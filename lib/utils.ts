import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as USD currency
 * @example formatCurrency(95000) => "$95,000"
 * @example formatCurrency(95123.45) => "$95,123.45"
 */
export function formatCurrency(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a number as a percentage with optional sign
 * @example formatPercentage(15.5, true) => "+15.5%"
 * @example formatPercentage(-2.3, true) => "-2.3%"
 */
export function formatPercentage(value: number, includeSign: boolean = false): string {
  const sign = includeSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Format a countdown timer
 * @example formatCountdown(timestamp) => "6d 23h 14m"
 */
export function formatCountdown(expiryDate: Date): string {
  const now = new Date().getTime();
  const expiry = expiryDate.getTime();
  const diff = expiry - now;

  if (diff <= 0) return "Expired";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${days}d ${hours}h ${minutes}m`;
}

/**
 * Format timestamp for chart axis
 * @example formatChartTime(timestamp, '1h') => "14:30"
 * @example formatChartTime(timestamp, '1d') => "Apr 12"
 */
export function formatChartTime(timestamp: number, interval: string): string {
  const date = new Date(timestamp);

  if (interval === '1h' || interval === '4h') {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } else if (interval === '1d') {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
}
