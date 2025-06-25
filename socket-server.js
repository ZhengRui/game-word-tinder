const { createServer } = require('http');
const { Server } = require('socket.io');
const { getRandomCard } = require('./word-cards');

const socketPort = 3001;

// Game state management
const gameState = {
  players: new Map(), // playerId -> { id, name, team, status, socketId, cooldownTimer?, cooldownTimeRemaining?, bonusAwarded? }
  teams: {
    'Team A': { members: [], score: 0 },
    'Team B': { members: [], score: 0 },
    'Team C': { members: [], score: 0 }
  },
  currentCard: null,
  gamePhase: 'waiting', // waiting, card-display, speaking, cooldown
  currentSpeaker: null,
  cardTimer: null,
  cardTimeRemaining: 0,
  speechTimer: null,
  speechTimeRemaining: 0
};

// Helper functions
function getGameStateForClients() {
  return {
    players: Array.from(gameState.players.values()).map(p => ({
      id: p.id,
      name: p.name,
      team: p.team,
      status: p.status,
      cooldownTimeRemaining: p.cooldownTimeRemaining || 0,
      bonusAwarded: p.bonusAwarded || false
    })),
    teams: gameState.teams,
    currentCard: gameState.currentCard,
    gamePhase: gameState.gamePhase,
    currentSpeaker: gameState.currentSpeaker,
    cardTimeRemaining: gameState.cardTimeRemaining,
    speechTimeRemaining: gameState.speechTimeRemaining
  };
}

function broadcastGameState(io) {
  const clientState = getGameStateForClients();
  io.emit('game-state-update', clientState);
  console.log('Broadcasting game state to all clients');
}

// Word card management functions
function startNewCard(io) {
  // Clear any existing timer
  if (gameState.cardTimer) {
    clearInterval(gameState.cardTimer);
  }

  // Get new random card
  gameState.currentCard = getRandomCard();
  gameState.gamePhase = 'card-display';
  gameState.cardTimeRemaining = 10; // 10 seconds display time
  gameState.currentSpeaker = null;

  console.log(`🎲 New card: ${gameState.currentCard.topic}`);

  // Start countdown timer
  gameState.cardTimer = setInterval(() => {
    gameState.cardTimeRemaining--;
    
    // Broadcast updated game state (includes timer)
    broadcastGameState(io);

    if (gameState.cardTimeRemaining <= 0) {
      // Auto-skip to next card if not claimed
      if (!gameState.currentSpeaker) {
        console.log('⏰ Card timed out, showing next card');
        startNewCard(io);
      } else {
        // Stop timer if someone claimed it
        clearInterval(gameState.cardTimer);
        gameState.cardTimer = null;
      }
    }
  }, 1000);

  // Broadcast new game state
  broadcastGameState(io);
}

function stopCardTimer() {
  if (gameState.cardTimer) {
    clearInterval(gameState.cardTimer);
    gameState.cardTimer = null;
  }
}

// Speech timer management functions
function startSpeechTimer(io) {
  // Clear any existing speech timer
  if (gameState.speechTimer) {
    clearInterval(gameState.speechTimer);
  }

  gameState.speechTimeRemaining = 60; // 1 minute for speech
  console.log(`🎤 Starting 60-second speech timer`);

  gameState.speechTimer = setInterval(() => {
    gameState.speechTimeRemaining--;
    
    // Broadcast speech timer update
    broadcastGameState(io);

    if (gameState.speechTimeRemaining <= 0) {
      console.log('⏱️ Speech time ended, starting cooldown');
      endSpeechAndStartCooldown(io);
    }
  }, 1000);
}

