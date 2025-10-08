"use client";

import ResultPodium from "@/app/_components/ResultPodium";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function FinalResult() {
  const params = useParams();
  const code = params.code as string;

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

  if (isLoading || !finalResultEvent) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-xl font-semibold text-gray-600">
            Loading results...
          </p>
        </div>
      </div>
    );
  }

  if (finalResultEvent.newState !== "FINAL_RESULT") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-xl font-semibold text-gray-600">
            Loading results...
          </p>
        </div>
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
          baseCountdownDuration={1500}
          transitionDelay={1000}
        />
      </div>
    </main>
  );
}
