import { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { BinanceKlineData, PricePoint } from "@/lib/types";
import { config } from "@/lib/config";

export function useBTCPrice() {
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);

  const { lastJsonMessage, readyState } = useWebSocket<BinanceKlineData>(
    config.client.binance.wsUrl,
    {
      shouldReconnect: () => true,
      reconnectInterval: 3000,
      reconnectAttempts: 10,
    }
  );

  useEffect(() => {
    if (lastJsonMessage?.k) {
      const price = parseFloat(lastJsonMessage.k.c);
      const timestamp = lastJsonMessage.k.T;

      setCurrentPrice(price);

      setPriceHistory((prev) => {
        const newPoint: PricePoint = { timestamp, price };
        const updated = [...prev, newPoint];

        if (updated.length > config.client.binance.maxPriceHistory) {
          return updated.slice(updated.length - config.client.binance.maxPriceHistory);
        }

        return updated;
      });
    }
  }, [lastJsonMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Connected",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Disconnected",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return {
    currentPrice,
    priceHistory,
    isConnected: readyState === ReadyState.OPEN,
    connectionStatus,
  };
}
