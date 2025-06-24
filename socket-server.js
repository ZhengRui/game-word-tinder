const { createServer } = require('http');
const { Server } = require('socket.io');

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
  currentSpeaker: null
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
    currentSpeaker: gameState.currentSpeaker
  };
}

function broadcastGameState(io) {
  const clientState = getGameStateForClients();
  io.emit('game-state-update', clientState);
  console.log('Broadcasting game state to all clients');
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

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
    
    // Find and remove player
    const player = Array.from(gameState.players.values()).find(p => p.socketId === socket.id);
    if (player) {
      // Remove from team
      const teamMembers = gameState.teams[player.team].members;
      const memberIndex = teamMembers.indexOf(player.id);
      if (memberIndex > -1) {
        teamMembers.splice(memberIndex, 1);
      }
      
      // Remove from players
      gameState.players.delete(player.id);
      
      console.log(`👋 Player ${player.name} left the game`);
      
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