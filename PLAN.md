# Wine Blind Tasting PWA - Implementation Plan

## Project Overview

A Progressive Web App for hosting wine blind tasting events with no backend or database. Uses peer-to-peer WebRTC connections for real-time communication between host and participants.

**Timeline**: 2 days
**Target Date**: Ready by January 11, 2026

---

## Technical Architecture

### Tech Stack
- **Frontend Framework**: React 18 + Vite + TypeScript
- **State Management**: Zustand with localStorage persistence
- **Peer-to-Peer Communication**: PeerJS (WebRTC)
- **Styling**: Tailwind CSS
- **QR Code Generation**: qrcode.react
- **PWA Support**: Vite PWA plugin

### How It Works (No Backend)
1. **Host device acts as the coordinator** using WebRTC peer connections
2. Host creates event → starts peer connection → generates QR code with peer ID
3. Participants scan QR → establish direct P2P connection to host device
4. All event data stored in host's localStorage
5. Participant answers sent directly to host via WebRTC
6. Host calculates points and broadcasts results to all participants

---

## Event Flow

### Phase 1: Setup
1. Host creates event
   - Adds 5-6 wines (name, year, price)
   - Defines 5-6 price ranges
   - System generates 3 randomized orders:
     - Original tasting order (sequential)
     - Display glass order (randomized labels A, B, C...)
     - Bottle reveal order (randomized labels)

### Phase 2: Joining
1. Host shares QR code (displayed on screen)
2. Participants scan QR or manually enter event code
3. Participants enter their name
4. Real-time participant list updates on host screen

### Phase 3: Tasting (Host Controlled)
1. Host pours samples sequentially
2. Participants take notes (outside the app)
3. Host advances to next round when ready

### Phase 4: Round 1 - Display Glass Matching
1. Host pours display glasses labeled A, B, C...
2. Participants submit: Which label matches which tasting order?
3. Example: "Glass A was the 3rd wine I tasted"
4. **1 point per correct match**

### Phase 5: Round 2 - Bottle Matching
1. Host reveals bottles with labels
2. Participants submit: Which bottle label matches which tasting order?
3. **1 point per correct match**

### Phase 6: Round 3 - Price Range Guessing
1. Participants select price range for each wine
2. Based on predefined ranges from host
3. **1 point per correct range**

### Phase 7: Results
1. Host presses "Calculate Results"
2. System calculates points: (wines × 2 for matching) + wines for prices = wines × 3 total
3. Leaderboard displayed to all participants
4. Each participant sees their detailed score

---

## Data Models

```typescript
// Stored in host's localStorage
interface Event {
  id: string;
  peerId: string;              // Host's WebRTC peer ID
  wines: Wine[];
  displayOrder: number[];      // Randomized indices for display glasses
  bottleOrder: number[];       // Randomized indices for bottles
  priceRanges: PriceRange[];
  status: 'setup' | 'waiting' | 'displayRound' | 'bottleRound' | 'priceRound' | 'results';
  createdAt: number;
}

interface Wine {
  id: string;
  name: string;
  year?: string;
  price: number;
}

interface PriceRange {
  id: string;
  label: string;               // "€0-10", "€10-20", etc.
  min: number;
  max: number;
}

interface Participant {
  id: string;
  name: string;
  peerId: string;
  displayAnswers: Record<string, number>;  // {"A": 2, "B": 0, ...} label → tasting order
  bottleAnswers: Record<string, number>;   // Same structure
  priceAnswers: Record<number, string>;    // {0: "rangeId1", 1: "rangeId2", ...} wine index → range id
  points: number;
  connectedAt: number;
}
```

---

## PeerJS Message Protocol

### Messages: Participant → Host

```typescript
// Join event
{
  type: 'JOIN',
  participantId: string,
  name: string,
  peerId: string
}

// Submit round answers
{
  type: 'SUBMIT_DISPLAY',
  participantId: string,
  answers: Record<string, number>  // label → tasting order
}

{
  type: 'SUBMIT_BOTTLE',
  participantId: string,
  answers: Record<string, number>
}

{
  type: 'SUBMIT_PRICE',
  participantId: string,
  answers: Record<number, string>  // wine index → range id
}
```

