"use client";

import { useState, useMemo, useCallback } from "react";
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
import { TIMEFRAMES, CHART_CONFIG, ANIMATION_DURATIONS } from "@/lib/constants";
import { CHART_COLORS } from "@/lib/constants/colors";

type TimeInterval = typeof TIMEFRAMES[number]["value"];

interface PriceChartProps {
  targetPrice: number;
  currentPrice: number;
  direction: "bullish" | "bearish";
}

export function PriceChart({ targetPrice, currentPrice, direction }: PriceChartProps) {
  const [selectedInterval, setSelectedInterval] = useState<TimeInterval>("1h");
  const { chartData, isLoading, error } = useBinanceKlines(selectedInterval);

  const chartColor = useMemo(
    () => (direction === "bullish" ? CHART_COLORS.bullish : CHART_COLORS.bearish),
    [direction]
  );

  const { prices, dataMax, dataMin } = useMemo(() => {
    if (chartData.length === 0) {
      return { prices: [], dataMax: 0, dataMin: 0 };
    }
    const priceArray = chartData.map((d) => d.price);
    return {
      prices: priceArray,
      dataMax: Math.max(...priceArray),
      dataMin: Math.min(...priceArray),
    };
  }, [chartData]);

  const targetIsInRange = useMemo(
    () =>
      dataMax > 0 &&
      targetPrice <= dataMax * (1 + CHART_CONFIG.targetRangeTolerance) &&
      targetPrice >= dataMin * (1 - CHART_CONFIG.targetRangeTolerance),
    [targetPrice, dataMax, dataMin]
  );

  const { yDomain, showTargetLine } = useMemo(() => {
    if (dataMax === 0 || dataMin === 0) {
      return { yDomain: [0, 100] as [number, number], showTargetLine: false };
    }

    if (targetIsInRange) {
      const minPrice = Math.min(dataMin, targetPrice, currentPrice);
      const maxPrice = Math.max(dataMax, targetPrice, currentPrice);
      const padding = (maxPrice - minPrice) * CHART_CONFIG.yAxisPadding;
      return {
        yDomain: [Math.floor(minPrice - padding), Math.ceil(maxPrice + padding)] as [number, number],
        showTargetLine: true,
      };
    }

    const padding = (dataMax - dataMin) * CHART_CONFIG.minYAxisPadding;
    return {
      yDomain: [Math.floor(dataMin - padding), Math.ceil(dataMax + padding)] as [number, number],
      showTargetLine: false,
    };
  }, [targetIsInRange, dataMin, dataMax, targetPrice, currentPrice]);

  const distanceToTarget = useMemo(
    () => Math.abs(targetPrice - currentPrice),
    [targetPrice, currentPrice]
  );

  const percentAway = useMemo(
    () => ((distanceToTarget / currentPrice) * 100).toFixed(1),
    [distanceToTarget, currentPrice]
  );

  const directionArrow = useMemo(
    () => (direction === "bullish" ? "↑" : "↓"),
    [direction]
  );

  const tickInterval = useMemo(() => {
    const tickCount =
      selectedInterval === "1h" || selectedInterval === "4h" ? 6 : 5;
    return Math.floor(chartData.length / tickCount);
  }, [selectedInterval, chartData.length]);

  const handleIntervalChange = useCallback((interval: TimeInterval) => {
    setSelectedInterval(interval);
  }, []);

  const renderTooltip = useCallback(
    ({ active, payload }: any) => {
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
    },
    []
  );

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

  return (
    <div className="flex h-full w-full flex-col gap-3">
      <div
        className="flex shrink-0 gap-2 rounded-lg bg-white/5 backdrop-blur-md p-1 border border-white/10"
        role="tablist"
        aria-label="Chart timeframe selector"
      >
        {TIMEFRAMES.map((interval) => (
          <button
            key={interval.value}
            onClick={() => handleIntervalChange(interval.value)}
            role="tab"
            aria-selected={selectedInterval === interval.value}
            aria-label={`${interval.label} timeframe`}
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
            role="img"
            aria-label={`Bitcoin price chart showing ${direction} trend with target of ${formatCurrency(targetPrice, 0)}`}
          >
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset={CHART_CONFIG.gradientStops.start.offset}
                  stopColor={chartColor}
                  stopOpacity={CHART_CONFIG.gradientStops.start.opacity}
                />
                <stop
                  offset={CHART_CONFIG.gradientStops.end.offset}
                  stopColor={chartColor}
                  stopOpacity={CHART_CONFIG.gradientStops.end.opacity}
                />
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

            <Tooltip content={renderTooltip} />

            {showTargetLine && (
              <ReferenceLine
                y={targetPrice}
                stroke={chartColor}
                strokeDasharray="6 4"
                strokeWidth={CHART_CONFIG.targetLineStrokeWidth}
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
              strokeWidth={CHART_CONFIG.strokeWidth}
              fill="url(#priceGradient)"
              animationDuration={ANIMATION_DURATIONS.chartAnimation}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
