'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface Player {
  id: string;
  name: string;
  team: string;
  status: 'available' | 'speaking' | 'cooldown' | 'disconnected';
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
  gamePhase: 'waiting' | 'card-display' | 'speaking' | 'speech-paused' | 'cooldown';
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
  const [gameEndResult, setGameEndResult] = useState<{winners: string[], finalScores: Record<string, Team>} | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const [reconnectionError, setReconnectionError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session in localStorage
    const existingSession = typeof window !== 'undefined' ? localStorage.getItem('wordTinderSession') : null;
    let shouldReconnect = false;
    let sessionData = null;

    if (existingSession) {
      try {
        sessionData = JSON.parse(existingSession);
        shouldReconnect = true;
      } catch {
        // Invalid session data, remove it
        localStorage.removeItem('wordTinderSession');
      }
    }

    // Create socket connection - try env var first, then dynamic hostname
    let socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    
    // Fallback to dynamic hostname if env var not set
    if (!socketUrl && typeof window !== 'undefined') {
      socketUrl = `http://${window.location.hostname}:3001`;
    }
    
    // Final fallback to localhost
    socketUrl = socketUrl || 'http://localhost:3001';
    
    // Debug logging
    console.log('🔌 Attempting to connect to:', socketUrl);
    console.log('🌐 Environment variable:', process.env.NEXT_PUBLIC_SOCKET_URL);
    console.log('🏠 Current hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server-side');
    
    socketRef.current = io(socketUrl, {
      transports: ['websocket', 'polling']
    });

    const socket = socketRef.current;

    // Connection event handlers
    socket.on('connect', () => {
      setIsConnected(true);
      
      // Attempt reconnection if we have session data
      if (shouldReconnect && sessionData) {
        socket.emit('reconnect-player', sessionData);
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Game state updates
    socket.on('game-state-update', (state: GameState) => {
      setGameState(state);
    });

    // Registration events
    socket.on('registration-success', (data: { playerId: string; name: string; team: string; sessionToken: string }) => {
      setRegistrationError(null);
      setCurrentPlayer({
        id: data.playerId,
        name: data.name,
        team: data.team,
        status: 'available'
      });
      
      // Save session data to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('wordTinderSession', JSON.stringify({
          playerId: data.playerId,
          name: data.name,
          team: data.team,
          sessionToken: data.sessionToken
        }));
      }
    });

    socket.on('registration-error', (data: { message: string }) => {
      setRegistrationError(data.message);
    });

    // Reconnection events
    socket.on('reconnection-success', (data: { playerId: string; name: string; team: string }) => {
      setReconnectionError(null);
      setCurrentPlayer({
        id: data.playerId,
        name: data.name,
        team: data.team,
        status: 'available'
      });
    });

    socket.on('reconnection-error', (data: { message: string }) => {
      setReconnectionError(data.message);
      // Clear invalid session data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('wordTinderSession');
      }
    });

    socket.on('speech-resumed', (data: { remainingTime: number }) => {
      // Speech has been resumed after reconnection
      console.log(`Speech resumed with ${data.remainingTime} seconds remaining`);
    });

    // Claim events
    socket.on('word-claimed', () => {
      // Word successfully claimed
    });

    socket.on('claim-error', () => {
      // Handle claim error if needed
    });

    // Game end event
    socket.on('game-ended', (data: { winners: string[]; finalScores: Record<string, Team> }) => {
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
    reconnectionError,
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
    clearReconnectionError: () => setReconnectionError(null),
    clearGameEndResult: () => setGameEndResult(null),
    clearConfigError: () => setConfigError(null),
    clearSession: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('wordTinderSession');
      }
      setCurrentPlayer(null);
    }
  };
}