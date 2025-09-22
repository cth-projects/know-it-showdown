// src/app/_components/game/LeaderboardTable.tsx
'use client';

import { useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/react";

/**
 * Props for the LeaderboardTable component
 */
interface LeaderboardTableProps {
  gameCode: string;              // The game code to show results for
  showGameInfo?: boolean;        // Whether to show game metadata
}

/**
 * Complete LeaderboardTable Component
 * Handles everything needed for final game results:
 * - Fetches game data via tRPC
 * - Manages loading and error states
 * - Shows leaderboard when game is in FINAL_RESULT state
 */
export default function LeaderboardTable({ 
  gameCode,
  showGameInfo = true
}: LeaderboardTableProps) {

  // Check game state to determine what to show
  const { data: gameState, refetch: refetchGameState } = api.game.getGameState.useQuery({ 
    gameCode 
  });

  // Get leaderboard data (only when in FINAL_RESULT state)
  const { 
    data: game, 
    isLoading: gameLoading, 
    error: gameError, 
    refetch: refetchGame 
  } = api.game.getLeaderboard.useQuery(
    { gameCode },
    { 
      enabled: gameState?.gameState === 'FINAL_RESULT' // Only fetch when ready
    }
  );

  // Pusher integration for real-time updates
  useEffect(() => {
    // TODO: Replace with your actual Pusher setup
    /*
    const pusher = new Pusher('your-key', { cluster: 'your-cluster' });
    const channel = pusher.subscribe(`game-${gameCode}`);
    
    // Listen for game ending
    channel.bind('game-ended', () => {
      console.log('🎮 Game ended - refreshing leaderboard');
      refetchGameState(); // Check new game state
      refetchGame();      // Fetch leaderboard data
    });

    // Listen for state changes
    channel.bind('state-changed', (data) => {
      console.log(`🎮 Game state changed to: ${data.gameState}`);
      refetchGameState(); // Refresh game state
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`game-${gameCode}`);
    };
    */
  }, [gameCode, refetchGameState, refetchGame]);

  // Helper functions for display
  const getRankDisplay = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getBadgeVariant = (rank: number) => {
    if (rank === 1) return "default";
    if (rank === 2) return "secondary";
    return "outline";
  };

  const getTimeSinceEnd = () => {
    if (!game) return "";
    const minutesAgo = Math.floor((Date.now() - game.updatedAt.getTime()) / (1000 * 60));
    if (minutesAgo < 1) return "Just finished";
    if (minutesAgo === 1) return "1 minute ago";
    return `${minutesAgo} minutes ago`;
  };

  const getGameDuration = () => {
    if (!game) return "";
    const duration = Math.floor((game.updatedAt.getTime() - game.createdAt.getTime()) / (1000 * 60));
    return `${duration} minutes`;
  };

  // Loading game state
  if (!gameState) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading game...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Game not ready for final results yet
  if (gameState.gameState !== 'FINAL_RESULT') {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Game Status</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Game in Progress</h3>
              <div className="space-y-2 text-blue-700">
                <p>
                  Current state: <span className="font-mono bg-blue-100 px-2 py-1 rounded text-sm">{gameState.gameState}</span>
                </p>
                <p>Question: {gameState.currentQuestion}</p>
                <p className="text-sm text-blue-600">Game Code: <span className="font-mono">{gameCode}</span></p>
              </div>
              <div className="mt-4">
                <div className="animate-pulse text-blue-600 text-sm">⏳ Waiting for final results...</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Loading leaderboard data
  if (gameLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Final Results</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading final results...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error loading game data
  if (gameError || !game) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Final Results</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
              <h3 className="text-lg font-semibold text-red-900 mb-3">⚠️ Error Loading Results</h3>
              <p className="text-red-700 mb-4 text-sm">
                {gameError?.message || 'Could not load game results'}
              </p>
              <button 
                onClick={() => refetchGame()} 
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Success! Show the final leaderboard
  return (
    <div className="space-y-6">
      {/* Celebration Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white-900 mb-2">
          🎉 Game Complete! 🎉
        </h2>
        <p className="text-gray-600">
          Congratulations to all players! Here are the final results.
        </p>
      </div>

      {/* Main Leaderboard Card */}
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Final Results</CardTitle>
          {showGameInfo && (
            <div className="text-sm text-gray-600 space-y-1">
              <p>Game Code: <span className="font-mono font-bold">{game.gameCode}</span></p>
              <p>{getTimeSinceEnd()} • {getGameDuration()} • {game.currentQuestion} questions</p>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 text-center">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="text-center">Answers</TableHead>
                <TableHead className="w-20 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {game.players.map((player) => (
                <TableRow 
                  key={`${player.name}-${player.gameCode}`}
                  className={`
                    ${player.isWinner ? 'bg-yellow-50/40 border-yellow-200/50' : ''} 
                    hover:bg-gray-50/50 transition-colors duration-200
                  `}
                >
                  {/* Rank */}
                  <TableCell className="text-center">
                    <Badge variant={getBadgeVariant(player.rank)}>
                      {getRankDisplay(player.rank)}
                    </Badge>
                  </TableCell>
                  
                  {/* Player Name */}
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span>{player.name}</span>
                      {player.isWinner && <span className="text-lg">👑</span>}
                    </div>
                  </TableCell>
                  
                  {/* Score */}
                  <TableCell className="text-right font-bold text-lg">
                    {player.score.toLocaleString()}
                  </TableCell>
                  
                  {/* Answer Count */}
                  <TableCell className="text-center text-sm">
                    {player.playerAnswers.length}/{game.currentQuestion}
                  </TableCell>
                  
                  {/* Status */}
                  <TableCell className="text-center">
                    {player.isWinner ? (
                      <Badge variant="default" className="bg-yellow-500 text-white">
                        Winner
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        {player.rank === 2 ? '2nd' : player.rank === 3 ? '3rd' : `${player.rank}th`}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Game Summary */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              {game.players.length} players • 
              Winner: {game.players.find(p => p.isWinner)?.name || 'None'} • 
              High Score: {game.players[0]?.score || 0}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Play Again
        </button>
        <button className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
          Back to Lobby
        </button>
      </div>
    </div>
  );
}