function endSpeechAndStartCooldown(io) {
  // Stop speech timer
  if (gameState.speechTimer) {
    clearInterval(gameState.speechTimer);
    gameState.speechTimer = null;
  }

  const speaker = gameState.players.get(gameState.currentSpeaker);
  if (speaker) {
    // Award 2 points to speaker's team for completing speech
    gameState.teams[speaker.team].score += 2;
    console.log(`🏆 ${speaker.name} completed speech! ${speaker.team} now has ${gameState.teams[speaker.team].score} points`);
    
    // Change speaker status to cooldown
    speaker.status = 'cooldown';
    speaker.cooldownTimeRemaining = 180; // 3 minutes cooldown
    speaker.bonusAwarded = false; // Allow bonus for this new speech
    
    console.log(`❄️ ${speaker.name} entered 3-minute cooldown`);

    // Start individual cooldown timer for this player
    speaker.cooldownTimer = setInterval(() => {
      speaker.cooldownTimeRemaining--;
      
      // Broadcast cooldown update
      broadcastGameState(io);

      if (speaker.cooldownTimeRemaining <= 0) {
        // Cooldown finished, return to available
        clearInterval(speaker.cooldownTimer);
        speaker.cooldownTimer = null;
        speaker.cooldownTimeRemaining = 0;
        speaker.status = 'available';
        speaker.bonusAwarded = false; // Reset bonus flag when player becomes available again
        
        console.log(`✅ ${speaker.name} cooldown finished - now available`);
        broadcastGameState(io);
      }
    }, 1000);
  }

  // Reset global speaking state and start new card
  gameState.currentSpeaker = null;
  gameState.gamePhase = 'card-display';
  gameState.speechTimeRemaining = 0;
  
  // Start new card automatically
  startNewCard(io);
}

function stopSpeechTimer() {
  if (gameState.speechTimer) {
    clearInterval(gameState.speechTimer);
    gameState.speechTimer = null;
    gameState.speechTimeRemaining = 0;
  }
}

