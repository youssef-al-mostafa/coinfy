"use client";

import { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Binance24hrTicker, PriceStats } from "@/lib/types";
import { config } from "@/lib/config";
import { WEBSOCKET_CONFIG } from "@/lib/constants";

export function useBinancePrice() {
  const [stats, setStats] = useState<PriceStats>({
    currentPrice: 0,
    priceChange24h: 0,
    priceChangePercent24h: 0,
    high24h: 0,
    low24h: 0,
  });

  const [shouldConnect, setShouldConnect] = useState(false);

  useEffect(() => {
    setShouldConnect(true);
  }, []);

  const { lastJsonMessage, readyState } = useWebSocket<Binance24hrTicker>(
    shouldConnect ? (config.binance.wsUrl || null) : null,
    {
      shouldReconnect: () => true,
      reconnectInterval: WEBSOCKET_CONFIG.reconnectInterval,
      reconnectAttempts: WEBSOCKET_CONFIG.reconnectAttempts,
    }
  );

  useEffect(() => {
    if (lastJsonMessage) {
      setStats({
        currentPrice: parseFloat(lastJsonMessage.c),
        priceChange24h: parseFloat(lastJsonMessage.p),
        priceChangePercent24h: parseFloat(lastJsonMessage.P),
        high24h: parseFloat(lastJsonMessage.h),
        low24h: parseFloat(lastJsonMessage.l),
      });
    }
  }, [lastJsonMessage]);

  return {
    ...stats,
    isConnected: readyState === ReadyState.OPEN,
  };
}
