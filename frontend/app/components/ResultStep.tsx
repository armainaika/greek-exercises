"use client";

import { useState, useEffect } from "react";
import Loading from "./Loading";
import { motion } from "framer-motion";
import Exercise from "./Exercise";
import { ResultStepProps, ResultItem } from "@/types/index";

/**
 * component for the result view
 * -------------------
 * handles:
 * - fetching processed verb data from backend
 * - displaying loading state while waiting
 * - rendering exercise once data is ready
 */
export default function ResultStep({ text, onBack }: ResultStepProps) {
  const [loadingDone, setLoadingDone] = useState(false);
  const [verbs, setVerbs] = useState<ResultItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  /**
   * fetch the api analysis with verbs when the text is submitted
   */
  useEffect(() => {
    async function fetchVerbs() {
      try {
        const res = await fetch("/api/verbs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch verbs");
        }

        const data = await res.json();
        setVerbs(data);
      } catch (err) {
        setError("Failed to load verbs");
      }
    }

    fetchVerbs();
  }, [text]);

  return (
    <div className="w-full flex flex-col">
      {/* back button to return to input step */}
      <div className="grow">
        <button
          onClick={onBack}
          className="pr-3 py-1.5 rounded-lg cursor-pointer font-inter transition-all duration-300 ease-in-out hover:bg-gray-200 hover:dark:bg-[#282828] flex items-center justify-center text-gray-800 dark:text-[#696969]"
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
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m14 8-4 4 4 4"
            />
          </svg>
          cancel
        </button>
      </div>

      <div className="flex w-full items-center justify-center overflow-auto h-full no-scrollbar">
        {/* show loading animation until complete */}
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : !loadingDone ? (
          <Loading onComplete={() => setLoadingDone(true)} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className=" font-roboto-mono text-center text-lg sm:text-xl w-full h-full"
          >
            <Exercise text={text} result={verbs} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
