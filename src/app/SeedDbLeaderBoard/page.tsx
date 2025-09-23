// src/app/admin-test/page.tsx
'use client';

import { useState } from 'react';
import { api } from '@/trpc/react';
import { useRouter } from "next/navigation";

export default function SeedDbLeaderBoard() { 
    const [testGameCode, setTestGameCode] = useState('TEST123');
  
  const router = useRouter();

  // Mutations for seeding and cleanup
  const seedGame = api.game.seedTestGame.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        alert(`✅ Test game created: ${data.gameCode}`);
         router.push(`/presenter/${data.gameCode}/finalResult`);
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    }
  });

  const cleanupGame = api.game.cleanupTestData.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        alert(`✅ Cleaned up: ${data.message}`);
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    }
  });

  const handleSeedGame = () => {
    seedGame.mutate({ gameCode: testGameCode });
  };

  const handleCleanup = () => {
    cleanupGame.mutate({ gameCode: testGameCode });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">🧪 Database Testing</h1>
        <p className="text-gray-700">Test your leaderboard with real database data</p>
      </div>

      {/* Control Panel */}
      <div className="max-w-md mx-auto mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Test Controls</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800">Game Code:</label>
            <input
              type="text"
              value={testGameCode}
              onChange={(e) => setTestGameCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="TEST123"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSeedGame}
              disabled={seedGame.isPending}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 font-medium"
            >
              {seedGame.isPending ? 'Creating...' : '🌱 Seed Test Game'}
            </button>

            <button
              onClick={handleCleanup}
              disabled={cleanupGame.isPending}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 font-medium"
            >
              {cleanupGame.isPending ? 'Cleaning...' : '🧹 Cleanup'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}