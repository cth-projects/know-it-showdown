import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { pusher } from "@/lib/pusher";
import { TRPCError } from "@trpc/server";
import { Game0To100State } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import type {
  PlayerGameAdvanceEvent,
  PresenterGameAdvanceEvent,
} from "@/types";

const DEFAULT_ANSWER = 0;

export const advanceRouter = createTRPCRouter({
  advance: publicProcedure
    .input(
      z.object({
        gameCode: z.string().length(6),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { gameCode } = input;

      const game = await ctx.db.game0To100.findUnique({
        where: { gameCode },
        include: {
          players: true,
          questions: true,
        },
      });

      if (!game) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Game not found" });
      }

      const nextState = determineNextState(
        game.gameState,
        game.currentQuestionIndex,
        game.questions.length,
      );

      // Check for missing player answers and add defaults
      if (nextState === Game0To100State.RESULT) {
        const currentQuestion = game.questions[game.currentQuestionIndex];

        for (const player of game.players) {
          if (player.playerAnswers.length <= game.currentQuestionIndex) {
            const scoreForQuestion =
              DEFAULT_ANSWER === currentQuestion!.answer
                ? -10
                : Math.abs(DEFAULT_ANSWER - currentQuestion!.answer);

            await ctx.db.game0To100Player.update({
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

      const updateData: Prisma.Game0To100UpdateInput = {
        gameState: nextState,
      };

      if (
        game.gameState === Game0To100State.RESULT &&
        nextState === Game0To100State.QUESTION
      ) {
        updateData.currentQuestionIndex = game.currentQuestionIndex + 1;
      }

      const updatedGame = await ctx.db.game0To100.update({
        where: { gameCode },
        data: updateData,
        include: {
          players: true,
          questions: true,
        },
      });

      await handleGameBroadcasting(gameCode, nextState, updatedGame);
    }),
});

async function handleGameBroadcasting(
  gameCode: string,
  nextState: Game0To100State,
  updatedGame: Prisma.Game0To100GetPayload<{
    include: { players: true; questions: true };
  }>,
) {
  try {
    switch (nextState) {
      case Game0To100State.QUESTION:
        await broadcastQuestionEvents(gameCode, updatedGame);
        break;

      case Game0To100State.RESULT:
        await broadcastResultEvents(gameCode, updatedGame);
        break;

      case Game0To100State.FINAL_RESULT:
        await broadcastFinalResultEvents(gameCode, updatedGame);
        break;
    }
  } catch (pusherError) {
    console.error("Pusher broadcast error:", pusherError);
  }
}

async function broadcastQuestionEvents(
  gameCode: string,
  updatedGame: Prisma.Game0To100GetPayload<{
    include: { players: true; questions: true };
  }>,
) {
  const currentQuestion =
    updatedGame.questions[updatedGame.currentQuestionIndex];

  if (!currentQuestion) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Question not found for current index",
    });
  }

  const baseEventData = {
    newState: "QUESTION" as const,
    currentQuestionIndex: updatedGame.currentQuestionIndex,
    totalQuestions: updatedGame.questions.length,
    timestamp: new Date().toISOString(),
  };

  const questionData = {
    question: currentQuestion.question,
    categoryName: currentQuestion.categoryName,
  };

  const playerEvent: PlayerGameAdvanceEvent = {
    ...baseEventData,
    currentQuestion: questionData,
  };

  const presenterEvent: PresenterGameAdvanceEvent = {
    ...baseEventData,
    currentQuestion: questionData,
  };

  await Promise.all([
    pusher.trigger(`player-${gameCode}`, "game-advance", playerEvent),
    pusher.trigger(`presenter-${gameCode}`, "game-advance", presenterEvent),
  ]);
}

async function broadcastResultEvents(
  gameCode: string,
  updatedGame: Prisma.Game0To100GetPayload<{
    include: { players: true; questions: true };
  }>,
) {
  const currentQuestion =
    updatedGame.questions[updatedGame.currentQuestionIndex];

  if (!currentQuestion) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Question not found for current index",
    });
  }

  const presenterEvent: PresenterGameAdvanceEvent = {
    newState: "RESULT",
    currentQuestionIndex: updatedGame.currentQuestionIndex,
    totalQuestions: updatedGame.questions.length,
    timestamp: new Date().toISOString(),
    questionResult: {
      question: currentQuestion.question,
      answer: currentQuestion.answer,
      categoryName: currentQuestion.categoryName,
    },
    playerResults: updatedGame.players.map((player) => {
      const playerAnswer =
        player.playerAnswers[updatedGame.currentQuestionIndex] ??
        DEFAULT_ANSWER;
      const isCorrect = playerAnswer === currentQuestion.answer;

      return {
        name: player.name,
        answer: playerAnswer,
        scoreForQuestion: isCorrect
          ? -10
          : Math.abs(playerAnswer - currentQuestion.answer),
        currentScore: player.score,
      };
    }),
  };

  await pusher.trigger(
    `presenter-${gameCode}`,
    "presenter-advanced",
    presenterEvent,
  );
}

async function broadcastFinalResultEvents(
  gameCode: string,
  updatedGame: Prisma.Game0To100GetPayload<{
    include: { players: true; questions: true };
  }>,
) {
  const baseEventData = {
    newState: "FINAL_RESULT" as const,
    currentQuestionIndex: updatedGame.currentQuestionIndex,
    totalQuestions: updatedGame.questions.length,
    timestamp: new Date().toISOString(),
  };

  const finalResults = updatedGame.players
    .sort((a, b) => b.score - a.score)
    .map((player, index: number) => ({
      rank: index + 1,
      name: player.name,
      finalScore: player.score,
      totalCorrect: player.playerAnswers.filter(
        (answer: number, idx: number) =>
          answer === updatedGame.questions[idx]?.answer,
      ).length,
      totalQuestions: updatedGame.questions.length,
    }));

  const gameStats = {
    totalPlayers: updatedGame.players.length,
    totalQuestions: updatedGame.questions.length,
    averageScore:
      updatedGame.players.reduce((sum: number, p) => sum + p.score, 0) /
      updatedGame.players.length,
  };

  // broadcast to presenter only
  const presenterEvent: PresenterGameAdvanceEvent = {
    ...baseEventData,
    finalResults,
    gameStats,
  };

  await pusher.trigger(
    `presenter-${gameCode}`,
    "presenter-advanced",
    presenterEvent,
  );
}

function determineNextState(
  currentState: Game0To100State,
  currentQuestionIndex: number,
  totalQuestions: number,
) {
  switch (currentState) {
    case Game0To100State.LOBBY:
      return Game0To100State.QUESTION;

    case Game0To100State.QUESTION:
      return Game0To100State.RESULT;

    case Game0To100State.RESULT:
      const nextQuestionIndex = currentQuestionIndex + 1;
      if (nextQuestionIndex >= totalQuestions) {
        return Game0To100State.FINAL_RESULT;
      }
      return Game0To100State.QUESTION;

    case Game0To100State.FINAL_RESULT:
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Game has already ended.",
      });

    default:
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unknown state: " + String(currentState),
      });
  }
}
