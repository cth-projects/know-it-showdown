"use client";
import { usePusherContext } from "@/contexts/PusherContext";
import { api } from "@/trpc/react";
import type { PresenterGameAdvanceEvent } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Display() {
  const param = useParams();
  const code = param.code as string;
  const { subscribe, unsubscribe } = usePusherContext();
  const router = useRouter();
  const [timeIsUp, setTimeIsUp] = useState(false);
  const [question, setQuestion] = useState<string>("Waiting for question...");
  const [result, setResult] = useState<number>(0);
  const { data } = api.game.getGameState.useQuery({ gameCode: code });

  useEffect(() => {
    if (data) {
      if (data.gameState === "QUESTION") {
        setTimeIsUp(false);
      } else if (data.gameState === "RESULT") {
        setTimeIsUp(true);
      }
      setQuestion(data.question ?? "Waiting for question...");
      setResult(data.answer ?? 0);
    }
  }, [data]);

  useEffect(() => {
    const channelName = "presenter-" + code;
    const channel = subscribe(channelName);

    const handlePresenterAdvanced = (event: PresenterGameAdvanceEvent) => {
      if (event.newState == "QUESTION") {
        setTimeIsUp(false);
        setQuestion(event.currentQuestion.question);
      } else if (event.newState == "RESULT") {
        setTimeIsUp(true);
        setResult(event.questionResult.answer);
      } else {
        router.push("/presenter/" + code + "/finalResult");
      }
    };

    channel.bind("presenter-advanced", handlePresenterAdvanced);

    return () => {
      channel.unbind("presenter-advanced", handlePresenterAdvanced);
    };
  }, [code, router, subscribe, unsubscribe]);
  return (
    <div>
      <div className="p-10 text-7xl">{question}</div>
      {timeIsUp ? (
        <div className="flex flex-col items-center">
          <div className="text-5xl">Answer: {result}</div>
        </div>
      ) : null}
    </div>
  );
}
