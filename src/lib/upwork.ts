/**
 * Upwork platform fee calculation.
 *
 * Current Official Upwork Help Documentation:
 *   - Freelancer service fees range from 0% to 15% per contract.
 *   - The exact rate is displayed when submitting a proposal or offer, and locks when the contract begins.
 *   - Standard contracts are commonly 10%.
 *   - Direct Contracts & BYO (Bring Your Own) clients are 0%.
 *   - Certain enterprise / specialized contracts can range up to 15%.
 *   - The legacy 20% -> 10% -> 5% lifetime billing structure is NO LONGER the active universal model.
 *
 * Sources:
 *   - https://support.upwork.com/hc/en-us/articles/211062538-Freelancer-Service-Fees
 */

export type UpworkTier = "20" | "10" | "5";

export interface UpworkResult {
  grossAmount: number;
  bonusAmount: number;
  totalGross: number;
  feeRate: number; // Decimal (e.g. 0.10)
  feePercentage: number; // Percent (e.g. 10)
  feeAmount: number;
  netAmount: number;
  tier?: UpworkTier;
  exchangeRate?: number;
  targetCurrency?: string;
  netConverted?: number;
  netPkr?: number;
}

/** Returns the Upwork service fee rate for a legacy tier or percentage. */
export function getUpworkFeeRate(tierOrRate: UpworkTier | number): number {
  if (typeof tierOrRate === "string") {
    const rates: Record<UpworkTier, number> = {
      "20": 0.2,
      "10": 0.1,
      "5": 0.05,
    };
    return rates[tierOrRate] ?? 0.1;
  }
  // If passed as percentage (e.g. 10 or 15)
  if (tierOrRate > 1) {
    return tierOrRate / 100;
  }
  // If passed as decimal (e.g. 0.10)
  return tierOrRate;
}

/**
 * Calculates Upwork net earnings after platform service fee (0%–15% configurable),
 * with optional bonus and optional multi-currency conversion.
 */
export function calculateUpworkFee(
  grossAmount: number,
  feeRateOrPercentage: UpworkTier | number,
  bonusAmount: number = 0,
  exchangeRate?: number,
  targetCurrency: string = "PKR"
): UpworkResult {
  if (grossAmount < 0) throw new Error("grossAmount must be non-negative");
  if (bonusAmount < 0) throw new Error("bonusAmount must be non-negative");

  let feeRate: number;
  let tier: UpworkTier | undefined;

  if (typeof feeRateOrPercentage === "string") {
    feeRate = getUpworkFeeRate(feeRateOrPercentage);
    tier = feeRateOrPercentage;
  } else {
    feeRate = feeRateOrPercentage > 1 ? feeRateOrPercentage / 100 : feeRateOrPercentage;
    if (feeRate < 0 || feeRate > 1) {
      throw new Error("feeRate must be between 0% and 100%");
    }
  }

  const totalGross = grossAmount + bonusAmount;
  const feeAmount = totalGross * feeRate;
  const netAmount = Math.max(0, totalGross - feeAmount);
  const netConverted =
    exchangeRate && exchangeRate > 0 ? netAmount * exchangeRate : undefined;
  const netPkr = netConverted;

  return {
    grossAmount,
    bonusAmount,
    totalGross,
    feeRate,
    feePercentage: feeRate * 100,
    feeAmount,
    netAmount,
    tier,
    exchangeRate,
    targetCurrency,
    netConverted,
    netPkr,
  };
}
