"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { FinalResultEvent } from "@/types/game-events";
import { useRouter } from "next/navigation";

interface finalResultBoardProps {
  finalResultEvent: FinalResultEvent; // The complete final result event
  gameCode?: string; // Optional game code for display
  showGameInfo?: boolean; // Whether to show game metadata
}

export default function FinalResultBoard({
  finalResultEvent,
  gameCode,
  showGameInfo = true,
}: finalResultBoardProps) {
  const router = useRouter();

  // Helper functions for display
  const getRankDisplay = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getBadgeVariant = (rank: number) => {
    if (rank === 1) return "default";
    if (rank === 2) return "secondary";
    return "outline";
  };

  const getTimeSinceEvent = () => {
    const eventTime = new Date(finalResultEvent.nextAdvanceTimestamp);
    const minutesAgo = Math.floor(
      (Date.now() - eventTime.getTime()) / (1000 * 60),
    );
    if (minutesAgo < 1) return "Just finished";
    if (minutesAgo === 1) return "1 minute ago";
    return `${minutesAgo} minutes ago`;
  };

  const isWinner = (rank: number) => rank === 1;

  // Extract data from the event
  const { finalResults, gameStats } = finalResultEvent;
  const winner = finalResults.find((player) => player.rank === 1);

  return (
    <div className="space-y-6">
      {/* Celebration Header */}
      <div className="text-center">
        <h2 className="text-white-900 mb-2 text-3xl font-bold">
          🎉 Game Complete! 🎉
        </h2>
        <p className="text-gray-600">
          Congratulations to all players! Here are the final results.
        </p>
      </div>

      {/* Main Leaderboard Card */}
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Final Results</CardTitle>
          {showGameInfo && (
            <div className="space-y-1 text-sm text-gray-600">
              {gameCode && (
                <p>
                  Game Code:{" "}
                  <span className="font-mono font-bold">{gameCode}</span>
                </p>
              )}
              <p>
                {getTimeSinceEvent()} • {gameStats.totalQuestions} questions
              </p>
            </div>
          )}
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 text-center">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="w-20 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {finalResults.map((player) => (
                <TableRow
                  key={`${player.name}-${player.rank}`}
                  className={` ${isWinner(player.rank) ? "border-yellow-200/50 bg-yellow-50/40" : ""} transition-colors duration-200 hover:bg-gray-50/50`}
                >
                  {/* Rank */}
                  <TableCell className="text-center">
                    <Badge variant={getBadgeVariant(player.rank)}>
                      {getRankDisplay(player.rank)}
                    </Badge>
                  </TableCell>

                  {/* Player Name */}
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span>{player.name}</span>
                      {isWinner(player.rank) && (
                        <span className="text-lg">👑</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Score */}
                  <TableCell className="text-right text-lg font-bold">
                    {player.finalScore.toLocaleString()}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="text-center">
                    {isWinner(player.rank) ? (
                      <Badge
                        variant="default"
                        className="bg-yellow-500 text-white"
                      >
                        Winner
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        {player.rank === 2
                          ? "2nd"
                          : player.rank === 3
                            ? "3rd"
                            : `${player.rank}th`}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Game Summary */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              {gameStats.totalPlayers} players • Winner:{" "}
              {winner?.name ?? "None"} • Winning Score:{" "}
              {finalResults[0]?.finalScore ?? 0}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button className="rounded-lg bg-green-600 px-6 py-3 text-white transition-colors hover:bg-green-700">
          Play Again
        </button>
        <button
          onClick={() => {
            router.push(`/`);
          }}
          className="rounded-lg bg-gray-600 px-6 py-3 text-white transition-colors hover:bg-gray-700"
        >
          Back to home
        </button>
      </div>
    </div>
  );
}
