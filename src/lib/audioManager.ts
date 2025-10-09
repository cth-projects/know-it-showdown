import { Howl, Howler } from "howler";
import type { HowlOptions } from "howler";
import {
  AUDIO_PATHS,
  type AudioKey,
  type SoundEffectKey,
  type ControlledSoundKey,
} from "@/types/audio";

interface AudioSettings {
  isMuted: boolean;
  globalVolume: number;
  soundEnabled: boolean;
}

interface PlayOptions {
  volumeModifier?: number;
  rate?: number;
}

interface LoopOptions {
  volumeModifier?: number;
}

class AudioManager {
  private sounds = new Map<AudioKey, Howl>();
  private settings: AudioSettings = {
    isMuted: false,
    globalVolume: 0.7,
    soundEnabled: true,
  };

  constructor() {
    this.preloadAll();
  }

  private preloadAll(): void {
    (Object.entries(AUDIO_PATHS) as [AudioKey, string][]).forEach(
      ([key, path]) => {
        const howlOptions: HowlOptions = {
          src: [path],
          preload: true,
          volume: 1,
        };
        const howl = new Howl(howlOptions);
        this.sounds.set(key, howl);
      },
    );
  }

  // Called by AudioContext when settings change
  updateSettings(settings: Partial<AudioSettings>): void {
    this.settings = { ...this.settings, ...settings };

    if (settings.isMuted !== undefined) {
      Howler.mute(settings.isMuted);
    }
    if (settings.globalVolume !== undefined) {
      Howler.volume(settings.globalVolume);
    }
  }

  // Check if sound should play
  private shouldPlay(): boolean {
    return this.settings.soundEnabled && !this.settings.isMuted;
  }

  // Calculate final volume
  private calculateVolume(volumeModifier = 0): number {
    return Math.max(
      0,
      Math.min(1, this.settings.globalVolume + volumeModifier),
    );
  }

  // Play sound effect (fire and forget)
  play(key: SoundEffectKey, options?: PlayOptions): void {
    if (!this.shouldPlay()) return;

    const sound = this.sounds.get(key);
    if (sound) {
      const volume = this.calculateVolume(options?.volumeModifier);
      sound.volume(volume);

      if (options?.rate !== undefined) {
        sound.rate(options.rate);
      }

      sound.play();
    }
  }

  // Start looping sound
  startLoop(key: ControlledSoundKey, options?: LoopOptions): void {
    if (!this.shouldPlay()) return;

    const sound = this.sounds.get(key);
    if (sound) {
      const volume = this.calculateVolume(options?.volumeModifier);
      sound.loop(true);
      sound.volume(volume);
      sound.play();
    }
  }

  // Stop a specific sound
  stop(key: ControlledSoundKey): void {
    const sound = this.sounds.get(key);
    if (sound) {
      sound.stop();
      sound.loop(false);
    }
  }

  // Pause a sound
  pause(key: ControlledSoundKey): void {
    this.sounds.get(key)?.pause();
  }

  // Resume a paused sound
  resume(key: ControlledSoundKey): void {
    if (!this.shouldPlay()) return;
    this.sounds.get(key)?.play();
  }

  // Check if playing
  isPlaying(key: ControlledSoundKey): boolean {
    return this.sounds.get(key)?.playing() ?? false;
  }

  // Fade with volume modifier support
  fade(
    key: ControlledSoundKey,
    fromModifier: number,
    toModifier: number,
    duration: number,
  ): void {
    const sound = this.sounds.get(key);
    if (sound) {
      const from = this.calculateVolume(fromModifier);
      const to = this.calculateVolume(toModifier);
      sound.fade(from, to, duration);
    }
  }

  // Global controls
  stopAll(): void {
    Howler.stop();
  }

  unloadAll(): void {
    this.sounds.forEach((sound) => sound.unload());
    this.sounds.clear();
  }
}

export const audioManager = new AudioManager();
