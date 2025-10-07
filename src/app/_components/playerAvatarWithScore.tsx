import React, { useEffect, useState } from "react";
import PlayerAvatar from "./playerAvatar";

function useCountdown(
  targetScore: number,
  startFrom: number,
  duration: number,
  onComplete?: () => void,
) {
  const [currentScore, setCurrentScore] = useState(startFrom);

  useEffect(() => {
    const startTime = Date.now();
    const difference = startFrom - targetScore;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation (easeOutCubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const newScore = Math.round(startFrom - difference * easeOut);
      setCurrentScore(newScore);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCurrentScore(targetScore);

        if (onComplete) {
          onComplete();
        }
      }
    };

    requestAnimationFrame(animate);
  }, [targetScore, startFrom, duration, onComplete]);

  return currentScore;
}

interface PlayerAvatarWithScoreProps {
  name: string;
  score: number;
  startFrom?: number;
  duration?: number;
  size?: "sm" | "md" | "lg";
  onCountdownComplete?: () => void;
}

const scoreSizeClasses = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-3xl",
};

export default function PlayerAvatarWithScore({
  name,
  score,
  startFrom = 100,
  duration = 800,
  size = "sm",
  onCountdownComplete,
}: PlayerAvatarWithScoreProps) {
  const animatedScore = useCountdown(
    score,
    startFrom,
    duration,
    onCountdownComplete,
  );

  return (
    <div className="flex flex-col items-center gap-2">
      <PlayerAvatar name={name} size={size} />
      <span className={`${scoreSizeClasses[size]} font-bold text-white`}>
        {animatedScore}
      </span>
    </div>
  );
}
