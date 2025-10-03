"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import Gamecode from "src/app/_components/displayGameCode";
import PlayerList from "src/app/_components/playerList";
import { Gamepad2, LogOut } from "lucide-react";

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
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-b py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-8">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="bg-primary/10 rounded-full p-4">
                  <Gamepad2 className="text-primary h-10 w-10" />
                </div>
              </div>
              <CardTitle className="text-4xl font-bold">Game Room</CardTitle>
              <CardDescription className="mt-2 text-lg">
                <Gamecode />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="bg-primary/5 border-primary/20 rounded-lg border p-6">
                <p className="text-lg">
                  Welcome,{" "}
                  <span className="text-primary text-xl font-bold">
                    {playerName}
                  </span>
                  !
                </p>
                <p className="text-muted-foreground mt-2">
                  Waiting for the host to start the game...
                </p>
              </div>

              <Button
                onClick={handleLeaveGame}
                variant="outline"
                className="gap-2 border-red-500 bg-transparent text-red-500 hover:bg-red-500 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Leave Game
              </Button>
            </CardContent>
          </Card>

          <PlayerList />
        </div>
      </div>
    </div>
  );
}
