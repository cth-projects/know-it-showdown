"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePusherContext } from "@/contexts/PusherContext";
import { api } from "@/trpc/react";
import type { PresenterGameEvent } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Display() {
  const param = useParams();
  const code = param.code as string;
  const { subscribe, unsubscribe } = usePusherContext();
  const router = useRouter();
  const [timeIsUp, setTimeIsUp] = useState(false);
  const [question, setQuestion] = useState<string>();
  const [result, setResult] = useState<number>(0);
  const { data } = api.game.getGameState.useQuery({ gameCode: code });

  useEffect(() => {
    if (data) {
      if (data.gameState === "QUESTION") {
        setTimeIsUp(false);
      } else if (data.gameState === "RESULT") {
        setTimeIsUp(true);
      }
      setQuestion(data.question ?? "Loading question...");
      setResult(data.answer ?? 0);
    }
  }, [data]);

  useEffect(() => {
    const channelName = "presenter-" + code;
    const channel = subscribe(channelName);

    const handlePresenterAdvanced = (event: PresenterGameEvent) => {
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
  if (!data) return <div>Loading...</div>;
  return (
    <div>
      <Card className="mx-auto mb-1 w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl">Question:</CardTitle>
        </CardHeader>
        <CardContent className="text-5xl">{question}</CardContent>

        {timeIsUp ? (
          <>
            <CardHeader>
              <CardTitle className="text-2xl text-green-600">
                Correct answer:
              </CardTitle>
            </CardHeader>
            <CardContent className="text-5xl text-green-600">
              {result}
            </CardContent>
          </>
        ) : null}
      </Card>
    </div>
  );
}
