"use client";

import { useState, useEffect } from "react";
import { BinanceKline, ChartDataPoint } from "@/lib/types";
import { formatChartTime } from "@/lib/utils";

const BINANCE_API_URL = "https://api.binance.com/api/v3/klines";

type TimeInterval = "1h" | "4h" | "1d" | "1w";

const INTERVAL_CONFIG = {
  "1h": { interval: "1h", limit: 48 },
  "4h": { interval: "4h", limit: 48 },
  "1d": { interval: "1d", limit: 30 },
  "1w": { interval: "1w", limit: 20 },
};

export function useBinanceKlines(selectedInterval: TimeInterval = "1h") {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKlines = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const config = INTERVAL_CONFIG[selectedInterval];
        const url = `${BINANCE_API_URL}?symbol=BTCUSDT&interval=${config.interval}&limit=${config.limit}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch klines: ${response.statusText}`);
        }

        const data: BinanceKline[] = await response.json();

        const formattedData: ChartDataPoint[] = data.map((kline) => ({
          timestamp: kline[0],
          price: parseFloat(kline[4]), // Close price
          time: formatChartTime(kline[0], selectedInterval),
        }));

        setChartData(formattedData);
      } catch (err) {
        console.error("Error fetching klines:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch chart data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchKlines();
  }, [selectedInterval]);

  return {
    chartData,
    isLoading,
    error,
  };
}
