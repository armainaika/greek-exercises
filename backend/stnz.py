import stanza
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# ---------- fastAPI app ----------
app = FastAPI()

# TODO: replace "*" with frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- stanza pipeline ----------
# download greek model if not already downloaded
#
# test: stanza downloads greek model at build on render, so i commented next line out
# stanza.download("el")
nlp = stanza.Pipeline("el", processors="tokenize,mwt,pos,lemma,depparse", use_gpu=False)

# ---------- feature explanations ----------
features_full = {
    "Aspect": {
        "Imp": "imperfect",
        "Perf": "perfect",
        "Prosp": "prospective",
        "Prog": "progressive",
        "Hab": "habitual",
        "Iter": "iterative/frequentative",
    },
    "Mood": {
        "Ind": "indicative",
        "Imp": "imperative",
        "Cnd": "conditional",
        "Pot": "potential",
        "Sub": "subjunctive",
        "Jus": "jussive",
        "Prp": "purposive",
        "Qot": "quotative",
        "Opt": "optative",
        "Des": "desiderative",
        "Nec": "necessitative",
        "Int": "interrogative",
        "Irr": "irrealist",
        "Adm": "admirative",
    },
    "Number": {
        "Sing": "singular",
        "Plur": "plural",
        "Dual": "dual",
        "Tri": "trial",
        "Pauc": "paucal",
        "Grpa": "greater paucal",
        "Grpl": "greater plural",
        "Inc": "incerse",
        "Count": "count plural",
        "Ptan": "plurale tantum",
        "Coll": "collective",
    },
    "Person": {
        "0": "0th person",
        "1": "1st person",
        "2": "2nd person",
        "3": "3rd person",
        "4": "4th person",
    },
    "Tense": {
        "Past": "past tense",
        "Pres": "present",
        "Fut": "future",
        "Imp": "imperfect",
        "Pqp": "pluperfect",
    },
    "Voice": {
        "Act": "active",
        "Mid": "middle",
        "Rcp": "reciprocal",
        "Pass": "passive",
        "Antip": "antipassive",
        "Lfoc": "location-focus",
        "Bfod": "beneficiary-focus",
        "Dir": "direct",
        "Inv": "inverse",
        "Cau": "causative",
    },
    "VerbForm": {
        "Fin": "finite",
        "Inf": "infinitive",
        "Sup": "supine",
        "Part": "participle",
        "Conv": "adverbal participle",
        "Gdv": "gerundive",
        "Ger": "gerund",
        "Vnoun": "verbal noun",
    },
}


aux_accepted_lemmas = ["θα", "έχω"]
aux_cancel = ["να"]

# errors found through testing below. in the future need to automatise error detection, might need ai?
verbs_cancel = ["δρα", "πόντκαστ"]
CUSTOM_LEMMAS = {
    "συνυπάρχουν": "συνυπάρχω",
    "μολυνθούν": "μολύνω",
    "μάθει": "μαθαίνω",
    "πάμε": "πηγαίνω",
}

# TODO: create a check in wiktionaries. if dont exist, think of a backup plan to fix lemma
# https://stanfordnlp.github.io/stanza/lemma.html#improving-the-lemmatizer-by-providing-key-value-dictionary


# ---------- helping functions ----------
def fix_lemma(word):
    """
    if the word is in the errored verb list (CUSTOM_LEMMAS), show the correct lemma
    """
    if word.text in CUSTOM_LEMMAS:
        return CUSTOM_LEMMAS[word.text]
    return word.lemma


def parse_feats(feats_string):
    """
    this function makes use of the list of abbreviations and their explanations above. it takes the "feats" string which stanza returns and turns it into a clear array, which is more readable/understandable
    """
    if not feats_string:
        return {}

    features = {}
    for item in feats_string.split("|"):
        try:
            key, value = item.split("=")
        except ValueError:
            continue  # if smth wrong with feature display
        explanation = features_full.get(key, {}).get(value)
        if explanation:
            features[key] = {"short": value, "explanation": explanation}
        else:
            features[key] = {"short": value}
    return features


def combine_aux_main(aux_children, parent):
    """
    accepts an array with auxiliary words related to the parent (verb) and returns an array with the correct features to display for the parent verb. basically combines the right features to display
    """
    feats = parse_feats(parent.feats)
    combined_feats = feats.copy()

    for aux in aux_children:
        aux_feats = parse_feats(aux.feats)

        # if 'θα' is present → future tense (force override)
        if aux.lemma == "θα":
            combined_feats["Tense"] = {
                "short": "Fut",
                "explanation": "future",
            }

        # merge other features, but skip tense if already set to future
        for key in ["Tense", "Person", "Number", "Mood", "VerbForm"]:
            if key in aux_feats:
                if (
                    key == "Tense"
                    and combined_feats.get("Tense", {}).get("short") == "Fut"
                ):
                    continue  # don't overwrite future tense
                combined_feats[key] = aux_feats[key]
    return combined_feats


def debug(text):
    """
    returns breakdown of the whole text
    """
    doc = nlp(text)
    tokens = []

    doc_dict = doc.to_dict()  # return this for debugging

    return doc_dict


def get_verbs_with_text(text):
    """
    this function accepts greek text and returns an array, which includes text pieces and then verbs with extra details. detailed verbs are then used to create exercises
    """
    doc = nlp(text)
    tokens = []
    handled_aux_verbs = set()
    verb_spans = []

    for sentence in doc.sentences:
        for word in sentence.words:

            # skip auxiliaries already attached to a verb
            if word.id in handled_aux_verbs:
                continue

            # collect auxiliary words related to the verb
            aux_children = [
                aux
                for aux in sentence.words
                if aux.head == word.id
                and aux.upos == "AUX"
                and aux.lemma in aux_accepted_lemmas
            ]

            aux_children.sort(key=lambda x: x.id)

            if word.upos != "VERB" or word.text in verbs_cancel:
                continue

            # determine span
            span_words = aux_children + [word]
            start_char = min(
                w.start_char for w in span_words
            )  # char to cut to from the start_cut
            end_char = max(w.end_char for w in span_words)

            # build verb phrase
            verb_text = " ".join([aux.text for aux in aux_children] + [word.text])

            verb_spans.append(
                {"verb_text": verb_text, "start_char": start_char, "end_char": end_char}
            )

            combined_feats = combine_aux_main(aux_children, word)

            for aux in aux_children:
                handled_aux_verbs.add(aux.id)

            tokens.append(
                {
                    "type": "verb",
                    "text": verb_text,
                    "base_form": fix_lemma(word),
                    "features": combined_feats,
                    "start_char": start_char,
                    "end_char": end_char,
                }
            )

    result = []
    prev_end = 0

    for token in tokens:
        start = token["start_char"]
        end = token["end_char"]

        # text before token
        if prev_end < start:
            result.append({"type": "text", "text": text[prev_end:start]})

        result.append(token)

        prev_end = end

    # remaining text after the last token
    if prev_end < len(text):
        result.append({"type": "text", "text": text[prev_end:]})

    return result


# ---------- api endpoint ----------
class TextInput(BaseModel):
    text: str


@app.post("/verbs")
def get_verbs_api(data: TextInput):
    return get_verbs_with_text(data.text)
