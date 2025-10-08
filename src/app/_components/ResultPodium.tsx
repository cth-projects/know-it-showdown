import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { Trophy, Medal, Award } from "lucide-react";
import PlayerAvatar from "./playerAvatar";
import type { FinalResultEvent } from "@/types";
import FinalCountdownGrid from "./finalCountdownGrid";
import FinalRankedList from "./finalRankedList";

type ResultPodiumProps = {
  finalResults: FinalResultEvent["finalResults"];
  baseCountdownDuration?: number;
  transitionDelay?: number;
};

export default function ResultPodium({
  finalResults,
  baseCountdownDuration = 1000,
  transitionDelay = 500,
}: ResultPodiumProps) {
  const [playersInPodium, setPlayersInPodium] = useState<Set<string>>(
    new Set(),
  );
  const [playersInList, setPlayersInList] = useState<Set<string>>(new Set());

  const getCountdownDuration = (rank: number) => {
    const totalPlayers = finalResults.length;

    const positionFromLast = totalPlayers - rank + 1;

    if (rank < 4) {
      return (totalPlayers + 1) * baseCountdownDuration;
    }

    return positionFromLast * baseCountdownDuration;
  };

  const podiumPlayers = finalResults.slice(0, 3);
  const listPlayers = finalResults.slice(3);

  const playersInCountdown = finalResults.filter(
    (p) => !playersInPodium.has(p.name) && !playersInList.has(p.name),
  );

  const handleCountdownComplete = useCallback(
    (playerName: string, rank: number) => {
      console.log(`Player ${playerName} finished countdown with rank ${rank}`);
      setTimeout(() => {
        if (rank <= 3) {
          console.log(`Adding ${playerName} to podium (rank ${rank})`);
          setPlayersInPodium((prev) => new Set([...prev, playerName]));
        } else {
          console.log(`Adding ${playerName} to list (rank ${rank})`);
          setPlayersInList((prev) => new Set([...prev, playerName]));
        }
      }, transitionDelay);
    },
    [transitionDelay],
  );

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-12 w-12 text-yellow-500" />;
      case 2:
        return <Medal className="h-12 w-12 text-gray-400" />;
      case 3:
        return <Award className="h-12 w-12 text-amber-600" />;
      default:
        return null;
    }
  };

  const getPodiumHeight = (rank: number) => {
    switch (rank) {
      case 1:
        return "h-48";
      case 2:
        return "h-40";
      case 3:
        return "h-32";
      default:
        return "h-32";
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-12">
      {/* Countdown Grid */}
      {playersInCountdown.length > 0 && (
        <div className="mb-12" key="countdown-grid-container">
          <FinalCountdownGrid
            players={playersInCountdown}
            getCountdownDuration={getCountdownDuration}
            onPlayerCountdownComplete={handleCountdownComplete}
          />
        </div>
      )}

      {/* Podium, Top 3 */}
      {playersInPodium.size > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12 flex items-end justify-center gap-8"
        >
          {/* 2nd Place */}
          {podiumPlayers[1] && playersInPodium.has(podiumPlayers[1].name) && (
            <motion.div
              layoutId={`player-${podiumPlayers[1].name}`}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative">
                <PlayerAvatar name={podiumPlayers[1].name} size="md" />
                <div className="absolute -top-2 -right-2">
                  {getMedalIcon(2)}
                </div>
              </div>
              <div
                className={`${getPodiumHeight(2)} flex w-32 flex-col items-center justify-start rounded-t-lg bg-gray-400 pt-4`}
              >
                <span className="text-4xl font-bold text-white">#2</span>
                <span className="mt-2 text-2xl font-bold text-white">
                  {podiumPlayers[1].finalScore}
                </span>
              </div>
            </motion.div>
          )}

          {/* 1st Place */}
          {podiumPlayers[0] && playersInPodium.has(podiumPlayers[0].name) && (
            <motion.div
              layoutId={`player-${podiumPlayers[0].name}`}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative">
                <PlayerAvatar name={podiumPlayers[0].name} size="lg" />
                <div className="absolute -top-2 -right-2">
                  {getMedalIcon(1)}
                </div>
              </div>
              <div
                className={`${getPodiumHeight(1)} flex w-32 flex-col items-center justify-start rounded-t-lg bg-yellow-500 pt-4`}
              >
                <span className="text-4xl font-bold text-white">#1</span>
                <span className="mt-2 text-2xl font-bold text-white">
                  {podiumPlayers[0].finalScore}
                </span>
              </div>
            </motion.div>
          )}

          {/* 3rd Place */}
          {podiumPlayers[2] && playersInPodium.has(podiumPlayers[2].name) && (
            <motion.div
              layoutId={`player-${podiumPlayers[2].name}`}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative">
                <PlayerAvatar name={podiumPlayers[2].name} size="md" />
                <div className="absolute -top-2 -right-2">
                  {getMedalIcon(3)}
                </div>
              </div>
              <div
                className={`${getPodiumHeight(3)} flex w-32 flex-col items-center justify-start rounded-t-lg bg-amber-600 pt-4`}
              >
                <span className="text-4xl font-bold text-white">#3</span>
                <span className="mt-2 text-2xl font-bold text-white">
                  {podiumPlayers[2].finalScore}
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Vertical List - Ranks 4+ */}
      {playersInList.size > 0 && listPlayers.length > 0 && (
        <FinalRankedList
          players={listPlayers.filter((p) => playersInList.has(p.name))}
          allPlayers={listPlayers}
        />
      )}
    </div>
  );
}
