"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { usePusherContext } from "@/contexts/PusherContext";
import JoinGameForm from "@/components/game/JoinGameForm";
import PlayerList from "@/app/_components/playerList";

export default function GamePage() {
  const params = useParams();
  const code = params.code as string;

  const [hasJoined, setHasJoined] = useState(false);
  const [playerName, setPlayerName] = useState("");

  const { subscribe, unsubscribe } = usePusherContext();
  const testPusherMutation = api.test.pusher.useMutation();

  useEffect(() => {
    const channel = subscribe("test");

    channel.bind("test-event", (data: { name: string; timestamp: number }) => {
      console.log("Got event:", data);
    });

    return () => {
      channel.unbind_all();
      unsubscribe("test");
    };
  }, [subscribe, unsubscribe]);

  const handleJoinGame = async (name: string) => {
    console.log(`Mock: ${name} joining game ${code}`);

    setPlayerName(name);
    setHasJoined(true);
  };

  const handleLeaveGame = () => {
    setHasJoined(false);
    setPlayerName("");
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="mb-2 text-4xl font-bold">Game Room</h1>
          <p className="text-xl text-gray-300">Code: {code}</p>
        </div>
        {!hasJoined ? (
          <>
            <JoinGameForm onJoinGame={handleJoinGame} />
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
      <div className="mt-8 flex justify-center">
        <PlayerList />
      </div>
      <div className="mt-8 flex justify-center">
        <Button
          onClick={async () => {
            await testPusherMutation.mutateAsync({ name: "hello" });
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Test Pusher
        </Button>
      </div>
    </div>
  );
}
