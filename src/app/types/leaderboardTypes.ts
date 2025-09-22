// src/types/game.ts

/**
 * Simple types that closely match your database schema
 */

export type GameState = 'LOBBY' | 'QUESTION' | 'RESULT' | 'FINAL_RESULT';

/**
 * Player with calculated rank and winner status
 * Extends your database Player with display properties
 */
export interface LeaderboardPlayer {
  name: string;
  gameCode: string;
  score: number;
  playerAnswers: number[];
  // Calculated properties for display
  rank: number;
  isWinner: boolean;
}

/**
 * Game with ranked players
 * Extends your database Game with sorted/ranked players
 */
export interface LeaderboardGame {
  gameCode: string;
  gameState: GameState;
  currentQuestion: number;
  createdAt: Date;
  updatedAt: Date;
  // Players sorted by score with ranks assigned
  players: LeaderboardPlayer[];
}