// Create HTTP server for Socket.io
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  
  // Send current game state to newly connected client
  socket.emit('game-state-update', getGameStateForClients());

  // Handle player registration
  socket.on('register-player', (data) => {
    const { name, team } = data;
    
    // Validation
    if (!name || !team) {
      socket.emit('registration-error', { message: 'Name and team are required' });
      return;
    }

    if (!gameState.teams[team]) {
      socket.emit('registration-error', { message: 'Invalid team selected' });
      return;
    }

    // Check for duplicate names
    const existingPlayer = Array.from(gameState.players.values()).find(p => p.name === name);
    if (existingPlayer) {
      socket.emit('registration-error', { message: 'Name already taken' });
      return;
    }

    // Create player
    const playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const player = {
      id: playerId,
      name,
      team,
      status: 'available',
      socketId: socket.id
    };

    // Add to game state
    gameState.players.set(playerId, player);
    gameState.teams[team].members.push(playerId);

    console.log(`✅ Player registered: ${name} joined ${team}`);
    
    // Confirm registration to player
    socket.emit('registration-success', { playerId, name, team });
    
    // Broadcast updated state to all clients
    broadcastGameState(io);
  });

  // Handle word claim attempts
  socket.on('claim-word', (data) => {
    const { playerId } = data;
    const player = gameState.players.get(playerId);
    
    if (!player) {
      socket.emit('claim-error', { message: 'Player not found' });
      return;
    }

    if (player.status !== 'available') {
      socket.emit('claim-error', { message: 'Player not available to claim' });
      return;
    }

    if (gameState.gamePhase !== 'card-display') {
      socket.emit('claim-error', { message: 'No card available to claim' });
      return;
    }

    // Process claim (first come, first served)
    if (!gameState.currentSpeaker) {
      player.status = 'speaking';
      gameState.currentSpeaker = playerId;
      gameState.gamePhase = 'speaking';
      
      // Stop card timer since word was claimed
      stopCardTimer();
      
      console.log(`🎤 ${player.name} claimed the word!`);
      
      // Start 1-minute speech timer
      startSpeechTimer(io);
      
      // Broadcast claim success
      io.emit('word-claimed', {
        playerId,
        playerName: player.name,
        team: player.team
      });
      
      broadcastGameState(io);
    } else {
      socket.emit('claim-error', { message: 'Word already claimed by another player' });
    }
  });

  // Handle bonus point awards
  socket.on('award-bonus-point', (data) => {
    const { playerId } = data;
    const player = gameState.players.get(playerId);
    
    if (!player) {
      socket.emit('bonus-error', { message: 'Player not found' });
      return;
    }

    if (player.status !== 'cooldown') {
      socket.emit('bonus-error', { message: 'Player not in cooldown' });
      return;
    }

    if (player.bonusAwarded) {
      socket.emit('bonus-error', { message: 'Bonus already awarded for this speech' });
      return;
    }

    // Award 1 bonus point to player's team and mark as awarded
    gameState.teams[player.team].score += 1;
    player.bonusAwarded = true;
    console.log(`🌟 Bonus point awarded to ${player.name}! ${player.team} now has ${gameState.teams[player.team].score} points`);
    
    // Broadcast updated scores
    broadcastGameState(io);
  });

  // Handle admin controls for starting game/cards
  socket.on('start-game', () => {
    console.log('🎮 Starting new game with first card');
    // Reset all team scores when starting a new game
    gameState.teams['Team A'].score = 0;
    gameState.teams['Team B'].score = 0;
    gameState.teams['Team C'].score = 0;
    startNewCard(io);
  });

  socket.on('next-card', () => {
    console.log('⏭️ Admin requested next card');
    startNewCard(io);
  });

  socket.on('stop-game', () => {
    console.log('⏹️ Game stopped by admin');
    stopCardTimer();
    stopSpeechTimer();
    
    // Determine winners (handle ties)
    const teams = Object.entries(gameState.teams);
    const maxScore = Math.max(...teams.map(([_, team]) => team.score));
    const winners = teams.filter(([_, team]) => team.score === maxScore).map(([name, _]) => name);
    
    if (winners.length === 1) {
      console.log(`🎉 Game ended! Winner: ${winners[0]} with ${maxScore} points`);
    } else {
      console.log(`🎉 Game ended! Tie between: ${winners.join(', ')} with ${maxScore} points each`);
    }
    
    // Broadcast final scores and winners
    io.emit('game-ended', {
      winners: winners,
      finalScores: gameState.teams
    });
    
    // Clear all player cooldown timers
    for (const player of gameState.players.values()) {
      if (player.cooldownTimer) {
        clearInterval(player.cooldownTimer);
        player.cooldownTimer = null;
      }
      player.cooldownTimeRemaining = 0;
      player.status = 'available';
    }
    
    gameState.gamePhase = 'waiting';
    gameState.currentCard = null;
    gameState.currentSpeaker = null;
    gameState.cardTimeRemaining = 0;
    gameState.speechTimeRemaining = 0;
    broadcastGameState(io);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
    
    // Find and remove player
    const player = Array.from(gameState.players.values()).find(p => p.socketId === socket.id);
    if (player) {
      const wasSpeaking = gameState.currentSpeaker === player.id;
      
      // Clean up player's cooldown timer if exists
      if (player.cooldownTimer) {
        clearInterval(player.cooldownTimer);
        player.cooldownTimer = null;
      }
      
      // Remove from team first
      const teamMembers = gameState.teams[player.team].members;
      const memberIndex = teamMembers.indexOf(player.id);
      if (memberIndex > -1) {
        teamMembers.splice(memberIndex, 1);
      }
      
      // Remove from players
      gameState.players.delete(player.id);
      
      console.log(`👋 Player ${player.name} left the game`);
      
      // If the disconnecting player was the current speaker, reset game state
      if (wasSpeaking) {
        console.log(`🎤 Current speaker ${player.name} disconnected - resetting game state`);
        
        // Stop speech timer and reset speaking state
        stopSpeechTimer();
        gameState.currentSpeaker = null;
        gameState.gamePhase = 'card-display';
        
        // If there's still time on the card, continue the timer
        // If not, start a new card
        if (gameState.cardTimeRemaining <= 0) {
          console.log('🎲 Starting new card after speaker disconnect');
          startNewCard(io);
          return; // startNewCard will handle broadcasting
        }
      }
      
      // Broadcast updated state
      broadcastGameState(io);
    }
  });
});

// Start Socket.io server
httpServer.listen(socketPort, () => {
  console.log(`🔌 Socket.io server ready on http://localhost:${socketPort}`);
  console.log(`🎮 Game server is running and ready for connections`);
});