import PlayerAvatarWithScore from "./playerAvatarWithScore";
import type { PlayerResult } from "@/types";
import { motion } from "motion/react";
import { useMemo, useRef } from "react";

const MAX_PLAYERS_PER_ROW = 7;

type resultCountdownGrid = {
  players: PlayerResult[];
  countdownDuration: number;
  startFrom?: number;
  onAllCountdownsComplete?: () => void;
};

export default function ResultCountdownGrid({
  players,
  countdownDuration,
  startFrom = 100,
  onAllCountdownsComplete,
}: resultCountdownGrid) {
  const initialLayout = useRef<Map<string, { row: number; rank: number }>>(
    new Map(),
  );

  const initializedPlayers = useRef<Set<string>>(new Set());

  const playerNames = useMemo(
    () =>
      players
        .map((p) => p.name)
        .sort()
        .join(","),
    [players],
  );

  if (
    initialLayout.current.size === 0 ||
    !initializedPlayers.current.has(playerNames)
  ) {
    initialLayout.current.clear();
    initializedPlayers.current.add(playerNames);

    const sortedPlayers = [...players].sort(
      (a, b) => b.scoreForQuestion - a.scoreForQuestion,
    );

    const totalPlayers = sortedPlayers.length;
    const numRows =
      totalPlayers <= MAX_PLAYERS_PER_ROW
        ? 1
        : Math.ceil(totalPlayers / MAX_PLAYERS_PER_ROW);
    const playersPerRow = Math.ceil(totalPlayers / numRows);

    sortedPlayers.forEach((player, index) => {
      const rowIndex = Math.floor(index / playersPerRow);
      const rank = totalPlayers - index;
      initialLayout.current.set(player.name, {
        row: rowIndex,
        rank: rank,
      });
    });
  }

  const rowsMap = useMemo(() => {
    const map = new Map<number, PlayerResult[]>();

    players.forEach((player) => {
      const layout = initialLayout.current.get(player.name);
      if (layout) {
        if (!map.has(layout.row)) {
          map.set(layout.row, []);
        }
        map.get(layout.row)!.push(player);
      }
    });

    return map;
  }, [players]);

  const maxRowIndex = Math.max(
    ...Array.from(initialLayout.current.values()).map((l) => l.row),
  );

  return (
    <motion.div
      key="countdown-area"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8 space-y-8"
    >
      {Array.from({ length: maxRowIndex + 1 }, (_, rowIndex) => {
        const rowPlayers = rowsMap.get(rowIndex) ?? [];

        return (
          <div
            key={rowIndex}
            className="flex min-h-[100px] flex-wrap justify-center gap-6"
          >
            {rowPlayers.map((result) => {
              const layout = initialLayout.current.get(result.name);
              const rank = layout?.rank ?? 0;

              return (
                <motion.div
                  key={`${result.name}-countdown`}
                  layoutId={`player-${result.name}`}
                  className="flex flex-col items-center gap-3"
                >
                  <PlayerAvatarWithScore
                    name={result.name}
                    score={result.scoreForQuestion}
                    startFrom={startFrom}
                    size="md"
                    duration={countdownDuration}
                    onCountdownComplete={() => {
                      if (rank === 1 && onAllCountdownsComplete) {
                        onAllCountdownsComplete();
                      }
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        );
      })}
    </motion.div>
  );
}
