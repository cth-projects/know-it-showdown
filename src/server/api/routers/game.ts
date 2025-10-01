import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { nanoid } from "nanoid";
import { TRPCError } from "@trpc/server";
import { pusher } from "@/lib/pusher";
import { Game0To100State, type Prisma } from "@prisma/client";
import {
  applyDefaultAnswers,
  broadcastQuestionEvents,
  buildFinalResultEvent,
  buildQuestionEvent,
  buildResultEvent,
  determineNextState,
  handleGameBroadcasting,
} from "@/lib/game";
import type { PlayerStatus, PresenterGameEvent } from "src/types";

export const gameRouter = createTRPCRouter({
  createGame: publicProcedure
    .input(
      z.object({
        gameType: z.enum(["0-100"]),
      }),
    )
    .mutation(async ({ ctx }) => {
      const code = nanoid(6);
      const game = await ctx.db.game.create({
        data: {
          gameCode: code,
          upstashId: nanoid(), // TODO: use actual id...
        },
      });

      await ctx.db.game0To100.create({
        data: {
          gameCode: code,
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
      const game = await ctx.db.game0To100.findUnique({
        where: { gameCode: input.gameCode },
      });

      if (!game)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No game with code '${input.gameCode}'`,
        });

      if (game.gameState != Game0To100State.LOBBY)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Game has started`,
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

      const player = await ctx.db.game0To100Player.create({
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

      return { gameId: input.gameCode, player };
    }),

  leaveGame: publicProcedure
    .input(
      z.object({ gameCode: z.string().min(1), playerName: z.string().min(1) }),
    )
    .mutation(async ({ input, ctx }) => {
      const deletePlayer = await ctx.db.game0To100Player.deleteMany({
        where: {
          gameCode: input.gameCode,
          name: input.playerName,
        },
      });

      if (deletePlayer.count == 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Player not found in the game",
        });
      }

      const allPlayers = await ctx.db.game0To100Player.findMany({
        where: {
          gameCode: input.gameCode,
        },
      });

      await pusher.trigger(
        `presenter-${input.gameCode}`,
        "playerlist-updated",
        allPlayers.map((p) => p.name),
      );

      return { success: true };
    }),

  startGame: publicProcedure
    .input(
      z.object({
        gameCode: z.string().length(6),
        totalQuestions: z.number().min(5).max(20).default(15),
        secondsPerQuestion: z.number().min(15).max(120).default(60),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const categories = await ctx.db.game0To100Category.findMany({
        select: { name: true },
      });

      const questionsPerCategory = Math.ceil(
        input.totalQuestions / categories.length,
      );
      const selectedQuestions: { id: number }[] = [];

      for (const category of categories) {
        if (selectedQuestions.length >= input.totalQuestions) break;

        const allQuestions = await ctx.db.game0To100Question.findMany({
          where: { categoryName: category.name },
          select: { id: true },
        });

        const shuffled = allQuestions
          .sort(() => Math.random() - 0.5)
          .slice(0, questionsPerCategory);

        selectedQuestions.push(...shuffled);
      }

      const finalQuestions = selectedQuestions
        .slice(0, input.totalQuestions)
        .sort(() => Math.random() - 0.5);

      const updatedGame = await ctx.db.game0To100.update({
        where: { gameCode: input.gameCode },
        data: {
          gameState: Game0To100State.QUESTION,
          secondsPerQuestion: input.secondsPerQuestion,
          questions: {
            connect: finalQuestions,
          },
        },
        include: {
          players: true,
          questions: {
            include: { category: true },
          },
        },
      });
      await broadcastQuestionEvents(input.gameCode, updatedGame);
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

  advanceGame: publicProcedure
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
          questions: {
            include: { category: true },
          },
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

      if (nextState === Game0To100State.RESULT) {
        const currentQuestion = game.questions[game.currentQuestionIndex]!;

        await applyDefaultAnswers(
          ctx.db,
          input.gameCode,
          game.players,
          game.currentQuestionIndex,
          currentQuestion,
        );
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
          questions: {
            include: { category: true },
          },
        },
      });

      await handleGameBroadcasting(gameCode, nextState, updatedGame);
    }),

  getCurrentPresenterView: publicProcedure
    .input(z.object({ gameCode: z.string().length(6) }))
    .query(async ({ ctx, input }): Promise<PresenterGameEvent> => {
      const game = await ctx.db.game0To100.findUnique({
        where: { gameCode: input.gameCode },
        include: {
          players: true,
          questions: {
            include: {
              category: true,
            },
          },
        },
      });

      if (!game) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Game not found" });
      }

      if (game.gameState === Game0To100State.QUESTION) {
        return buildQuestionEvent(game);
      }

      if (game.gameState === Game0To100State.RESULT) {
        return buildResultEvent(game);
      }

      return buildFinalResultEvent(game);
    }),

  getPlayersAnsweredList: publicProcedure
    .input(z.object({ gameCode: z.string().length(6) }))
    .query(async ({ ctx, input }): Promise<PlayerStatus[]> => {
      const game = await ctx.db.game0To100.findUnique({
        where: { gameCode: input.gameCode },
        include: { players: true },
      });

      if (!game) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Game not found" });
      }

      const playerStatusList: PlayerStatus[] = [];

      for (const player of game.players) {
        const hasAnswered =
          player.playerAnswers.length > game.currentQuestionIndex;

        playerStatusList.push({
          name: player.name,
          answered: hasAnswered,
        });
      }

      return playerStatusList;
    }),
});
