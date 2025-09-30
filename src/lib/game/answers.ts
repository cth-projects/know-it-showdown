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
  for (const player of players) {
    if (player.playerAnswers.length <= currentQuestionIndex) {
      const scoreForQuestion = calculateScore(
        DEFAULT_ANSWER,
        currentQuestion.answer,
      );

      await db.game0To100Player.update({
        where: {
          name_gameCode: { name: player.name, gameCode },
        },
        data: {
          playerAnswers: { push: DEFAULT_ANSWER },
          score: { increment: scoreForQuestion },
        },
      });
    }
  }
}
