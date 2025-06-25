'use client';

import { useSocket } from '@/hooks/useSocket';

export default function DisplayPage() {
  const { isConnected, gameState, startGame, nextCard, stopGame } = useSocket();
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4 h-screen flex flex-col lg:flex-row">
        {/* Left Half - Word Card */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
          <div className="bg-blue-600 rounded-2xl p-8 lg:p-16 w-full max-w-4xl text-center shadow-2xl">
            {gameState?.currentCard ? (
              <>
                <h1 className="text-3xl lg:text-6xl font-bold mb-4 text-white text-center break-words">{gameState.currentCard.topic}</h1>
                <div className="text-lg lg:text-2xl text-blue-100 mb-6 lg:mb-8">
                  <p className="font-semibold mb-2">Keywords:</p>
                  <p className="leading-relaxed">{gameState.currentCard.keywords.join(' • ')}</p>
                </div>
                {gameState.gamePhase === 'card-display' && (
                  <div className={`text-2xl lg:text-4xl font-bold ${gameState.cardTimeRemaining <= 3 ? 'text-red-200 animate-pulse' : 'text-blue-200'}`}>
                    ⏰ {gameState.cardTimeRemaining}s
                  </div>
                )}
                {gameState.gamePhase === 'speaking' && (
                  <>
                    <div className={`text-2xl lg:text-4xl font-bold ${gameState.speechTimeRemaining <= 10 ? 'text-red-200 animate-pulse' : 'text-green-200'}`}>
                      🎤 {Math.floor(gameState.speechTimeRemaining / 60)}:{(gameState.speechTimeRemaining % 60).toString().padStart(2, '0')}
                    </div>
                    <div className="mt-4 lg:mt-6 text-xl lg:text-2xl text-yellow-200">
                      {(() => {
                        const speaker = gameState.players.find(p => p.id === gameState.currentSpeaker);
                        return speaker ? `${speaker.name} (${speaker.team}) is speaking!` : 'Someone is speaking!';
                      })()}
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <h1 className="text-4xl lg:text-6xl font-bold mb-6 lg:mb-8 text-white">Word Tinder</h1>
                <div className="text-xl lg:text-2xl text-blue-100 mb-8 lg:mb-12">
                  <p>{gameState?.gamePhase === 'waiting' ? 'Ready to start!' : 'Waiting for players to join...'}</p>
                </div>
                <div className="text-lg lg:text-xl text-blue-200">
                  {gameState ? `${gameState.players.length} players connected` : 'Starting up...'}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Half - Teams */}
        <div className="w-full lg:w-1/2 p-4 lg:p-8 flex flex-col justify-center">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 text-center">Teams</h2>
            
            {gameState ? (
              <>
                {/* Team A */}
                <div className="mb-6 lg:mb-8">
                  <h3 className="text-xl lg:text-2xl font-semibold mb-3 lg:mb-4 text-red-400">
                    Team A ({gameState.teams['Team A'].score} points)
                  </h3>
                  <div className="space-y-2 lg:space-y-3">
                    {gameState.teams['Team A'].members.length === 0 ? (
                      <div className="bg-gray-800 p-3 lg:p-4 rounded-lg text-center text-gray-500 text-sm lg:text-base">
                        No players yet
                      </div>
                    ) : (
                      gameState.teams['Team A'].members.map((playerId) => {
                        const player = gameState.players.find(p => p.id === playerId);
                        if (!player) return null;
                        return (
                          <div key={player.id} className="bg-gray-800 p-3 lg:p-4 rounded-lg">
                            <span className={`text-base lg:text-lg ${
                              player.status === 'available' ? 'text-green-400' :
                              player.status === 'speaking' ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {player.status === 'available' ? '✓' :
                               player.status === 'speaking' ? '🎤' : '⏱'} {player.name}
                            </span>
                            <span className="text-xs lg:text-sm text-gray-400 ml-2 lg:ml-3">
                              {player.status === 'available' ? 'Available' :
                               player.status === 'speaking' ? 'Speaking' : 
                               player.status === 'cooldown' && player.cooldownTimeRemaining ? 
                                 `Cooldown (${Math.floor(player.cooldownTimeRemaining / 60)}:${(player.cooldownTimeRemaining % 60).toString().padStart(2, '0')})` : 
                                 'Cooldown'}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Team B */}
                <div className="mb-6 lg:mb-8">
                  <h3 className="text-xl lg:text-2xl font-semibold mb-3 lg:mb-4 text-blue-400">
                    Team B ({gameState.teams['Team B'].score} points)
                  </h3>
                  <div className="space-y-2 lg:space-y-3">
                    {gameState.teams['Team B'].members.length === 0 ? (
                      <div className="bg-gray-800 p-3 lg:p-4 rounded-lg text-center text-gray-500 text-sm lg:text-base">
                        No players yet
                      </div>
                    ) : (
                      gameState.teams['Team B'].members.map((playerId) => {
                        const player = gameState.players.find(p => p.id === playerId);
                        if (!player) return null;
                        return (
                          <div key={player.id} className="bg-gray-800 p-3 lg:p-4 rounded-lg">
                            <span className={`text-base lg:text-lg ${
                              player.status === 'available' ? 'text-green-400' :
                              player.status === 'speaking' ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {player.status === 'available' ? '✓' :
                               player.status === 'speaking' ? '🎤' : '⏱'} {player.name}
                            </span>
                            <span className="text-xs lg:text-sm text-gray-400 ml-2 lg:ml-3">
                              {player.status === 'available' ? 'Available' :
                               player.status === 'speaking' ? 'Speaking' : 
                               player.status === 'cooldown' && player.cooldownTimeRemaining ? 
                                 `Cooldown (${Math.floor(player.cooldownTimeRemaining / 60)}:${(player.cooldownTimeRemaining % 60).toString().padStart(2, '0')})` : 
                                 'Cooldown'}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Team C */}
                <div className="mb-6 lg:mb-8">
                  <h3 className="text-xl lg:text-2xl font-semibold mb-3 lg:mb-4 text-green-400">
                    Team C ({gameState.teams['Team C'].score} points)
                  </h3>
                  <div className="space-y-2 lg:space-y-3">
                    {gameState.teams['Team C'].members.length === 0 ? (
                      <div className="bg-gray-800 p-3 lg:p-4 rounded-lg text-center text-gray-500 text-sm lg:text-base">
                        No players yet
                      </div>
                    ) : (
                      gameState.teams['Team C'].members.map((playerId) => {
                        const player = gameState.players.find(p => p.id === playerId);
                        if (!player) return null;
                        return (
                          <div key={player.id} className="bg-gray-800 p-3 lg:p-4 rounded-lg">
                            <span className={`text-base lg:text-lg ${
                              player.status === 'available' ? 'text-green-400' :
                              player.status === 'speaking' ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {player.status === 'available' ? '✓' :
                               player.status === 'speaking' ? '🎤' : '⏱'} {player.name}
                            </span>
                            <span className="text-xs lg:text-sm text-gray-400 ml-2 lg:ml-3">
                              {player.status === 'available' ? 'Available' :
                               player.status === 'speaking' ? 'Speaking' : 
                               player.status === 'cooldown' && player.cooldownTimeRemaining ? 
                                 `Cooldown (${Math.floor(player.cooldownTimeRemaining / 60)}:${(player.cooldownTimeRemaining % 60).toString().padStart(2, '0')})` : 
                                 'Cooldown'}
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
      
      {/* Admin Controls */}
      <div className="fixed bottom-4 right-4 flex flex-col lg:flex-row gap-2">
        {gameState?.gamePhase === 'waiting' && (
          <button
            onClick={startGame}
            className="bg-green-600 hover:bg-green-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-semibold transition-colors text-sm lg:text-base"
          >
            🎮 Start Game
          </button>
        )}
        {gameState?.gamePhase === 'card-display' && (
          <button
            onClick={nextCard}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-semibold transition-colors text-sm lg:text-base"
          >
            ⏭️ Next Card
          </button>
        )}
        {gameState?.gamePhase !== 'waiting' && (
          <button
            onClick={stopGame}
            className="bg-red-600 hover:bg-red-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-semibold transition-colors text-sm lg:text-base"
          >
            ⏹️ Stop Game
          </button>
        )}
      </div>
    </div>
  );
}