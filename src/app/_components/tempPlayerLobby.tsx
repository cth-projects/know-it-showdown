"use client";

import { Button } from "@/components/ui/button";

interface TempGameLobbyProps {
  gameCode: string;
  playerName: string | null;
  onLeaveGame: () => void;
}

export default function TempGameLobby({
  gameCode,
  playerName,
  onLeaveGame,
}: TempGameLobbyProps) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="mb-2 text-4xl font-bold">Game Room</h1>
          <p className="text-xl text-gray-300">Code: {gameCode}</p>
        </div>

        {playerName ? (
          <>
            <p className="text-lg">
              Welcome,{" "}
              <span className="text-[hsl(280,100%,70%)]">{playerName}</span>!
              Waiting for game to start.
            </p>
            <Button
              onClick={onLeaveGame}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              Leave Game
            </Button>
          </>
        ) : (
          <div className="text-center">
            <Button onClick={() => window.history.back()} variant="outline">
              Go Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
