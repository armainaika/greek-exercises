"use client";

import ThemeToggle from "./components/theme-toggle";
import { useState } from "react";
import InputStep from "./components/InputStep";
import ResultStep from "./components/ResultStep";
import { AnimatePresence, motion } from "framer-motion";
import Footer from "./components/Footer";

export default function Home() {
  const [sourceText, setSourceText] = useState("");

  // code for animating switch between input and result below:
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<number>(0); // 1 = forward, -1 = back

  // variants accept a custom value (direction) to decide enter/exit X
  const variants = {
    initial: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    animate: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  };

  const goNext = () => {
    setDirection(1);
    setStep(1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep(0);
  };

  return (
    <div className="flex max-h-screen items-center justify-center  bg-[#ffffff] dark:bg-[#1e1e1e]">
      <div
        id="kinda_like_a_navbar_but_not_really"
        className="absolute top-0 w-full z-40"
      >
        <ThemeToggle />
      </div>
      <main className="overflow-hidden flex h-screen w-full max-w-3xl flex-col items-center justify-center sm:justify-start px-5 sm:px-16 sm:items-start ">
        <div
          className={`absolute left-0 font-space-mono w-full text-center  font-bold flex-inline leading-tight transition-[top,font-size] duration-800 ease-in-out
    ${step === 0 ? "sm:text-6xl text-4xl top-20" : "sm:text-3xl text-xl top-7 sm:top-2"}`}
        >
          <span className="dark:text-[#378EDE] text-[#055EB0]">greek</span>{" "}
          <span
            className={`bg-[#EDEDED] dark:bg-[#424242] text-[#4D4D4D] dark:text-[#EDEDED] px-2.5 pb-0.5 inline-block transition-[border-radius] duration-800 ${step === 0 ? "sm:rounded-2xl rounded-xl" : "sm:rounded-lg rounded-md"} -ml-2`}
          >
            exercise
          </span>
        </div>

        {/* view transition: InputStep <-> ResultStep */}
        <AnimatePresence mode="wait" initial={false}>
          {step === 0 ? (
            <motion.div
              key="input"
              custom={direction}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.32, ease: "easeInOut" }}
              className="w-full h-full mt-20"
            >
              <InputStep
                sourceText={sourceText}
                setSourceText={setSourceText}
                onSubmit={goNext}
              />
            </motion.div>
          ) : (
            <motion.div
              key="result"
              custom={direction}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.32, ease: "easeInOut" }}
              className="w-full h-full pt-20 flex"
            >
              <ResultStep text={sourceText} onBack={goBack} />
            </motion.div>
          )}
        </AnimatePresence>
        <Footer />
      </main>
    </div>
  );
}
