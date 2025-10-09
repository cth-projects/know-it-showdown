"use client";

import ResultPodium from "@/app/_components/ResultPodium";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/trpc/react";
import { Game0To100State } from "@prisma/client";
import { motion } from "motion/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FinalResult() {
  const params = useParams();
  const code = params.code as string;
  const [showBackButton, setShowBackButton] = useState(false);
  const baseCountdownDuration = 1500;
  const transitionDelay = 1000;
  const router = useRouter();

  const {
    data: finalResultEvent,
    isLoading,
    refetch,
  } = api.game.getCurrentPresenterView.useQuery({
    gameCode: code,
  });

  useEffect(() => {
    const fetchData = async () => {
      await refetch();
    };
    void fetchData();
  }, [refetch]);

  useEffect(() => {
    if (finalResultEvent?.newState === Game0To100State.FINAL_RESULT) {
      const totalPlayers = finalResultEvent.finalResults.length;

      const longestCountdown = (totalPlayers + 2) * baseCountdownDuration;
      const totalAnimationTime = longestCountdown + transitionDelay;

      const timer = setTimeout(() => {
        setShowBackButton(true);
      }, totalAnimationTime);

      return () => clearTimeout(timer);
    }
  }, [finalResultEvent]);
  if (
    isLoading ||
    !finalResultEvent ||
    finalResultEvent.newState !== Game0To100State.FINAL_RESULT
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center gap-5 p-12">
      <div className="container flex flex-col items-center gap-8 py-8">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Final Results
        </h1>

        <ResultPodium
          finalResults={finalResultEvent.finalResults}
          baseCountdownDuration={baseCountdownDuration}
          transitionDelay={transitionDelay}
          onAllAnimationsComplete={() => setShowBackButton(true)}
        />

        {showBackButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-1"
          >
            <Button
              className="bg-lime-800 text-lg hover:bg-lime-900"
              variant={"secondary"}
              onClick={() => router.push("/")}
              size="lg"
            >
              Play again
            </Button>
          </motion.div>
        )}
      </div>
    </main>
  );
}
