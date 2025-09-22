
import LeaderboardTable from "@/app/_components/gameLeaderboard/LeaderBoardTable";
import { HydrateClient } from "@/trpc/server";

interface FinalResultPageProps {
  params: { 
    code: string;  
  };
}

export default function FinalResult({params}:FinalResultPageProps) {
    const { code } =  params;
    return (
        <HydrateClient>
            <main className="flex min-h-screen flex-col items-center justify-center">
                <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16">
                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
                        Game lobby
                    </h1>
                </div>
        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out">
      <LeaderboardTable 
        gameCode={code} 
        showGameInfo={true}
        />
    </div>
            </main>
        </HydrateClient>
    )
}
