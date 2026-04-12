"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useBinanceKlines } from "@/lib/hooks/useBinanceKlines";
import { formatCurrency } from "@/lib/utils";

type TimeInterval = "1h" | "4h" | "1d" | "1w";

interface PriceChartProps {
  targetPrice: number;
  currentPrice: number;
  direction: "bullish" | "bearish";
}

const TIME_INTERVALS: { value: TimeInterval; label: string }[] = [
  { value: "1h", label: "1H" },
  { value: "4h", label: "4H" },
  { value: "1d", label: "1D" },
  { value: "1w", label: "1W" },
];

export function PriceChart({ targetPrice, currentPrice, direction }: PriceChartProps) {
  const [selectedInterval, setSelectedInterval] = useState<TimeInterval>("1h");
  const { chartData, isLoading, error } = useBinanceKlines(selectedInterval);

  const chartColor = direction === "bullish" ? "#10b981" : "#ef4444";

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
        <p className="text-sm text-red-400">Failed to load chart data</p>
      </div>
    );
  }

  if (isLoading || chartData.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
          <p className="text-sm text-gray-400">Loading chart...</p>
        </div>
      </div>
    );
  }

  const prices = chartData.map((d) => d.price);
  const dataMax = Math.max(...prices);
  const dataMin = Math.min(...prices);

  const targetIsInRange = targetPrice <= dataMax * 1.15 && targetPrice >= dataMin * 0.85;

  let yDomain: [number, number];
  let showTargetLine = false;

  if (targetIsInRange) {
    const minPrice = Math.min(dataMin, targetPrice, currentPrice);
    const maxPrice = Math.max(dataMax, targetPrice, currentPrice);
    const padding = (maxPrice - minPrice) * 0.15;
    yDomain = [Math.floor(minPrice - padding), Math.ceil(maxPrice + padding)];
    showTargetLine = true;
  } else {
    const padding = (dataMax - dataMin) * 0.1;
    yDomain = [Math.floor(dataMin - padding), Math.ceil(dataMax + padding)];
    showTargetLine = false;
  }

  const distanceToTarget = Math.abs(targetPrice - currentPrice);
  const percentAway = ((distanceToTarget / currentPrice) * 100).toFixed(1);
  const directionArrow = direction === "bullish" ? "↑" : "↓";

  const tickCount = selectedInterval === "1h" || selectedInterval === "4h" ? 6 : 5;
  const tickInterval = Math.floor(chartData.length / tickCount);

  return (
    <div className="flex h-full w-full flex-col gap-3">
      <div className="flex shrink-0 gap-2 rounded-lg bg-white/5 backdrop-blur-md p-1 border border-white/10">
        {TIME_INTERVALS.map((interval) => (
          <button
            key={interval.value}
            onClick={() => setSelectedInterval(interval.value)}
            className={`
              px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200
              ${
                selectedInterval === interval.value
                  ? "bg-emerald-500 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }
            `}
          >
            {interval.label}
          </button>
        ))}
      </div>

      {!showTargetLine && (
        <div className="flex items-center gap-1.5 text-[12px] text-gray-500 px-2">
          <span className={chartColor === "#10b981" ? "text-emerald-400" : "text-red-400"}>
            {directionArrow}
          </span>
          <span>
            Target {formatCurrency(targetPrice, 0)} ({percentAway}% {direction === "bullish" ? "above" : "below"})
          </span>
        </div>
      )}

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%" minHeight={150}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="time"
              tick={{ fill: "#6b7280", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval={tickInterval}
            />

            <YAxis
              domain={yDomain}
              tick={{ fill: "#6b7280", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              width={70}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg bg-black/80 backdrop-blur-xl border border-white/20 px-3 py-2 shadow-xl">
                      <p className="text-xs text-gray-400 mb-1">
                        {payload[0].payload.time}
                      </p>
                      <p className="text-sm font-bold text-white">
                        {formatCurrency(payload[0].value as number, 2)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />

            {showTargetLine && (
              <ReferenceLine
                y={targetPrice}
                stroke={chartColor}
                strokeDasharray="6 4"
                strokeWidth={2}
                label={{
                  value: `Target ${formatCurrency(targetPrice, 0)}`,
                  position: "insideTopRight",
                  fill: "#9ca3af",
                  fontSize: 10,
                  fontWeight: 500,
                  offset: 10,
                }}
              />
            )}

            <Area
              type="monotone"
              dataKey="price"
              stroke={chartColor}
              strokeWidth={2.5}
              fill="url(#priceGradient)"
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
