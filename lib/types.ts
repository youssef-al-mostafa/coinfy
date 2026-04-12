export interface TradeIdea {
  asset: string;
  assetName: string;
  pair: string;
  direction: "bullish" | "bearish";
  targetPrice: number;
  expiryDate: Date;
  potentialReturn?: number;
}

export interface PricePoint {
  timestamp: number;
  price: number;
}

// Binance 24hr Ticker WebSocket Response
export interface Binance24hrTicker {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  p: string; // Price change
  P: string; // Price change percent
  w: string; // Weighted average price
  x: string; // First trade(F)-1 price (first trade before the 24hr rolling window)
  c: string; // Last price
  Q: string; // Last quantity
  b: string; // Best bid price
  B: string; // Best bid quantity
  a: string; // Best ask price
  A: string; // Best ask quantity
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Total traded base asset volume
  q: string; // Total traded quote asset volume
  O: number; // Statistics open time
  C: number; // Statistics close time
  F: number; // First trade ID
  L: number; // Last trade Id
  n: number; // Total number of trades
}

// Binance Kline (Candlestick) Data
export interface BinanceKline {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteVolume: string;
  trades: number;
  takerBuyBaseVolume: string;
  takerBuyQuoteVolume: string;
  ignore: string;
}

// Simplified chart data point
export interface ChartDataPoint {
  timestamp: number;
  price: number;
  time: string;
}

// 24h Price Stats
export interface PriceStats {
  currentPrice: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  high24h: number;
  low24h: number;
}
