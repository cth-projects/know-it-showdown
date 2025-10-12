import type { PlayerResult } from "@/types";
import { AnimatePresence } from "motion/react";
import ResultCountdownGrid from "./resultCountdownGrid";
import ResultRankedList from "./resultRankedList";
import { useEffect, useState } from "react";
import { audioManager } from "@/lib/audioManager";

type QuestionResultProps = {
  playerResults: PlayerResult[];
  countdownDuration?: number;
  transitionDelay?: number;
};

export default function QuestionResult({
  playerResults,
  countdownDuration = 3000,
  transitionDelay = 1500,
}: QuestionResultProps) {
  const [showVerticalLayout, setShowVerticalLayout] = useState(false);

  const sortedResults = [...playerResults].sort(
    (a, b) => b.scoreForQuestion - a.scoreForQuestion,
  );

  const handleCountdownComplete = () => {
    audioManager.stop("countdown");
    setTimeout(() => {
      setShowVerticalLayout(true);
    }, transitionDelay);
  };

  useEffect(() => {
    audioManager.startLoop("countdown", { volumeModifier: -0.3 });

    return () => {
      audioManager.stop("countdown");
    };
  }, []);

  if (sortedResults.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="space-y-4 text-center">
          <p className="text-xl font-semibold text-gray-600">
            No results available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      <AnimatePresence mode="wait">
        {!showVerticalLayout ? (
          <ResultCountdownGrid
            players={sortedResults}
            countdownDuration={countdownDuration}
            onAllCountdownsComplete={handleCountdownComplete}
          />
        ) : (
          <ResultRankedList players={sortedResults} />
        )}
      </AnimatePresence>
    </div>
  );
}
