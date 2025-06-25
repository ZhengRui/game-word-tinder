'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface Player {
  id: string;
  name: string;
  team: string;
  status: 'available' | 'speaking' | 'cooldown';
  cooldownTimeRemaining?: number;
  bonusAwarded?: boolean;
}

export interface Team {
  members: string[];
  score: number;
}

export interface WordCard {
  id: number;
  topic: string;
  keywords: string[];
}

export interface GameConfig {
  numberOfTeams: number;
  cardDisplayTime: number;
  speechTime: number;
  cooldownTime: number;
  speechPoints: number;
  bonusPoints: number;
}

export interface GameState {
  players: Player[];
  teams: Record<string, Team>;
  config: GameConfig;
  currentCard: WordCard | null;
  gamePhase: 'waiting' | 'card-display' | 'speaking' | 'cooldown';
  currentSpeaker: string | null;
  cardTimeRemaining: number;
  speechTimeRemaining: number;
}

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [gameEndResult, setGameEndResult] = useState<{winners: string[], finalScores: any} | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    // Create socket connection
    socketRef.current = io('http://localhost:3001', {
      transports: ['websocket', 'polling']
    });

    const socket = socketRef.current;

    // Connection event handlers
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Game state updates
    socket.on('game-state-update', (state: GameState) => {
      setGameState(state);
    });

    // Registration events
    socket.on('registration-success', (data: { playerId: string; name: string; team: string }) => {
      setRegistrationError(null);
      setCurrentPlayer({
        id: data.playerId,
        name: data.name,
        team: data.team,
        status: 'available'
      });
    });

    socket.on('registration-error', (data: { message: string }) => {
      setRegistrationError(data.message);
    });

    // Claim events
    socket.on('word-claimed', (data: { playerId: string; playerName: string; team: string }) => {
      // Word successfully claimed
    });

    socket.on('claim-error', (data: { message: string }) => {
      // Handle claim error if needed
    });

    // Game end event
    socket.on('game-ended', (data: { winners: string[]; finalScores: any }) => {
      setGameEndResult(data);
    });

    // Configuration events
    socket.on('config-error', (data: { message: string }) => {
      setConfigError(data.message);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Helper functions
  const registerPlayer = (name: string, team: string) => {
    if (socketRef.current) {
      setRegistrationError(null);
      socketRef.current.emit('register-player', { name, team });
    }
  };

  const claimWord = () => {
    if (socketRef.current && currentPlayer) {
      socketRef.current.emit('claim-word', { playerId: currentPlayer.id });
    }
  };

  const startGame = () => {
    if (socketRef.current) {
      socketRef.current.emit('start-game');
    }
  };

  const nextCard = () => {
    if (socketRef.current) {
      socketRef.current.emit('next-card');
    }
  };

  const stopGame = () => {
    if (socketRef.current) {
      socketRef.current.emit('stop-game');
    }
  };

  const awardBonusPoint = (playerId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('award-bonus-point', { playerId });
    }
  };

  const updateConfig = (config: Partial<GameConfig>) => {
    if (socketRef.current) {
      setConfigError(null);
      socketRef.current.emit('update-config', { config });
    }
  };

  return {
    isConnected,
    gameState,
    currentPlayer,
    registrationError,
    gameEndResult,
    configError,
    registerPlayer,
    claimWord,
    startGame,
    nextCard,
    stopGame,
    awardBonusPoint,
    updateConfig,
    clearRegistrationError: () => setRegistrationError(null),
    clearGameEndResult: () => setGameEndResult(null),
    clearConfigError: () => setConfigError(null)
  };
}