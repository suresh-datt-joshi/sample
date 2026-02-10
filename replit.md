# JumpIn - AI Meeting Assistant

## Overview
JumpIn is a React-based meeting assistant dashboard that helps manage and join meetings across platforms like Google Meet and Zoom. It provides a unified dashboard with one-click joining.

## Tech Stack
- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS (via CDN), Font Awesome icons
- **Language**: TypeScript

## Project Structure
```
/
├── index.html          # Entry HTML
├── index.tsx           # React entry point
├── index.css           # Global styles
├── App.tsx             # Main App component
├── types.ts            # TypeScript type definitions
├── components/
│   ├── Dashboard.tsx
│   ├── MeetingCard.tsx
│   ├── NotificationCenter.tsx
│   ├── Platforms.tsx
│   ├── ScheduleMeeting.tsx
│   ├── Sidebar.tsx
│   └── SourceSync.tsx
├── services/
│   └── geminiService.ts  # (currently empty/unused)
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript config
└── package.json        # Dependencies
```

## Development
- **Dev server**: `npm run dev` (runs on port 5000)
- **Build**: `npm run build` (outputs to `dist/`)
- **Deployment**: Static site deployment from `dist/`
