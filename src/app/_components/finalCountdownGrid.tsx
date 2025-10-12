import { audioManager } from "@/lib/audioManager";
import PlayerAvatarWithScore from "./playerAvatarWithScore";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef } from "react";

const MAX_PLAYERS_PER_ROW = 7;

type FinalPlayer = {
  rank: number;
  name: string;
  finalScore: number;
};

type FinalCountdownGridProps = {
  players: FinalPlayer[];
  getCountdownDuration: (rank: number) => number;
  onPlayerCountdownComplete: (playerName: string, rank: number) => void;
};

export default function FinalCountdownGrid({
  players,
  getCountdownDuration,
  onPlayerCountdownComplete,
}: FinalCountdownGridProps) {
  const initialLayout = useRef<{
    totalPlayers: number;
    numRows: number;
    playersPerRow: number;
    playerPositions: Map<string, { row: number; position: number }>;
  } | null>(null);

  useEffect(() => {
    audioManager.startLoop("drumRoll");

    return () => {
      audioManager.stop("drumRoll");
    };
  }, []);

  if (initialLayout.current === null) {
    const totalPlayers = players.length;
    const numRows =
      totalPlayers <= MAX_PLAYERS_PER_ROW
        ? 1
        : Math.ceil(totalPlayers / MAX_PLAYERS_PER_ROW);
    const playersPerRow = Math.ceil(totalPlayers / numRows);

    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);

    const playerPositions = new Map<
      string,
      { row: number; position: number }
    >();
    shuffledPlayers.forEach((player, index) => {
      const rowIndex = Math.floor(index / playersPerRow);
      const positionInRow = index % playersPerRow;
      playerPositions.set(player.name, {
        row: rowIndex,
        position: positionInRow,
      });
    });

    initialLayout.current = {
      totalPlayers,
      numRows,
      playersPerRow,
      playerPositions,
    };
  }

  const layout = initialLayout.current;

  const rowsMap = useMemo(() => {
    const map = new Map<number, FinalPlayer[]>();

    for (let i = 0; i < layout.numRows; i++) {
      map.set(i, []);
    }

    players.forEach((player) => {
      const position = layout.playerPositions.get(player.name);
      if (position) {
        map.get(position.row)!.push(player);
      }
    });

    map.forEach((rowPlayers) => {
      rowPlayers.sort((a, b) => {
        const posA = layout.playerPositions.get(a.name)?.position ?? 0;
        const posB = layout.playerPositions.get(b.name)?.position ?? 0;
        return posA - posB;
      });
    });

    return map;
  }, [players, layout]);

  return (
    <motion.div
      key="final-countdown-area"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8 space-y-8"
    >
      {Array.from({ length: layout.numRows }, (_, rowIndex) => {
        const rowPlayers = rowsMap.get(rowIndex) ?? [];

        return (
          <div
            key={rowIndex}
            className="flex min-h-[100px] flex-wrap justify-center gap-6"
            style={{ minWidth: `${layout.playersPerRow * 120}px` }}
          >
            {rowPlayers.map((player) => {
              const duration = getCountdownDuration(player.rank);

              return (
                <motion.div
                  key={`${player.name}-countdown`}
                  layoutId={`player-${player.name}`}
                  className="flex flex-col items-center gap-3"
                >
                  <PlayerAvatarWithScore
                    name={player.name}
                    score={player.finalScore}
                    startFrom={10000}
                    size="md"
                    duration={duration}
                    variant="final"
                    onCountdownComplete={() => {
                      onPlayerCountdownComplete(player.name, player.rank);
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
