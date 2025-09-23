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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { api } from "@/trpc/react";
import { TRPCError } from "@trpc/server";

export enum GameType {
  ZERO_TO_HUNDRED = "0-100",
}

export default function Join() {
  const router = useRouter();

  const [code, setCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [gameType, setGameType] = useState<GameType>(GameType.ZERO_TO_HUNDRED);

  const createGameMutation = api.game.createGame.useMutation({
    onSuccess: (data) => {
      if (data.gameId) {
        router.push(`/presenter/${data.gameId}/lobby`);
      }
    },
  });

  const joinGameMutation = api.game.joinGame.useMutation({
    onSuccess: (data) => {
      if (data instanceof TRPCError) {
        alert(data.message);
        return;
      }

      if (data.gameId) {
        router.push(`/game/${data.gameId}`);
      }
    },
  });

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

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Create Game</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create a new game</DialogTitle>
              <DialogDescription>
                Enter details to set up your game.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="playerName">Your Name</label>
                <Input
                  id="playerName"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.currentTarget.value)}
                  placeholder="Player 1"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="gameType">Game Type</label>
                <Select
                  onValueChange={(value) => setGameType(value as GameType)}
                  defaultValue={GameType.ZERO_TO_HUNDRED}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Game" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={GameType.ZERO_TO_HUNDRED}>
                      {GameType.ZERO_TO_HUNDRED}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                disabled={createGameMutation.isPending}
                onClick={() => {
                  createGameMutation.mutate({
                    playerName,
                    gameType,
                  });
                }}
              >
                {createGameMutation.isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Fragment>
  );
}
