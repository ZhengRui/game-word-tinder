# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Word Tinder** is a real-time multiplayer word game for Toastmasters meetings where teams compete to claim word prompts and deliver impromptu speeches. The game runs for 15 minutes with teams claiming words, giving 1-minute speeches, and earning points.

## Architecture

### Dual-Server Setup
This project requires **two servers running simultaneously**:
- **Next.js App** (port 3000): UI, routing, static content
- **Socket.io Server** (port 3001): Real-time game state and WebSocket communication

### Development Commands
```bash
# Terminal 1 - Socket.io server
bun run socket-server

# Terminal 2 - Next.js app  
bun dev

# Build
bun run build
```

### Key URLs
- **Main Display**: `http://localhost:3000/display` (for projector/large screen)
- **Player Interface**: `http://localhost:3000/play` (for mobile devices)

## Real-time Communication

### Socket.io Architecture
- **Server**: `socket-server.js` - Standalone Socket.io server with CORS for localhost
- **Client Hook**: `src/hooks/useSocket.ts` - Custom React hook managing Socket.io connection
- **Game State**: Centralized server-side state broadcasted to all clients on changes

### Key Socket Events
- `register-player` - Player joins team
- `claim-word` - Player attempts to claim current word card
- `game-state-update` - Server broadcasts state to all clients
- `registration-error` / `claim-error` - Error handling

### Game State Structure
```typescript
{
  players: Player[];  // All registered players
  teams: {
    'Team A': { members: string[], score: number };
    'Team B': { members: string[], score: number }; 
    'Team C': { members: string[], score: number };
  };
  currentCard: any;    // Current word card
  gamePhase: 'waiting' | 'card-display' | 'speaking' | 'cooldown';
  currentSpeaker: string | null;
}
```

## Interface Architecture

### Two Primary Interfaces
1. **Display Interface** (`/display`): Large screen showing game state, teams, current card
2. **Player Interface** (`/play`): Mobile-optimized for player registration and interactions

### UI Patterns
- **Dark theme**: Gray-900 backgrounds throughout
- **Team colors**: Red (Team A), Blue (Team B), Green (Team C)
- **Status indicators**: ✓ (available), 🎤 (speaking), ⏱ (cooldown)
- **Tailwind CSS**: Utility-first styling

## Implementation Status

### ✅ Phase 1, 2, 3 & 4 Complete
- **Real-time Foundation**: Player registration, team tracking, connection management
- **Word Card System**: 30 Toastmasters topics with random selection (word-cards.js)
- **10-Second Timer**: Auto-skip cards if not claimed within time limit
- **Claiming Mechanism**: Real-time first-come-first-served claiming with validation
- **Speech Timer System**: 1-minute countdown starting when player claims topic
- **Cooldown System**: 3-minute individual cooldown timers for players after speaking
- **Auto-Transitions**: Automatic progression between game phases (claim → speak → cooldown → available)
- **Speaker Management**: Clear identification of who claimed (name + team display)
- **Disconnect Handling**: Proper cleanup when speaking player disconnects/refreshes
- **Admin Controls**: Start Game, Next Card, Stop Game buttons on display interface
- **Timer Displays**: Real-time countdown timers on both mobile and display interfaces
- **Button States**: Claim buttons properly disabled with countdown during cooldown
- **Responsive Design**: Mobile-optimized layouts with fixed-height containers
- **Scoring System**: Complete team scoring with 2 points per speech, 1 point per bonus
- **Bonus Points**: Star buttons for creativity awards during cooldown periods
- **Winner Determination**: Automatic winner detection with tie handling
- **Game End Modal**: Final scores display with winner announcement

### 🚧 Phase 5+ Optional Features (Not Planned)
- Enhanced visual transitions and sound effects
- Live leaderboard updates and audience voting system

## Development Notes

### File Structure
- `socket-server.js` - Standalone Socket.io server (not in src/)
- `src/app/display/page.tsx` - Main display interface
- `src/app/play/page.tsx` - Mobile player interface  
- `src/hooks/useSocket.ts` - Socket.io client management
- `game_design.md` - Complete game rules and mechanics
- `TODO.md` - Detailed implementation roadmap

### Deployment Considerations
- **Development**: Both servers run locally
- **Production**: Requires separate hosting
  - Next.js app → Vercel (recommended)
  - Socket.io server → Railway/Render/Heroku
- **CORS**: Currently configured for localhost only

### Testing
- Manual testing by running both servers and opening display + mobile interfaces
- No automated test suite currently implemented

## Game Design Context

Read `game_design.md` for complete game mechanics. Key points:
- 15-minute session with multiple rounds
- Teams compete to claim word prompts first
- 1-minute speeches with 3-minute cooldown periods
- Scoring based on successful claims and speech delivery
- Visual countdown timers and transitions between game phases