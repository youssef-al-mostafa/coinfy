# Trade Idea Card 📈

[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC.svg)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2-ff7300.svg)](https://recharts.org/)

A polished UI component that presents a BTC options trade as a clear, human-readable idea designed for both desktop and mobile.

> **BTC will reach $95,000 in 7 days**

Instead of showing raw trading parameters, the card communicates the trade thesis at a glance with real-time price data and an interactive chart.

## ✨ Features

- **Trade Thesis Display**: Human-readable headline summarizing the options trade (asset, direction, target, timeframe)
- **Real-Time Price Feed**: Live BTC/USDT price via Binance WebSocket with 24h change indicator
- **Interactive Price Chart**: Line chart with gradient fill showing real price movement across multiple timeframes (1H, 4H, 1D, 1W)
- **Target Price Visualization**: Dynamic target line on chart when in range, floating label when out of range
- **Distance to Target**: Live calculation showing how far the current price is from the strike price
- **Configurable Trade Parameters**: Settings overlay to adjust direction (bullish/bearish), target price, and expiry
- **Expiry Countdown**: Live countdown timer updating every second
- **Responsive Design**: Optimized layout for desktop and mobile viewports
- **Dark Theme**: Premium fintech aesthetic with emerald accent palette

## 🛠️ Technologies Used

- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Type Safety**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Charts**: Recharts 2
- **Data Source**: Binance WebSocket & REST API
- **Deployment**: Vercel

## 📦 Prerequisites

- Node.js (>= 18.x)
- npm or yarn

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/trade-idea-card.git
cd trade-idea-card

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📁 Project Structure

```
  coinfy/
  ├── app/
  │   ├── page.tsx              # Main page — renders TradeIdeaCard centered with background
  │   ├── layout.tsx            # Root layout with metadata and suppressHydrationWarning
  │   ├── globals.css           # Global styles, Tailwind imports, and dark theme
  │   └── favicon.ico           # App icon
  │
  ├── components/
  │   ├── app/
  │   │   ├── TradeIdeaCard.tsx     # Main card component with live price, settings, and CTA
  │   │   └── PriceChart.tsx        # Recharts area chart with timeframe selector and target line
  │   └── ui/                       #shadcn/ui components
  │
  ├── lib/
  │   ├── hooks/
  │   │   ├── useBinancePrice.ts    # WebSocket hook for live price & 24h ticker data
  │   │   └── useBinanceKlines.ts   # REST API hook for historical kline/candlestick data
  │   ├── constants/
  │   │   ├── index.ts              # Timeframes, animation durations, WebSocket & chart config
  │   │   └── colors.ts             # Color palette (bullish, bearish, glass, borders)
  │   ├── data/
  │   │   └── tradeIdeas.ts         # Mock trade idea data
  │   ├── services/
  │   │   └── tradeIdeasService.ts  # Trade ideas business logic/service layer
  │   ├── config.ts                 # Environment variable configuration with getters
  │   ├── types.ts                  # TypeScript interfaces (TradeIdea, BinanceKline, etc.)
  │   └── utils.ts                  # Currency, percentage, countdown formatters
  │
  ├── public/
  │   └── images/                   # Project images
  ├── .env.local                    # Environment variables
  ├── .env.local.example            # Example env file template
  ├── components.json               # shadcn/ui configuration
  ├── eslint.config.mjs             # ESLint configuration
  ├── package.json                  # Dependencies and scripts
  ├── postcss.config.mjs            # PostCSS configuration
  ├── tsconfig.json                 # TypeScript configuration
  └── README.md                     # Project documentation

```

## 📊 Data Sources

- **Live Price**: Binance WebSocket stream (`btcusdt@ticker`) for real-time price, 24h high/low, and 24h change
- **Historical Data**: Binance REST API (`/api/v3/klines`) for OHLCV candle data across multiple timeframes

## 🎨 Design Decisions

- **Dark theme** chosen to match industry-standard trading interfaces and reduce eye strain
- **Chart Y-axis scaling** adapts per timeframe — short timeframes (1H, 4H) scale to price data range for detail, longer timeframes (1D, 1W) include the target line when naturally in range
- **Distance to target** shown as both absolute value and percentage for quick comprehension
- **Settings overlay** tucked behind a gear icon to keep the default card clean while demonstrating component configurability


## 📬 Contact

- Youssef Al Mostafa — [LinkedIn](https://linkedin.com/in/youssef-al-mostafa)
- [youssefalmostafa2@gmail.com](mailto:youssefalmostafa2@gmail.com)