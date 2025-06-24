const { createServer } = require('http');
const { Server } = require('socket.io');
const { getRandomCard } = require('./word-cards');

const socketPort = 3001;

// Game state management
const gameState = {
  players: new Map(), // playerId -> { id, name, team, status, socketId }
  teams: {
    'Team A': { members: [], score: 0 },
    'Team B': { members: [], score: 0 },
    'Team C': { members: [], score: 0 }
  },
  currentCard: null,
  gamePhase: 'waiting', // waiting, card-display, speaking, cooldown
  currentSpeaker: null,
  cardTimer: null,
  cardTimeRemaining: 0
};

// Helper functions
function getGameStateForClients() {
  return {
    players: Array.from(gameState.players.values()).map(p => ({
      id: p.id,
      name: p.name,
      team: p.team,
      status: p.status
    })),
    teams: gameState.teams,
    currentCard: gameState.currentCard,
    gamePhase: gameState.gamePhase,
    currentSpeaker: gameState.currentSpeaker,
    cardTimeRemaining: gameState.cardTimeRemaining
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
      
      console.log(`🎤 ${player.name} claimed the word!`);
      
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

  // Handle admin controls for starting game/cards
  socket.on('start-game', () => {
    console.log('🎮 Starting new game with first card');
    startNewCard(io);
  });

  socket.on('next-card', () => {
    console.log('⏭️ Admin requested next card');
    startNewCard(io);
  });

  socket.on('stop-game', () => {
    console.log('⏹️ Game stopped by admin');
    stopCardTimer();
    gameState.gamePhase = 'waiting';
    gameState.currentCard = null;
    gameState.currentSpeaker = null;
    gameState.cardTimeRemaining = 0;
    broadcastGameState(io);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
    
    // Find and remove player
    const player = Array.from(gameState.players.values()).find(p => p.socketId === socket.id);
    if (player) {
      const wasSpeaking = gameState.currentSpeaker === player.id;
      
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
        
        // Reset speaking state and return to card display
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