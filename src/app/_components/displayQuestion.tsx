"use client";
import { motion, AnimatePresence } from "motion/react";

type DisplayProps = {
  question: string;
  result: number;
  showResult: boolean;
};

function Display({ question, result, showResult }: DisplayProps) {
  return (
    <motion.div 
      layout 
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex flex-col items-center gap-8"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={question} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-[80vw] text-5xl text-center"
        >
          {question}
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300,
              damping: 20,
            }}
            className="text-5xl text-green-600"
          >
            {result}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Display;
