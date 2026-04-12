# Coinfy - BTC Trade Idea Card

A premium cryptocurrency trade idea card component built for Melanion Capital's technical interview assignment. Features real-time BTC price tracking with live WebSocket connection to Binance and a polished glassmorphism UI.

## Features

- **Live Price Tracking** - Real-time BTC/USDT prices via Binance WebSocket API
- **Interactive Chart** - Area chart with 60-minute price history using Recharts
- **Human-Readable Trade Ideas** - "BTC will reach $95,000 in 7 days" format
- **Premium Glassmorphism Design** - Modern liquid glass UI with backdrop blur effects
- **Responsive Layout** - Works seamlessly on desktop and mobile devices
- **Live Indicator** - Pulsing animation when price updates
- **SSR + Client Hydration** - Server-side rendering for instant paint, client-side WebSocket for live data

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Charts:** Recharts with shadcn/ui chart components
- **WebSocket:** react-use-websocket
- **Fonts:** Inter (UI), JetBrains Mono (numbers)

## Architecture

```
lib/
  ├── types.ts                       # TypeScript interfaces
  ├── config.ts                      # Environment configuration
  ├── data/
  │   └── tradeIdeas.ts             # Mock data (simulates backend)
  ├── services/
  │   └── tradeIdeasService.ts      # Data access layer
  └── hooks/
      └── useBTCPrice.ts            # WebSocket custom hook

components/
  ├── tradeIdeaCard.tsx             # App-specific main card component
  ├── core/
  │   └── livePriceChart.tsx        # Reusable chart component
  └── ui/
      └── chart.tsx                 # shadcn chart primitives

app/
  ├── layout.tsx                    # Root layout with fonts & metadata
  └── page.tsx                      # Home page (async server component)
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd coinfy
```

2. Install dependencies:
```bash
npm install
```

3. Install shadcn chart component:
```bash
npx shadcn@latest add chart
```

4. Create environment file:
```bash
cp .env.local.example .env.local
```

5. Update `.env.local` with your configuration:
```env
NEXT_PUBLIC_BINANCE_WS_URL=wss://stream.binance.com:9443/ws/btcusdt@kline_1m
NEXT_PUBLIC_MAX_PRICE_HISTORY=60
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the trade idea card in action.

### Build

```bash
npm run build
npm start
```

## Deployment

This project is optimized for deployment on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

**Environment Variables:**
Make sure to add the environment variables from `.env.local.example` to your Vercel project settings.

## Design Decisions

### Glassmorphism UI
- Backdrop blur for depth and premium feel
- Semi-transparent layers create visual hierarchy
- Gradient background with purple/blue/cyan color scheme
- Premium fonts: Inter for readability, JetBrains Mono for numbers

### Architecture Patterns
- **Services Layer:** Separates data access from components, easy to swap mock data with real API
- **Custom Hooks:** `useBTCPrice` encapsulates WebSocket logic and state management
- **SSR + Client Components:** Trade card shell renders server-side for instant paint, chart mounts client-side for interactivity
- **Environment Config:** All configurable values in env files for flexibility across environments

### WebSocket Implementation
- Auto-reconnect on disconnect (3-second interval, 10 attempts)
- Rolling 60-point price history (1 hour of 1-minute candles)
- Efficient state updates to prevent memory leaks
- Connection status tracking for user feedback

### Chart Features
- Current price line (solid)
- Target price line (dashed)
- Gradient fill under price curve
- Dynamic Y-axis domain based on price range
- Responsive tooltips with formatted values

## Project Structure

```
coinfy/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── tradeIdeaCard.tsx         # App-specific component
│   ├── core/
│   │   └── livePriceChart.tsx    # Reusable core component
│   └── ui/
│       ├── chart.tsx
│       └── ...
├── lib/
│   ├── config.ts
│   ├── types.ts
│   ├── utils.ts
│   ├── data/
│   │   └── tradeIdeas.ts
│   ├── hooks/
│   │   └── useBTCPrice.ts
│   └── services/
│       └── tradeIdeasService.ts
├── .env.local
├── .env.local.example
├── package.json
├── tsconfig.json
└── README.md
```

### Component Organization

- **components/** - App-specific components
- **components/core/** - General components that can be copied and pasted in other projects
- **components/ui/** - Pure UI components like shadcn components

## Future Enhancements

- Add multiple trade ideas with carousel
- Historical performance tracking
- Price alerts and notifications
- Multiple cryptocurrency support
- User authentication and saved ideas
- Backend API integration
- Advanced charting (candlestick, volume)
- Trade execution integration

## License

MIT