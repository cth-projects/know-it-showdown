"use client";

import { audioManager } from "@/lib/audioManager";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  globalVolume: number;
  setGlobalVolume: (volume: number) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [globalVolume, setGlobalVolume] = useState(0.7);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sync with AudioManager whenever these change
  useEffect(() => {
    audioManager.updateSettings({ isMuted, globalVolume, soundEnabled });
  }, [isMuted, globalVolume, soundEnabled]);

  const toggleMute = () => setIsMuted((prev) => !prev);
  const toggleSound = () => setSoundEnabled((prev) => !prev);

  return (
    <AudioContext.Provider
      value={{
        isMuted,
        toggleMute,
        globalVolume,
        setGlobalVolume,
        soundEnabled,
        toggleSound,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudioContext must be used within AudioProvider");
  }
  return context;
};
