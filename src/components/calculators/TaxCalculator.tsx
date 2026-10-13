"use client";

import { useState } from "react";
import {
  calculatePakistanWithholdingTax,
  type TaxYear,
  type IncomeCategory,
  type FilerStatus,
  type PsebRegistration,
} from "@/lib/tax";
import { formatPKR, formatUSD } from "@/lib/formatters";
import InputField from "@/components/ui/InputField";
import ResultCard from "@/components/ui/ResultCard";

export default function TaxCalculator() {
  const [taxYear, setTaxYear] = useState<TaxYear>("2027");
  const [incomeCategory, setIncomeCategory] = useState<IncomeCategory>("it_export");
  const [filerStatus, setFilerStatus] = useState<FilerStatus>("active");
  const [psebRegistration, setPsebRegistration] = useState<PsebRegistration>("registered");

  const [currencyMode, setCurrencyMode] = useState<"USD" | "PKR">("USD");
  const [amountStr, setAmountStr] = useState("1000");
  const [exchangeRateStr, setExchangeRateStr] = useState("278.50");
  const [error, setError] = useState("");

  const parsedAmount = parseFloat(amountStr);
  const isValidAmount = amountStr !== "" && !isNaN(parsedAmount) && parsedAmount >= 0;

  const parsedExchangeRate = parseFloat(exchangeRateStr) || 278.5;
  const grossAmountPkr = isValidAmount
    ? currencyMode === "USD"
      ? parsedAmount * parsedExchangeRate
      : parsedAmount
    : 0;

  const usdAmount = currencyMode === "USD" ? parsedAmount : undefined;

  const result = isValidAmount
    ? calculatePakistanWithholdingTax({
        grossAmountPkr,
        taxYear,
        incomeCategory,
        filerStatus,
        psebRegistration,
        usdAmount,
        exchangeRate: currencyMode === "USD" ? parsedExchangeRate : undefined,
      })
    : null;

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setAmountStr(val);
    const n = parseFloat(val);
    setError(
      val !== "" && (isNaN(n) || n < 0)
        ? "Please enter a valid positive amount."
        : ""
    );
  }

  const retainedRate = result ? 100 - result.applicableRate : 0;
  const retainedPercentStr = `${retainedRate.toFixed(2).replace(/\.00$/, "")}%`;

  const estimatedWithholdingUSD =
    result && result.usdAmount
      ? (result.usdAmount * result.applicableRate) / 100
      : undefined;

  const netUSD =
    result && result.usdAmount && estimatedWithholdingUSD !== undefined
      ? result.usdAmount - estimatedWithholdingUSD
      : undefined;

  const copyText = result
    ? `Pakistan Withholding Tax Calculation (FBR Tax Year ${result.taxYear})\nGross proceeds: ${
        currencyMode === "USD" ? `${formatUSD(result.usdAmount!)} (` : ""
      }${formatPKR(result.grossAmountPkr)}${currencyMode === "USD" ? ")" : ""}\nApplicable rate: ${
        result.applicableRate
      }%\nEstimated withholding: −${formatPKR(
        result.estimatedWithholdingPkr
      )}${
        estimatedWithholdingUSD !== undefined
          ? ` (−${formatUSD(estimatedWithholdingUSD)})`
          : ""
      }\nNet after withholding: ${formatPKR(
        result.netAfterWithholdingPkr
      )}${netUSD !== undefined ? ` (${formatUSD(netUSD)})` : ""}\nTax Regime: ${
        result.taxRegimeType
      } (${result.sectionReference})`
    : undefined;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-0 md:divide-x md:divide-stone-200">
      {/* Inputs Column */}
      <div className="space-y-6 md:pr-8">
        {/* Currency mode tabs */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium uppercase tracking-wider text-stone-500">
              Receipt Currency
            </label>
            <div className="inline-flex rounded-md border border-stone-200 p-0.5 bg-stone-50 text-xs">
              <button
                type="button"
                onClick={() => {
                  setCurrencyMode("USD");
                  if (currencyMode === "PKR" && isValidAmount) {
                    setAmountStr((parsedAmount / parsedExchangeRate).toFixed(0));
                  }
                }}
                className={[
                  "px-2.5 py-1 rounded font-medium transition-colors",
                  currencyMode === "USD"
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-800",
                ].join(" ")}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrencyMode("PKR");
                  if (currencyMode === "USD" && isValidAmount) {
                    setAmountStr((parsedAmount * parsedExchangeRate).toFixed(0));
                  }
                }}
                className={[
                  "px-2.5 py-1 rounded font-medium transition-colors",
                  currencyMode === "PKR"
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-800",
                ].join(" ")}
              >
                PKR (₨)
              </button>
            </div>
          </div>

          <InputField
            id="gross-proceeds"
            label={
              currencyMode === "USD"
                ? "Gross export proceeds (USD)"
                : "Gross proceeds (PKR)"
            }
            type="number"
            min="0"
            step={currencyMode === "USD" ? "10" : "1000"}
            placeholder={currencyMode === "USD" ? "1000" : "278500"}
            prefix={currencyMode === "USD" ? "$" : "₨"}
            value={amountStr}
            onChange={handleAmountChange}
            error={error}
            helpText={
              currencyMode === "USD"
                ? "Foreign exchange remittance amount received via banking channel"
                : "Total gross amount realized in Pakistani Rupees"
            }
          />
        </div>

        {/* Exchange rate (if USD) */}
        {currencyMode === "USD" && (
          <InputField
            id="tax-exchange-rate"
            label="Bank exchange rate (PKR per USD)"
            type="number"
            min="1"
            step="0.01"
            placeholder="278.50"
            suffix="PKR"
            value={exchangeRateStr}
            onChange={(e) => setExchangeRateStr(e.target.value)}
            helpText="Conversion rate applied by your receiving commercial bank"
          />
        )}

        {/* Tax Year Selection */}
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-stone-500">
            FBR Tax Year
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "2027", label: "Tax Year 2027", sub: "Finance Act 2026 (Current)" },
              { id: "2026", label: "Tax Year 2026", sub: "Prior year assessment" },
            ].map((yr) => (
              <label
                key={yr.id}
                className={[
                  "flex cursor-pointer flex-col rounded-md border p-2.5 text-xs transition-colors",
                  taxYear === yr.id
                    ? "border-[#9bb7a3] bg-[#f0f4f1] text-stone-900"
                    : "border-stone-200 bg-white text-stone-700 hover:border-stone-300",
                ].join(" ")}
              >
                <div className="flex items-center gap-1.5 font-medium">
                  <input
                    type="radio"
                    name="tax-year"
                    value={yr.id}
                    checked={taxYear === yr.id}
                    onChange={() => setTaxYear(yr.id as TaxYear)}
                    className="accent-[#44684f]"
                  />
                  <span>{yr.label}</span>
                </div>
                <span className="mt-1 text-[11px] text-stone-500">{yr.sub}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Income Category */}
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-stone-500">
            Income Category
          </label>
          <div className="space-y-2">
            {[
              {
                id: "it_export",
                label: "IT / IT-enabled Services Export",
                desc: "Software dev, web design, apps, digital marketing, BPO, freelancing",
              },
              {
                id: "other_export",
                label: "Other Services Export",
                desc: "Consultancy, accounting, or non-IT export services (Sec 154A(1)(b))",
              },
              {
                id: "domestic_services",
                label: "Domestic Services (Local clients)",
                desc: "Services provided to Pakistani clients within Pakistan (Sec 153)",
              },
            ].map((cat) => (
              <label
                key={cat.id}
                className={[
                  "flex cursor-pointer items-start gap-2.5 rounded-md border p-3 text-xs transition-colors",
                  incomeCategory === cat.id
                    ? "border-[#9bb7a3] bg-[#f0f4f1] text-stone-900"
                    : "border-stone-200 bg-white text-stone-700 hover:border-stone-300",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name="income-category"
                  value={cat.id}
                  checked={incomeCategory === cat.id}
                  onChange={() => setIncomeCategory(cat.id as IncomeCategory)}
                  className="mt-0.5 accent-[#44684f]"
                />
                <div>
                  <p className="font-medium text-stone-900">{cat.label}</p>
                  <p className="mt-0.5 text-[11px] text-stone-500">{cat.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Filer Status */}
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-stone-500">
            Active Taxpayer Status (ATL)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                id: "active",
                label: "Active Filer (on ATL)",
                desc: "Standard statutory rates",
              },
              {
                id: "inactive",
                label: "Non-Filer / Inactive",
                desc: "Tenth Schedule (100% higher)",
              },
            ].map((st) => (
              <label
                key={st.id}
                className={[
                  "flex cursor-pointer flex-col rounded-md border p-2.5 text-xs transition-colors",
                  filerStatus === st.id
                    ? "border-[#9bb7a3] bg-[#f0f4f1] text-stone-900"
                    : "border-stone-200 bg-white text-stone-700 hover:border-stone-300",
                ].join(" ")}
              >
                <div className="flex items-center gap-1.5 font-medium">
                  <input
                    type="radio"
                    name="filer-status"
                    value={st.id}
                    checked={filerStatus === st.id}
                    onChange={() => setFilerStatus(st.id as FilerStatus)}
                    className="accent-[#44684f]"
                  />
                  <span>{st.label}</span>
                </div>
                <span className="mt-1 text-[11px] text-stone-500">{st.desc}</span>
              </label>
            ))}
          </div>
        </div>

        {/* PSEB Registration (Only for IT export) */}
        {incomeCategory === "it_export" && (
          <div className="rounded-md border border-stone-200 bg-stone-50/70 p-3">
            <label className="flex cursor-pointer items-start gap-2.5 text-xs text-stone-800">
              <input
                type="checkbox"
                checked={psebRegistration === "registered"}
                onChange={(e) =>
                  setPsebRegistration(
                    e.target.checked ? "registered" : "not_registered"
                  )
                }
                className="mt-0.5 rounded accent-[#44684f]"
              />
              <div>
                <span className="font-medium text-stone-900">
                  Registered with PSEB / PBIT (Active & Compliant)
                </span>
                <p className="mt-0.5 text-[11px] leading-relaxed text-stone-500">
                  Qualifies for the <strong>0.25% concessionary final tax rate</strong> under Section 154A(2) of the Income Tax Ordinance. Requires active PSEB registration and timely sales tax return filings.
                </p>
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Results Column */}
      <div className="md:pl-8">
        {result ? (
          <div className="space-y-4">
            <ResultCard
              highlightLabel="Estimated net proceeds"
              highlightValue={formatPKR(result.netAfterWithholdingPkr)}
              retainedPercent={retainedPercentStr}
              rows={[
                {
                  label: "Gross proceeds",
                  value: `${formatPKR(result.grossAmountPkr)}${
                    result.usdAmount ? ` (${formatUSD(result.usdAmount)})` : ""
                  }`,
                },
                {
                  label: `Withholding rate (${result.sectionReference})`,
                  value: `${result.applicableRate.toFixed(2).replace(/\.00$/, "")}%`,
                  variant: "highlight",
                },
                {
                  label: "Tax deducted at source",
                  value: `− ${formatPKR(result.estimatedWithholdingPkr)}${
                    estimatedWithholdingUSD !== undefined
                      ? ` (${formatUSD(estimatedWithholdingUSD)})`
                      : ""
                  }`,
                  variant: "muted",
                },
                {
                  label: "Net after withholding",
                  value: `${formatPKR(result.netAfterWithholdingPkr)}${
                    netUSD !== undefined ? ` (${formatUSD(netUSD)})` : ""
                  }`,
                  variant: "highlight",
                  isFinal: true,
                },
              ]}
              copySummary={copyText}
            />

            {/* Regime details card */}
            <div className="rounded-md border border-stone-200 bg-white p-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium text-stone-900">
                  Tax Regime Classification:
                </span>
                <span
                  className={[
                    "rounded px-2 py-0.5 text-[11px] font-medium",
                    result.taxRegimeType === "Final Tax"
                      ? "bg-[#eaf1ec] text-[#2f4d38]"
                      : "bg-stone-100 text-stone-800",
                  ].join(" ")}
                >
                  {result.taxRegimeType}
                </span>
              </div>
              <p className="mt-2 text-stone-600 leading-relaxed">
                {result.ruleExplanation}
              </p>
              <div className="mt-3 border-t border-stone-100 pt-2 text-[11px] text-stone-400">
                Statutory reference: {result.sectionReference}, Income Tax Ordinance 2001 (Rate Card Tax Year {result.taxYear}).
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full min-h-[140px] items-center text-sm text-stone-400">
            Enter your gross export proceeds on the left to see the official withholding tax breakdown.
          </div>
        )}
      </div>
    </div>
  );
}
