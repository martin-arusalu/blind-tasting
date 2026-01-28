# Wine Blind Tasting

## Overview
A React-based web application for hosting interactive wine blind tasting events with real-time scoring. Uses PeerJS for peer-to-peer communication between host and participants.

## Tech Stack
- **Frontend**: React 19 with TypeScript
- **Bundler**: Vite (rolldown-vite)
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **P2P Communication**: PeerJS
- **Routing**: React Router DOM v7

## Project Structure
```
src/
  components/
    host/         - Host-related components (EventSetup, HostDashboard)
    participant/  - Participant components (JoinEvent, ParticipantView)
  services/       - PeerJS service for P2P connections
  store/          - Zustand stores (hostStore, participantStore)
  types/          - TypeScript type definitions
  utils/          - Utility functions (scoring, ID generation, labels)
```

## Development
- Run: `npm run dev` (starts Vite dev server on port 5000)
- Build: `npm run build` (outputs to dist/)

## Deployment
Static deployment serving the `dist` folder after running build.

## Recent Changes
- 2026-01-28: Configured for Replit environment (removed GitHub Pages basename, set up port 5000)
