"use client";

import { useState } from "react";
import {
  calculateFiverrFee,
  FIVERR_WITHDRAWAL_OPTIONS,
  type FiverrWithdrawalMethod,
} from "@/lib/fiverr";
import {
  GLOBAL_FREELANCE_CURRENCIES,
  type TargetCurrencyCode,
} from "@/lib/currency";
import {
  formatUSD,
  formatPercent,
  formatTargetCurrency,
} from "@/lib/formatters";
import InputField from "@/components/ui/InputField";
import ResultCard from "@/components/ui/ResultCard";

const WITHDRAWAL_METHODS = Object.entries(FIVERR_WITHDRAWAL_OPTIONS) as [
  FiverrWithdrawalMethod,
  (typeof FIVERR_WITHDRAWAL_OPTIONS)[FiverrWithdrawalMethod],
][];

const CURRENCY_LIST = Object.values(GLOBAL_FREELANCE_CURRENCIES);

export default function FiverrCalculator() {
  const [orderAmount, setOrderAmount] = useState("");
  const [method, setMethod] = useState<FiverrWithdrawalMethod>("payoneer");

  const [showExtras, setShowExtras] = useState(false);
  const [extrasStr, setExtrasStr] = useState("");

  const [showTip, setShowTip] = useState(false);
  const [tipStr, setTipStr] = useState("");

  const [showCurrency, setShowCurrency] = useState(false);
  const [targetCurrency, setTargetCurrency] = useState<TargetCurrencyCode>("PKR");
  const [exchangeRateStr, setExchangeRateStr] = useState("278.50");

  const [error, setError] = useState("");

  const parsedOrder = parseFloat(orderAmount);
  const isValidOrder = orderAmount !== "" && !isNaN(parsedOrder) && parsedOrder >= 0;

  const parsedExtras = showExtras ? parseFloat(extrasStr) || 0 : 0;
  const parsedTip = showTip ? parseFloat(tipStr) || 0 : 0;
  const parsedExchangeRate = showCurrency ? parseFloat(exchangeRateStr) || 0 : undefined;

  const result = isValidOrder
    ? calculateFiverrFee(
        parsedOrder,
        method,
        parsedExtras,
        parsedTip,
        parsedExchangeRate,
        targetCurrency
      )
    : null;

  function handleOrderChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setOrderAmount(val);
    const n = parseFloat(val);
    setError(
      val !== "" && (isNaN(n) || n < 0)
        ? "Please enter a valid positive amount."
        : ""
    );
  }

  function handleCurrencyChange(code: TargetCurrencyCode) {
    setTargetCurrency(code);
    const meta = GLOBAL_FREELANCE_CURRENCIES[code];
    if (meta) {
      setExchangeRateStr(meta.defaultRate.toString());
    }
  }

  const retainedRate =
    result && result.grossAmount > 0
      ? (result.netAmount / result.grossAmount) * 100
      : 0;
  const retainedPercentStr = `${retainedRate.toFixed(1).replace(/\.0$/, "")}%`;

  const copyText = result
    ? `Fiverr Fee Breakdown\nBase order: ${formatUSD(result.orderAmount)}${
        result.extrasAmount > 0 ? `\nOrder extras: +${formatUSD(result.extrasAmount)}` : ""
      }${
        result.tipAmount > 0 ? `\nBuyer tip: +${formatUSD(result.tipAmount)}` : ""
      }${
        result.extrasAmount > 0 || result.tipAmount > 0
          ? `\nTotal order gross: ${formatUSD(result.grossAmount)}`
          : ""
      }\nFiverr seller fee (${formatPercent(result.platformFeeRate)}): −${formatUSD(
        result.platformFeeAmount
      )}${result.withdrawalFee > 0 ? `\nWithdrawal fee: −${formatUSD(result.withdrawalFee)}` : ""}\nNet seller earnings: ${formatUSD(
        result.netAmount
      )} (${retainedPercentStr})${
        result.netConverted
          ? `\nEstimated ${targetCurrency} payout: ${formatTargetCurrency(result.netConverted, targetCurrency)} (@ ${parsedExchangeRate} ${targetCurrency}/USD)`
          : ""
      }`
    : undefined;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-0 md:divide-x md:divide-stone-200">
      {/* Inputs Column */}
      <div className="space-y-6 md:pr-8">
        <InputField
          id="fiverr-amount"
          label="Base order amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="100"
          prefix="$"
          value={orderAmount}
          onChange={handleOrderChange}
          error={error}
          helpText="Purchase amount of your base gig or custom offer in USD"
        />

        {/* Standard Fee Banner */}
        <div className="rounded-md border border-stone-200 bg-stone-50/70 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-stone-600">
              Seller Commission Rate
            </span>
            <span className="text-xs font-mono font-semibold text-stone-900">
              20% standard
            </span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-stone-500">
            Fiverr pays sellers 80% of completed orders. The 20% commission applies to base orders, extras, and tips. Buyer checkout fees are separate.
          </p>
        </div>

        {/* Optional Extras Toggle */}
        <div className="border-t border-stone-100 pt-4">
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-stone-700">
            <input
              type="checkbox"
              checked={showExtras}
              onChange={(e) => setShowExtras(e.target.checked)}
              className="rounded accent-[#44684f]"
            />
            <span>Include order extras / add-ons</span>
          </label>
          {showExtras && (
            <div className="mt-3">
              <InputField
                id="fiverr-extras"
                label="Order extras amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="25"
                prefix="$"
                value={extrasStr}
                onChange={(e) => setExtrasStr(e.target.value)}
                helpText="Fast delivery, revisions, source files, etc."
              />
            </div>
          )}
        </div>

        {/* Optional Tip Toggle */}
        <div className="border-t border-stone-100 pt-4">
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-stone-700">
            <input
              type="checkbox"
              checked={showTip}
              onChange={(e) => setShowTip(e.target.checked)}
              className="rounded accent-[#44684f]"
            />
            <span>Include buyer tip</span>
          </label>
          {showTip && (
            <div className="mt-3">
              <InputField
                id="fiverr-tip"
                label="Tip amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="15"
                prefix="$"
                value={tipStr}
                onChange={(e) => setTipStr(e.target.value)}
                helpText="Fiverr deducts the standard 20% fee from tips as well"
              />
            </div>
          )}
        </div>

        {/* Withdrawal Method */}
        <div className="border-t border-stone-100 pt-4">
          <fieldset>
            <legend className="mb-2 text-xs font-medium uppercase tracking-wider text-stone-500">
              Withdrawal method
            </legend>
            <div className="space-y-2">
              {WITHDRAWAL_METHODS.map(([key, option]) => {
                const isSelected = method === key;
                return (
                  <label
                    key={key}
                    htmlFor={`method-${key}`}
                    className={[
                      "flex cursor-pointer items-start justify-between rounded-md border p-3 text-sm transition-colors",
                      isSelected
                        ? "border-[#9bb7a3] bg-[#f0f4f1] text-stone-900"
                        : "border-stone-200 bg-white text-stone-700 hover:border-stone-300",
                    ].join(" ")}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        id={`method-${key}`}
                        type="radio"
                        name="fiverr-method"
                        value={key}
                        checked={isSelected}
                        onChange={() => setMethod(key)}
                        className="mt-0.5 accent-[#44684f]"
                      />
                      <div>
                        <p className="font-medium text-stone-900">
                          {option.label}
                        </p>
                        <p className="text-xs text-stone-500">{option.feeNote}</p>
                      </div>
                    </div>
                    <span className="text-xs text-stone-400">
                      {option.fee === 0 ? "Free" : `$${option.fee}`}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        {/* Optional Multi-Currency conversion */}
        <div className="border-t border-stone-100 pt-4">
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-stone-700">
            <input
              type="checkbox"
              checked={showCurrency}
              onChange={(e) => setShowCurrency(e.target.checked)}
              className="rounded accent-[#44684f]"
            />
            <span>Convert take-home to local currency</span>
          </label>
          {showCurrency && (
            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Destination currency
                </label>
                <select
                  value={targetCurrency}
                  onChange={(e) =>
                    handleCurrencyChange(e.target.value as TargetCurrencyCode)
                  }
                  className="w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 focus:border-[#44684f] focus:outline-none"
                >
                  {CURRENCY_LIST.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} — {c.name} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <InputField
                id="fiverr-exchange-rate"
                label={`Exchange rate (${targetCurrency} per USD)`}
                type="number"
                min="0.01"
                step="0.01"
                placeholder="278.50"
                suffix={targetCurrency}
                value={exchangeRateStr}
                onChange={(e) => setExchangeRateStr(e.target.value)}
                helpText="Your bank, Wise, or Payoneer remittance rate"
              />
            </div>
          )}
        </div>
      </div>

      {/* Results Column */}
      <div className="md:pl-8">
        {result ? (
          <ResultCard
            highlightLabel="Your estimated payout"
            highlightValue={formatUSD(result.netAmount)}
            retainedPercent={retainedPercentStr}
            rows={[
              {
                label: "Base order amount",
                value: formatUSD(result.orderAmount),
              },
              ...(result.extrasAmount > 0
                ? [
                    {
                      label: "Order extras",
                      value: `+ ${formatUSD(result.extrasAmount)}`,
                    },
                  ]
                : []),
              ...(result.tipAmount > 0
                ? [
                    {
                      label: "Buyer tip",
                      value: `+ ${formatUSD(result.tipAmount)}`,
                    },
                  ]
                : []),
              ...(result.extrasAmount > 0 || result.tipAmount > 0
                ? [
                    {
                      label: "Total gross amount",
                      value: formatUSD(result.grossAmount),
                    },
                  ]
                : []),
              {
                label: `Fiverr fee (${formatPercent(result.platformFeeRate)})`,
                value: `− ${formatUSD(result.platformFeeAmount)}`,
                variant: "muted",
              },
              ...(result.withdrawalFee > 0
                ? [
                    {
                      label: "Withdrawal fee",
                      value: `− ${formatUSD(result.withdrawalFee)}`,
                      variant: "muted" as const,
                    },
                  ]
                : []),
              {
                label: "You keep (USD)",
                value: `${formatUSD(result.netAmount)} (${retainedPercentStr})`,
                variant: "highlight" as const,
                isFinal: !result.netConverted,
              },
              ...(result.netConverted
                ? [
                    {
                      label: `Estimated payout (@ ${parsedExchangeRate} ${targetCurrency})`,
                      value: formatTargetCurrency(result.netConverted, targetCurrency),
                      variant: "highlight" as const,
                      isFinal: true,
                    },
                  ]
                : []),
            ]}
            copySummary={copyText}
          />
        ) : (
          <div className="flex h-full min-h-[140px] items-center text-sm text-stone-400">
            Enter an amount on the left to see your estimated payout.
          </div>
        )}
      </div>
    </div>
  );
}
