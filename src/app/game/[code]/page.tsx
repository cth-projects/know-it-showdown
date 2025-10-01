"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { usePusherContext } from "@/contexts/PusherContext";
import TempGameLobby from "@/app/_components/tempPlayerLobby";

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

  const handleLeaveGame = () => {
    window.history.back(); // moves one page back for now, doesnt change a players status in the database
  };

  return (
    <TempGameLobby
      gameCode={code}
      playerName={playerName}
      onLeaveGame={handleLeaveGame}
    />
  );
}
