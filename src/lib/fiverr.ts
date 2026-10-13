/**
 * Fiverr platform fee calculation.
 *
 * Official Fiverr Help Center Rules:
 *   - Fiverr charges a standard 20% seller service fee on completed orders.
 *   - The seller receives 80% of the total purchase amount.
 *   - The 20% commission applies to the base order, order extras, and tips.
 *   - This seller fee is separate from the buyer service fees charged at checkout.
 *   - Withdrawal methods may incur flat transfer fees.
 *
 * Sources:
 *   - https://help.fiverr.com/hc/en-us/articles/360010776317 (service fee)
 *   - https://help.fiverr.com/hc/en-us/articles/360011219218 (withdrawal fees)
 */

export type FiverrWithdrawalMethod =
  | "payoneer"
  | "paypal"
  | "bank_transfer"
  | "fiverr_revenue_card";

export interface FiverrWithdrawalOption {
  label: string;
  fee: number; // flat fee in USD per withdrawal
  feeNote: string;
}

export const FIVERR_WITHDRAWAL_OPTIONS: Record<
  FiverrWithdrawalMethod,
  FiverrWithdrawalOption
> = {
  payoneer: {
    label: "Payoneer",
    fee: 0,
    feeNote: "No Fiverr fee (Payoneer may charge separately)",
  },
  paypal: {
    label: "PayPal",
    fee: 0,
    feeNote: "No Fiverr fee (PayPal may charge separately)",
  },
  bank_transfer: {
    label: "Bank Transfer (Wire)",
    fee: 3,
    feeNote: "$3 flat fee per withdrawal from Fiverr",
  },
  fiverr_revenue_card: {
    label: "Fiverr Revenue Card",
    fee: 1,
    feeNote: "$1 flat fee per withdrawal from Fiverr",
  },
};

export interface FiverrResult {
  orderAmount: number;
  extrasAmount: number;
  tipAmount: number;
  grossAmount: number; // orderAmount + extrasAmount + tipAmount
  platformFeeRate: number; // 0.20
  platformFeeAmount: number; // grossAmount * 0.20
  afterPlatformFee: number; // 80% of gross
  withdrawalMethod: FiverrWithdrawalMethod;
  withdrawalFee: number;
  netAmount: number; // afterPlatformFee - withdrawalFee
  exchangeRate?: number;
  targetCurrency?: string;
  netConverted?: number;
  netPkr?: number;
}

/**
 * Calculates Fiverr net seller earnings: 20% commission on base order, extras, and tips,
 * plus withdrawal method fee and optional multi-currency conversion.
 */
export function calculateFiverrFee(
  orderAmount: number,
  withdrawalMethod: FiverrWithdrawalMethod = "payoneer",
  extrasAmount: number = 0,
  tipAmount: number = 0,
  exchangeRate?: number,
  targetCurrency: string = "PKR"
): FiverrResult {
  if (orderAmount < 0) throw new Error("orderAmount must be non-negative");
  if (extrasAmount < 0) throw new Error("extrasAmount must be non-negative");
  if (tipAmount < 0) throw new Error("tipAmount must be non-negative");

  const grossAmount = orderAmount + extrasAmount + tipAmount;
  const platformFeeRate = 0.2; // Standard 20%
  const platformFeeAmount = grossAmount * platformFeeRate;
  const afterPlatformFee = grossAmount - platformFeeAmount;
  const withdrawalFee = FIVERR_WITHDRAWAL_OPTIONS[withdrawalMethod]?.fee ?? 0;
  const netAmount = Math.max(0, afterPlatformFee - withdrawalFee);
  const netConverted =
    exchangeRate && exchangeRate > 0 ? netAmount * exchangeRate : undefined;
  const netPkr = netConverted;

  return {
    orderAmount,
    extrasAmount,
    tipAmount,
    grossAmount,
    platformFeeRate,
    platformFeeAmount,
    afterPlatformFee,
    withdrawalMethod,
    withdrawalFee,
    netAmount,
    exchangeRate,
    targetCurrency,
    netConverted,
    netPkr,
  };
}