### Messages: Host → Participant

```typescript
// Send event details (without wine info)
{
  type: 'EVENT_INFO',
  wineCount: number,
  displayLabels: string[],        // ["A", "B", "C", "D", "E"]
  bottleLabels: string[],
  priceRanges: PriceRange[],
  currentRound: string
}

// Update current round
{
  type: 'ROUND_CHANGE',
  round: 'waiting' | 'displayRound' | 'bottleRound' | 'priceRound' | 'results'
}

// Broadcast results
{
  type: 'RESULTS',
  leaderboard: Array<{
    name: string,
    points: number,
    displayCorrect: number,
    bottleCorrect: number,
    priceCorrect: number
  }>,
  yourScore: {
    points: number,
    displayCorrect: number,
    bottleCorrect: number,
    priceCorrect: number
  }
}
```

---

## Implementation Phases

### Phase 1: Project Setup (2 hours)
**Tasks:**
- [x] Initialize Vite React TypeScript project
- [ ] Install dependencies:
  - zustand
  - peerjs
  - qrcode.react
  - @types/qrcode.react
  - tailwindcss + plugins
  - react-router-dom
  - vite-plugin-pwa
- [ ] Configure Tailwind CSS
- [ ] Set up basic routing structure
- [ ] Configure PWA manifest and service worker

**Deliverable**: Running app with routing skeleton

---

### Phase 2: Host Interface (5 hours)

#### 2.1 Event Setup Form
**Tasks:**
- [ ] Create wine input form (name, year, price)
- [ ] Add/remove wines dynamically (5-6 wines)
- [ ] Create price range form (5-6 ranges with min/max)
- [ ] Generate random display and bottle orders
- [ ] Store event in localStorage
- [ ] Initialize PeerJS host connection

**Deliverable**: Host can create event with wines and price ranges

#### 2.2 Host Dashboard
**Tasks:**
- [ ] Display QR code with peer ID
- [ ] Show event code for manual entry
- [ ] Real-time participant list with connection status
- [ ] Round control buttons (advance to next round)
- [ ] Current round status display
- [ ] Show wine details in host view

**Deliverable**: Host dashboard showing participants and controls

#### 2.3 Results Management
**Tasks:**
- [ ] View submitted answers from all participants
- [ ] Calculate points algorithm:
  - Compare displayAnswers with actual displayOrder
  - Compare bottleAnswers with actual bottleOrder
  - Compare priceAnswers with wine.price in ranges
- [ ] Generate leaderboard sorted by points
- [ ] Broadcast results to all participants
- [ ] Display detailed breakdown per participant

**Deliverable**: Host can calculate and view results

---

### Phase 3: Participant Interface (4 hours)

#### 3.1 Join Flow
**Tasks:**
- [ ] QR code scanner (or manual peer ID entry)
- [ ] Connect to host via PeerJS
- [ ] Name entry form
- [ ] Send JOIN message to host
- [ ] Wait for event info from host
- [ ] Show connection status

**Deliverable**: Participants can join event

#### 3.2 Answer Forms
**Tasks:**
- [ ] Display Round: Dropdown/select for each label (A→1st, B→3rd, etc.)
- [ ] Bottle Round: Same UI, different labels
- [ ] Price Round: Dropdown for each wine position
- [ ] Form validation (ensure all answered)
- [ ] Submit button sends answers to host
- [ ] Confirmation/waiting state after submission

**Deliverable**: Participants can submit answers for all rounds

#### 3.3 Results View
**Tasks:**
- [ ] Display personal score breakdown
- [ ] Show full leaderboard
- [ ] Highlight correct/incorrect answers
- [ ] Celebration animation for winner

**Deliverable**: Participants see results

---

