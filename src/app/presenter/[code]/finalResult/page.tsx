import FinalResultBoard from "@/app/_components/finalResultBoard";
import { HydrateClient } from "@/trpc/server";
import { api } from "@/trpc/server";
import type { FinalResultEvent } from "@/types/game-events";
import { notFound } from "next/navigation";

export default async function FinalResult({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  let finalResultEvent: FinalResultEvent;

  try {
    finalResultEvent = await api.finalResult.getLeaderboard({ gameCode: code });
  } catch (error) {
    console.error("Failed to load game results:", error);
    // If game not found or any error, show 404
    notFound();
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Game Result
          </h1>
        </div>
        <div className="rounded-2xl bg-gray-900 p-6 text-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl">
          <FinalResultBoard
            finalResultEvent={finalResultEvent}
            gameCode={code}
            showGameInfo={true}
          />
        </div>
      </main>
    </HydrateClient>
  );
}
