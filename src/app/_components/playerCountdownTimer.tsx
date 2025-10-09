"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Clock, Zap } from "lucide-react";

interface CountdownTimerProps {
  targetTimestamp: string;
  onComplete?: () => void;
}

const PlayerCountdownTimer: React.FC<CountdownTimerProps> = ({
  targetTimestamp,
  onComplete,
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    const initialTime = Date.now();

    const calculateTimeLeft = () => {
      const now = Date.now();
      const target = new Date(targetTimestamp).getTime();
      const difference = Math.max(0, Math.ceil((target - now) / 1000) - 1);
      return difference;
    };

    setTimeLeft(calculateTimeLeft());
    setIsActive(true);

    const intervalId = setInterval(() => {
      const currentTime = Date.now();

      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      const totalDurationInSeconds = Math.max(
        0,
        Math.ceil((new Date(targetTimestamp).getTime() - initialTime) / 1000),
      );

      const elapsedTimeInSeconds = Math.max(
        0,
        Math.floor((currentTime - initialTime) / 1000),
      );

      let perc = 0;
      if (totalDurationInSeconds > 0) {
        perc = Math.min(
          (elapsedTimeInSeconds / totalDurationInSeconds) * 100,
          100,
        );
      } else if (currentTime >= new Date(targetTimestamp).getTime()) {
        perc = 100;
      }

      setProgressPercentage(perc);

      if (remaining <= 0) {
        setIsActive(false);
        clearInterval(intervalId);

        if (onComplete) {
          onComplete();
        }
      }
    }, 50);

    return () => clearInterval(intervalId);
  }, [targetTimestamp, onComplete]);

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return `00`;
    if (seconds < 10) return `0${seconds.toString()}`;

    return `${seconds.toString()}`;
  };

  const getTimerGradient = () => {
    if (!isActive) return "from-red-500 to-red-600";
    if (timeLeft <= 5) return "from-red-500 via-orange-500 to-red-600";
    if (timeLeft <= 10) return "from-orange-500 via-amber-500 to-orange-600";
    if (timeLeft <= 15) return "from-amber-500 via-yellow-500 to-amber-600";
    return "from-purple-500 via-violet-500 to-purple-600";
  };

  const getTimerAnimation = () => {
    if (!isActive) return "";
    if (timeLeft <= 5) return "animate-critical-pulsate";
    if (timeLeft <= 10) return "animate-urgent-pulsate";
    if (timeLeft <= 15) return "animate-warning-pulsate";
    return "";
  };

  const getRingAnimation = () => {
    if (!isActive) return "animate-critical-glow";
    if (timeLeft <= 5) return "animate-critical-glow";
    if (timeLeft <= 10) return "animate-urgent-glow";
    if (timeLeft <= 15) return "animate-warning-glow";
    return "";
  };

  const getIconColor = () => {
    if (!isActive) return "text-red-400";
    if (timeLeft <= 5) return "text-red-400";
    if (timeLeft <= 10) return "text-orange-400";
    if (timeLeft <= 15) return "text-amber-400";
    return "text-purple-400";
  };

  return (
    <div className="relative flex items-center justify-center">
      <div
        className={`relative flex items-center gap-3 rounded-2xl border-2 border-white/20 bg-gradient-to-br ${getTimerGradient()} p-4 shadow-2xl backdrop-blur-sm transition-all duration-300 ${getRingAnimation()} ${getTimerAnimation()}`}
      >
        <div className={`${getIconColor()} transition-colors duration-300`}>
          {!isActive ? (
            <Zap className="h-8 w-8 animate-pulse" />
          ) : (
            <Clock className="h-8 w-8" />
          )}
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="font-mono text-5xl font-black text-white tabular-nums drop-shadow-lg md:text-6xl">
            {formatTime(timeLeft)}
          </div>
          <div className="text-xs font-semibold tracking-widest text-white/80 uppercase">
            seconds
          </div>
        </div>

        {isActive && (
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div
              className="absolute right-0 bottom-0 left-0 bg-white/10 transition-all duration-300 ease-linear"
              style={{ height: `${progressPercentage}%` }}
            />
          </div>
        )}

        {isActive && timeLeft > 5 && (
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        )}
      </div>

      {timeLeft <= 10 && isActive && (
        <div
          className={`absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br ${getTimerGradient()} opacity-50 blur-xl`}
        />
      )}
    </div>
  );
};

export default PlayerCountdownTimer;
