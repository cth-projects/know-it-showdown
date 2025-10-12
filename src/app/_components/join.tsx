"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { api } from "@/trpc/react";

export enum GameType {
  ZERO_TO_HUNDRED = "0-100",
}

export default function Join() {
  const router = useRouter();

  const [code, setCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  // Keep gameType logic for future expansion
  const gameType = GameType.ZERO_TO_HUNDRED;

  const createGameMutation = api.game.createGame.useMutation({
    onSuccess: (data) => {
      if (data.gameId) {
        router.push(`/presenter/${data.gameId}/lobby`);
      }
    },
  });

  const joinGameMutation = api.game.joinGame.useMutation({
    onSuccess: (data) => {
      if (data.gameId && data.player) {
        router.push(`/game/${data.gameId}?playerName=${data.player.name}`);
      }
    },
  });

  const handleCreateGame = () => {
    createGameMutation.mutate({
      gameType,
    });
  };

  return (
    <Fragment>
      <div className="flex flex-wrap items-center gap-2 md:flex-row">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Join Game</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Join a game</DialogTitle>
              <DialogDescription>
                Enter the game code and your name.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="code">Game Code</label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.currentTarget.value)}
                  placeholder="ABC123"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="joinName">Your Name</label>
                <Input
                  id="joinName"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.currentTarget.value)}
                  placeholder="Player 1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                disabled={joinGameMutation.isPending}
                onClick={() => {
                  joinGameMutation.mutate({
                    gameCode: code,
                    playerName,
                  });
                }}
              >
                {joinGameMutation.isPending ? "Joining..." : "Join"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          disabled={createGameMutation.isPending}
          onClick={handleCreateGame}
        >
          {createGameMutation.isPending ? "Creating..." : "Create Game"}
        </Button>
      </div>
    </Fragment>
  );
}
