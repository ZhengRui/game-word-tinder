# 🎤 Word Tinder - Group Showdown

A complete real-time multiplayer word game for Toastmasters meetings that encourages spontaneous speaking and teamwork. Teams compete to claim word prompts, deliver 1-minute impromptu speeches, and earn points toward victory!

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
2. **Configure:** Admin clicks "Configure" to customize game settings (teams, timers, points)
3. **Join:** Players open the play page on their mobile devices
4. **Register:** Each player enters their name and selects a team
5. **Start Game:** Admin clicks "Start Game" on the display screen
6. **Claim Topics:** When a topic appears with configurable timer, players race to claim it
7. **Speak:** The first player to claim gets configurable time to deliver an impromptu speech
8. **Score:** Teams earn configurable points per completed speech
9. **Bonus:** During cooldown, admins can award configurable bonus points for creativity
10. **Cooldown:** After speaking, player enters configurable cooldown period
11. **Continue:** Game automatically progresses to next topics with new cards
12. **End Game:** Admin stops game to see final scores and winner announcement

## 🔧 Technical Architecture

- **Frontend:** Next.js 15 with TypeScript and Tailwind CSS
- **Real-time:** Socket.io for WebSocket communication
- **State Management:** Centralized game state with real-time broadcasting
- **Ports:** 
  - Next.js app: `http://localhost:3000`
  - Socket.io server: `http://localhost:3001`

## 📊 Implementation Status

### ✅ **COMPLETE** - Core Game Features (Phase 1-5)
- **Real-time Foundation:** Player registration, team tracking, connection management
- **Word Card System:** 30 Toastmasters topics with random selection and auto-skip
- **Timer Systems:** Configurable card display, speech, and cooldown timers
- **Claiming Mechanism:** Real-time first-come-first-served with validation
- **Scoring System:** Complete team scoring with configurable point values
- **Bonus Points:** Star button awards during cooldown periods
- **Winner Determination:** Automatic winner detection with tie handling
- **Game End:** Modal with final scores and winner announcement
- **Admin Controls:** Start Game, Next Card, Stop Game functionality
- **Responsive UI:** Mobile-optimized interfaces for both display and play modes
- **Game Configuration:** Customizable settings for flexible game setup
  - **Number of teams:** Configurable team count (2-6, default: 2)
  - **Topic display time:** Adjustable card timer (5-60s, default: 10s)
  - **Speech duration:** Customizable speech time (30-300s, default: 60s)
  - **Cooldown period:** Variable cooldown length (60-600s, default: 120s)
  - **Speech points:** Configurable speech scoring (1-10, default: 2)
  - **Bonus points:** Adjustable bonus awards (1-5, default: 1)

### 📋 Optional Features (Phase 6+ - Not Planned)
- Enhanced visual transitions and animations
- Sound effects for game events
- Live audience voting system
- Game session analytics and reporting

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
