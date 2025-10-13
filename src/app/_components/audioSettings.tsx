"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useAudioContext } from "@/contexts/AudioContext";
import { useState } from "react";

export const AudioSettings = () => {
  const { isMuted, toggleMute, globalVolume, setGlobalVolume } =
    useAudioContext();
  const [isHovered, setIsHovered] = useState(false);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setGlobalVolume(newVolume);

    if (isMuted && newVolume > 0) {
      toggleMute();
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Speaker Icon Button */}
      <button
        onClick={toggleMute}
        className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <VolumeX className="h-6 w-6" />
        ) : (
          <Volume2 className="h-6 w-6" />
        )}
      </button>

      {/* Volume Slider */}
      {isHovered && (
        <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-lg bg-white p-3 shadow-lg dark:bg-gray-900">
          <div className="flex h-24 flex-col items-center gap-2">
            <span className="text-sm font-medium">
              {Math.round(globalVolume * 100)}%
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={globalVolume}
              onChange={handleVolumeChange}
              className="h-20 w-8 cursor-pointer appearance-none bg-transparent"
              style={{
                writingMode: "vertical-lr",
              }}
              aria-label="Volume"
            />
          </div>
          {/* Arrow pointing down */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="h-3 w-3 rotate-45 bg-white dark:bg-gray-900" />
          </div>
        </div>
      )}

      {/* Custom Slider Styling */}
      <style jsx>{`
        input[type="range"] {
          direction: rtl;
        }
        input[type="range"]::-webkit-slider-track {
          width: 4px;
          background: #e5e7eb;
          border-radius: 2px;
        }
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        input[type="range"]::-moz-range-track {
          width: 4px;
          background: #e5e7eb;
          border-radius: 2px;
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};
