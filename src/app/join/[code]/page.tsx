"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const param = useParams();
  const code = param.code as string;
  const [playerName, setPlayerName] = useState("");
  const joinGameMutation = api.game.joinGame.useMutation({
    onSuccess: (data) => {
      if (data.gameId && data.player) {
        router.push(`/game/${data.gameId}?playerName=${data.player.name}`);
      }
    },
  });
  return (
    <main>
      <Dialog open={true}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Join {code}</DialogTitle>
            <DialogDescription>
              Enter your name to join {code}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="joinName">Your Name</label>
              <Input
                id="joinName"
                value={playerName}
                onChange={(e) => setPlayerName(e.currentTarget.value)}
                placeholder="Enter name"
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
    </main>
  );
}
