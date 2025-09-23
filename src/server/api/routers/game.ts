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
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const code = nanoid(6);
      const game = await ctx.db.game.create({
        data: {
          gameCode: code,
          gameState: "LOBBY",
        },
      });
      await ctx.db.player.create({
        data: {
          name: input.playerName,
          gameCode: game.gameCode,
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

      await ctx.db.player.create({
        data: {
          name: input.playerName,
          gameCode: input.gameCode,
        },
      });

      const allPlayers = await ctx.db.player.findMany({
        where: { gameCode: input.gameCode },
      });

      if (allPlayers.find((p) => p.name === input.playerName)) {
        return new TRPCError({
          code: "CONFLICT",
          message: `Player with name '${input.playerName}' already in game`,
        });
      }

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
      const players = await ctx.db.player.findMany({
        where: { gameCode: input.gameCode },
        select: { name: true },
      });
      return players;
    }),
});
