"use client";

import { useState, useEffect, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Binance24hrTicker, PriceStats } from "@/lib/types";
import { config } from "@/lib/config";

export function useBinancePrice() {
  const [stats, setStats] = useState<PriceStats>({
    currentPrice: 0,
    priceChange24h: 0,
    priceChangePercent24h: 0,
    high24h: 0,
    low24h: 0,
  });

  const prevPriceRef = useRef<number>(0);
  const [shouldConnect, setShouldConnect] = useState(false);

  useEffect(() => {
    setShouldConnect(true);
  }, []);

  const { lastJsonMessage, readyState } = useWebSocket<Binance24hrTicker>(
    shouldConnect ? config.binance.wsUrl : null,
    {
      shouldReconnect: () => true,
      reconnectInterval: 3000,
      reconnectAttempts: 10,
    }
  );

  useEffect(() => {
    if (lastJsonMessage) {
      const currentPrice = parseFloat(lastJsonMessage.c);
      const priceChange24h = parseFloat(lastJsonMessage.p);
      const priceChangePercent24h = parseFloat(lastJsonMessage.P);
      const high24h = parseFloat(lastJsonMessage.h);
      const low24h = parseFloat(lastJsonMessage.l);

      prevPriceRef.current = stats.currentPrice;

      setStats({
        currentPrice,
        priceChange24h,
        priceChangePercent24h,
        high24h,
        low24h,
      });
    }
  }, [lastJsonMessage, stats.currentPrice]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Connected",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Disconnected",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return {
    ...stats,
    isConnected: readyState === ReadyState.OPEN,
    connectionStatus,
  };
}
