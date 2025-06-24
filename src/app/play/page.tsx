'use client';

import { useState } from 'react';

export default function PlayPage() {
  const [playerName, setPlayerName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [canClaim, setCanClaim] = useState(true);

  const handleRegister = () => {
    if (playerName && selectedTeam) {
      setIsRegistered(true);
    }
  };

  const handleClaim = () => {
    if (canClaim) {
      setCanClaim(false);
      // TODO: Send claim to server
      console.log('Claimed by:', playerName, 'from', selectedTeam);
    }
  };

  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="max-w-md mx-auto mt-20">
          <h1 className="text-3xl font-bold text-center mb-8">Word Tinder</h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Your Name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Select Team</label>
              <div className="space-y-2">
                {['Team A', 'Team B', 'Team C'].map((team) => (
                  <button
                    key={team}
                    onClick={() => setSelectedTeam(team)}
                    className={`w-full p-3 rounded border-2 transition-colors ${
                      selectedTeam === team
                        ? 'border-blue-500 bg-blue-900'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    }`}
                  >
                    {team}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleRegister}
              disabled={!playerName || !selectedTeam}
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
            {playerName} • {selectedTeam}
          </p>
        </div>

        {/* Current Word Card Preview */}
        <div className="bg-gray-800 rounded-lg p-4 mb-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Current Word</h2>
          <div className="text-lg text-blue-400">Innovation</div>
          <div className="text-sm text-gray-500 mt-2">
            Keywords: Technology, Future, Progress
          </div>
        </div>

        {/* Claim Button */}
        <button
          onClick={handleClaim}
          disabled={!canClaim}
          className={`w-full p-6 rounded-lg font-bold text-xl transition-all ${
            canClaim
              ? 'bg-green-600 hover:bg-green-700 active:scale-95'
              : 'bg-red-600 cursor-not-allowed'
          }`}
        >
          {canClaim ? 'CLAIM TO SPEAK!' : 'COOLDOWN: 2:30'}
        </button>

        {/* Status */}
        <div className="mt-6 text-center">
          <div className="text-sm text-gray-400">
            Status: {canClaim ? 'Ready to claim' : 'In cooldown'}
          </div>
        </div>
      </div>
    </div>
  );
}