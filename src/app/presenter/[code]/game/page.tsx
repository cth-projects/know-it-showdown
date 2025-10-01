"use client";
import { useParams, useRouter } from "next/navigation";
import AnsweredList from "@/app/_components/listPlayersAnswered";
import CountdownTimer from "@/app/_components/countdownTimer";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import DisplayQuestion from "@/app/_components/displayQuestion";
import { useCallback, useEffect, useState } from "react";
import { usePusherContext } from "@/contexts/PusherContext";
import type { PresenterGameEvent } from "@/types";
import ListPlayerAnswerResults from "@/app/_components/listPlayerResults";

export default function GamePage() {
  const param = useParams();
  const code = param.code as string;
  const router = useRouter();
  const mutation = api.game.advanceGame.useMutation();
  const { subscribe, unsubscribe } = usePusherContext();
  const [question, setQuestion] = useState<string>();
  const [result, setResult] = useState<number>();
  const [timeIsUp, setTimeIsUp] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [duration, setDuration] = useState(120);
  const { data: fetchedEvent } = api.game.getCurrentPresenterView.useQuery({
    gameCode: code,
  });
  const eventHandler = useCallback(
    (event: PresenterGameEvent) => {
      if (event.newState == "QUESTION") {
        //TODO: Need to change the setting of duration based on endTimeStamp from PresenterGameEvent.
        setDuration(20);

        setQuestion(event.currentQuestion.question);

        setTimeIsUp(false);
      } else if (event.newState == "RESULT") {
        setTimeIsUp(true);
        setQuestion(event.questionResult.question);
        setResult(event.questionResult.answer);
      } else if (event.newState == "FINAL_RESULT") {
        router.push("/presenter/" + code + "/finalResult");
      }
    },
    [router, code],
  );
  useEffect(() => {
    if (fetchedEvent) {
      eventHandler(fetchedEvent);
      setIsClient(true);
    }
  }, [eventHandler, fetchedEvent]);

  useEffect(() => {
    const channeName = "presenter-" + code;
    const channel = subscribe(channeName);

    channel.bind("presenter-advanced", eventHandler);
    return () => {
      channel.unbind("presenter-advanced", eventHandler);
    };
  }, [code, eventHandler, subscribe, unsubscribe]);

  if (!isClient) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-xl font-semibold text-gray-600">Loading page...</p>
        </div>
      </div>
    );
  }
  return (
    <main className="flex flex-col items-center gap-5 p-12">
      {!timeIsUp ? (
        <CountdownTimer
          duration={duration}
          autoStart={!timeIsUp}
          onComplete={async () => {
            await mutation.mutateAsync({ gameCode: code });
          }}
        />
      ) : null}
      <DisplayQuestion
        question={question ?? ""}
        result={result ?? 0}
        showResult={timeIsUp}
      />
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
