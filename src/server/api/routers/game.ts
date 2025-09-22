

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { generateUniqueRoomCode,generatePlaceholderUpstashId } from "@/server/utils/gameUtils";
import { z } from "zod";
import type { LeaderboardGame} from "@/app/types/leaderboardTypes";

export const gameRouter = createTRPCRouter({
  
  /**
   * Creates a new game with a unique room code
   * This is what "Create Game" button will call
   */
 
  create: publicProcedure
  .mutation(async ({ ctx }) => {
    try {

       // Step 1: Generate unique room code
      const roomCode = await generateUniqueRoomCode();
      console.log(`🎮 Creating new game with room code: ${roomCode}`);
      
      // Step 2: Generate unique upstash ID 
      const upstashId = generatePlaceholderUpstashId(); // You'll need to implement this
      
      const result = await ctx.db.$transaction(async (prisma) => {
        // Create Game WITH Game0To100 in one operation
        const gameWithGame0To100 = await prisma.game.create({
          data: {
            gameCode: roomCode,
            upstashId: upstashId,
            
            // Create the related Game0To100 record
            game0To100: {
              create: {
                gameState: 'LOBBY',
                currentQuestionIndex: 0,
              }
            }
          },
          include: {
            game0To100: true // Include the created Game0To100 in response
          }
        });

        return gameWithGame0To100;
      });

      console.log(`✅ Created game successfully: ${roomCode}`);

      return {
        success: true,
        game: {
          gameCode: result.gameCode,
          gameState: result.game0To100?.gameState,
          createdAt: result.createdAt
        },
        message: `Game created successfully with code: ${roomCode}`
      };

    } catch (error) {
      console.error('❌ Error creating game:', error);
      return {
        success: false,
        error: 'Failed to create game. Please try again.',
        game: null
      };
    }
  }),


    /**
   * Get leaderboard for a game in FINAL_RESULT state
   * Simple: fetch data, add ranks, return it
   */
  getLeaderboard: publicProcedure
    .input(z.object({
      gameCode: z.string().min(6),
    }))
    .query(async ({ input, ctx }) => {
      // 1. Get game with players from database
      const game = await ctx.db.game0To100.findUnique({
        where: { gameCode: input.gameCode },
        include: {
          players: {
            orderBy: { score: 'asc' } // Lowest score first
          }
        }
      });

      if (!game) {
        throw new Error(`Game ${input.gameCode} not found`);
      }

      // 2. Check if game is in final result state (optional validation)
      if (game.gameState !== 'FINAL_RESULT') {
        console.warn(`⚠️ Game ${input.gameCode} is in ${game.gameState} state, not FINAL_RESULT`);
        // You can choose to throw an error or allow it
        // throw new Error(`Game is not finished yet (current state: ${game.gameState})`);
      }

      // 3. Add ranks and winner status (minimal transformation)
      const playersWithRanks = game.players.map((player, index) => ({
        ...player,
        rank: index + 1,
        isWinner: index === 0 && game.players.length > 0 // First player is winner
      }));

      // 4. Return game with ranked players
      const leaderboard: LeaderboardGame = {
        gameCode: game.gameCode,
        gameState: game.gameState,
        currentQuestion: game.currentQuestionIndex,
        createdAt: game.createdAt,
        updatedAt: game.updatedAt,
        players: playersWithRanks
      };

      return leaderboard;
    }),

  /**
   * Check current game state 
   * Useful for determining what UI to show
   */
  getGameState: publicProcedure
    .input(z.object({
      gameCode: z.string().min(6),
    }))
    .query(async ({ input, ctx }) => {
      const game = await ctx.db.game0To100.findUnique({
        where: { gameCode: input.gameCode },
        select: { 
          gameCode: true, 
          gameState: true, 
          currentQuestionIndex: true,
          updatedAt: true
        }
      });

      if (!game) {
        throw new Error(`Game ${input.gameCode} not found`);
      }

      return {
        gameCode: game.gameCode,
        gameState: game.gameState,
        currentQuestion: game.currentQuestionIndex,
        updatedAt: game.updatedAt,
        shouldShowLeaderboard: game.gameState === 'FINAL_RESULT'
      };
    }),

    /*************** TESTING PURPOSES BELOW:  *************************/
      /**
   * Seed database with test data for leaderboard testing
   * REMOVE THIS IN PRODUCTION
   */
  seedTestGame: publicProcedure
    .input(z.object({
      gameCode: z.string().min(1).optional()
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const roomCode = input.gameCode ?? 'TEST123';
        
        // Create the game in a transaction
         await ctx.db.$transaction(async (prisma) => {
          // Create Game with Game0To100
          const gameWithGame0To100 = await prisma.game.create({
            data: {
              gameCode: roomCode,
              upstashId: `test_${roomCode}`,
              game0To100: {
                create: {
                  gameState: 'FINAL_RESULT', // Set to final result for testing
                  currentQuestionIndex: 8,
                }
              }
            },
            include: {
              game0To100: true
            }
          });

          // Create test players
          const players = [
            { name: 'Alice', score: 680, answers: [75, 82, 65, 90, 88, 70, 85, 78] },
            { name: 'Bob', score: 620, answers: [70, 65, 80, 75, 70, 85, 80, 72] },
            { name: 'Charlie', score: 580, answers: [60, 70, 75, 80, 65, 75, 70, 68] },
            { name: 'Diana', score: 520, answers: [55, 60, 70, 65, 60, 70, 65, 62] }
          ];

          // Insert players
          for (const playerData of players) {
            await prisma.game0To100Player.create({
              data: {
                name: playerData.name,
                gameCode: roomCode,
                score: playerData.score,
                playerAnswers: playerData.answers
              }
            });
          }

          return gameWithGame0To100;
        });

        console.log(`✅ Seeded test game: ${roomCode} with 4 players`);

        return {
          success: true,
          gameCode: roomCode,
          message: `Test game ${roomCode} created with 4 players`
        };

      } catch (error) {
        console.error('❌ Error seeding test game:', error);
        return {
          success: false,
          error: 'Failed to seed test game'
        };
      }
    }),

  /**
   * Clean up test data
   */
  cleanupTestData: publicProcedure
    .input(z.object({
      gameCode: z.string().min(1)
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.db.$transaction(async (prisma) => {
          // Delete players first (due to foreign keys)
          await prisma.game0To100Player.deleteMany({
            where: { gameCode: input.gameCode }
          });

          // Delete Game0To100
          await prisma.game0To100.delete({
            where: { gameCode: input.gameCode }
          });

          // Delete Game
          await prisma.game.delete({
            where: { gameCode: input.gameCode }
          });
        });

        return {
          success: true,
          message: `Cleaned up test game ${input.gameCode}`
        };

      } catch (error) {
        console.error('❌ Error cleaning up test data:', error);
        return {
          success: false,
          error: 'Failed to cleanup test data'
        };
      }
    })

});