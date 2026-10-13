"use client";

import { useState } from "react";
import { calculateUpworkFee } from "@/lib/upwork";
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

const COMMON_PRESETS = [
  { value: 10, label: "10% Standard", note: "Most fixed & hourly contracts" },
  { value: 0, label: "0% Direct Contract", note: "Direct Contracts & BYO clients" },
  { value: 15, label: "15% Maximum", note: "Special contract terms" },
];

const CURRENCY_LIST = Object.values(GLOBAL_FREELANCE_CURRENCIES);

export default function UpworkCalculator() {
  const [amount, setAmount] = useState("");
  const [feeRate, setFeeRate] = useState<number>(10);
  const [isCustomFee, setIsCustomFee] = useState(false);
  const [customFeeStr, setCustomFeeStr] = useState("10");

  const [showBonus, setShowBonus] = useState(false);
  const [bonusStr, setBonusStr] = useState("");

  const [showCurrency, setShowCurrency] = useState(false);
  const [targetCurrency, setTargetCurrency] = useState<TargetCurrencyCode>("PKR");
  const [exchangeRateStr, setExchangeRateStr] = useState("278.50");

  const [error, setError] = useState("");

  const parsedAmount = parseFloat(amount);
  const isValidAmount = amount !== "" && !isNaN(parsedAmount) && parsedAmount >= 0;

  const parsedBonus = showBonus ? parseFloat(bonusStr) || 0 : 0;
  const parsedExchangeRate = showCurrency ? parseFloat(exchangeRateStr) || 0 : undefined;

  const effectiveFee = isCustomFee ? Math.min(15, Math.max(0, parseFloat(customFeeStr) || 0)) : feeRate;

  const result = isValidAmount
    ? calculateUpworkFee(
        parsedAmount,
        effectiveFee,
        parsedBonus,
        parsedExchangeRate,
        targetCurrency
      )
    : null;

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setAmount(val);
    const n = parseFloat(val);
    setError(
      val !== "" && (isNaN(n) || n < 0)
        ? "Please enter a valid positive amount."
        : ""
    );
  }

  function handlePresetClick(rate: number) {
    setIsCustomFee(false);
    setFeeRate(rate);
    setCustomFeeStr(rate.toString());
  }

  function handleCustomFeeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setCustomFeeStr(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0 && num <= 15) {
      setFeeRate(num);
    }
  }

  function handleCurrencyChange(code: TargetCurrencyCode) {
    setTargetCurrency(code);
    const meta = GLOBAL_FREELANCE_CURRENCIES[code];
    if (meta) {
      setExchangeRateStr(meta.defaultRate.toString());
    }
  }

  const retainedRate = result && result.totalGross > 0 ? (1 - result.feeRate) * 100 : 0;
  const retainedPercentStr = `${retainedRate.toFixed(1).replace(/\.0$/, "")}%`;

  const copyText = result
    ? `Upwork Earnings Breakdown\nProject amount: ${formatUSD(result.grossAmount)}${
        result.bonusAmount > 0 ? `\nBonus payment: +${formatUSD(result.bonusAmount)}\nTotal gross: ${formatUSD(result.totalGross)}` : ""
      }\nService fee (${formatPercent(result.feeRate)}): −${formatUSD(result.feeAmount)}\nYou keep: ${formatUSD(result.netAmount)} (${retainedPercentStr})${
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
          id="upwork-amount"
          label="How much are you charging?"
          type="number"
          min="0"
          step="0.01"
          placeholder="500"
          prefix="$"
          value={amount}
          onChange={handleAmountChange}
          error={error}
          helpText="Gross contract or milestone amount in USD"
        />

        {/* Fee Rate Selector (0% - 15%) */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <label className="text-xs font-medium uppercase tracking-wider text-stone-500">
              Service fee rate (0% – 15%)
            </label>
            <span className="text-xs font-mono font-medium text-stone-700">
              {effectiveFee}%
            </span>
          </div>

          <div className="space-y-2">
            {COMMON_PRESETS.map((preset) => {
              const isSelected = !isCustomFee && feeRate === preset.value;
              return (
                <label
                  key={preset.value}
                  className={[
                    "flex cursor-pointer items-center justify-between rounded-md border p-3 text-sm transition-colors",
                    isSelected
                      ? "border-[#9bb7a3] bg-[#f0f4f1] text-stone-900"
                      : "border-stone-200 bg-white text-stone-700 hover:border-stone-300",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="upwork-fee-preset"
                      checked={isSelected}
                      onChange={() => handlePresetClick(preset.value)}
                      className="accent-[#44684f]"
                    />
                    <span className="font-medium">{preset.label}</span>
                  </div>
                  <span className="text-xs text-stone-400">{preset.note}</span>
                </label>
              );
            })}

            {/* Custom rate row */}
            <div
              className={[
                "rounded-md border p-3 transition-colors",
                isCustomFee
                  ? "border-[#9bb7a3] bg-[#f0f4f1]"
                  : "border-stone-200 bg-white hover:border-stone-300",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <label
                  className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-stone-800"
                  onClick={() => setIsCustomFee(true)}
                >
                  <input
                    type="radio"
                    name="upwork-fee-preset"
                    checked={isCustomFee}
                    onChange={() => setIsCustomFee(true)}
                    className="accent-[#44684f]"
                  />
                  <span>Custom rate (0% – 15%)</span>
                </label>
                {isCustomFee && (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="15"
                      step="0.1"
                      value={customFeeStr}
                      onChange={handleCustomFeeChange}
                      className="w-16 rounded border border-stone-300 bg-white px-2 py-1 text-right text-xs font-mono font-medium text-stone-900 focus:border-[#44684f] focus:outline-none"
                    />
                    <span className="text-xs text-stone-500">%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-stone-500">
            Current Upwork policy locks the exact fee (0%–15%) per contract at the time of proposal or offer.
          </p>
        </div>

        {/* Optional Bonus Toggle */}
        <div className="border-t border-stone-100 pt-4">
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-stone-700">
            <input
              type="checkbox"
              checked={showBonus}
              onChange={(e) => setShowBonus(e.target.checked)}
              className="rounded accent-[#44684f]"
            />
            <span>Include bonus / additional payment</span>
          </label>
          {showBonus && (
            <div className="mt-3">
              <InputField
                id="upwork-bonus"
                label="Bonus amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="100"
                prefix="$"
                value={bonusStr}
                onChange={(e) => setBonusStr(e.target.value)}
                helpText="Bonuses are subject to the same contract fee rate"
              />
            </div>
          )}
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
                id="upwork-exchange-rate"
                label={`Exchange rate (${targetCurrency} per USD)`}
                type="number"
                min="0.01"
                step="0.01"
                placeholder="278.50"
                suffix={targetCurrency}
                value={exchangeRateStr}
                onChange={(e) => setExchangeRateStr(e.target.value)}
                helpText="Your bank, Wise, or Payoneer telegraphic transfer rate"
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
                label: "Project amount",
                value: formatUSD(result.grossAmount),
              },
              ...(result.bonusAmount > 0
                ? [
                    {
                      label: "Bonus payment",
                      value: `+ ${formatUSD(result.bonusAmount)}`,
                    },
                    {
                      label: "Total gross billed",
                      value: formatUSD(result.totalGross),
                    },
                  ]
                : []),
              {
                label: `Upwork fee (${formatPercent(result.feeRate)})`,
                value: `− ${formatUSD(result.feeAmount)}`,
                variant: "muted",
              },
              {
                label: "You keep (USD)",
                value: `${formatUSD(result.netAmount)} (${retainedPercentStr})`,
                variant: "highlight",
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
