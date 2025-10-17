"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { usePusherContext } from "@/contexts/PusherContext";
import QuestionCard from "@/app/_components/playerQuestion";
import type { PlayerGameEvent, QuestionEvent } from "@/types";
import Lobby from "@/components/game/lobby";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { Game0To100State } from "@prisma/client";
import { Spinner } from "@/components/ui/spinner";

export default function GamePage() {
  const params = useParams();
  const code = params.code as string;
  const searchParams = useSearchParams();
  const playerName = searchParams.get("playerName");
  const [gameState, setGameState] = useState<Game0To100State>(
    Game0To100State.LOBBY,
  );
  const [questionData, setQuestionData] = useState<QuestionEvent | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submittedAnswer, setSubmittedAnswer] = useState<number | undefined>(
    undefined,
  );
  const router = useRouter();
  const submitAnswerMutation = api.game.submitAnswer.useMutation();
  const { subscribe, unsubscribe } = usePusherContext();

  const [isInitialized, setIsInitialized] = useState(false);
  const { data: currentState, isLoading } =
    api.game.getCurrentPlayerView.useQuery(
      {
        gameCode: code,
        playerName: playerName ?? "",
      },
      {
        enabled: !!playerName && !!code,
        refetchOnWindowFocus: false,
      },
    );

  useEffect(() => {
    if (currentState && !isInitialized) {
      setGameState(currentState.newState);

      if (currentState.newState === Game0To100State.QUESTION) {
        setQuestionData(currentState);
        setHasSubmitted(currentState.hasAnswered);
        setSubmittedAnswer(currentState.submittedAnswer);
      } else if (currentState.newState === Game0To100State.RESULT) {
        const resultEvent = currentState;

        setQuestionData({
          newState: "QUESTION",
          currentQuestion: {
            question: resultEvent.questionResult.question,
            category: resultEvent.questionResult.category,
          },
          currentQuestionIndex: resultEvent.currentQuestionIndex,
          totalQuestions: resultEvent.totalQuestions,
          nextAdvanceTimestamp: resultEvent.nextAdvanceTimestamp,
        });

        const playerResult = resultEvent.playerResults.find(
          (p) => p.name === playerName,
        );

        setHasSubmitted(true);
        setSubmittedAnswer(playerResult?.answer);
      }

      setIsInitialized(true);
    }
  }, [currentState, isInitialized, playerName]);

  useEffect(() => {
    const channelName = "player-" + code;
    const channel = subscribe(channelName);

    channel.bind("game-advance", (data: PlayerGameEvent) => {
      if (data.newState === Game0To100State.QUESTION) {
        setGameState(Game0To100State.QUESTION);
        setQuestionData(data);
        setHasSubmitted(false);
        setSubmittedAnswer(undefined);
      } else if (data.newState === Game0To100State.RESULT) {
        setGameState(Game0To100State.RESULT);
      } else if (data.newState === Game0To100State.FINAL_RESULT) {
        setGameState(Game0To100State.FINAL_RESULT);
      }
    });

    return () => {
      channel.unbind_all();
      unsubscribe(channelName);
    };
  }, [code, subscribe, unsubscribe]);

  const handleSubmitAnswer = async (answer: number) => {
    if (!playerName) return;
    if (hasSubmitted) return;

    setHasSubmitted(true);
    setSubmittedAnswer(answer);

    try {
      await submitAnswerMutation.mutateAsync({
        gameCode: code,
        playerName: playerName,
        answer: answer,
      });
    } catch {
      setHasSubmitted(false);
      setSubmittedAnswer(undefined);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  if (gameState === Game0To100State.LOBBY) {
    return <Lobby gameCode={code} playerName={playerName} />;
  } else if (
    (gameState === Game0To100State.QUESTION ||
      gameState === Game0To100State.RESULT) &&
    questionData
  ) {
    return (
      <QuestionCard
        question={questionData.currentQuestion}
        questionEndTimestamp={questionData.nextAdvanceTimestamp}
        onSubmitAnswer={handleSubmitAnswer}
        isSubmitted={hasSubmitted}
        playerAnswer={submittedAnswer}
        questionIndex={questionData.currentQuestionIndex}
        totalQuestions={questionData.totalQuestions}
      />
    );
  } else if (gameState === Game0To100State.FINAL_RESULT) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center space-y-6">
        <div className="text-3xl font-bold">GG WP, thanks for playing!</div>
        <p className="text-lg text-gray-300">
          Please see the presenter screen for results.
        </p>
        <button
          onClick={() => router.push(`/`)}
          className="rounded-lg bg-gray-600 px-6 py-3 text-white transition-colors hover:bg-gray-700"
        >
          Back to home
        </button>
      </div>
    );
  }
}
