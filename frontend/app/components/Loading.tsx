"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LoadingProps } from "@/types/index";

/**
 * loading component
 * -----------------
 * displays an animated loading sequence with a progress bar and step text.
 * steps through predefined messages and calls `onComplete` when finished.
 */
export default function Loading({ onComplete }: LoadingProps) {
  // yeah its a fake loading.........
  const steps = [
    { text: "getting text...", duration: 2000, width: 25 },
    { text: "catching verbs...", duration: 1800, width: 50 },
    { text: "creating a cool exercise for you...", duration: 2000, width: 75 },
    { text: "good luck!", duration: 2000, width: 100 },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentStep >= steps.length) {
      setTimeout(() => onComplete(), 1000); // notify parent when loading is done
      return;
    }

    const step = steps[currentStep];

    setProgress(step.width);

    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, step.duration);

    return () => clearTimeout(timer);
  }, [currentStep]);

  // framer Motion variants for animating text
  const textVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  };

  return (
    <div className="font-space-mono w-full text-center h-full flex flex-col items-center justify-center gap-4 px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={Math.min(currentStep, steps.length - 1)}
          variants={textVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="text-lg sm:text-xl text-[#1e1e1e] dark:text-white"
        >
          {steps[Math.min(currentStep, steps.length - 1)]?.text}
        </motion.div>
      </AnimatePresence>

      <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
        <div
          className="h-full bg-[rgb(5,94,176,1)] rounded-full transition-all ease-in-out"
          style={{
            width: `${progress}%`,
            transitionDuration: steps[currentStep - 1]
              ? `${steps[Math.max(currentStep - 1, 0)].duration}ms`
              : "500ms",
          }}
        ></div>
      </div>
    </div>
  );
}
