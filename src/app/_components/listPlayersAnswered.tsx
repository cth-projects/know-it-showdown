import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle } from "lucide-react";
import { usePusherContext } from "@/contexts/PusherContext";
import { useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import type { PresenterGameAdvanceEvent } from "@/types";

interface PlayerStatus {
  name: string;
  answered: boolean;
}

const usePersistedPlayerStatus = (gameCode: string) => {
  const storageKey = `player-status-${gameCode}`;

  const [players, setPlayers] = useState<PlayerStatus[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsedPlayers = JSON.parse(saved);
        setPlayers(parsedPlayers);
      } catch (error) {
        console.error("Failed to parse saved player status:", error);
      }
    }
  }, [storageKey]);

  // Save to localStorage whenever players state changes
  useEffect(() => {
    if (isClient && players.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(players));
    }
  }, [players, storageKey, isClient]);

  const updatePlayerStatus = (name: string, answered: boolean) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.name === name ? { ...player, answered } : player,
      ),
    );
  };

  const initializePlayers = (newPlayers: { name: string }[]) => {
    setPlayers((prevPlayers) => {
      const existingStatusMap = new Map(
        prevPlayers.map((player) => [player.name, player.answered]),
      );
      return newPlayers.map((player) => ({
        name: player.name,
        answered: existingStatusMap.get(player.name) ?? false,
      }));
    });
  };

  const resetPlayerStatus = () => {
    localStorage.removeItem(storageKey);
    setPlayers([]);
  };

  return {
    players,
    updatePlayerStatus,
    initializePlayers,
    resetPlayerStatus,
    isClient,
  };
};

export default function SimpleQuestionList() {
  const { subscribe, unsubscribe } = usePusherContext();
  const param = useParams();
  const code = param.code as string;
  const mutation = api.answers.submit.useMutation();

  const { data } = api.game.getPlayers.useQuery({ gameCode: code });
  const { players, updatePlayerStatus, initializePlayers, isClient } =
    usePersistedPlayerStatus(code);

  useEffect(() => {
    if (data && data.length > 0) {
      initializePlayers(data.map((p) => ({ name: p.name })));
    }
  }, [data]);

  useEffect(() => {
    const channelName = "presenter-" + code;
    const channel = subscribe(channelName);

    //Reset all players to unanswered when a new question starts
    const handlePresenterAdvanced = (event: PresenterGameAdvanceEvent) => {
      if (event.newState == "QUESTION") {
        players.forEach((player) => {
          updatePlayerStatus(player.name, false);
        });
      }
    };
    const handlePlayerAnswered = (eventData: {
      name: string;
      questionID: number;
    }) => {
      updatePlayerStatus(eventData.name, true);
    };

    channel.bind("presenter-advanced", handlePresenterAdvanced);
    channel.bind("player-answered", handlePlayerAnswered);

    return () => {
      channel.unbind("presenter-advanced", handlePresenterAdvanced);
      channel.unbind("player-answered", handlePlayerAnswered);
    };
  }, [code, players, subscribe, unsubscribe, updatePlayerStatus]);
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
    <div className="mb-2 flex items-center justify-between gap-3 rounded-lg border bg-white p-3 transition-shadow hover:shadow-sm">
      <div className="flex items-center gap-3">
        {player.answered ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <Circle className="h-5 w-5 text-gray-400" />
        )}
        <span className={player.answered ? "text-gray-600" : "text-gray-900"}>
          {player.name}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={player.answered ? "default" : "secondary"}>
          {player.answered ? "Answered" : "Pending"}
        </Badge>

        {/* Button to mark as answered for testing purposes */}
{/*         <Button
          onClick={async () => {
            await mutation.mutateAsync({
              gameCode: code,
              answer: 42,
              playerName: player.name,
            });
          }}
        >
          Mark Answered
        </Button> */}
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
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
              unansweredQuestions.map((player) => (
                <QuestionItem
                  key={player.name}
                  name={player.name}
                  answered={player.answered}
                />
              ))
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
              answeredQuestions.map((player) => (
                <QuestionItem
                  key={player.name}
                  name={player.name}
                  answered={player.answered}
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
