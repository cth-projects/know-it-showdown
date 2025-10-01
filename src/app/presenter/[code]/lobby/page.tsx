"use client";

import GameCode from "src/app/_components/displayGameCode";
import PlayerList from "@/app/_components/playerList";
import { GameSettings } from "@/app/_components/gameSettings";
import StartButton from "@/app/_components/startGameButton";
import { useState } from "react";

interface GameSettingsState {
  timePerQuestion: number;
  questionCount: number;
}

// Default settings
const DEFAULT_SETTINGS: GameSettingsState = {
  timePerQuestion: 60,
  questionCount: 10,
};

export default function LobbyPage() {
  const [gameSettings, setGameSettings] =
    useState<GameSettingsState>(DEFAULT_SETTINGS);

  const handleSettingsChange = (newSettings: GameSettingsState) => {
    setGameSettings(newSettings);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 py-10">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Game lobby
        </h1>
        <GameCode />
        <GameSettings value={gameSettings} onChange={handleSettingsChange} />
        {/*<h2 className="text-2xl">Lobby code</h2> */}
      </div>
      <PlayerList />
      <StartButton gameSettings={gameSettings} />
    </main>
  );
}
