import { motion } from "motion/react";
import PlayerAvatar from "./playerAvatar";
import React, { useMemo } from "react";

type FinalPlayer = {
  rank: number;
  name: string;
  finalScore: number;
};

type FinalRankedListProps = {
  players: FinalPlayer[];
  allPlayers: FinalPlayer[];
};

export default function FinalRankedList({
  players,
  allPlayers,
}: FinalRankedListProps) {
  const useTwoColumns = allPlayers.length > 5;

  const sortedVisiblePlayers = useMemo(
    () => [...players].sort((a, b) => a.rank - b.rank),
    [players],
  );

  const leftColumn: FinalPlayer[] = [];
  const rightColumn: FinalPlayer[] = [];

  if (useTwoColumns) {
    sortedVisiblePlayers.forEach((player) => {
      const layoutIndex = player.rank - 4;
      if (layoutIndex % 2 === 0) {
        leftColumn.push(player);
      } else {
        rightColumn.push(player);
      }
    });
  }

  const renderSingleColumn = (playersToRender: FinalPlayer[]) => (
    <div className="grid grid-cols-[64px_140px_64px] items-center gap-x-8 gap-y-2">
      {/* Header Row */}
      <div className="text-center">
        <span className="text-lg font-semibold text-gray-400">#</span>
      </div>
      <div className="text-center">
        <span className="text-lg font-semibold text-gray-400">Player</span>
      </div>
      <div className="text-center">
        <span className="text-lg font-semibold text-gray-400">Score</span>
      </div>

      {/* Player Rows */}
      {playersToRender.map((player, index) => {
        const isLast = index === playersToRender.length - 1;

        return (
          <React.Fragment key={`${player.name}-row`}>
            {/* Rank */}
            <motion.div
              key={`${player.name}-rank`}
              layoutId={`player-${player.name}-rank`}
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
                #{player.rank}
              </span>
            </motion.div>

            {/* Player */}
            <motion.div
              key={`${player.name}-avatar`}
              layoutId={`player-${player.name}`}
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
                  name={player.name}
                  size="sm"
                  layout="horizontal"
                />
              </div>
            </motion.div>

            {/* Final Score */}
            <motion.div
              key={`${player.name}-final-score`}
              layoutId={`player-${player.name}-score`}
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
                {player.finalScore}
              </span>
            </motion.div>

            {/* Separator line spanning all columns */}
            {!isLast && <div className="col-span-3 h-px bg-gray-300" />}
          </React.Fragment>
        );
      })}
    </div>
  );

  if (!useTwoColumns) {
    // Single column layout for 5 or fewer players
    return (
      <motion.div
        key="final-vertical-layout"
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
      key="final-vertical-layout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto flex w-fit items-start gap-12"
    >
      {/* Left Column - ranks 4, 6, 8, 10... */}
      <div style={{ minHeight: `${maxRows * 80}px` }}>
        {renderSingleColumn(leftColumn)}
      </div>

      {/* Right Column - ranks 5, 7, 9, 11... */}
      <div style={{ minHeight: `${maxRows * 80}px` }}>
        {renderSingleColumn(rightColumn)}
      </div>
    </motion.div>
  );
}
