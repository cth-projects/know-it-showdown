import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
interface CountdownTimerProps {
  duration?: number;
  autoStart?: boolean;
  onComplete?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  duration = 120,
  autoStart = false,
  onComplete,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(autoStart);

  useEffect(() => {
    if (isActive && timeLeft <= 0) {
      setIsActive(false);
      if (onComplete) {
        onComplete();
      }
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onComplete, isActive]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (!isActive) return "text-red-600";
    if (timeLeft <= 30) return "text-red-500";
    if (timeLeft <= 60) return "text-orange-500";
    return "text-foreground";
  };

  const getBackgroundColor = () => {
    if (!isActive) return "bg-red-50 border-red-200";
    if (timeLeft <= 30) return "bg-red-50 border-red-200";
    if (timeLeft <= 60) return "bg-orange-50 border-orange-200";
    return "";
  };

  return (
    <Card className={`mx-auto w-fit ${getBackgroundColor()}`}>
      <CardContent className="p-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2">
            {!isActive ? (
              <Badge variant="destructive" className="text-2xl">
                Time&apos;s Up!
              </Badge>
            ) : (
              <Badge variant="outline" className="text-2xl">
                Time left
              </Badge>
            )}
          </div>

          <div className={`font-mono text-6xl font-bold ${getTimerColor()}`}>
            {formatTime(timeLeft)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CountdownTimer;
