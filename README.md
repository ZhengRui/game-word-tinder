# 🎤 Word Tinder - Group Showdown

An interactive word game for Toastmasters meetings that encourages spontaneous speaking and teamwork. Participants compete in teams to claim word prompts and deliver 1-minute impromptu speeches.

## 🚀 Quick Start

### Development Setup

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Start the application (requires 2 terminals):**
   
   **Terminal 1 - Socket.io Server:**
   ```bash
   bun run socket-server
   ```
   
   **Terminal 2 - Next.js App:**
   ```bash
   bun dev
   ```

3. **Open the game:**
   - **Main Display:** `http://localhost:3000/display` (for projector)
   - **Player Interface:** `http://localhost:3000/play` (for mobile devices)

## 🎮 How to Play

1. **Setup:** Open the display page on a projector/main screen
2. **Join:** Players open the play page on their mobile devices
3. **Register:** Each player enters their name and selects a team (A, B, or C)
4. **Start Game:** Admin clicks "Start Game" on the display screen
5. **Claim Topics:** When a topic appears with 10-second timer, players race to claim it
6. **Speak:** The first player to claim gets to deliver a 1-minute impromptu speech
7. **Continue:** Game automatically progresses to next topics

## 🔧 Technical Architecture

- **Frontend:** Next.js 15 with TypeScript and Tailwind CSS
- **Real-time:** Socket.io for WebSocket communication
- **State Management:** Centralized game state with real-time broadcasting
- **Ports:** 
  - Next.js app: `http://localhost:3000`
  - Socket.io server: `http://localhost:3001`

## 📊 Implementation Status

### ✅ Completed (Phase 1 & 2)
- Real-time player registration system
- Live team member tracking and display
- Connection management (connect/disconnect/reconnect)
- Game state management with broadcasting
- Word card management system with 30 Toastmasters topics
- 10-second auto-skip timer for cards
- Real-time claiming mechanism (first-come-first-served)
- Speaker identification and disconnect handling
- Responsive UI for both display and mobile interfaces
- Admin controls (Start Game, Next Card, Stop Game)

### 🚧 In Development (Phase 3)
- 1-minute speech timer with auto-progression
- 3-minute cooldown system for players after speaking

### 📋 Planned Features
- Scoring system with team leaderboards
- Visual transitions and animations
- Sound effects for game events
- Admin controls for game flow

## 📁 Project Structure

```
src/
├── app/
│   ├── display/          # Main display screen
│   ├── play/             # Mobile player interface
│   └── page.tsx          # Home/navigation page
├── hooks/
│   └── useSocket.ts      # Socket.io client hook
├── socket-server.js      # Socket.io server
└── ...
```

## 🚀 Deployment Notes

**Current Setup:** Dual server architecture
- **Development:** Run both servers locally
- **Production:** Requires separate hosting for Socket.io server
  - Next.js app → Vercel (recommended)
  - Socket.io server → Railway/Render/Heroku

## 🤝 Contributing

See `status.md` and `TODO.md` for current implementation status and next steps.

## 📄 License

MIT License - Built for Toastmasters communities worldwide! 🎤
