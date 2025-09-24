"use client";
import { useParams } from "next/navigation";
import AnsweredList from "@/app/_components/listPlayersAnswered";
import CountdownTimer from "@/app/_components/countdownTimer";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import DisplayQuestion from "@/app/_components/displayQuestion";
import { useEffect, useState } from "react";
import { usePusherContext } from "@/contexts/PusherContext";
import type { PresenterGameAdvanceEvent } from "@/types";

export default function GamePage() {
  const param = useParams();
  const code = param.code as string;
  const mutation = api.advance.advance.useMutation();
  const { subscribe, unsubscribe } = usePusherContext();
  // Initialize from sessionStorage if available
  const [timeIsUp, setTimeIsUp] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(`timeIsUp-${code}`);
      return stored ? stored === "true" : false;
    }
    return false;
  });
  // Save to sessionStorage whenever timeIsUp changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(`timeIsUp-${code}`, timeIsUp.toString());
    }
  }, [timeIsUp, code]);

  // Initialize from sessionStorage if available
  const [endTimeStamp, setEndTimeStamp] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(`endTimeStamp-${code}`);
      return stored ? parseInt(stored, 10) : undefined;
    }
    return undefined;
  });

  const [duration, setDuration] = useState(() => {
    if (typeof window !== "undefined" && endTimeStamp) {
      return Math.floor((endTimeStamp - Date.now()) / 1000);
    }
    return 120;
  });

  // Save to sessionStorage whenever endTimeStamp changes
  useEffect(() => {
    if (endTimeStamp && typeof window !== "undefined") {
      sessionStorage.setItem(`endTimeStamp-${code}`, endTimeStamp.toString());
    }
  }, [endTimeStamp, code]);

  useEffect(() => {
    const channeName = "presenter-" + code;
    const channel = subscribe(channeName);
    const eventHandler = (event: PresenterGameAdvanceEvent) => {
      if (event.newState == "QUESTION") {
        setTimeIsUp(false);
        const endtime = Date.parse(event.timestamp) + 120 * 1000;
        setEndTimeStamp(endtime);
        setDuration(Math.floor((endtime - Date.now()) / 1000));
      } else if (event.newState == "RESULT") {
        setTimeIsUp(true);
        if (typeof window !== "undefined") {
          sessionStorage.removeItem(`endTimeStamp-${code}`);
          sessionStorage.removeItem(`timeIsUp-${code}`);
        }
      } else if (event.newState == "FINAL_RESULT") {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem(`endTimeStamp-${code}`);
          sessionStorage.removeItem(`timeIsUp-${code}`);
        }
      }
    };
    channel.bind("presenter-advanced", eventHandler);
    return () => {
      channel.unbind("presenter-advanced", eventHandler);
    };
  }, [code, subscribe, unsubscribe]);

  useEffect(() => {
    if (endTimeStamp) {
      setDuration(Math.floor((endTimeStamp - Date.now()) / 1000));
    }
  }, [endTimeStamp]);

  return (
    <main className="flex flex-col items-center gap-5 p-12">
      <DisplayQuestion />
      <CountdownTimer duration={duration} autoStart={!timeIsUp} />
      <AnsweredList />
      <Button
        variant={"secondary"}
        onClick={async () => {
          await mutation.mutateAsync({ gameCode: code });
        }}
      >
        {timeIsUp ? "Next Question" : "Show answer"}
      </Button>
    </main>
  );
}
