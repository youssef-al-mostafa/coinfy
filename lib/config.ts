/**
 * Client-side configuration
 */
export const config = {
    binance: {
        wsUrl: process.env.NEXT_PUBLIC_BINANCE_WS_URL,
        maxPriceHistory: process.env.NEXT_PUBLIC_MAX_PRICE_HISTORY,
    },
} as const;
