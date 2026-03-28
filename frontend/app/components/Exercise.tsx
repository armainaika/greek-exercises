import { useState } from "react";
import { ExerciseProps } from "@/types/index";

export default function Exercise({ text, result }: ExerciseProps) {
  const verbs = result.filter((x) => x.type === "verb");

  //below constants for checking the right answers.
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState<Record<number, boolean>>({});

  // update the user's answer for a specific verb
  // trims whitespace to prevent accidental mismatches
  const handleInput = (index: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [index]: value.trim() }));
  };

  /**
   * compares user answers with the correct verbs.
   * updates the `correct` state and sets `checked` to true
   */
  const checkAnswers = () => {
    const newCorrect: Record<number, boolean> = {};
    let count = 0;

    result.forEach((item, i) => {
      if (item.type === "verb") {
        const isRight = answers[i] === item.text;
        newCorrect[i] = isRight;
        if (isRight) count++;
      }
    });

    setCorrect(newCorrect);
    setChecked(true);
  };

  const correctCount = Object.values(correct).filter(Boolean).length;

  /**
   * requests a generated PDF from the API and opens it in a new tab
   */
  const openPdf = async () => {
    console.log("clicked print");
    const res = await fetch("/api/pdf", {
      method: "POST",
      body: JSON.stringify({ result }),
      headers: { "Content-Type": "application/json" },
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  return (
    <div className="h-full w-full flex flex-col text-start pt-2">
      <div className=" flex justify-between mb-5 flex-row text-center items-center">
        <div className="font-inter font-semibold dark:text-[#378EDE] text-[#055EB0] bg-[#055db034] rounded-lg w-fit px-2">
          fill in the verbs in the right form
        </div>

        <button
          className=" dark:text-[#378EDE] text-[#055EB0]  p-1 rounded-lg cursor-pointer hover:bg-[#055db040] transition-colors duration-200 ease-in-out"
          onClick={openPdf}
        >
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16.444 18H19a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h2.556M17 11V5a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v6h10ZM7 15h10v4a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-4Z"
            />
          </svg>
        </button>
      </div>

      <div
        id="exercise"
        className="whitespace-pre-line text-[#1e1e1e] dark:text-[#EDEDED] text-xl/7"
      >
        {/** Render each item: editable span for verbs, plain text otherwise*/}
        {result.map((item, i) => {
          if (item.type === "verb") {
            return (
              <span key={i} className="">
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) =>
                    handleInput(i, (e.target as HTMLElement).textContent || "")
                  }
                  className={`rounded-lg px-2 min-w-1/6 inline-block outline-none 
                    ${
                      checked
                        ? correct[i]
                          ? "bg-[#51ff005e]"
                          : "bg-[#db000082]"
                        : "bg-[#EDEDED] dark:bg-[#424242]"
                    }`}
                ></span>{" "}
                <span className="text-[#8b8b8b]">({item.base_form})</span>
              </span>
            );
          }

          return <span key={i}>{item.text}</span>;
        })}
      </div>

      <div className="w-full flex justify-end items-center gap-4 py-5">
        {checked && (
          <div className="font-semibold bg-[#50b30033] text-[#9efc51] px-2 rounded-lg">
            {correctCount}/{verbs.length}
          </div>
        )}

        <button
          onClick={checkAnswers}
          className="text-white bg-[#055db0] rounded-lg px-3 py-1 font-bold text-2xl cursor-pointer hover:bg-[#023f77] transition-colors duration-200 ease-in-out"
        >
          check
        </button>
      </div>
    </div>
  );
}
