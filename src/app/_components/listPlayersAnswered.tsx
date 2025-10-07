import { useEffect } from "react";
import type { PlayerStatus } from "@/types";
import { motion, LayoutGroup } from "motion/react";
import PlayerAvatar from "./playerAvatar";
import { CircleCheck } from "lucide-react";
import { ThreeDotsLoader } from "src/components/ui/theedotsloader";

type Props = {
  players: PlayerStatus[];
  onSuccess: () => void;
};

function SimpleQuestionList({ players, onSuccess }: Props) {
  useEffect(() => {
    if (players.every((p) => p.answered) && players.length > 0) {
      onSuccess();
    }
  }, [onSuccess, players]);

  const unansweredQuestions = players.filter((q) => !q.answered);
  const answeredQuestions = players.filter((q) => q.answered);

  const PlayerItem = (player: { name: string; answered: boolean }) => (
    <motion.div
      layoutId={player.name}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 30,
      }}
      className="relative p-2"
    >
      <PlayerAvatar name={player.name} size={"sm"} />
      <div className="absolute -top-1 -right-2">
        {player.answered ? <CircleCheck color="green" /> : <ThreeDotsLoader />}
      </div>
    </motion.div>
  );

  return (
    <LayoutGroup>
      <div className="flex flex-col gap-6">
        <div className="flex min-h-22 flex-row items-center justify-center gap-0">
          {answeredQuestions.map((player) => (
            <PlayerItem
              key={player.name}
              name={player.name}
              answered={player.answered}
            />
          ))}
        </div>
        <div className="flex flex-row gap-0">
          {unansweredQuestions.map((player) => (
            <PlayerItem
              key={player.name}
              name={player.name}
              answered={player.answered}
            />
          ))}
        </div>
      </div>
    </LayoutGroup>
  );
}
export default SimpleQuestionList;
