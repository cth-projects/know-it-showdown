"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { usePusherContext } from "@/contexts/PusherContext";
import QuestionCard from "@/app/_components/playerQuestion";
import type { QuestionEvent } from "@/types";
import Lobby from "@/components/game/lobby";
import { api } from "@/trpc/react";

export default function GamePage() {
  const params = useParams();
  const code = params.code as string;

  const searchParams = useSearchParams();
  const playerName = searchParams.get("playerName");

  const [gameState, setGameState] = useState("LOBBY");
  const [currentQuestion, setCurrentQuestion] = useState<
    QuestionEvent["currentQuestion"] | null
  >(null);

  const [timeLeft, setTimeLeft] = useState<number>(120);

  const { subscribe, unsubscribe } = usePusherContext();

  useEffect(() => {
    if (!subscribe || !unsubscribe) return;

    const channel = subscribe(`player-${code}`);

    if (!channel) return;

    channel.bind("game-advance", (data: QuestionEvent) => {
      if (data.newState === "QUESTION") {
        setGameState("QUESTION");
        setCurrentQuestion(data.currentQuestion);
        setTimeLeft(120); // TODO: should get timer from somewhere else
      }
    });

    return () => {
      channel.unbind_all();
      unsubscribe(`player-${code}`);
    };
  }, [code, subscribe, timeLeft, unsubscribe]);

  const submitAnswerMutation = api.game.submitAnswer.useMutation();

  const handleSubmitAnswer = async (answer: number) => {
    if (!playerName) {
      console.error("No player name");
      return;
    }

    await submitAnswerMutation.mutateAsync(
      {
        gameCode: code,
        playerName: playerName,
        answer: answer,
      },
      {
        onSuccess: (data) => {
          console.log("Answer submitted successfully:", data);
        },
        onError: (error) => {
          console.error("Failed to submit answer:", error);
        },
      },
    );
  };

  if (gameState === "LOBBY") {
    return <Lobby gameCode={code} playerName={playerName} />;
  }

  if (gameState === "QUESTION" && currentQuestion) {
    return (
      <QuestionCard
        question={currentQuestion}
        timeLeft={timeLeft}
        onSubmitAnswer={handleSubmitAnswer}
        questionIndex={0}
        totalQuestions={0}
      />
    );
  }

  return <div>Loading...</div>;
}
