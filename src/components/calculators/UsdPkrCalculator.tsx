"use client";

import { useState } from "react";
import {
  convertUsdToCurrency,
  GLOBAL_FREELANCE_CURRENCIES,
  type EarningsFrequency,
  type TargetCurrencyCode,
} from "@/lib/currency";
import { formatUSD, formatTargetCurrency } from "@/lib/formatters";
import InputField from "@/components/ui/InputField";
import ResultCard from "@/components/ui/ResultCard";

const FREQUENCIES: { value: EarningsFrequency; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const CURRENCY_LIST = Object.values(GLOBAL_FREELANCE_CURRENCIES);

export default function UsdPkrCalculator() {
  const [usdAmount, setUsdAmount] = useState("1000");
  const [targetCurrency, setTargetCurrency] = useState<TargetCurrencyCode>("PKR");
  const [rate, setRate] = useState("278.50");
  const [frequency, setFrequency] = useState<EarningsFrequency>("monthly");
  const [errors, setErrors] = useState<{ usd?: string; rate?: string }>({});

  const parsedUsd = parseFloat(usdAmount);
  const parsedRate = parseFloat(rate);
  const isValid =
    usdAmount !== "" &&
    rate !== "" &&
    !isNaN(parsedUsd) &&
    parsedUsd >= 0 &&
    !isNaN(parsedRate) &&
    parsedRate > 0;

  const result = isValid
    ? convertUsdToCurrency(parsedUsd, parsedRate, frequency, targetCurrency)
    : null;

  function handleUsdChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setUsdAmount(val);
    const n = parseFloat(val);
    setErrors((prev) => ({
      ...prev,
      usd:
        val !== "" && (isNaN(n) || n < 0)
          ? "Please enter a valid positive amount."
          : undefined,
    }));
  }

  function handleCurrencyChange(code: TargetCurrencyCode) {
    setTargetCurrency(code);
    const meta = GLOBAL_FREELANCE_CURRENCIES[code];
    if (meta) {
      setRate(meta.defaultRate.toString());
    }
  }

  function handleRateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setRate(val);
    const n = parseFloat(val);
    setErrors((prev) => ({
      ...prev,
      rate:
        val !== "" && (isNaN(n) || n <= 0)
          ? "Please enter a valid exchange rate."
          : undefined,
    }));
  }

  const copyText = result
    ? `USD to ${targetCurrency} Freelance Conversion\nUSD earnings (${frequency}): ${formatUSD(
        result.usdAmount
      )}\nExchange rate: ${result.exchangeRate.toFixed(2)} ${targetCurrency}/USD\nPeriod earnings: ${formatTargetCurrency(
        result.convertedAmount,
        targetCurrency
      )}\nMonthly projection: ${formatTargetCurrency(
        result.monthlyConverted,
        targetCurrency
      )}\nAnnual projection: ${formatTargetCurrency(
        result.annualConverted,
        targetCurrency
      )}`
    : undefined;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-0 md:divide-x md:divide-stone-200">
      {/* Inputs Column */}
      <div className="space-y-6 md:pr-8">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-stone-500 mb-2">
            Target Currency
          </label>
          <select
            value={targetCurrency}
            onChange={(e) =>
              handleCurrencyChange(e.target.value as TargetCurrencyCode)
            }
            className="w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 focus:border-[#44684f] focus:outline-none"
          >
            {CURRENCY_LIST.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code} — {c.name} ({c.symbol})
              </option>
            ))}
          </select>
        </div>

        <InputField
          id="usd-amount"
          label="USD earnings"
          type="number"
          min="0"
          step="0.01"
          placeholder="1000"
          prefix="$"
          value={usdAmount}
          onChange={handleUsdChange}
          error={errors.usd}
          helpText="Gross amount earned in USD before platform fees"
        />

        <InputField
          id="exchange-rate"
          label={`Exchange rate (${targetCurrency} per USD)`}
          type="number"
          min="0.01"
          step="0.01"
          placeholder="278.50"
          suffix={targetCurrency}
          value={rate}
          onChange={handleRateChange}
          error={errors.rate}
          helpText="Your receiving bank, Wise, or Payoneer telegraphic transfer rate"
        />

        <fieldset>
          <legend className="mb-2 text-xs font-medium uppercase tracking-wider text-stone-500">
            Earning frequency
          </legend>
          <div className="grid grid-cols-3 gap-2">
            {FREQUENCIES.map(({ value, label }) => {
              const isSelected = frequency === value;
              return (
                <button
                  key={value}
                  id={`freq-${value}`}
                  type="button"
                  onClick={() => setFrequency(value)}
                  className={[
                    "rounded-md border py-2 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#44684f]",
                    isSelected
                      ? "border-[#9bb7a3] bg-[#f0f4f1] text-stone-900"
                      : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-900",
                  ].join(" ")}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      {/* Results Column */}
      <div className="md:pl-8">
        {result ? (
          <ResultCard
            highlightLabel="Estimated monthly payout"
            highlightValue={formatTargetCurrency(
              result.monthlyConverted,
              targetCurrency
            )}
            rows={[
              {
                label: `USD earnings (${frequency})`,
                value: formatUSD(result.usdAmount),
              },
              {
                label: "Exchange rate",
                value: `${result.exchangeRate.toFixed(2)} ${targetCurrency}/USD`,
              },
              {
                label: "Period equivalent",
                value: formatTargetCurrency(
                  result.convertedAmount,
                  targetCurrency
                ),
              },
              {
                label: "Monthly projection",
                value: formatTargetCurrency(
                  result.monthlyConverted,
                  targetCurrency
                ),
                variant: "highlight",
              },
              {
                label: "Annual projection",
                value: formatTargetCurrency(
                  result.annualConverted,
                  targetCurrency
                ),
                isFinal: true,
              },
            ]}
            copySummary={copyText}
          />
        ) : (
          <div className="flex h-full min-h-[140px] items-center text-sm text-stone-400">
            Enter your earnings and exchange rate on the left to see the calculation.
          </div>
        )}
      </div>
    </div>
  );
}
