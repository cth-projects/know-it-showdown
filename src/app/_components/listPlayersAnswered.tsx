import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle } from "lucide-react";
import { usePusherContext } from "@/contexts/PusherContext";
import { useParams } from "next/navigation";
import { api } from "@/trpc/react";
import type { PlayerStatus } from "@/types";
import { motion, LayoutGroup } from "motion/react";
import PlayerAvatar from "./playerAvatar";

export default function SimpleQuestionList() {
  const { subscribe, unsubscribe } = usePusherContext();
  const [hasAdvanced, setHasAdvanced] = useState(false);
  const param = useParams();
  const code = param.code as string;
  const advanceMutation = api.game.advanceGame.useMutation();
  const [players, setPlayers] = useState<PlayerStatus[]>([]);
  const [isClient, setIsClient] = useState(false);

  const { data } = api.game.getPlayersAnsweredList.useQuery({ gameCode: code });

  useEffect(() => {
    if (Array.isArray(data)) {
      setPlayers(data);
      setIsClient(true);
    }
  }, [data]);

  useEffect(() => {
    const channelName = "presenter-" + code;
    const channel = subscribe(channelName);

    const handlePlayerAnswered = (eventData: {
      name: string;
      questionID: number;
    }) => {
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.name === eventData.name
            ? { ...player, answered: true }
            : player,
        ),
      );
    };
    channel.bind("player-answered", handlePlayerAnswered);

    return () => {
      channel.unbind("player-answered", handlePlayerAnswered);
    };
  }, [code, subscribe, unsubscribe]);

  useEffect(() => {
    if (
      !hasAdvanced &&
      players.every((p) => p.answered) &&
      players.length > 0
    ) {
      setHasAdvanced(true);
      void advanceMutation.mutateAsync({ gameCode: code });
    }
  }, [players, hasAdvanced, advanceMutation, code]);

  if (!isClient) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 p-6">
        <div className="text-center">Loading player status...</div>
      </div>
    );
  }

  const unansweredQuestions = players.filter((q) => !q.answered);
  const answeredQuestions = players.filter((q) => q.answered);

  const QuestionItem = (player: { name: string; answered: boolean }) => (
    <motion.div
      layoutId={player.name}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 30,
      }}
      className="p-4"
    >
      <PlayerAvatar name={player.name} size={"sm"} />
    </motion.div>
  );

  return (
    <LayoutGroup>
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Circle className="h-5 w-5" />
                Not Answered
                <Badge variant="outline">{unansweredQuestions.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {unansweredQuestions.length === 0 ? (
                <p className="py-8 text-center text-gray-500">
                  All players have answered! 🎉
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {unansweredQuestions.map((player) => (
                    <QuestionItem
                      key={player.name}
                      name={player.name}
                      answered={player.answered}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                Answered
                <Badge variant="outline">{answeredQuestions.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {answeredQuestions.length === 0 ? (
                <p className="py-8 text-center text-gray-500">No answers yet</p>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {answeredQuestions.map((player) => (
                    <QuestionItem
                      key={player.name}
                      name={player.name}
                      answered={player.answered}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutGroup>
  );
}
