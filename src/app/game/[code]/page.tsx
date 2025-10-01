"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { usePusherContext } from "@/contexts/PusherContext";
import Lobby from "@/components/game/lobby";



export default function GamePage() {
  const params = useParams();
  const code = params.code as string;

  const searchParams = useSearchParams();
  const playerName = searchParams.get("playerName");

  const { subscribe, unsubscribe } = usePusherContext();

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

  return (
    <Lobby
      gameCode={code}
      playerName={playerName}
    />
  )
}
