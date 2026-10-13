/**
 * Multi-Currency earnings conversion for global freelancers.
 *
 * Sourced for top global freelance hubs:
 * Pakistan (PKR), India (INR), Philippines (PHP), Europe (EUR), UK (GBP),
 * Canada (CAD), Australia (AUD), Bangladesh (BDT), Nigeria (NGN).
 *
 * Exchange rates are user-editable because:
 *   - Telegraphic transfer (TT) buying rates vary across individual receiving banks.
 *   - Platform withdrawal channels (Payoneer, Wise, direct wire) apply distinct spreads.
 */

export type EarningsFrequency = "daily" | "weekly" | "monthly";

export type TargetCurrencyCode =
  | "PKR"
  | "INR"
  | "PHP"
  | "EUR"
  | "GBP"
  | "CAD"
  | "AUD"
  | "BDT"
  | "NGN";

export interface CurrencyMetadata {
  code: TargetCurrencyCode;
  name: string;
  symbol: string;
  flag: string;
  defaultRate: number;
}

export const GLOBAL_FREELANCE_CURRENCIES: Record<
  TargetCurrencyCode,
  CurrencyMetadata
> = {
  PKR: {
    code: "PKR",
    name: "Pakistani Rupee",
    symbol: "PKR",
    flag: "🇵🇰",
    defaultRate: 278.5,
  },
  INR: {
    code: "INR",
    name: "Indian Rupee",
    symbol: "₹",
    flag: "🇮🇳",
    defaultRate: 83.9,
  },
  PHP: {
    code: "PHP",
    name: "Philippine Peso",
    symbol: "₱",
    flag: "🇵🇭",
    defaultRate: 58.5,
  },
  EUR: {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    flag: "🇪🇺",
    defaultRate: 0.92,
  },
  GBP: {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    flag: "🇬🇧",
    defaultRate: 0.78,
  },
  CAD: {
    code: "CAD",
    name: "Canadian Dollar",
    symbol: "CA$",
    flag: "🇨🇦",
    defaultRate: 1.38,
  },
  AUD: {
    code: "AUD",
    name: "Australian Dollar",
    symbol: "A$",
    flag: "🇦🇺",
    defaultRate: 1.52,
  },
  BDT: {
    code: "BDT",
    name: "Bangladeshi Taka",
    symbol: "৳",
    flag: "🇧🇩",
    defaultRate: 120.0,
  },
  NGN: {
    code: "NGN",
    name: "Nigerian Naira",
    symbol: "₦",
    flag: "🇳🇬",
    defaultRate: 1620.0,
  },
};

export interface MultiCurrencyResult {
  usdAmount: number;
  exchangeRate: number;
  currencyCode: TargetCurrencyCode;
  currencySymbol: string;
  convertedAmount: number;
  monthlyConverted: number;
  annualConverted: number;
  frequency: EarningsFrequency;
}

export interface CurrencyResult {
  usdAmount: number;
  exchangeRate: number;
  pkrAmount: number;
  monthlyPkr: number;
  annualPkr: number;
  frequency: EarningsFrequency;
}

const WORKING_DAYS_PER_MONTH = 22;
const WEEKS_PER_MONTH = 4.33;

/** Converts a USD amount to any target global currency with projections. */
export function convertUsdToCurrency(
  usdAmount: number,
  exchangeRate: number,
  frequency: EarningsFrequency,
  currencyCode: TargetCurrencyCode = "PKR"
): MultiCurrencyResult {
  if (usdAmount < 0) throw new Error("usdAmount must be non-negative");
  if (exchangeRate <= 0) throw new Error("exchangeRate must be positive");

  let monthlyUsd: number;
  switch (frequency) {
    case "daily":
      monthlyUsd = usdAmount * WORKING_DAYS_PER_MONTH;
      break;
    case "weekly":
      monthlyUsd = usdAmount * WEEKS_PER_MONTH;
      break;
    case "monthly":
    default:
      monthlyUsd = usdAmount;
  }

  const convertedAmount = usdAmount * exchangeRate;
  const monthlyConverted = monthlyUsd * exchangeRate;
  const annualConverted = monthlyConverted * 12;

  const metadata = GLOBAL_FREELANCE_CURRENCIES[currencyCode] ?? GLOBAL_FREELANCE_CURRENCIES.PKR;

  return {
    usdAmount,
    exchangeRate,
    currencyCode,
    currencySymbol: metadata.symbol,
    convertedAmount,
    monthlyConverted,
    annualConverted,
    frequency,
  };
}

/** Backward-compatible USD to PKR conversion function. */
export function convertUsdToPkr(
  usdAmount: number,
  exchangeRate: number,
  frequency: EarningsFrequency
): CurrencyResult {
  const res = convertUsdToCurrency(usdAmount, exchangeRate, frequency, "PKR");
  return {
    usdAmount: res.usdAmount,
    exchangeRate: res.exchangeRate,
    pkrAmount: res.convertedAmount,
    monthlyPkr: res.monthlyConverted,
    annualPkr: res.annualConverted,
    frequency: res.frequency,
  };
}
