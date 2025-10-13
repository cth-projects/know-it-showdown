"use client";
import { useParams, useRouter } from "next/navigation";
import AnsweredList from "@/app/_components/listPlayersAnswered";
import CountdownTimer from "@/app/_components/countdownTimer";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import DisplayQuestion from "@/app/_components/displayQuestion";
import { useCallback, useEffect, useState } from "react";
import { usePusherContext } from "@/contexts/PusherContext";
import type { PlayerResult, PlayerStatus, PresenterGameEvent } from "@/types";
import QuestionResult from "@/app/_components/questionResult";
import { Game0To100State } from "@prisma/client";
import { Spinner } from "@/components/ui/spinner";
import { audioManager } from "@/lib/audioManager";
import { AudioSettings } from "@/app/_components/audioSettings";

export default function GamePage() {
  const param = useParams();
  const code = param.code as string;
  const router = useRouter();
  const startRoundMutation = api.game.startRound.useMutation();
  const endRoundMutation = api.game.endRound.useMutation();
  const { subscribe, unsubscribe } = usePusherContext();
  const [question, setQuestion] = useState<string>();
  const [result, setResult] = useState<number>();
  const [timeIsUp, setTimeIsUp] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [nextAdvanceTimestamp, setNextAdvanceTimestamp] = useState<string>("");
  const [isMutating, setIsMutating] = useState(false);
  const [playerResults, setPlayerResults] = useState<PlayerResult[]>([]);
  const [gameState, setGameState] = useState<Game0To100State>();
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus[]>([]);
  const [gameData, setGameData] = useState<PresenterGameEvent>();

  const { data: fetchedEvent } = api.game.getCurrentPresenterView.useQuery({
    gameCode: code,
  });
  const { data: fetchedPlayerStatus } =
    api.game.getPlayersAnsweredList.useQuery({
      gameCode: code,
    });

  const eventHandler = useCallback(
    (event: PresenterGameEvent) => {
      setGameState(event.newState);
      setGameData(event);

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
        //Resets all players status to false when gamestate changes to result
        setPlayerStatus((players) =>
          players.map((player) => ({
            name: player.name,
            answered: false,
          })),
        );
      } else if (event.newState === Game0To100State.FINAL_RESULT) {
        setNextAdvanceTimestamp("");
        router.push("/presenter/" + code + "/final-result");
      }
    },
    [router, code],
  );

  const playerAnsweredHandler = useCallback(
    (data: { name: string }) => {
      setPlayerStatus((players) =>
        players.map((player) =>
          player.name === data.name ? { ...player, answered: true } : player,
        ),
      );
      audioManager.play("swoosh");
    },
    [setPlayerStatus],
  );
  useEffect(() => {
    if (fetchedEvent) {
      eventHandler(fetchedEvent);
    }
    if (fetchedPlayerStatus) {
      setPlayerStatus(fetchedPlayerStatus);
    }
    if (fetchedEvent && fetchedPlayerStatus) {
      setIsClient(true);
    }
  }, [eventHandler, fetchedEvent, fetchedPlayerStatus]);

  useEffect(() => {
    const channeName = "presenter-" + code;
    const channel = subscribe(channeName);

    channel.bind("presenter-advanced", eventHandler);
    channel.bind("player-answered", playerAnsweredHandler);
    return () => {
      channel.unbind("presenter-advanced", eventHandler);
      channel.unbind("player-answered", playerAnsweredHandler);
    };
  }, [code, eventHandler, playerAnsweredHandler, subscribe, unsubscribe]);

  const handleAdvance = async () => {
    if (isMutating) return;
    setIsMutating(true);
    try {
      if (gameState === Game0To100State.QUESTION) {
        await endRoundMutation.mutateAsync({ gameCode: code });
      } else if (
        gameState === Game0To100State.RESULT ||
        gameState === Game0To100State.LOBBY
      ) {
        await startRoundMutation.mutateAsync({ gameCode: code });
      }
    } finally {
      setIsMutating(false);
    }
  };

  if (!isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center gap-5 p-12">
      {nextAdvanceTimestamp ? (
        <div className={timeIsUp ? "hidden" : ""}>
          <CountdownTimer
            targetTimestamp={nextAdvanceTimestamp}
            onComplete={handleAdvance}
          />
        </div>
      ) : null}

      {gameData && !timeIsUp && (
        <div>
          <span className="text-4xl font-bold text-purple-600 dark:text-white">
            {gameData.currentQuestionIndex + 1}/{gameData.totalQuestions}
          </span>
        </div>
      )}
      <DisplayQuestion
        question={question ?? ""}
        result={result ?? 0}
        showResult={timeIsUp}
      />
      {!timeIsUp ? (
        <AnsweredList players={playerStatus} onSuccess={handleAdvance} />
      ) : (
        <QuestionResult playerResults={playerResults} />
      )}
      {process.env.NODE_ENV === "development" && (
        <Button variant={"secondary"} onClick={handleAdvance}>
          {timeIsUp ? "Next Question" : "Show answer"}
        </Button>
      )}
      <div className="fixed right-4 bottom-4 z-50">
        <AudioSettings />
      </div>
    </main>
  );
}
