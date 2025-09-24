import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { nanoid } from "nanoid";
import { TRPCError } from "@trpc/server";
import { pusher } from "@/lib/pusher";

export const gameRouter = createTRPCRouter({
  createGame: publicProcedure
    .input(
      z.object({
        playerName: z.string().min(1),
        gameType: z.enum(["0-100"]),
        totalQuestions: z.number().min(5).max(20).default(15),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const code = nanoid(6);
      const game = await ctx.db.game.create({
        data: {
          gameCode: code,
          upstashId: nanoid(), // TODO: use actual id...
        },
      });

      const categories = await ctx.db.game0To100Category.findMany({
        select: { name: true },
      });

      const questionsPerCategory = Math.ceil(
        input.totalQuestions / categories.length,
      );
      const selectedQuestions: { id: number }[] = [];

      // TODO: improve to get random questions not just first x questions per category
      for (const category of categories) {
        if (selectedQuestions.length >= input.totalQuestions) break;

        const questions = await ctx.db.game0To100Question.findMany({
          where: { categoryName: category.name },
          take: questionsPerCategory,
          select: { id: true },
          orderBy: { id: "asc" },
        });
        selectedQuestions.push(...questions);
      }

      const finalQuestions = selectedQuestions.slice(0, input.totalQuestions);

      await ctx.db.game0To100.create({
        data: {
          gameCode: code,
          questions: {
            connect: finalQuestions,
          },
        },
      });

      return { gameId: game.gameCode };
    }),

  joinGame: publicProcedure
    .input(
      z.object({
        gameCode: z.string().min(1, "Game code is required"),
        playerName: z.string().min(1, "Player name is required"),
      }),
    )

    .mutation(async ({ input, ctx }) => {
      const game = await ctx.db.game.findUnique({
        where: { gameCode: input.gameCode },
      });

      if (!game)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No game with code '${input.gameCode}'`,
        });

      const nameTaken = await ctx.db.game0To100Player.findFirst({
        where: {
          name: input.playerName,
          gameCode: input.gameCode,
        },
      });

      if (nameTaken) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `A player with the name '${input.playerName}' already exists in the lobby`,
        });
      }

      await ctx.db.game0To100Player.create({
        data: {
          name: input.playerName,
          gameCode: input.gameCode,
        },
      });

      const allPlayers = await ctx.db.game0To100Player.findMany({
        where: { gameCode: input.gameCode },
      });

      await pusher.trigger(
        `presenter-${input.gameCode}`,
        "playerlist-updated",
        allPlayers.map((p) => p.name),
      );

      return { gameId: input.gameCode };
    }),
  getPlayers: publicProcedure
    .input(z.object({ gameCode: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      const players = await ctx.db.game0To100Player.findMany({
        where: { gameCode: input.gameCode },
        select: { name: true },
      });
      return players;
    }),
  getGameState: publicProcedure
    .input(z.object({ gameCode: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      const game = await ctx.db.game0To100.findUnique({
        where: { gameCode: input.gameCode },
      });
      if (!game)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No game with code '${input.gameCode}'`,
        });
      if (game.gameState === "QUESTION" || "RESULT") {
        const result = (await ctx.db.game0To100Question.findFirst({
          where: { id: game.currentQuestionIndex + 1 },
          select: { question: true, answer: true },
        })) ?? { question: null, answer: null };
        return {
          gameState: game.gameState,
          question: result.question,
          answer: result.answer,
        };
      }
      return { gameState: game.gameState };
    }),
});
