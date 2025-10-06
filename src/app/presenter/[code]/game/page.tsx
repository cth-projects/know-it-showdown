"use client";
import { useParams, useRouter } from "next/navigation";
import AnsweredList from "@/app/_components/listPlayersAnswered";
import CountdownTimer from "@/app/_components/countdownTimer";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import DisplayQuestion from "@/app/_components/displayQuestion";
import { useCallback, useEffect, useState } from "react";
import { usePusherContext } from "@/contexts/PusherContext";
import type { PlayerResult, PresenterGameEvent } from "@/types";
import ListPlayerAnswerResults from "@/app/_components/listPlayerResults";
import { Game0To100State } from "@prisma/client";

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
  const [nextAdvanceTimestamp, setNextAdvanceTimestamp] = useState<string>("");
  const [isMutating, setIsMutating] = useState(false);
  const [playerResults, setPlayerResults] = useState<PlayerResult[]>([]);

  const { data: fetchedEvent } = api.game.getCurrentPresenterView.useQuery({
    gameCode: code,
  });

  const eventHandler = useCallback(
    (event: PresenterGameEvent) => {
      if (event.newState === Game0To100State.QUESTION) {
        setNextAdvanceTimestamp(event.nextAdvanceTimestamp);
        setQuestion(event.currentQuestion.question);
        setTimeIsUp(false);
        setPlayerResults([]); // Clear previous results
      } else if (event.newState === Game0To100State.RESULT) {
        setTimeIsUp(true);
        setQuestion(event.questionResult.question);
        setResult(event.questionResult.answer);
        setNextAdvanceTimestamp(event.nextAdvanceTimestamp);
        setPlayerResults(event.playerResults);
      } else if (event.newState === Game0To100State.FINAL_RESULT) {
        setNextAdvanceTimestamp("");
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
      {nextAdvanceTimestamp ? (
        <div className={timeIsUp ? "hidden" : ""}>
          <CountdownTimer
            targetTimestamp={nextAdvanceTimestamp}
            onComplete={async () => {
              if (!isMutating) {
                setIsMutating(true);
                await mutation.mutateAsync({ gameCode: code });
                setIsMutating(false);
              }
            }}
          />
        </div>
      ) : null}
      <DisplayQuestion
        question={question ?? ""}
        result={result ?? 0}
        showResult={timeIsUp}
      />
      {!timeIsUp ? (
        <AnsweredList />
      ) : (
        <ListPlayerAnswerResults playerResults={playerResults} />
      )}
      {process.env.NODE_ENV === "development" && (
        <Button
          variant={"secondary"}
          onClick={async () => {
            await mutation.mutateAsync({ gameCode: code });
          }}
        >
          {timeIsUp ? "Next Question" : "Show answer"}
        </Button>
      )}
    </main>
  );
}
