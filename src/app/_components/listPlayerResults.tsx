import { Award, Medal, Trophy } from "lucide-react";
import PlayerAvatarWithScore from "./playerAvatarWithScore";
import type { PlayerResult } from "@/types";

const MAX_PLAYERS_PER_ROW = 7;

type ListPlayerAnswerResultsProps = {
  playerResults: PlayerResult[];
};

export default function ListPlayerAnswerResults({
  playerResults,
}: ListPlayerAnswerResultsProps) {
  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 1:
        return <Medal className="h-8 w-8 text-gray-400" />;
      case 2:
        return <Award className="h-8 w-8 text-amber-600" />;
      default:
        return null;
    }
  };

  const getBalancedRows = (players: PlayerResult[]): PlayerResult[][] => {
    if (players.length === 0) return [];

    const totalPlayers = players.length;

    if (totalPlayers <= MAX_PLAYERS_PER_ROW) {
      return [players];
    }

    const numRows = Math.ceil(totalPlayers / MAX_PLAYERS_PER_ROW);
    const playersPerRow = Math.ceil(totalPlayers / numRows);

    const rows: PlayerResult[][] = [];
    for (let i = 0; i < totalPlayers; i += playersPerRow) {
      rows.push(players.slice(i, i + playersPerRow));
    }

    return rows;
  };

  const sortedResults = [...playerResults].sort(
    (a, b) => b.scoreForQuestion - a.scoreForQuestion,
  );

  if (sortedResults.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="space-y-4 text-center">
          <p className="text-xl font-semibold text-gray-600">
            No results available
          </p>
        </div>
      </div>
    );
  }

  const rows = getBalancedRows(sortedResults);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-6">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-wrap justify-center gap-6">
          {row.map((result, indexInRow) => {
            const globalIndex =
              rows.slice(0, rowIndex).reduce((sum, r) => sum + r.length, 0) +
              indexInRow;

            return (
              <div
                key={`${result.name}-${globalIndex}`}
                className="flex flex-col items-center gap-3"
              >
                <div className="relative">
                  <PlayerAvatarWithScore
                    name={result.name}
                    score={result.scoreForQuestion}
                    startFrom={100}
                    size="md"
                    duration={1000}
                  />
                  {globalIndex < 3 && (
                    <div className="absolute -top-2 -right-2">
                      {getMedalIcon(globalIndex)}
                    </div>
                  )}
                </div>
                {globalIndex >= 3 && (
                  <span className="text-sm font-medium text-gray-500">
                    #{globalIndex + 1}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
