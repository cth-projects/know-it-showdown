"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { usePusherContext } from "@/contexts/PusherContext";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { Users } from "lucide-react";

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Players in Lobby
          </span>
          <Badge variant="secondary" className="text-lg font-bold">
            {players?.length ?? 0}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {players ? (
            <div className="grid gap-3">
              {players.map((item, index) => (
                <div
                  key={item}
                  className="bg-card hover:bg-accent flex items-center gap-3 rounded-lg border p-3 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(item)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="leading-none font-medium">{item}</p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Player #{index + 1}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-green-500/20 bg-green-500/10 text-green-600"
                  >
                    Ready
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center">
              Loading players...
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
