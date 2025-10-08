import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { customAlphabet } from "nanoid";
import { TRPCError } from "@trpc/server";
import { pusher } from "@/lib/pusher";
import { Game0To100State, type Prisma } from "@prisma/client";
import {
  applyDefaultAnswers,
  broadcastQuestionEvents,
  buildFinalResultEvent,
  buildQuestionEvent,
  buildResultEvent,
  calculateScore,
  getRandomQuestions,
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
      const nanoid = customAlphabet("BCDFGHJKLMNPQRSTVWXYZ", 6);

      const code = nanoid();
      const game = await ctx.db.game.create({
        data: {
          gameCode: code,
          upstashId: nanoid(), // TODO: we're not using upstash so remove from DB?
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
        totalQuestions: z.number().min(5).max(25).default(15),
        secondsPerQuestion: z.number().min(15).max(120).default(60),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const finalQuestions = await getRandomQuestions(
        ctx.db,
        input.totalQuestions,
      );

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

  startRound: publicProcedure
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

      if (
        game.gameState === Game0To100State.QUESTION ||
        game.gameState === Game0To100State.FINAL_RESULT
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Cannot start round from ${game.gameState} state`,
        });
      }

      const nextQuestionIndex =
        game.gameState === Game0To100State.RESULT
          ? game.currentQuestionIndex + 1
          : game.currentQuestionIndex;

      const nextState =
        nextQuestionIndex >= game.questions.length
          ? Game0To100State.FINAL_RESULT
          : Game0To100State.QUESTION;

      const updateData: Prisma.Game0To100UpdateInput = {
        gameState: nextState,
      };

      if (game.gameState === Game0To100State.RESULT) {
        updateData.currentQuestionIndex = nextQuestionIndex;
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

  endRound: publicProcedure
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

      if (game.gameState !== Game0To100State.QUESTION) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Cannot end round from ${game.gameState} state`,
        });
      }

      const currentQuestion = game.questions[game.currentQuestionIndex]!;

      await applyDefaultAnswers(
        ctx.db,
        gameCode,
        game.players,
        game.currentQuestionIndex,
        currentQuestion,
      );

      const updatedGame = await ctx.db.game0To100.update({
        where: { gameCode },
        data: {
          gameState: Game0To100State.RESULT,
        },
        include: {
          players: true,
          questions: {
            include: { category: true },
          },
        },
      });

      await handleGameBroadcasting(
        gameCode,
        Game0To100State.RESULT,
        updatedGame,
      );
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

  submitAnswer: publicProcedure
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

      const updatedAnswers = [...player.playerAnswers, answer];

      await ctx.db.game0To100Player.update({
        where: {
          name_gameCode: { name: playerName, gameCode },
        },
        data: {
          playerAnswers: { set: updatedAnswers },
          score: { increment: scoreForCurrentQuestion },
        },
      });

      await pusher.trigger("presenter-" + gameCode, "player-answered", {
        name: playerName,
        questionIndex: currentQuestionIndex,
      });

      return { success: true };
    }),
});
