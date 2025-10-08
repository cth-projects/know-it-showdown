import React, { useEffect, useRef, useState } from "react";
import PlayerAvatar from "./playerAvatar";

function useCountdown(
  targetScore: number,
  startFrom: number,
  duration: number,
  onComplete?: () => void,
) {
  const [currentScore, setCurrentScore] = useState(startFrom);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const startTime = Date.now();
    const difference = startFrom - targetScore;
    let hasCompleted = false;

    const animate = () => {
      if (hasCompleted) return;

      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOut = 1 - Math.pow(1 - progress, 8);

      const newScore = Math.round(startFrom - difference * easeOut);
      setCurrentScore(newScore);

      if (newScore === targetScore || progress >= 1) {
        hasCompleted = true;
        setCurrentScore(targetScore);

        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      } else {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [targetScore, startFrom, duration]);

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
