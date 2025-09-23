

import { HydrateClient } from "@/trpc/server";

import GameCode from "src/app/_components/displayGameCode"
import PlayerList from "@/app/_components/playerList";
import TestLeaderboardButton from "@/app/_components/gameLeaderboard/testLeaderBoardButton";

export default function LobbyPage() {
    return (
        <HydrateClient>
            <main className="flex min-h-screen flex-col items-center justify-center">
                <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16">
                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
                        Game lobby
                    </h1>
                    <h2 className="text-2xl">
                        Lobby code
                    </h2>
                    <GameCode />
                </div>
                <PlayerList/>
                <TestLeaderboardButton/>
            </main>
        </HydrateClient>
    )
}