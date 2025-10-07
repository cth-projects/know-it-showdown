import { Award, Medal, Trophy } from "lucide-react";
import PlayerAvatarWithScore from "./playerAvatarWithScore";
import type { PlayerResult } from "@/types";
import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import PlayerAvatar from "./playerAvatar";

const MAX_PLAYERS_PER_ROW = 7;

type ListPlayerAnswerResultsProps = {
  playerResults: PlayerResult[];
  startRank?: number;
  countdownDuration?: number;
  getCountdownDuration?: (rank: number) => number;
  transitionDelay?: number;
  onPlayerCountdownComplete?: (playerName: string, rank: number) => void;
  playersToShowInVertical?: Set<string>;
};

export default function ListPlayerAnswerResults({
  playerResults,
  startRank = 1,
  countdownDuration = 1000,
  getCountdownDuration,
  transitionDelay = 500,
  onPlayerCountdownComplete,
  playersToShowInVertical,
}: ListPlayerAnswerResultsProps) {
  const [internalPlayersInVertical, setInternalPlayersInVertical] = useState<
    Set<string>
  >(new Set());

  // Use external control if provided, otherwise use internal state
  const playersInVertical =
    playersToShowInVertical ?? internalPlayersInVertical;

  // For simple case (no external control): move all players at once after countdown
  useEffect(() => {
    if (!playersToShowInVertical && !onPlayerCountdownComplete) {
      const timer = setTimeout(() => {
        setInternalPlayersInVertical(new Set(playerResults.map((p) => p.name)));
      }, countdownDuration + transitionDelay);

      return () => clearTimeout(timer);
    }
  }, [
    playerResults,
    countdownDuration,
    transitionDelay,
    playersToShowInVertical,
    onPlayerCountdownComplete,
  ]);

  const handlePlayerCountdownComplete = useCallback(
    (playerName: string, rank: number) => {
      if (onPlayerCountdownComplete) {
        // External control: let parent handle transition timing
        onPlayerCountdownComplete(playerName, rank);
      } else {
        // Internal control: this shouldn't be called in simple case
        // but handle it anyway
        setTimeout(() => {
          setInternalPlayersInVertical(
            (prev) => new Set([...prev, playerName]),
          );
        }, transitionDelay);
      }
    },
    [onPlayerCountdownComplete, transitionDelay],
  );

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

  // Split players into those still in countdown vs those in vertical layout
  const playersInCountdown = sortedResults.filter(
    (p) => !playersInVertical.has(p.name),
  );
  const playersInVerticalList = sortedResults.filter((p) =>
    playersInVertical.has(p.name),
  );

  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      {/* Countdown area, disappears as players move to vertical */}
      {playersInCountdown.length > 0 && (
        <motion.div key="countdown-area" layout className="mb-8 space-y-8">
          {getBalancedRows(playersInCountdown).map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-wrap justify-center gap-6">
              {row.map((result) => {
                const globalIndex = sortedResults.findIndex(
                  (r) => r.name === result.name,
                );
                const rank = startRank + globalIndex;

                return (
                  <motion.div
                    key={`${result.name}-countdown`}
                    layoutId={`player-${result.name}`}
                    className="flex flex-col items-center gap-3"
                  >
                    <PlayerAvatarWithScore
                      name={result.name}
                      score={result.scoreForQuestion}
                      startFrom={100}
                      size="md"
                      duration={
                        getCountdownDuration
                          ? getCountdownDuration(rank)
                          : countdownDuration
                      }
                      onCountdownComplete={() =>
                        handlePlayerCountdownComplete(result.name, rank)
                      }
                    />
                  </motion.div>
                );
              })}
            </div>
          ))}
        </motion.div>
      )}

      {/* Vertical ranked list, players appear here after countdown */}
      {playersInVerticalList.length > 0 && (
        <motion.div key="vertical-layout" layout className="mx-auto max-w-2xl">
          {playersInVerticalList.map((result, index) => {
            const globalIndex = sortedResults.findIndex(
              (r) => r.name === result.name,
            );
            const rank = startRank + globalIndex;
            const isLast = index === playersInVerticalList.length - 1;

            return (
              <motion.div
                key={`${result.name}-vertical`}
                layoutId={`player-${result.name}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              >
                <div className="flex items-center justify-between py-4">
                  {/* Left: Rank/Medal */}
                  <div className="flex w-16 items-center justify-center">
                    {rank <= 3 ? (
                      getMedalIcon(rank - 1)
                    ) : (
                      <span className="text-2xl font-bold text-gray-400">
                        #{rank}
                      </span>
                    )}
                  </div>

                  {/* Center: Avatar */}
                  <div className="flex flex-1 justify-center">
                    <PlayerAvatar name={result.name} size="sm" />
                  </div>

                  {/* Right: Score */}
                  <div className="flex w-16 items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {result.scoreForQuestion}
                    </span>
                  </div>
                </div>

                {/* Separator line */}
                {!isLast && <div className="h-px bg-gray-300" />}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
