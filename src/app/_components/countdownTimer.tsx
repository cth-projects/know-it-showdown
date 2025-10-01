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
      const difference = Math.max(0, Math.ceil((target - now) / 1000));
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
    }, 100);

    return () => clearInterval(intervalId);
  }, [targetTimestamp, onComplete]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (!isActive) return "text-red-600";
    if (timeLeft <= 10) return "text-red-500";
    if (timeLeft <= 30) return "text-orange-500";
    return "text-foreground";
  };

  const getBackgroundColor = () => {
    if (!isActive) return "bg-red-50 border-red-200";
    if (timeLeft <= 10) return "bg-red-50 border-red-200";
    if (timeLeft <= 30) return "bg-orange-50 border-orange-200";
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
