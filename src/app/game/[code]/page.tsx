"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { usePusherContext } from "@/contexts/PusherContext";

export default function GamePage() {
  const params = useParams();
  const code = params.code as string;

  const { subscribe, unsubscribe } = usePusherContext();
  const testPusherMutation = api.test.pusher.useMutation();

  useEffect(() => {
    const channel = subscribe("test");

    channel.bind("test-event", (data: { name: string; timestamp: number }) => {
      console.log("Got event:", data);
    });

    return () => {
      channel.unbind_all();
      unsubscribe("test");
    };
  }, [subscribe, unsubscribe]);

  return (
    <div>
      <Button
        onClick={async () => {
          await testPusherMutation.mutateAsync({
            name: "hello",
          });
        }}
      >
        Test Pusher {code}
      </Button>
    </div>
  );
}
