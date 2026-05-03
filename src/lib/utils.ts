import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a price. Defaults to INR with Indian-style grouping (1,85,000),
 * which works well for travel-agency-style "starting from" prices regardless
 * of the user's UI locale.
 */
export function formatPrice(
  amount: number,
  currency: string = "INR",
  locale: string = "en-IN"
) {
  // Always use en-IN for INR so we get the lakh/crore grouping (1,85,000 not 185,000)
  const formatLocale = currency === "INR" ? "en-IN" : locale;
  return new Intl.NumberFormat(formatLocale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
