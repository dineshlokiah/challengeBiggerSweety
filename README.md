# challengeandgrow

A lightweight, mobile-responsive web application for gamified math learning through timed question marathons.

**Created by Dinesh Lokiah**

> 🔒 We do not send your data to our servers. All data stays on your device.

---

## Project Structure

```
challenge-bigger-sweety/
├── src/
│   ├── components/       # React components
│   ├── utils/           # Utility functions and helpers
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Root application component
│   └── main.tsx         # Application entry point
├── index.html           # HTML template with mobile meta tags
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite bundler configuration
└── README.md           # This file
```

## Features

- Client-side only architecture (no server required)
- Mobile-first responsive design
- Timed question marathons with visual countdown
- Configurable difficulty and volume
- Performance tracking and downloadable reports

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Testing

```bash
npm test
```

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Vitest** - Testing framework
- **fast-check** - Property-based testing

## Requirements

This application validates Requirements 11.1 and 11.2:
- Operates entirely in browser memory (no backend storage)
- No server communication required
- Client-side file generation for reports

## Author

**Dinesh Lokiah**

© 2025 All rights reserved

## License

This project is proprietary software. All rights reserved.
