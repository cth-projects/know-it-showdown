"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import Gamecode from "src/app/_components/displayGameCode";
import PlayerList from "src/app/_components/playerList";

interface LobbyProps {
  playerName: string | null;
  gameCode: string;
}

export default function Lobby({ playerName, gameCode }: LobbyProps) {
  const router = useRouter();

  const leaveGameMutation = api.game.leaveGame.useMutation({
    onSuccess: () => {
      router.push("/");
    },
    onError: () => {
      console.error("Failed to leave game");
    },
  });

  const handleLeaveGame = () => {
    if (playerName) {
      leaveGameMutation.mutate({ gameCode, playerName });
    }
  };

  if (!playerName) {
    return (
      <div className="text-center">
        <Button onClick={() => router.push("/")} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="mb-2 text-4xl font-bold">Game Room</h1>
          <Gamecode />
        </div>

        <p className="text-lg">
          Welcome,{" "}
          <span className="text-[hsl(280,100%,70%)]">{playerName}</span>!
          Waiting for game to start.
        </p>

        <Button
          onClick={handleLeaveGame}
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
        >
          Leave Game
        </Button>

        <div>
          <PlayerList />
        </div>
      </div>
    </div>
  );
}
