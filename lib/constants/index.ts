export const ANIMATION_DURATIONS = {
  priceFlash: 300,
  toastDisplay: 2000,
  chartAnimation: 500,
} as const;

export const TIMEFRAMES = [
  { value: "1h" as const, label: "1H", interval: "1h", limit: 48 },
  { value: "4h" as const, label: "4H", interval: "4h", limit: 48 },
  { value: "1d" as const, label: "1D", interval: "1d", limit: 30 },
  { value: "1w" as const, label: "1W", interval: "1w", limit: 20 },
] as const;

export const EXPIRY_OPTIONS = [
  { value: 7, label: "7 days" },
  { value: 14, label: "14 days" },
  { value: 30, label: "30 days" },
] as const;

export const DIRECTION_ARROWS = {
  bullish: "▲",
  bearish: "▼",
} as const;

export const WEBSOCKET_CONFIG = {
  reconnectInterval: 3000,
  reconnectAttempts: 10,
} as const;

export const CHART_CONFIG = {
  targetRangeTolerance: 0.15,
  yAxisPadding: 0.15,
  minYAxisPadding: 0.1,
  strokeWidth: 2.5,
  targetLineStrokeWidth: 2,
  gradientStops: {
    start: { offset: "0%", opacity: 0.3 },
    end: { offset: "95%", opacity: 0 },
  },
} as const;
