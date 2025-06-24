# Word Tinder - Implementation Plan

## 🎯 **Next Implementation Phase: Core Real-time Functionality**

### **✅ Phase 1: Foundation (COMPLETED)**
1. **✅ Complete Socket.io Server Implementation**
   - ✅ Replaced API route with proper WebSocket server (server.js)
   - ✅ Set up proper event handlers for game events
   - ✅ Implemented connection management and CORS handling
   - ✅ Added comprehensive logging and error handling

2. **✅ Real-time Player Registration System**
   - ✅ Connected registration UI to backend with validation
   - ✅ Store player data (name, team) with conflict resolution
   - ✅ Real-time registration updates broadcast to display screen
   - ✅ Handle player disconnections and cleanup gracefully

### **Phase 2: Game Core (Priority 3-4)**
3. **Word Card Management System**
   - Create a word card database/array with topics and keywords
   - Implement random card selection logic
   - Add card progression and state management
   - Create card content that fits the Toastmasters theme

4. **Claiming Mechanism**
   - Implement first-come-first-served claim processing
   - Add real-time claim broadcasting to all clients
   - Handle simultaneous claims and conflicts
   - Update player states (available → speaking → cooldown)

### **Phase 3: Timing & Flow (Priority 5)**
5. **Timer Systems**
   - 10-second card display timer with auto-skip
   - 1-minute speech countdown timer
   - 3-minute cooldown timers per player
   - Automatic state transitions between game phases

### **Phase 4: Game Polish**
6. **Visual Transitions & Feedback**
   - 3-2-1 countdown animations
   - Real-time state updates on both screens
   - Visual feedback for claims and state changes

### **Phase 5: Scoring & Advanced Features**
7. **Basic Scoring System**
8. **Optional enhancements** (leaderboard, sound effects, etc.)

---

## 🎯 **NEXT: Phase 2 Implementation**

**Ready to implement:** Word Card Management System
- Create word card database with Toastmasters-appropriate topics
- Implement random card selection and display
- Add card progression logic
- Connect card system to claiming mechanism

---

## 📋 **Phase 1 Detailed Implementation Plan (COMPLETED)**

### **Step 1.1: Fix Socket.io Server Setup**
- [ ] Replace the current API route with a proper Socket.io server
- [ ] Create a standalone server file for Socket.io
- [ ] Set up proper CORS and connection handling
- [ ] Add basic connection/disconnection logging
- [ ] Test basic WebSocket connectivity

### **Step 1.2: Game State Management**
- [ ] Create a global game state object to store:
  - Active players with their teams and status
  - Current game phase (waiting, card-display, speaking, etc.)
  - Current word card data
  - Team scores
- [ ] Implement state update functions
- [ ] Add state broadcasting to all connected clients

### **Step 1.3: Player Registration Backend**
- [ ] Create registration event handler
- [ ] Validate player data (name, team selection)
- [ ] Store player in game state
- [ ] Broadcast updated player list to display screen
- [ ] Handle duplicate names and team limits

### **Step 1.4: Frontend Socket.io Integration**
- [ ] Add Socket.io client to both display and play pages
- [ ] Connect registration form to Socket.io events
- [ ] Update display page to show real players instead of mock data
- [ ] Add connection status indicators
- [ ] Handle connection errors gracefully

### **Step 1.5: Real-time Updates**
- [ ] Implement player list updates on display screen
- [ ] Show real-time team member count
- [ ] Update player status indicators
- [ ] Add join/leave notifications

### **Step 1.6: Testing & Validation**
- [ ] Test multiple players joining different teams
- [ ] Verify real-time updates across devices
- [ ] Test disconnection/reconnection scenarios
- [ ] Validate data persistence during session

### **Technical Requirements for Phase 1:**
- Socket.io server running on separate port (3001)
- Client-side Socket.io integration
- In-memory game state management
- Real-time event broadcasting
- Error handling and connection management

**Expected Outcome**: After Phase 1, multiple players should be able to register on their mobile devices and see their names appear in real-time on the main display screen, with proper team organization and status tracking.