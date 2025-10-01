"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useParams, useRouter } from "next/navigation";

interface StartButtonProps {
  gameSettings: {
    timePerQuestion: number;
    questionCount: number;
  };
}

export default function StartButton({ gameSettings }: StartButtonProps) {
  const param = useParams();
  const code = param.code as string;
  const router = useRouter();
  const mutation = api.game.startGame.useMutation();
  const { timePerQuestion, questionCount } = gameSettings;

  return (
    <Button
      variant={"secondary"}
      onClick={async () => {
        await mutation.mutateAsync({
          gameCode: code,
          totalQuestions: questionCount,
          secondsPerQuestion: timePerQuestion,
        });

        router.push("/presenter/" + code + "/game");
      }}
    >
      Start game
    </Button>
  );
}
