import { useAudioContext } from "@/contexts/AudioContext";

export const AudioSettings = () => {
  const {
    isMuted,
    toggleMute,
    globalVolume,
    setGlobalVolume,
    soundEnabled,
    toggleSound,
  } = useAudioContext();

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <label className="font-medium">Sound Effects</label>
        <button
          onClick={toggleSound}
          className={`rounded px-4 py-2 font-medium transition ${
            soundEnabled
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-500 text-white hover:bg-gray-600"
          }`}
        >
          {soundEnabled ? "On" : "Off"}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <label className="font-medium">Mute All</label>
        <button
          onClick={toggleMute}
          className={`rounded px-4 py-2 font-medium transition ${
            isMuted
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {isMuted ? "Muted" : "Unmuted"}
        </button>
      </div>

      <div className="space-y-2">
        <label className="font-medium">
          Volume: {Math.round(globalVolume * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={globalVolume}
          onChange={(e) => setGlobalVolume(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
};
