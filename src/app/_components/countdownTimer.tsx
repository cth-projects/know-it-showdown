import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
interface CountdownTimerProps {
  targetTimestamp: string;
  onComplete?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetTimestamp,
  onComplete,
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const target = new Date(targetTimestamp).getTime();
      const difference = Math.max(0, Math.ceil((target - now) / 1000) - 1);
      return difference;
    };

    setTimeLeft(calculateTimeLeft());
    setIsActive(true);

    const intervalId = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

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
    return `${seconds.toString()}`;
  };

  const getTimerColor = () => {
    if (!isActive) return "text-red-600";
    if (timeLeft <= 5) return "text-red-500";
    if (timeLeft <= 10) return "text-orange-500";
    return "text-foreground";
  };

  const getTimerAnimation = () => {
    if (!isActive) return "";
    if (timeLeft <= 5) return "animate-critical-pulsate";
    if (timeLeft <= 10) return "animate-urgent-pulsate";
    if (timeLeft <= 15) return "animate-warning-pulsate";
    return "";
  };

  const getCardAnimation = () => {
    if (!isActive) return "bg-purple-500/30 shadow-xl shadow-purple-500/50";
    if (timeLeft <= 5) return "animate-critical-glow";
    if (timeLeft <= 10) return "animate-urgent-glow";
    if (timeLeft <= 15) return "animate-warning-glow";
    return "";
  };

  return (
    <Card className="mx-auto w-fit border-0 bg-transparent p-2">
      <CardContent className={`p-4 ${getCardAnimation()}`}>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2">
            {!isActive ? (
              <div className="animate-times-up-clean font-mono text-7xl tracking-wider text-white uppercase">
                TIME&apos;S UP
              </div>
            ) : (
              <Badge
                variant="outline"
                className="font-bold} w-[5ch] border-white/5 bg-white/1 p-2 font-mono text-8xl"
              >
                <div className={` ${getTimerAnimation()} ${getTimerColor()}`}>
                  {formatTime(timeLeft)}
                </div>
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CountdownTimer;
