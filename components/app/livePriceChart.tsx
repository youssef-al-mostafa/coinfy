"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";
import { useBTCPrice } from "@/lib/hooks/useBTCPrice";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface LivePriceChartProps {
  targetPrice: number;
}

export function LivePriceChart({ targetPrice }: LivePriceChartProps) {
  const { currentPrice, priceHistory, isConnected } = useBTCPrice();

  const chartData = useMemo(() => {
    return priceHistory.map((point) => ({
      time: new Date(point.timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      price: point.price,
    }));
  }, [priceHistory]);

  const chartConfig = {
    price: {
      label: "BTC Price",
      color: "hsl(var(--chart-1))",
    },
  };

  const yAxisDomain = useMemo(() => {
    if (priceHistory.length === 0) return [0, 100000];

    const prices = priceHistory.map((p) => p.price);
    const minPrice = Math.min(...prices, targetPrice);
    const maxPrice = Math.max(...prices, targetPrice);
    const padding = (maxPrice - minPrice) * 0.1;

    return [
      Math.floor(minPrice - padding),
      Math.ceil(maxPrice + padding),
    ];
  }, [priceHistory, targetPrice]);

  if (!isConnected || chartData.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm">
        <p className="text-sm text-zinc-400">
          {!isConnected ? "Connecting to live feed..." : "Loading price data..."}
        </p>
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.5} />
            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-white/5" />
        <XAxis
          dataKey="time"
          tick={{ fill: "rgba(255, 255, 255, 0.4)", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={yAxisDomain}
          tick={{ fill: "rgba(255, 255, 255, 0.4)", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value) => `Time: ${value}`}
              formatter={(value) => `$${Number(value).toLocaleString()}`}
            />
          }
        />
        <ReferenceLine
          y={targetPrice}
          stroke="hsl(var(--chart-2))"
          strokeDasharray="6 6"
          strokeWidth={2}
          label={{
            value: `Target: $${targetPrice.toLocaleString()}`,
            position: "insideTopRight",
            fill: "hsl(var(--chart-2))",
            fontSize: 11,
            fontWeight: 600,
          }}
        />
        <ReferenceLine
          y={currentPrice}
          stroke="hsl(var(--chart-1))"
          strokeWidth={2.5}
          label={{
            value: `Current: $${currentPrice.toLocaleString()}`,
            position: "insideBottomRight",
            fill: "hsl(var(--chart-1))",
            fontSize: 11,
            fontWeight: 600,
          }}
        />
        <Area
          type="monotone"
          dataKey="price"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2.5}
          fill="url(#colorPrice)"
          animationDuration={300}
        />
      </AreaChart>
    </ChartContainer>
  );
}
