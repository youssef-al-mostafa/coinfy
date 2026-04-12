export const COLORS = {
  primary: "#F7931A",

  bullish: {
    primary: "#10b981",
    light: "#6ee7b7",
    dark: "#059669",
  },

  bearish: {
    primary: "#ef4444",
    light: "#f87171",
    dark: "#dc2626",
  },

  text: {
    primary: "#ffffff",
    secondary: "#9ca3af",
    muted: "#6b7280",
  },

  glass: {
    card: "rgba(255, 255, 255, 0.05)",
    modal: "rgba(255, 255, 255, 0.15)",
    modalOverlay: "rgba(0, 0, 0, 0.70)",
    input: "rgba(255, 255, 255, 0.10)",
    button: "rgba(255, 255, 255, 0.10)",
  },

  border: {
    default: "rgba(255, 255, 255, 0.10)",
    light: "rgba(255, 255, 255, 0.20)",
    bullish: "rgba(16, 185, 129, 0.20)",
    bearish: "rgba(239, 68, 68, 0.20)",
  },
} as const;

export const CHART_COLORS = {
  bullish: "#10b981",
  bearish: "#ef4444",
} as const;
