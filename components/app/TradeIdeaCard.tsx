"use client";

import { useState, useEffect } from "react";
import { TradeIdea } from "@/lib/types";
import { PriceChart } from "./PriceChart";
import { useBinancePrice } from "@/lib/hooks/useBinancePrice";
import { formatCurrency, formatPercentage, formatCountdown } from "@/lib/utils";

interface TradeIdeaCardProps {
  tradeIdea: TradeIdea;
}

export function TradeIdeaCard({ tradeIdea: initialTradeIdea }: TradeIdeaCardProps) {
  const [tradeIdea, setTradeIdea] = useState(initialTradeIdea);
  const [showSettings, setShowSettings] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [priceFlash, setPriceFlash] = useState<"up" | "down" | null>(null);

  const [settingsForm, setSettingsForm] = useState({
    direction: tradeIdea.direction,
    targetPrice: tradeIdea.targetPrice,
    expiryDays: 7,
  });

  const {
    currentPrice,
    priceChangePercent24h,
    high24h,
    low24h,
    isConnected,
  } = useBinancePrice();

  const [countdown, setCountdown] = useState("");
  const [prevPrice, setPrevPrice] = useState(currentPrice);

  useEffect(() => {
    setCountdown(formatCountdown(tradeIdea.expiryDate));

    const interval = setInterval(() => {
      setCountdown(formatCountdown(tradeIdea.expiryDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [tradeIdea.expiryDate]);

  useEffect(() => {
    if (currentPrice > 0 && prevPrice > 0 && currentPrice !== prevPrice) {
      setPriceFlash(currentPrice > prevPrice ? "up" : "down");
      setTimeout(() => setPriceFlash(null), 300);
    }
    setPrevPrice(currentPrice);
  }, [currentPrice, prevPrice]);

  const { asset, assetName, direction, targetPrice, expiryDate, potentialReturn } = tradeIdea;

  const distanceToTarget = currentPrice > 0 ? targetPrice - currentPrice : 0;
  const percentageAway = currentPrice > 0
    ? Math.abs((distanceToTarget / currentPrice) * 100)
    : 0;
  const calculatedReturn = currentPrice > 0
    ? Math.abs(targetPrice - currentPrice) / currentPrice * 100
    : potentialReturn || 0;

  const getTimeframeBadge = () => {
    const now = new Date().getTime();
    const expiry = expiryDate.getTime();
    const days = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return `${days}d`;
  };

  const handleApplySettings = () => {
    const newExpiryDate = new Date(Date.now() + settingsForm.expiryDays * 24 * 60 * 60 * 1000);
    setTradeIdea({
      ...tradeIdea,
      direction: settingsForm.direction,
      targetPrice: settingsForm.targetPrice,
      expiryDate: newExpiryDate,
    });
    setShowSettings(false);
  };

  const handleTakeTrade = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const directionArrow = direction === "bullish" ? "▲" : "▼";
  const directionColor = direction === "bullish" ? "text-emerald-400" : "text-red-400";
  const borderColor = direction === "bullish" ? "border-emerald-500/20" : "border-red-500/20";
  const glowColor = direction === "bullish"
    ? "shadow-[0_0_15px_rgba(16,185,129,0.15)]"
    : "shadow-[0_0_15px_rgba(239,68,68,0.15)]";

  const headlineText = direction === "bullish"
    ? `will reach ${formatCurrency(targetPrice, 0)}`
    : `will drop to ${formatCurrency(targetPrice, 0)}`;

  return (
    <div
      className={`
        relative w-full max-w-[600px] overflow-hidden rounded-[20px]
        border ${borderColor} bg-white/5 backdrop-blur-xl
        p-5 ${glowColor}
      `}
    >
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-gray-500 hover:text-white transition-colors"
          aria-label="Settings"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <span className="text-[10px] uppercase tracking-wider text-gray-500">
          {isConnected ? "Live" : "Connecting"}
        </span>
        <div
          className={`
            h-2 w-2 rounded-full
            ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-gray-500"}
          `}
        />
      </div>

      {showToast && (
        <div className="absolute top-0 left-0 right-0 z-50 animate-[slideDown_0.3s_ease-out]">
          <div className="mx-auto mt-4 w-fit rounded-lg bg-emerald-500/90 backdrop-blur-md px-4 py-2 text-sm font-medium text-white shadow-lg">
            Trade idea saved! 🎯
          </div>
        </div>
      )}

      {showSettings && (
        <div className="absolute inset-0 z-40 flex items-start justify-center bg-black/70 backdrop-blur-md animate-[fadeIn_0.2s_ease-out] rounded-[20px]">
          <div className="mt-8 w-[90%] max-w-md rounded-xl border border-white/20 bg-[#1a1b23]/95 backdrop-blur-xl p-5 shadow-2xl animate-[slideDown_0.3s_ease-out]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Configure Trade</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-wider text-gray-400">
                  Direction
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSettingsForm({ ...settingsForm, direction: "bullish" })}
                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      settingsForm.direction === "bullish"
                        ? "bg-emerald-500 text-white"
                        : "bg-black/40 backdrop-blur-md text-gray-400 hover:bg-black/50"
                    }`}
                  >
                    ▲ Bullish
                  </button>
                  <button
                    onClick={() => setSettingsForm({ ...settingsForm, direction: "bearish" })}
                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      settingsForm.direction === "bearish"
                        ? "bg-red-500 text-white"
                        : "bg-black/40 backdrop-blur-md text-gray-400 hover:bg-black/50"
                    }`}
                  >
                    ▼ Bearish
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-wider text-gray-400">
                  Target Price
                </label>
                <input
                  type="number"
                  value={settingsForm.targetPrice}
                  onChange={(e) => setSettingsForm({ ...settingsForm, targetPrice: Number(e.target.value) })}
                  className="w-full rounded-lg border border-white/20 bg-black/40 backdrop-blur-md px-4 py-2 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-wider text-gray-400">
                  Expiry
                </label>
                <select
                  value={settingsForm.expiryDays}
                  onChange={(e) => setSettingsForm({ ...settingsForm, expiryDays: Number(e.target.value) })}
                  className="w-full rounded-lg border border-white/20 bg-black/40 backdrop-blur-md px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value={7} className="bg-[#1a1b23]">7 days</option>
                  <option value={14} className="bg-[#1a1b23]">14 days</option>
                  <option value={30} className="bg-[#1a1b23]">30 days</option>
                </select>
              </div>

              <button
                onClick={handleApplySettings}
                className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-7 h-7 rounded-full bg-[#F7931A] flex items-center justify-center text-white font-bold text-sm shrink-0">
            ₿
          </div>
          <h1 className="text-[20px] font-bold text-white leading-tight">
            {asset} <span className={directionColor}>{directionArrow}</span> {headlineText}
          </h1>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
            {getTimeframeBadge()}
          </span>
        </div>
        <p className="text-sm text-gray-500 ml-10">{assetName} · {tradeIdea.pair}</p>
      </div>

      <div className="mb-3 flex items-end justify-between">
        <p
          className={`
            text-[32px] font-bold tabular-nums leading-none transition-colors duration-300
            ${priceFlash === "up" ? "text-emerald-400" : priceFlash === "down" ? "text-red-400" : "text-white"}
          `}
        >
          {currentPrice > 0 ? formatCurrency(currentPrice, 2) : "Loading..."}
        </p>
        <p
          className={`
            text-lg font-bold tabular-nums
            ${priceChangePercent24h >= 0 ? "text-emerald-400" : "text-red-400"}
          `}
        >
          {priceChangePercent24h !== 0
            ? formatPercentage(priceChangePercent24h, true)
            : "—"}
        </p>
      </div>

      {currentPrice > 0 && (
        <div className="mb-4 flex items-center gap-1.5 text-[13px]">
          <span className={directionColor}>
            {directionArrow} {formatCurrency(Math.abs(distanceToTarget), 0)}
          </span>
          <span className="text-gray-400">to target ·</span>
          <span className="font-bold text-white">
            {percentageAway.toFixed(1)}% away
          </span>
        </div>
      )}

      <div className="mb-4 h-[200px]">
        <PriceChart
          targetPrice={targetPrice}
          currentPrice={currentPrice}
          direction={direction}
        />
      </div>

      <div className="mb-4 mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">
            24H High
          </p>
          <p className="text-[15px] font-bold text-emerald-400 tabular-nums">
            {high24h > 0 ? formatCurrency(high24h, 0) : "—"}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">
            24H Low
          </p>
          <p className="text-[15px] font-bold text-red-400 tabular-nums">
            {low24h > 0 ? formatCurrency(low24h, 0) : "—"}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">
            Target Price
          </p>
          <p className="text-[15px] font-bold text-white tabular-nums">
            {formatCurrency(targetPrice, 0)}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">
            Expiry
          </p>
          <p className="text-[15px] font-bold text-white tabular-nums">
            {countdown}
          </p>
        </div>
      </div>

      <div className={`mb-4 flex items-center justify-between rounded-lg border px-4 py-2.5 backdrop-blur-sm ${
        direction === "bullish"
          ? "bg-gradient-to-r from-emerald-500/15 to-emerald-600/10 border-emerald-500/30"
          : "bg-gradient-to-r from-red-500/15 to-red-600/10 border-red-500/30"
      }`}>
        <p className={`text-[11px] uppercase tracking-wider ${
          direction === "bullish" ? "text-emerald-300" : "text-red-300"
        }`}>
          Potential Return
        </p>
        <p className={`text-[20px] font-bold tabular-nums ${
          direction === "bullish" ? "text-emerald-300" : "text-red-300"
        }`}>
          {formatPercentage(calculatedReturn, true)}
        </p>
      </div>

      <button
        onClick={handleTakeTrade}
        className={`
          w-full rounded-xl px-6 py-2.5 text-base font-semibold text-white
          transition-all duration-200
          hover:scale-[1.02] hover:shadow-lg
          active:scale-[0.97]
          ${direction === "bullish"
            ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-emerald-500/25"
            : "bg-gradient-to-r from-red-500 to-red-600 hover:shadow-red-500/25"
          }
        `}
      >
        Take this trade
      </button>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
