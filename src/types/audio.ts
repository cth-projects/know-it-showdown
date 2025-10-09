export const AUDIO_PATHS = {
  testLoop: "/sounds/test.mp3",
  testPlayOnce: "/sounds/test.mp3",
} as const;

export type AudioKey = keyof typeof AUDIO_PATHS;

// Sound effects played ONCE (fire and forget) audioManager.play()
export type SoundEffectKey = "testPlayOnce";

// Looped sound effects, audioManager.startloop() / stop() / pause()
export type ControlledSoundKey = "testLoop";