### Phase 4: Core Services (3 hours)

#### 4.1 PeerJS Service
**Tasks:**
- [ ] Initialize peer connection (host)
- [ ] Connect to peer (participant)
- [ ] Handle connection events (open, close, error)
- [ ] Send/receive typed messages
- [ ] Reconnection logic
- [ ] Connection quality indicators

**Deliverable**: Reliable P2P communication

#### 4.2 State Management
**Tasks:**
- [ ] Zustand host store with localStorage persistence
- [ ] Zustand participant store (session only)
- [ ] Actions for all event operations
- [ ] Computed values (points, leaderboard)

**Deliverable**: Centralized state management

#### 4.3 Utilities
**Tasks:**
- [ ] `randomizeOrder()`: Shuffle array for display/bottle orders
- [ ] `generateLabels()`: Create A, B, C... labels
- [ ] `calculatePoints()`: Score calculation algorithm
- [ ] `findPriceRange()`: Match price to range
- [ ] `generateEventCode()`: Short 6-digit code

**Deliverable**: Reusable utility functions

---

### Phase 5: Polish & PWA (2 hours)

**Tasks:**
- [ ] Mobile-responsive design (test on actual devices)
- [ ] Loading states for all async operations
- [ ] Error handling and user-friendly messages
- [ ] Offline detection and warnings
- [ ] Connection status indicators
- [ ] PWA install prompt
- [ ] Test on iOS Safari and Android Chrome
- [ ] Add app icons and splash screens
- [ ] Haptic feedback for mobile
- [ ] Keyboard navigation support

**Deliverable**: Production-ready PWA

---

## File Structure

```
blind-tasting/
├── public/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── host/
│   │   │   ├── EventSetup.tsx           # Wine & price range form
│   │   │   ├── HostDashboard.tsx        # Main host view
│   │   │   ├── ParticipantList.tsx      # Connected participants
│   │   │   ├── ConnectionQR.tsx         # QR code display
│   │   │   ├── RoundControls.tsx        # Advance round buttons
│   │   │   └── HostResults.tsx          # Results & leaderboard
│   │   ├── participant/
│   │   │   ├── JoinEvent.tsx            # QR scan + name entry
│   │   │   ├── WaitingRoom.tsx          # Before rounds start
│   │   │   ├── DisplayRoundForm.tsx     # Glass matching form
│   │   │   ├── BottleRoundForm.tsx      # Bottle matching form
│   │   │   ├── PriceRoundForm.tsx       # Price range selection
│   │   │   └── ParticipantResults.tsx   # Personal results
│   │   └── shared/
│   │       ├── Leaderboard.tsx          # Sorted participant list
│   │       ├── LoadingSpinner.tsx
│   │       └── ConnectionStatus.tsx     # Online/offline indicator
│   ├── store/
│   │   ├── hostStore.ts                 # Zustand store for host
│   │   └── participantStore.ts          # Zustand store for participant
│   ├── services/
│   │   └── peerService.ts               # PeerJS wrapper
│   ├── types/
│   │   └── index.ts                     # TypeScript interfaces
│   ├── utils/
│   │   ├── randomize.ts                 # Order shuffling
│   │   ├── scoring.ts                   # Points calculation
│   │   ├── labels.ts                    # Generate A, B, C...
│   │   └── validation.ts                # Form validation
│   ├── App.tsx                          # Root component with routing
│   ├── main.tsx                         # Entry point
│   └── index.css                        # Tailwind imports
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
├── PLAN.md                              # This file
└── README.md
```

---

## Development Timeline

### Day 1 (January 9, 2026)
- **09:00 - 11:00**: Phase 1 - Project setup
- **11:00 - 13:00**: Phase 2.1 - Event setup form
- **14:00 - 16:00**: Phase 2.2 - Host dashboard
- **16:00 - 18:00**: Phase 4.1 - PeerJS service
- **18:00 - 20:00**: Phase 3.1 - Participant join flow

