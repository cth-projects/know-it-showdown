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
import ListPlayerAnswerResults from "@/app/_components/listPlayerResults";

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
  const [isClient, setIsClient] = useState(false); // Track client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

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
      const tempDuration = Math.floor((endTimeStamp - Date.now()) / 1000);
      return tempDuration > 0 ? tempDuration : 0;
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
        const endtime = Date.parse(event.timestamp) + 120 * 1000;
        setEndTimeStamp(endtime);
        setDuration(Math.floor((endtime - Date.now()) / 1000));
        setTimeIsUp(false);
      } else if (event.newState == "RESULT") {
        setTimeIsUp(true);
        if (typeof window !== "undefined") {
          sessionStorage.removeItem(`endTimeStamp-${code}`);
          setDuration(120);
          setEndTimeStamp(undefined);
          sessionStorage.removeItem(`timeIsUp-${code}`);
        }
      } else if (event.newState == "FINAL_RESULT") {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem(`endTimeStamp-${code}`);
          setDuration(120);
          setEndTimeStamp(undefined);
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
    if (timeIsUp) {
      localStorage.clear();
    }
  }, [timeIsUp]);

  if (!isClient) return null; // Prevent SSR issues
  return (
    <main className="flex flex-col items-center gap-5 p-12">
      {!timeIsUp ? (
        <CountdownTimer duration={duration} autoStart={!timeIsUp} />
      ) : null}
      <DisplayQuestion />
      {!timeIsUp ? <AnsweredList /> : <ListPlayerAnswerResults />}
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
