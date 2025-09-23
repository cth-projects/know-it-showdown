import LeaderboardTable from "@/app/_components/gameLeaderboard/LeaderBoardTable";
import { HydrateClient } from "@/trpc/server";

interface FinalResultPageProps {
  params: Promise<{ code: string }>;
}

export default async function FinalResult({ params }: FinalResultPageProps) {
  const { code } = await params;
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Game lobby
          </h1>
        </div>
        <div className="rounded-2xl bg-gray-900 p-6 text-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl">
          <LeaderboardTable gameCode={code} showGameInfo={true} />
        </div>
      </main>
    </HydrateClient>
  );
}
