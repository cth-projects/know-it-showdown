import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { pusher } from "@/lib/pusher";
import { TRPCError } from "@trpc/server";

function calculateScore(playerAnswer: number, correctAnswer: number): number {
  if (playerAnswer === correctAnswer) return -10;
  return Math.abs(playerAnswer - correctAnswer);
}

export const answersRouter = createTRPCRouter({
  submit: publicProcedure
    .input(
      z.object({
        gameCode: z.string().length(6),
        playerName: z.string().min(1),
        answer: z.number().min(0).max(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { gameCode, playerName, answer } = input;

      const game = await ctx.db.game0To100.findUnique({
        where: { gameCode },
        include: {
          questions: true,
          players: {
            where: { name: playerName },
          },
        },
      });

      if (!game) {
        throw new TRPCError({ code: "NOT_FOUND", message: "game not found" });
      }

      if (game.gameState != "QUESTION") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Game is not currently accepting answers",
        });
      }

      if (game.players.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Player not found in game",
        });
      }

      const player = game.players[0]!;
      const currentQuestionIndex = game.currentQuestionIndex;

      if (player.playerAnswers.length > currentQuestionIndex) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already answered this question",
        });
      }

      if (player.playerAnswers.length !== currentQuestionIndex) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Answer must be submitted for current question",
        });
      }

      const currentQuestion = game.questions[currentQuestionIndex]!;
      const scoreForCurrentQuestion = calculateScore(
        answer,
        currentQuestion.answer,
      );

      await ctx.db.game0To100Player.update({
        where: {
          name_gameCode: { name: playerName, gameCode },
        },
        data: {
          playerAnswers: { push: answer },
          score: { increment: scoreForCurrentQuestion },
        },
      });

      // TODO: schema/interface or something for this?
      await pusher.trigger(`presenter-${gameCode}`, "player-answered", {
        playerName,
        questionIndex: currentQuestionIndex,
      });
    }),
});
