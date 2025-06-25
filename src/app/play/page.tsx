'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';

export default function PlayPage() {
  const [playerName, setPlayerName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const { 
    isConnected, 
    currentPlayer, 
    gameState, 
    registrationError,
    reconnectionError, 
    registerPlayer, 
    claimWord,
    clearRegistrationError,
    clearReconnectionError
  } = useSocket();

  const isRegistered = !!currentPlayer;

  const handleRegister = () => {
    if (playerName.trim() && selectedTeam) {
      registerPlayer(playerName.trim(), selectedTeam);
    }
  };

  const handleClaim = () => {
    claimWord();
  };

  // Clear registration error when inputs change
  useEffect(() => {
    if (registrationError) {
      clearRegistrationError();
    }
  }, [playerName, selectedTeam, registrationError, clearRegistrationError]);

  // Find current player in game state to get latest status including cooldown timer
  const currentGamePlayer = gameState?.players.find(p => p.id === currentPlayer?.id);
  const playerStatus = currentGamePlayer?.status || currentPlayer?.status || 'disconnected';
  const canClaim = playerStatus === 'available' && gameState?.gamePhase === 'card-display';

  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="max-w-md mx-auto mt-20">
          <h1 className="text-3xl font-bold text-center mb-8">Word Tinder</h1>
          
          {/* Connection Status */}
          <div className="text-center mb-6">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
              isConnected ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                isConnected ? 'bg-green-400' : 'bg-red-400'
              }`}></div>
              {isConnected ? 'Connected' : 'Connecting...'}
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Your Name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:outline-none"
                placeholder="Enter your name"
                disabled={!isConnected}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Select Team</label>
              <div className="space-y-2">
                {gameState && Object.keys(gameState.teams).map((team) => (
                  <button
                    key={team}
                    onClick={() => setSelectedTeam(team)}
                    disabled={!isConnected}
                    className={`w-full p-3 rounded border-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      selectedTeam === team
                        ? 'border-blue-500 bg-blue-900'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    }`}
                  >
                    {team}
                    <span className="text-sm text-gray-400 ml-2">
                      ({gameState.teams[team].members.length} players)
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {registrationError && (
              <div className="bg-red-900 text-red-300 p-3 rounded border border-red-700">
                {registrationError}
              </div>
            )}

            <button
              onClick={handleRegister}
              disabled={!playerName.trim() || !selectedTeam || !isConnected}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed p-3 rounded font-semibold transition-colors"
            >
              Join Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Word Tinder</h1>
          <p className="text-gray-400">
            {currentPlayer?.name} • {currentPlayer?.team}
          </p>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm mt-2 ${
            isConnected ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              isConnected ? 'bg-green-400' : 'bg-red-400'
            }`}></div>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        {/* Current Word Card Preview */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 text-center h-64 flex flex-col justify-center">
          <div className="text-sm text-gray-500 mb-3">Current Topic</div>
          {gameState?.currentCard ? (
            <>
              <div className="text-3xl text-blue-400 font-bold mb-4 leading-tight min-h-[2.5rem] flex items-center justify-center">{gameState.currentCard.topic}</div>
              <div className="text-sm text-gray-400 mb-3">
                Keywords: {gameState.currentCard.keywords.join(' • ')}
              </div>
              {gameState.gamePhase === 'card-display' && gameState.cardTimeRemaining > 0 && (
                <div className={`text-2xl font-bold ${gameState.cardTimeRemaining <= 3 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`}>
                  ⏰ {gameState.cardTimeRemaining}s
                </div>
              )}
              {gameState.gamePhase === 'speaking' && (
                <div className={`text-2xl font-bold ${gameState.speechTimeRemaining <= 10 ? 'text-red-400 animate-pulse' : 'text-green-400'}`}>
                  🎤 {Math.floor(gameState.speechTimeRemaining / 60)}:{(gameState.speechTimeRemaining % 60).toString().padStart(2, '0')}
                </div>
              )}
              {gameState.gamePhase === 'speech-paused' && (
                <div className="text-2xl font-bold text-orange-400 animate-pulse">
                  ⏸️ PAUSED
                </div>
              )}
            </>
          ) : (
            <div className="text-gray-500">Waiting for next topic...</div>
          )}
        </div>

        {/* Reconnection Error */}
        {reconnectionError && (
          <div className="bg-orange-900 text-orange-300 p-3 rounded border border-orange-700 mb-6">
            <div className="flex justify-between items-center">
              <span>{reconnectionError}</span>
              <button
                onClick={clearReconnectionError}
                className="text-orange-200 hover:text-white ml-2"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Claim Button */}
        <button
          onClick={handleClaim}
          disabled={!canClaim || !isConnected}
          className={`w-full p-6 rounded-lg font-bold text-xl transition-all ${
            canClaim && isConnected
              ? 'bg-green-600 hover:bg-green-700 active:scale-95'
              : 'bg-gray-600 cursor-not-allowed'
          }`}
        >
          {!isConnected ? 'DISCONNECTED' :
           playerStatus === 'speaking' ? 'YOU ARE SPEAKING!' :
           playerStatus === 'disconnected' ? 'RECONNECTING...' :
           playerStatus === 'cooldown' ? 
             (currentGamePlayer?.cooldownTimeRemaining ? 
               `COOLDOWN (${Math.floor(currentGamePlayer.cooldownTimeRemaining / 60)}:${(currentGamePlayer.cooldownTimeRemaining % 60).toString().padStart(2, '0')})` : 
               'IN COOLDOWN') :
           canClaim ? 'CLAIM TO SPEAK!' : 'WAITING...'}
        </button>

        {/* Status */}
        <div className="mt-6 text-center space-y-2">
          <div className="text-sm text-gray-400">
            Status: {
              !isConnected ? 'Disconnected' :
              playerStatus === 'speaking' ? 'Speaking' :
              playerStatus === 'cooldown' ? 
                (currentGamePlayer?.cooldownTimeRemaining ? 
                  `Cooldown (${Math.floor(currentGamePlayer.cooldownTimeRemaining / 60)}:${(currentGamePlayer.cooldownTimeRemaining % 60).toString().padStart(2, '0')})` : 
                  'In cooldown') :
              playerStatus === 'available' ? 'Available' : 'Waiting'
            }
          </div>
          <div className="text-xs text-gray-500">
            Game: {
              gameState?.gamePhase === 'waiting' ? 'Waiting to start' :
              gameState?.gamePhase === 'card-display' ? 'Topic available' :
              gameState?.gamePhase === 'speaking' ? 
                (() => {
                  if (currentPlayer?.id === gameState.currentSpeaker) {
                    return 'YOU ARE SPEAKING!';
                  }
                  const speaker = gameState.players.find(p => p.id === gameState.currentSpeaker);
                  return speaker ? `${speaker.name} (${speaker.team}) speaking` : 'Someone speaking';
                })() :
              gameState?.gamePhase === 'speech-paused' ? 
                (currentPlayer?.id === gameState.currentSpeaker ? 'YOUR SPEECH IS PAUSED' : 'Speech paused (speaker disconnected)') :
              gameState?.gamePhase === 'cooldown' ? 'Round finished' : 'Loading...'
            }
          </div>
          {gameState && (
            <div className="text-xs text-gray-500">
              Players online: {gameState.players.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}