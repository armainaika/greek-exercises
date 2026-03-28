/**
 * result item that the python fastapi returns after analyzing text
 */
export type ResultItem =
  | {
      type: "text";
      text: string;
      [key: string]: any; // fallback for additional features. working with languages this is needed
    }
  | {
      type: "verb";
      text: string;
      base_form: string;
      features: Record<string, unknown>;
      start_char: number;
      end_char: number;
      [key: string]: any; // fallback for additional features
    };

/**
 * props for exercise component. the original text and result is ResultItem type
 */
export type ExerciseProps = {
  text: string;
  result: any[];
};

/**
 * props for the input view
 */
export type InputStepProps = {
  sourceText: string;
  setSourceText: (s: string) => void;
  onSubmit: () => void;
};

/**
 * props for the loading component
 */
export type LoadingProps = {
  onComplete: () => void;
};

/**
 * props for the result window
 */
export type ResultStepProps = {
  text: string;
  onBack: () => void;
};
