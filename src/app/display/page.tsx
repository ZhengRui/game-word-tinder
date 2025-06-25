"use client";

import { useSocket } from "@/hooks/useSocket";
import { useState, useEffect } from "react";

export default function DisplayPage() {
  const {
    gameState,
    gameEndResult,
    configError,
    startGame,
    nextCard,
    stopGame,
    awardBonusPoint,
    updateConfig,
    clearGameEndResult,
    clearConfigError,
  } = useSocket();
  const [showConfig, setShowConfig] = useState(false);
  const [configForm, setConfigForm] = useState({
    numberOfTeams: 2,
    cardDisplayTime: 10,
    speechTime: 60,
    cooldownTime: 120,
    speechPoints: 2,
    bonusPoints: 1,
  });

  // Update form when gameState config changes
  useEffect(() => {
    if (gameState?.config) {
      setConfigForm(gameState.config);
    }
  }, [gameState?.config]);

  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(configForm);
    setShowConfig(false);
  };
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Game End Modal */}
      {gameEndResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-2xl max-w-2xl w-full mx-4 text-center">
            <h2 className="text-4xl font-bold mb-6 text-yellow-400">
              🎉 Game Over!
            </h2>
            <h3 className="text-2xl font-semibold mb-4">
              {gameEndResult.winners.length === 1 ? (
                <>
                  Winner:{" "}
                  <span className="text-green-400">
                    {gameEndResult.winners[0]}
                  </span>
                </>
              ) : (
                <>
                  Winners:{" "}
                  <span className="text-green-400">
                    {gameEndResult.winners.join(" & ")}
                  </span>
                </>
              )}
            </h3>
            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-3">Final Scores:</h4>
              <div className="space-y-2">
                {Object.entries(gameEndResult.finalScores).map(
                  ([team, data]) => (
                    <div
                      key={team}
                      className="flex justify-between items-center bg-gray-700 p-3 rounded"
                    >
                      <span
                        className={`font-medium ${
                          team === "Team A"
                            ? "text-red-400"
                            : team === "Team B"
                            ? "text-blue-400"
                            : "text-green-400"
                        }`}
                      >
                        {team}
                      </span>
                      <span className="text-white font-bold">
                        {(data as { score: number }).score} points
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
            <button
              onClick={clearGameEndResult}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Configuration Modal */}
      {showConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-2xl max-w-2xl w-full mx-4">
            <h2 className="text-3xl font-bold mb-6 text-blue-400">
              ⚙️ Game Configuration
            </h2>

            {configError && (
              <div className="bg-red-600 text-white p-3 rounded mb-4">
                {configError}
                <button
                  onClick={clearConfigError}
                  className="ml-2 text-red-200 hover:text-white"
                >
                  ×
                </button>
              </div>
            )}

            <form onSubmit={handleConfigSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Number of Teams (2-6)
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="6"
                    value={configForm.numberOfTeams}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        numberOfTeams: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-2 bg-gray-700 rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Card Display Time (5-60s)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={configForm.cardDisplayTime}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        cardDisplayTime: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-2 bg-gray-700 rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Speech Time (30-300s)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="300"
                    value={configForm.speechTime}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        speechTime: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-2 bg-gray-700 rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cooldown Time (60-600s)
                  </label>
                  <input
                    type="number"
                    min="60"
                    max="600"
                    value={configForm.cooldownTime}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        cooldownTime: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-2 bg-gray-700 rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Speech Points (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={configForm.speechPoints}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        speechPoints: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-2 bg-gray-700 rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bonus Points (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={configForm.bonusPoints}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        bonusPoints: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-2 bg-gray-700 rounded text-white"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Apply Settings
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfig(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div
        className="bg-gradient-to-r from-blue-700 to-purple-700"
        style={{ boxShadow: "0 8px 32px rgba(255, 255, 255, 0.1)" }}
      >
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-white text-center tracking-wide">
            🎤 Word Tinder
          </h1>
        </div>
      </div>

      {/* Main Content - Takes remaining space and centers vertically */}
      <div className="flex-1 flex items-center">
        <div className="container mx-auto p-4 flex flex-col lg:flex-row w-full">
          {/* Left Half - Word Card */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
            <div className="bg-blue-600 rounded-2xl p-8 lg:p-12 w-full max-w-4xl text-center shadow-2xl h-96 lg:h-[32rem] flex flex-col justify-center">
              {gameState?.currentCard ? (
                <>
                  {/* Fixed height topic section */}
                  <div className="h-24 lg:h-32 flex items-center justify-center mb-6">
                    <h1 className="text-4xl lg:text-6xl font-bold text-white text-center break-words leading-tight">
                      {gameState.currentCard.topic}
                    </h1>
                  </div>

                  {/* Fixed height keywords section */}
                  <div className="h-32 lg:h-36 flex flex-col justify-center mb-6">
                    <p className="text-lg lg:text-2xl font-semibold mb-2 text-blue-100">
                      Keywords:
                    </p>
                    <p className="text-lg lg:text-xl text-blue-100 leading-relaxed">
                      {gameState.currentCard.keywords.join(" • ")}
                    </p>
                  </div>
                  {gameState.gamePhase === "card-display" && (
                    <div
                      className={`text-2xl lg:text-4xl font-bold ${
                        gameState.cardTimeRemaining <= 3
                          ? "text-red-200 animate-pulse"
                          : "text-blue-200"
                      }`}
                    >
                      ⏰ {gameState.cardTimeRemaining}s
                    </div>
                  )}
                  {gameState.gamePhase === "speaking" && (
                    <>
                      <div
                        className={`text-2xl lg:text-4xl font-bold ${
                          gameState.speechTimeRemaining <= 10
                            ? "text-red-200 animate-pulse"
                            : "text-green-200"
                        }`}
                      >
                        🎤 {Math.floor(gameState.speechTimeRemaining / 60)}:
                        {(gameState.speechTimeRemaining % 60)
                          .toString()
                          .padStart(2, "0")}
                      </div>
                      <div className="mt-4 lg:mt-6 text-xl lg:text-2xl text-yellow-200">
                        {(() => {
                          const speaker = gameState.players.find(
                            (p) => p.id === gameState.currentSpeaker
                          );
                          return speaker
                            ? `${speaker.name} (${speaker.team}) is speaking!`
                            : "Someone is speaking!";
                        })()}
                      </div>
                    </>
                  )}
                  {gameState.gamePhase === "speech-paused" && (
                    <>
                      <div className="text-2xl lg:text-4xl font-bold text-orange-200 animate-pulse">
                        ⏸️ SPEECH PAUSED
                      </div>
                      <div className="mt-4 lg:mt-6 text-xl lg:text-2xl text-orange-200">
                        {(() => {
                          const speaker = gameState.players.find(
                            (p) => p.id === gameState.currentSpeaker
                          );
                          return speaker
                            ? `${speaker.name} (${speaker.team}) disconnected`
                            : "Speaker disconnected";
                        })()}
                      </div>
                      <div className="mt-2 text-lg lg:text-xl text-orange-300">
                        Waiting for reconnection...
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <h1 className="text-4xl lg:text-6xl font-bold mb-6 lg:mb-8 text-white">
                    Word Tinder
                  </h1>
                  <div className="text-xl lg:text-2xl text-blue-100 mb-8 lg:mb-12">
                    <p>
                      {gameState?.gamePhase === "waiting"
                        ? "Ready to start!"
                        : "Waiting for players to join..."}
                    </p>
                  </div>
                  <div className="text-lg lg:text-xl text-blue-200">
                    {gameState
                      ? `${gameState.players.length} players connected`
                      : "Starting up..."}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Half - Teams */}
          <div className="w-full lg:w-1/2 p-4 lg:p-8 flex flex-col justify-center lg:max-h-[42rem] lg:justify-start overflow-y-auto">
            <div>
              {gameState ? (
                <>
                  {/* Dynamic Teams */}
                  {Object.entries(gameState.teams).map(
                    ([teamName, teamData], index) => {
                      const teamColors = [
                        "text-red-400",
                        "text-blue-400",
                        "text-green-400",
                        "text-purple-400",
                        "text-yellow-400",
                        "text-pink-400",
                      ];
                      const teamColor = teamColors[index] || "text-gray-400";

                      return (
                        <div key={teamName} className="mb-4 lg:mb-6">
                          <h3
                            className={`text-xl lg:text-2xl font-semibold mb-3 lg:mb-4 ${teamColor}`}
                          >
                            {teamName} ({teamData.score} points)
                          </h3>
                          <div className="h-full">
                            {teamData.members.length === 0 ? (
                              <div className="bg-gray-800 p-3 rounded-lg text-center text-gray-500 text-sm">
                                No players yet
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                                {teamData.members.map((playerId) => {
                                  const player = gameState.players.find(
                                    (p) => p.id === playerId
                                  );
                                  if (!player) return null;
                                  return (
                                    <div
                                      key={player.id}
                                      className="bg-gray-800 p-2 lg:p-3 rounded-lg"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div
                                          className={`flex items-center min-w-0 flex-1 ${
                                            player.status === "available"
                                              ? "text-green-400"
                                              : player.status === "speaking"
                                              ? "text-yellow-400"
                                              : player.status === "disconnected"
                                              ? "text-orange-400"
                                              : "text-red-400"
                                          }`}
                                        >
                                          <span className="text-sm lg:text-base">
                                            {player.status === "available"
                                              ? "✓"
                                              : player.status === "speaking"
                                              ? "🎤"
                                              : player.status === "disconnected"
                                              ? "📱"
                                              : "⏱"}
                                          </span>
                                          <span className="text-sm lg:text-base font-medium ml-2 truncate">
                                            {player.name}
                                          </span>
                                          <span className="text-xs ml-2">
                                            {player.status === "available"
                                              ? "Available"
                                              : player.status === "speaking"
                                              ? "Speaking"
                                              : player.status === "disconnected"
                                              ? "Disconnected"
                                              : player.status === "cooldown" &&
                                                player.cooldownTimeRemaining
                                              ? `Cooldown (${Math.floor(
                                                  player.cooldownTimeRemaining /
                                                    60
                                                )}:${(
                                                  player.cooldownTimeRemaining %
                                                  60
                                                )
                                                  .toString()
                                                  .padStart(2, "0")})`
                                              : "Cooldown"}
                                          </span>
                                        </div>
                                        {player.status === "cooldown" &&
                                          !player.bonusAwarded && (
                                            <button
                                              onClick={() =>
                                                awardBonusPoint(player.id)
                                              }
                                              className="bg-yellow-600 hover:bg-yellow-700 text-white px-1.5 py-1 rounded text-xs transition-colors flex-shrink-0"
                                              title="Award bonus point for creativity"
                                            >
                                              🌟
                                            </button>
                                          )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
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

      {/* Admin Controls */}
      <div className="fixed bottom-4 right-4 flex flex-col lg:flex-row gap-2">
        {gameState?.gamePhase === "waiting" && (
          <>
            <button
              onClick={() => setShowConfig(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-semibold transition-colors text-sm lg:text-base"
            >
              ⚙️ Configure
            </button>
            <button
              onClick={startGame}
              className="bg-green-600 hover:bg-green-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-semibold transition-colors text-sm lg:text-base"
            >
              🎮 Start Game
            </button>
          </>
        )}
        {(gameState?.gamePhase === "card-display" || gameState?.gamePhase === "speech-paused") && (
          <button
            onClick={nextCard}
            className={`px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-semibold transition-colors text-sm lg:text-base ${
              gameState?.gamePhase === "speech-paused"
                ? "bg-orange-600 hover:bg-orange-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {gameState?.gamePhase === "speech-paused" ? "⏭️ Skip Paused Speech" : "⏭️ Next Card"}
          </button>
        )}
        {gameState?.gamePhase !== "waiting" && (
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
