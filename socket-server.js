const { createServer } = require('http');
const { Server } = require('socket.io');
const { getRandomCard } = require('./word-cards');

const socketPort = 3001;

// Game configuration with defaults
const gameConfig = {
  numberOfTeams: 2,
  cardDisplayTime: 10, // seconds
  speechTime: 60, // seconds
  cooldownTime: 120, // seconds (2 minutes)
  speechPoints: 2,
  bonusPoints: 1
};

// Helper function to generate team structure based on config
function generateTeams() {
  const teams = {};
  const teamNames = ['Team A', 'Team B', 'Team C', 'Team D', 'Team E', 'Team F'];
  
  for (let i = 0; i < gameConfig.numberOfTeams; i++) {
    teams[teamNames[i]] = { members: [], score: 0 };
  }
  
  return teams;
}

// Game state management
const gameState = {
  players: new Map(), // playerId -> { id, name, team, status, socketId, cooldownTimer?, cooldownTimeRemaining?, bonusAwarded? }
  teams: generateTeams(),
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
    config: gameConfig,
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
  gameState.cardTimeRemaining = gameConfig.cardDisplayTime;
  gameState.currentSpeaker = null;

  // Start countdown timer
  gameState.cardTimer = setInterval(() => {
    gameState.cardTimeRemaining--;
    
    // Broadcast updated game state (includes timer)
    broadcastGameState(io);

    if (gameState.cardTimeRemaining <= 0) {
      // Auto-skip to next card if not claimed
      if (!gameState.currentSpeaker) {
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

  gameState.speechTimeRemaining = gameConfig.speechTime;

  gameState.speechTimer = setInterval(() => {
    gameState.speechTimeRemaining--;
    
    // Broadcast speech timer update
    broadcastGameState(io);

    if (gameState.speechTimeRemaining <= 0) {
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
    // Award points to speaker's team for completing speech
    gameState.teams[speaker.team].score += gameConfig.speechPoints;
    
    // Change speaker status to cooldown
    speaker.status = 'cooldown';
    speaker.cooldownTimeRemaining = gameConfig.cooldownTime;
    speaker.bonusAwarded = false; // Allow bonus for this new speech

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

    // Award bonus point to player's team and mark as awarded
    gameState.teams[player.team].score += gameConfig.bonusPoints;
    player.bonusAwarded = true;
    
    // Broadcast updated scores
    broadcastGameState(io);
  });

  // Handle admin controls for starting game/cards
  socket.on('start-game', () => {
    // Reset all team scores when starting a new game
    Object.keys(gameState.teams).forEach(teamName => {
      gameState.teams[teamName].score = 0;
    });
    startNewCard(io);
  });

  socket.on('next-card', () => {
    startNewCard(io);
  });

  // Handle configuration updates
  socket.on('update-config', (data) => {
    const { config } = data;
    
    // Validate configuration
    if (!config || typeof config !== 'object') {
      socket.emit('config-error', { message: 'Invalid configuration data' });
      return;
    }

    // Validate individual fields
    if (config.numberOfTeams && (config.numberOfTeams < 2 || config.numberOfTeams > 6)) {
      socket.emit('config-error', { message: 'Number of teams must be between 2 and 6' });
      return;
    }

    if (config.cardDisplayTime && (config.cardDisplayTime < 5 || config.cardDisplayTime > 60)) {
      socket.emit('config-error', { message: 'Card display time must be between 5 and 60 seconds' });
      return;
    }

    if (config.speechTime && (config.speechTime < 30 || config.speechTime > 300)) {
      socket.emit('config-error', { message: 'Speech time must be between 30 and 300 seconds' });
      return;
    }

    if (config.cooldownTime && (config.cooldownTime < 60 || config.cooldownTime > 600)) {
      socket.emit('config-error', { message: 'Cooldown time must be between 60 and 600 seconds' });
      return;
    }

    if (config.speechPoints && (config.speechPoints < 1 || config.speechPoints > 10)) {
      socket.emit('config-error', { message: 'Speech points must be between 1 and 10' });
      return;
    }

    if (config.bonusPoints && (config.bonusPoints < 1 || config.bonusPoints > 5)) {
      socket.emit('config-error', { message: 'Bonus points must be between 1 and 5' });
      return;
    }

    // Update configuration
    Object.assign(gameConfig, config);
    
    // Regenerate teams if numberOfTeams changed
    if (config.numberOfTeams) {
      // Save existing players and clear teams
      const allPlayers = Array.from(gameState.players.values());
      
      // Generate new team structure
      gameState.teams = generateTeams();
      
      // Clear all players (they'll need to re-register)
      gameState.players.clear();
    }
    
    // Broadcast updated configuration
    broadcastGameState(io);
  });

  socket.on('stop-game', () => {
    stopCardTimer();
    stopSpeechTimer();
    
    // Determine winners (handle ties)
    const teams = Object.entries(gameState.teams);
    const maxScore = Math.max(...teams.map(([_, team]) => team.score));
    const winners = teams.filter(([_, team]) => team.score === maxScore).map(([name, _]) => name);
    
    
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
      
      // If the disconnecting player was the current speaker, reset game state
      if (wasSpeaking) {
        // Stop speech timer and reset speaking state
        stopSpeechTimer();
        gameState.currentSpeaker = null;
        gameState.gamePhase = 'card-display';
        
        // If there's still time on the card, continue the timer
        // If not, start a new card
        if (gameState.cardTimeRemaining <= 0) {
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