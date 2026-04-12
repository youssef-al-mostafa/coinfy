"use client";

import { useState, useEffect } from "react";
import { BinanceKline, ChartDataPoint } from "@/lib/types";
import { formatChartTime } from "@/lib/utils";
import { TIMEFRAMES } from "@/lib/constants";

const BINANCE_API_URL = "https://api.binance.com/api/v3/klines";

type TimeInterval = typeof TIMEFRAMES[number]["value"];

export function useBinanceKlines(selectedInterval: TimeInterval = "1h") {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchKlines = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const config = TIMEFRAMES.find(tf => tf.value === selectedInterval);
        if (!config) {
          throw new Error("Invalid interval");
        }

        const url = `${BINANCE_API_URL}?symbol=BTCUSDT&interval=${config.interval}&limit=${config.limit}`;

        const response = await fetch(url, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch klines: ${response.statusText}`);
        }

        const data: BinanceKline[] = await response.json();

        const formattedData: ChartDataPoint[] = data.map((kline) => ({
          timestamp: kline[0],
          price: parseFloat(kline[4]),
          time: formatChartTime(kline[0], selectedInterval),
        }));

        setChartData(formattedData);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to fetch chart data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchKlines();

    return () => {
      abortController.abort();
    };
  }, [selectedInterval]);

  return {
    chartData,
    isLoading,
    error,
  };
}
