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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function StartButton({ gameSettings }: StartButtonProps) {
  const param = useParams();
  const code = param.code as string;
  const router = useRouter();
  const mutation = api.game.startGame.useMutation();

  return (
    <Button
      variant={"secondary"}
      onClick={async () => {
        router.push("/presenter/" + code + "/game");
        await mutation.mutateAsync({ gameCode: code });

        // TODO: make another api call including the timePerQuestion & questionCount
      }}
    >
      Start game
    </Button>
  );
}
