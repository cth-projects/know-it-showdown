export const AUDIO_PATHS = {
  testLoop: "/sounds/test.mp3",
  testPlayOnce: "/sounds/test.mp3",

  winner: "/sounds/winner.mp3",
  winnerBackground: "/sounds/small-cheer.mp3",

  countdown: "/sounds/countdown.mp3",

  drumRoll: "/sounds/drum-roll.mp3",
  score: "/sounds/points.mp3",
} as const;

export type AudioKey = keyof typeof AUDIO_PATHS;

// Sound effects played ONCE (fire and forget) audioManager.play()
export type SoundEffectKey = "testPlayOnce" | "score" | "winner";

// Looped sound effects, audioManager.startloop() / stop() / pause()
export type ControlledSoundKey =
  | "testLoop"
  | "winnerBackground"
  | "drumRoll"
  | "countdown";
