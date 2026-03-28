"use client";
import { InputStepProps } from "@/types/index";

export default function InputStep({
  sourceText,
  setSourceText,
  onSubmit,
}: InputStepProps) {
  return (
    <div className="w-full">
      <div className="text-[#696969] dark:text-white w-full text-center sm:text-lg font-light mb-18 mt-30 font-inter">
        create verb conjugation exercises from texts
      </div>
      <textarea
        id="source_text"
        rows={6}
        placeholder="enter your source text..."
        value={sourceText}
        onChange={(e) => setSourceText(e.target.value)}
        className="no-scrollbar resize-none rounded-2xl font-roboto-mono focus:outline-none focus:ring-0 focus:border-[#378EDE] focus:shadow-lg focus:shadow-[rgb(5,94,176,0.3)] border-2 border-[#B7B7B7] dark:border-[#696969] placeholder:text-[#B7B7B7] dark:placeholder:text-[#696969] text-[#1e1e1e] dark:text-[#EDEDED] w-full p-2 px-3 sm:text-lg mb-5"
      ></textarea>

      <button
        onClick={onSubmit}
        className="bg-[rgb(5,94,176,1)] w-full text-center p-3 font-inter text-lg sm:text-xl inline-flex items-center justify-center rounded-xl font-semibold cursor-pointer hover:shadow-lg hover:shadow-[rgb(5,94,176,0.5)] transition-all duration-100"
      >
        create exercise
        <svg
          className="w-8 h-8 text-[#EDEDED]"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m10 16 4-4-4-4"
          />
        </svg>
      </button>
    </div>
  );
}
