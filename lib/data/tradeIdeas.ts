import { TradeIdea } from "@/lib/types";

export const tradeIdeas: TradeIdea[] = [
  {
    asset: "BTC",
    assetName: "Bitcoin",
    pair: "BTC/USDT",
    direction: "bullish",
    targetPrice: 95000,
    expiryDate: new Date("2026-04-19T20:00:00Z"), // 7 days from now
    potentialReturn: 15.5,
  },
];
