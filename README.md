# 🍷 Wine Blind Tasting PWA

A Progressive Web App for hosting interactive wine blind tasting events with real-time peer-to-peer scoring.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (Node 25+ required)
nvm use 25
npm run dev

# Expose on local network for testing with multiple devices
npm run dev -- --host
```

## Usage

### As Host:
1. Click "Host Event"
2. Add 5-6 wines with prices
3. Set up price ranges
4. Share QR code with participants
5. Control rounds and view results

### As Participant:
1. Scan QR code or enter event code
2. Submit answers for each round
3. View your score and leaderboard

## Important

⚠️ **All devices must be on the same WiFi network** for PeerJS connections to work.

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- PeerJS (WebRTC)
- Zustand + React Router

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
