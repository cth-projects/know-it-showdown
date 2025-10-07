import type {
  Game0To100Player,
  Game0To100Question,
  PrismaClient,
} from "@prisma/client";
import { DEFAULT_ANSWER } from "./constants";
import { calculateScore } from "./scoring";

export async function applyDefaultAnswers(
  db: PrismaClient,
  gameCode: string,
  players: Game0To100Player[],
  currentQuestionIndex: number,
  currentQuestion: Game0To100Question,
) {
  const scoreForQuestion = calculateScore(
    DEFAULT_ANSWER,
    currentQuestion.answer,
  );

  for (const player of players) {
    const updatedAnswers = [...player.playerAnswers];

    if (updatedAnswers[currentQuestionIndex] === undefined) {
      while (updatedAnswers.length <= currentQuestionIndex) {
        updatedAnswers.push(DEFAULT_ANSWER);
      }

      await db.game0To100Player.update({
        where: {
          name_gameCode: { name: player.name, gameCode },
        },
        data: {
          playerAnswers: { set: updatedAnswers },
          score: { increment: scoreForQuestion },
        },
      });
    }
  }
}
