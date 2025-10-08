import type { PlayerResult } from "@/types";
import { motion } from "motion/react";
import PlayerAvatar from "./playerAvatar";
import React, { useMemo } from "react";

type ResultRankedListProps = {
  players: PlayerResult[];
  startRank?: number;
  allPlayers?: PlayerResult[];
};

export default function ResultRankedList({
  players,
  startRank = 1,
  allPlayers,
}: ResultRankedListProps) {
  const layoutPlayers = allPlayers ?? players;
  const useTwoColumns = layoutPlayers.length > 5;

  const sortedLayoutPlayers = useMemo(
    () =>
      [...layoutPlayers].sort(
        (a, b) => a.scoreForQuestion - b.scoreForQuestion,
      ),
    [layoutPlayers],
  );

  const playerRankMap = useMemo(() => {
    const map = new Map<string, number>();
    sortedLayoutPlayers.forEach((player, index) => {
      map.set(player.name, startRank + index);
    });
    return map;
  }, [sortedLayoutPlayers, startRank]);

  const sortedVisiblePlayers = useMemo(
    () =>
      [...players].sort((a, b) => {
        const rankA = playerRankMap.get(a.name) ?? 999;
        const rankB = playerRankMap.get(b.name) ?? 999;
        return rankA - rankB;
      }),
    [players, playerRankMap],
  );

  const leftColumn: PlayerResult[] = [];
  const rightColumn: PlayerResult[] = [];

  if (useTwoColumns) {
    sortedVisiblePlayers.forEach((player) => {
      const rank = playerRankMap.get(player.name) ?? 999;
      const layoutIndex = rank - startRank;
      if (layoutIndex % 2 === 0) {
        leftColumn.push(player);
      } else {
        rightColumn.push(player);
      }
    });
  }

  const renderSingleColumn = (playersToRender: PlayerResult[]) => (
    <div className="grid grid-cols-[64px_140px_80px_64px] items-center gap-x-8 gap-y-2">
      {/* Header Row */}
      <div className="text-center">
        <span className="text-lg font-semibold text-gray-400">#</span>
      </div>
      <div className="text-center">
        <span className="text-lg font-semibold text-gray-400">Player</span>
      </div>
      <div className="text-center">
        <span className="text-lg font-semibold text-gray-400">Answer</span>
      </div>
      <div className="text-center">
        <span className="text-lg font-semibold text-gray-400">Score</span>
      </div>

      {/* Player Rows */}
      {playersToRender.map((result, index) => {
        const rank = playerRankMap.get(result.name) ?? startRank + index;
        const isLast = index === playersToRender.length - 1;

        return (
          <React.Fragment key={`${result.name}-row`}>
            {/* Rank */}
            <motion.div
              key={`${result.name}-rank`}
              layoutId={`player-${result.name}-rank`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="flex items-center justify-center"
            >
              <span className="text-3xl font-bold text-white">#{rank}</span>
            </motion.div>

            {/* Player */}
            <motion.div
              key={`${result.name}-avatar`}
              layoutId={`player-${result.name}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="flex items-center justify-center"
            >
              <div className="flex w-[140px] items-center justify-start">
                <PlayerAvatar
                  name={result.name}
                  size="sm"
                  layout="horizontal"
                />
              </div>
            </motion.div>

            {/* Answer */}
            <motion.div
              key={`${result.name}-answer`}
              layoutId={`player-${result.name}-answer`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="flex items-center justify-center"
            >
              <span className="text-2xl font-semibold text-blue-300">
                {result.answer}
              </span>
            </motion.div>

            {/* Score */}
            <motion.div
              key={`${result.name}-score`}
              layoutId={`player-${result.name}-score`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="flex items-center justify-center"
            >
              <span className="text-3xl font-bold text-white">
                {result.scoreForQuestion}
              </span>
            </motion.div>

            {/* Separator line spanning all columns */}
            {!isLast && <div className="col-span-4 h-px bg-gray-300" />}
          </React.Fragment>
        );
      })}
    </div>
  );

  if (!useTwoColumns) {
    // Single column layout for 5 or fewer players
    return (
      <motion.div
        key="vertical-layout"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-fit"
      >
        {renderSingleColumn(sortedVisiblePlayers)}
      </motion.div>
    );
  }

  // Two column layout for more than 5 players
  const maxRows = Math.max(leftColumn.length, rightColumn.length);

  return (
    <motion.div
      key="vertical-layout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto flex w-fit items-start gap-12"
    >
      {/* Left Column - ranks 1, 3, 5, 7... */}
      <div style={{ minHeight: `${maxRows * 80}px` }}>
        {renderSingleColumn(leftColumn)}
      </div>

      {/* Right Column - ranks 2, 4, 6, 8... */}
      <div style={{ minHeight: `${maxRows * 80}px` }}>
        {renderSingleColumn(rightColumn)}
      </div>
    </motion.div>
  );
}
