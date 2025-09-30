import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PresenterGameAdvanceEvent } from "@/types";
import { usePusherContext } from "@/contexts/PusherContext";
import { useParams } from "next/navigation";
import { api } from "@/trpc/react";

interface CountdownTimerProps {
  duration?: number;
  autoStart?: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  duration = 120,
  autoStart = true,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(autoStart);
  const [isComplete, setIsComplete] = useState(false);
  const [hasAdvanced, setHasAdvanced] = useState(false);
  const { subscribe, unsubscribe } = usePusherContext();
  const param = useParams();
  const code = param.code as string;
  const mutation = api.advance.advance.useMutation();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsActive(false);
            setIsComplete(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (!isActive && interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  useEffect(() => {
    const channeName = "presenter-" + code;
    const channel = subscribe(channeName);

    const eventHandler = (event: PresenterGameAdvanceEvent) => {
      if (event.newState == "QUESTION") {
        setIsActive(true);
        setIsComplete(false);
        setTimeLeft(duration);
      } else if (event.newState == "RESULT") {
        setIsActive(false);
        setIsComplete(true);
        setTimeLeft(0);
        setHasAdvanced(true);
      }
    };
    channel.bind("presenter-advanced", eventHandler);

    return () => {
      channel.unbind("presenter-advanced", eventHandler);
    };
  }, [code, duration, subscribe, unsubscribe]);

  useEffect(() => {
    if (isComplete && !hasAdvanced) {
      setHasAdvanced(true);
      void mutation.mutateAsync({ gameCode: code });
    } else if (!isComplete && hasAdvanced) {
      setHasAdvanced(false);
    }
  }, [isComplete, hasAdvanced, mutation, code]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (isComplete) return "text-red-600";
    if (timeLeft <= 30) return "text-red-500";
    if (timeLeft <= 60) return "text-orange-500";
    return "text-foreground";
  };

  const getBackgroundColor = () => {
    if (isComplete) return "bg-red-50 border-red-200";
    if (timeLeft <= 30) return "bg-red-50 border-red-200";
    if (timeLeft <= 60) return "bg-orange-50 border-orange-200";
    return "";
  };

  return (
    <Card className={`mx-auto w-fit ${getBackgroundColor()}`}>
      <CardContent className="p-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2">
            {isComplete ? (
              <Badge variant="destructive" className="text-sm">
                Time&apos;s Up!
              </Badge>
            ) : (
              <Badge variant="outline" className="text-sm">
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
