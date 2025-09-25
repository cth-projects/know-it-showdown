import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const finalResultRouter = createTRPCRouter({
  getLeaderboard: publicProcedure
    .input(
      z.object({
        gameCode: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const game = await ctx.db.game.findUnique({
        where: { gameCode: input.gameCode },
        include: {
          game0To100: {
            include: {
              players: true,
              questions: true,
            },
          },
        },
      });

      // Validate game exists and has 0To100 data
      if (
        !game ||
        !game.game0To100 ||
        game?.game0To100?.gameState != "FINAL_RESULT"
      ) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Game not found",
        });
      }

      const gameData = game.game0To100;

      // Calculate stats for each player
      const playersWithStats = gameData.players.map((player) => {
        const totalCorrect = player.playerAnswers.reduce(
          (count, answer, index) => {
            const question = gameData.questions[index];
            if (!question) return count;

            const isCorrect = answer === question.answer; // correct answer
            return count + (isCorrect ? 1 : 0);
          },
          0,
        );

        return {
          name: player.name,
          finalScore: player.score,
          totalCorrect,
          totalQuestions: player.playerAnswers.length,
        };
      });

      // Sort by score (ascending since lower is better)
      const sortedPlayers = playersWithStats.sort(
        (a, b) => a.finalScore - b.finalScore,
      );

      // Add ranking
      const finalResults = sortedPlayers.map((player, index) => ({
        rank: index + 1,
        ...player,
      }));

      // Calculate game statistics
      const totalPlayers = gameData.players.length;
      const totalQuestions = gameData.questions.length;
      const averageScore =
        totalPlayers > 0
          ? gameData.players.reduce((sum, player) => sum + player.score, 0) /
            totalPlayers
          : 0;

      return {
        newState: game.game0To100.gameState,
        currentQuestionIndex: gameData.currentQuestionIndex,
        totalQuestions,
        timestamp: new Date().toISOString(),
        finalResults,
        gameStats: {
          totalPlayers,
          totalQuestions,
          averageScore,
        },
      };
    }),
});
