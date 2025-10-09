"use client";

import GameCode from "src/app/_components/displayGameCode";
import PlayerList from "@/app/_components/playerList";
import { GameSettings } from "@/app/_components/gameSettings";
import StartButton from "@/app/_components/startGameButton";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Gamepad2 } from "lucide-react";
import QRCode from "@/app/_components/displayQRCode";
import { audioManager } from "@/lib/audioManager";

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
  // TODO: Only as an example > remove after implementing audio
  useEffect(() => {
    // Play sound ONCE when page loads
    // audioManager.play("testPlayOnce");

    // Start looping background music
    audioManager.startLoop("testLoop", { volumeModifier: -0.3 });

    // Stop looping sound when component unmounts
    return () => {
      audioManager.stop("testLoop");
    };
  }, []);
  const [gameSettings, setGameSettings] =
    useState<GameSettingsState>(DEFAULT_SETTINGS);

  const handleSettingsChange = (newSettings: GameSettingsState) => {
    setGameSettings(newSettings);
  };

  return (
    <main className="from-background to-muted/20 flex min-h-screen flex-col items-center justify-center bg-gradient-to-b">
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="bg-primary/10 rounded-full p-4">
            <Gamepad2 className="text-primary h-12 w-12" />
          </div>
          <h1 className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-[5rem]">
            Game Lobby
          </h1>
          <p className="text-muted-foreground text-lg">
            Share the code below with players to join
          </p>
        </div>
        <div className="flex items-center">
          <GameCode />
          <QRCode />
        </div>
        <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Game Settings</CardTitle>
                <CardDescription>
                  Configure your game before starting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GameSettings
                  value={gameSettings}
                  onChange={handleSettingsChange}
                />
              </CardContent>
            </Card>

            <StartButton gameSettings={gameSettings} />
          </div>

          <PlayerList />
        </div>
      </div>
    </main>
  );
}