### Day 2 (January 10, 2026)
- **09:00 - 11:00**: Phase 3.2 - Answer forms
- **11:00 - 13:00**: Phase 4.2/4.3 - State & utilities
- **14:00 - 16:00**: Phase 2.3 - Results calculation
- **16:00 - 18:00**: Phase 3.3 - Participant results
- **18:00 - 20:00**: Phase 5 - Polish & testing

### Day 3 (Buffer - January 11, 2026)
- Final testing on real devices
- Bug fixes
- Performance optimization
- Ready for event!

---

## Testing Strategy

### Unit Testing (Optional - Time Permitting)
- Scoring algorithm
- Order randomization
- Price range matching

### Manual Testing (Critical)
1. **Host Flow**
   - Create event with 5 wines
   - Verify QR code generation
   - Check localStorage persistence
   - Test round advancement
   - Verify results calculation

2. **Participant Flow**
   - Join via QR code
   - Test all three answer forms
   - Verify answer submission
   - Check results display

3. **P2P Communication**
   - Test with 2+ devices on same WiFi
   - Verify reconnection on network issues
   - Test with poor connection
   - Test participant disconnect/reconnect

4. **Edge Cases**
   - Host closes app mid-event
   - Participant submits duplicate answers
   - Network interruption during submission
   - Browser refresh scenarios

### Device Testing
- [ ] iOS Safari (iPhone)
- [ ] Android Chrome
- [ ] Desktop Chrome
- [ ] Desktop Safari
- [ ] Desktop Firefox

---

## Deployment

### Option 1: GitHub Pages (Recommended)
- Free static hosting
- HTTPS by default (required for PWA)
- Simple deployment: `npm run build` → `gh-pages` branch

### Option 2: Vercel
- Zero config deployment
- Automatic HTTPS
- Fast global CDN

### Option 3: Netlify
- Drag & drop deploy
- Custom domain support

**Note**: Since there's no backend, any static hosting works!

---

## Future Enhancements (Post-Event)

### Phase 2 Features
- [ ] Multiple events storage
- [ ] Event history
- [ ] Export results to PDF/CSV
- [ ] Photo upload for wines
- [ ] Tasting notes in app
- [ ] Timer per round
- [ ] Custom scoring weights

### Phase 3 Features
- [ ] Vivino API integration (wine data)
- [ ] Wine rating after reveal
- [ ] Personal wine library
- [ ] Event templates
- [ ] Multi-language support
- [ ] Dark mode

---

## Known Limitations

1. **WebRTC Dependency**: Requires both host and participants on same network
2. **Host Device Critical**: If host disconnects, event is paused
3. **No Cloud Sync**: Data only on host device
4. **Browser Support**: Requires modern browser with WebRTC support
5. **Simultaneous Events**: Only one active event per host device

---

## Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "zustand": "^4.4.7",
    "peerjs": "^1.5.2",
    "qrcode.react": "^3.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "@vitejs/plugin-react": "^5.1.2",
    "typescript": "^5.3.3",
    "vite": "^7.2.5",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "vite-plugin-pwa": "^0.17.4"
  }
}
```

---

## Success Criteria

- [ ] Host can create event with 5-6 wines and price ranges
- [ ] Participants can join via QR code
- [ ] All 3 answer rounds work correctly
- [ ] Points calculated accurately
- [ ] Leaderboard displays correctly
- [ ] Works on mobile devices (iOS & Android)
- [ ] Installable as PWA
- [ ] No crashes during 2-hour event
- [ ] Supports at least 20 participants

---

## Questions & Decisions

### Answered
- ✅ No backend/database required
- ✅ Local WiFi only (no internet needed)
- ✅ QR code for joining
- ✅ Host controls all rounds

### To Decide During Development
- Label format for glasses/bottles (A,B,C vs 1,2,3)
- Allow participants to edit submitted answers?
- Show real-time submission count to host?
- Allow late joiners after rounds start?

---

**Last Updated**: January 9, 2026
**Status**: Ready to implement
