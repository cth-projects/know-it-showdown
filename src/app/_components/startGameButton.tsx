"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useParams, useRouter } from "next/navigation";

export default function StartButton() {
  const param = useParams();
  const code = param.code as string;
  const router = useRouter();
  const mutation = api.advance.advance.useMutation();

  return (
    <Button
      variant={"secondary"}
      onClick={async () => {
        
        router.push("/presenter/" + code + "/game");
        await mutation.mutateAsync({ gameCode: code });
      }}
    >
      Start game
    </Button>
  );
}
