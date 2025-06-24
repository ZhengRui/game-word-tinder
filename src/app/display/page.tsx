'use client';

import { useSocket } from '@/hooks/useSocket';

export default function DisplayPage() {
  const { isConnected, gameState } = useSocket();
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4 h-screen flex">
        {/* Left Half - Word Card */}
        <div className="w-1/2 flex items-center justify-center p-8">
          <div className="bg-blue-600 rounded-2xl p-16 w-full max-w-2xl text-center shadow-2xl">
            {gameState?.currentCard ? (
              <>
                <h1 className="text-8xl font-bold mb-8 text-white">{gameState.currentCard.word}</h1>
                <div className="text-2xl text-blue-100 mb-12">
                  <p>Keywords: {gameState.currentCard.keywords?.join(', ')}</p>
                </div>
                <div className="text-3xl text-blue-200 font-semibold">
                  Time remaining: 8 seconds
                </div>
              </>
            ) : (
              <>
                <h1 className="text-6xl font-bold mb-8 text-white">Word Tinder</h1>
                <div className="text-2xl text-blue-100 mb-12">
                  <p>Waiting for players to join...</p>
                </div>
                <div className="text-xl text-blue-200">
                  {gameState ? `${gameState.players.length} players connected` : 'Starting up...'}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Half - Teams */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">Teams</h2>
            
            {gameState ? (
              <>
                {/* Team A */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-red-400">
                    Team A ({gameState.teams['Team A'].score} points)
                  </h3>
                  <div className="space-y-3">
                    {gameState.teams['Team A'].members.length === 0 ? (
                      <div className="bg-gray-800 p-4 rounded-lg text-center text-gray-500">
                        No players yet
                      </div>
                    ) : (
                      gameState.teams['Team A'].members.map((playerId) => {
                        const player = gameState.players.find(p => p.id === playerId);
                        if (!player) return null;
                        return (
                          <div key={player.id} className="bg-gray-800 p-4 rounded-lg">
                            <span className={`text-lg ${
                              player.status === 'available' ? 'text-green-400' :
                              player.status === 'speaking' ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {player.status === 'available' ? '✓' :
                               player.status === 'speaking' ? '🎤' : '⏱'} {player.name}
                            </span>
                            <span className="text-sm text-gray-400 ml-3">
                              {player.status === 'available' ? 'Available' :
                               player.status === 'speaking' ? 'Speaking' : 'Cooldown'}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Team B */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-blue-400">
                    Team B ({gameState.teams['Team B'].score} points)
                  </h3>
                  <div className="space-y-3">
                    {gameState.teams['Team B'].members.length === 0 ? (
                      <div className="bg-gray-800 p-4 rounded-lg text-center text-gray-500">
                        No players yet
                      </div>
                    ) : (
                      gameState.teams['Team B'].members.map((playerId) => {
                        const player = gameState.players.find(p => p.id === playerId);
                        if (!player) return null;
                        return (
                          <div key={player.id} className="bg-gray-800 p-4 rounded-lg">
                            <span className={`text-lg ${
                              player.status === 'available' ? 'text-green-400' :
                              player.status === 'speaking' ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {player.status === 'available' ? '✓' :
                               player.status === 'speaking' ? '🎤' : '⏱'} {player.name}
                            </span>
                            <span className="text-sm text-gray-400 ml-3">
                              {player.status === 'available' ? 'Available' :
                               player.status === 'speaking' ? 'Speaking' : 'Cooldown'}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Team C */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-green-400">
                    Team C ({gameState.teams['Team C'].score} points)
                  </h3>
                  <div className="space-y-3">
                    {gameState.teams['Team C'].members.length === 0 ? (
                      <div className="bg-gray-800 p-4 rounded-lg text-center text-gray-500">
                        No players yet
                      </div>
                    ) : (
                      gameState.teams['Team C'].members.map((playerId) => {
                        const player = gameState.players.find(p => p.id === playerId);
                        if (!player) return null;
                        return (
                          <div key={player.id} className="bg-gray-800 p-4 rounded-lg">
                            <span className={`text-lg ${
                              player.status === 'available' ? 'text-green-400' :
                              player.status === 'speaking' ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {player.status === 'available' ? '✓' :
                               player.status === 'speaking' ? '🎤' : '⏱'} {player.name}
                            </span>
                            <span className="text-sm text-gray-400 ml-3">
                              {player.status === 'available' ? 'Available' :
                               player.status === 'speaking' ? 'Speaking' : 'Cooldown'}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500">
                <p>Connecting to game server...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}