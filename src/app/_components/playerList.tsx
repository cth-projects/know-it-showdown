"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Fragment } from "react/jsx-runtime";
import { usePusherContext } from "@/contexts/PusherContext";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/trpc/react";

export default function Playerlist() {
  const param = useParams();

  const code = param.code as string;

  const { subscribe, unsubscribe } = usePusherContext();

  const [players, setPlayers] = useState<string[]>();
  const { data } = api.game.getPlayers.useQuery({ gameCode: code });

  useEffect(() => {
    if (data) {
      setPlayers(data.map((p) => p.name));
    }
  }, [data]);

  useEffect(() => {
    const channel = subscribe("presenter-" + code);

    channel.bind("playerlist-updated", (new_playerlist: string[]) => {
      setPlayers(new_playerlist);
    });

    return () => {
      channel.unbind_all();
      unsubscribe("presenter-" + code);
    };
  }, [subscribe, unsubscribe, code]);

  return (
    <div>
      <ScrollArea className="h-[200px] w-[400px] rounded-md border">
        <div className="grid justify-items-center p-4">
          <h4 className="mb-5 text-sm leading-none font-medium">Players</h4>

          {players ? (
            players.map((item) => (
              <Fragment key={item}>
                <div className="text-sm">{item}</div>
                <Separator className="my-2" />
              </Fragment>
            ))
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </ScrollArea>
      <div>Player count: {players?.length ?? 0}</div>
    </div>
  );
}
