import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlayerAvatar from "./playerAvatar";
import { audioManager } from "@/lib/audioManager";

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
  variant?: "default" | "final";
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
  variant = "default",
  onCountdownComplete,
}: PlayerAvatarWithScoreProps) {
  const [isLocked, setIsLocked] = useState(false);

  const handleComplete = () => {
    setIsLocked(true);
    if (variant === "final") {
      audioManager.play("scorePoints", { volumeModifier: -0.3 });
    }
    if (onCountdownComplete) {
      onCountdownComplete();
    }
  };

  const animatedScore = useCountdown(
    score,
    startFrom,
    duration,
    handleComplete,
  );

  // Particle positions around a circle
  const particlePositions = Array.from({ length: 12 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 12;
    return {
      x: Math.cos(angle) * 60,
      y: Math.sin(angle) * 60,
    };
  });

  const lockedColor = variant === "final" ? "#fbbf24" : "#ffffff";
  const shouldScale = variant === "final";
  const shouldShake = variant === "final";
  const shouldShowRings = variant === "final";
  const shouldGlow = variant === "final";

  return (
    <div className="relative flex flex-col items-center gap-2">
      <PlayerAvatar name={name} size={size} />

      <div className="relative">
        {/* Particles - only for final variant */}
        <AnimatePresence>
          {variant === "final" &&
            isLocked &&
            particlePositions.map((pos, i) => (
              <motion.div
                key={i}
                className="absolute h-2 w-2 rounded-full bg-yellow-400"
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{
                  x: pos.x,
                  y: pos.y,
                  opacity: 0,
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.02,
                  ease: "easeOut",
                }}
                style={{
                  left: "50%",
                  top: "50%",
                }}
              />
            ))}
        </AnimatePresence>

        {/* Score */}
        <motion.div
          className={`${scoreSizeClasses[size]} relative font-bold`}
          animate={{
            scale: shouldScale && isLocked ? 1.25 : 1,
            color: isLocked ? lockedColor : "#ffffff",
          }}
          transition={{
            scale: { type: "spring", stiffness: 300, damping: 15 },
            color: { duration: 0.2 },
          }}
          style={{
            textShadow:
              shouldGlow && isLocked
                ? "0 0 20px rgba(251, 191, 36, 0.8), 0 0 40px rgba(251, 191, 36, 0.4)"
                : "none",
          }}
        >
          {/* Shake effect on lock - only for final variant */}
          <motion.span
            animate={
              shouldShake && isLocked
                ? {
                    x: [0, -3, 3, -3, 3, 0],
                  }
                : {}
            }
            transition={{ duration: 0.3, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
          >
            {animatedScore}
          </motion.span>

          {/* Expanding rings - only for final variant */}
          <AnimatePresence>
            {shouldShowRings && isLocked && (
              <motion.div
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="absolute rounded-full border-2 border-yellow-400"
                  initial={{ width: "100%", height: "100%", opacity: 1 }}
                  animate={{ width: "250%", height: "250%", opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute rounded-full border-2 border-yellow-300"
                  initial={{ width: "100%", height: "100%", opacity: 1 }}
                  animate={{ width: "200%", height: "200%", opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
