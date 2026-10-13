"use client";

import { useState } from "react";

export interface ResultRowProps {
  label: string;
  value: string;
  variant?: "default" | "highlight" | "muted";
  isFinal?: boolean;
}

interface ResultCardProps {
  title?: string;
  highlightLabel?: string;
  highlightValue?: string;
  retainedPercent?: string;
  rows: ResultRowProps[];
  copySummary?: string;
  className?: string;
}

export default function ResultCard({
  title,
  highlightLabel = "Your estimated payout",
  highlightValue,
  retainedPercent,
  rows,
  copySummary,
  className,
}: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!copySummary) return;
    try {
      await navigator.clipboard.writeText(copySummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API not permitted
    }
  }

  return (
    <div className={`space-y-6 ${className ?? ""}`}>
      {/* Primary Highlight */}
      {highlightValue && (
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
            {highlightLabel}
          </p>
          <div className="mt-1 flex items-baseline gap-2.5">
            <span className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl tabular-nums">
              {highlightValue}
            </span>
            {retainedPercent && (
              <span className="text-xs font-medium text-stone-500">
                ({retainedPercent} retained)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Aligned Breakdown */}
      <div>
        {title && (
          <h3 className="mb-2.5 text-xs font-medium uppercase tracking-wider text-stone-400">
            {title}
          </h3>
        )}

        <div className="space-y-2 text-sm">
          {rows.map((row, index) => {
            const isLast = index === rows.length - 1;
            const isHighlighted = row.variant === "highlight";
            const isMuted = row.variant === "muted";

            return (
              <div
                key={row.label}
                className={[
                  "flex items-center justify-between",
                  isLast || row.isFinal
                    ? "border-t border-stone-200 pt-2.5 mt-2.5 font-medium text-stone-900"
                    : "",
                ].join(" ")}
              >
                <span
                  className={
                    isHighlighted
                      ? "text-stone-900 font-medium"
                      : "text-stone-600"
                  }
                >
                  {row.label}
                </span>
                <span
                  className={[
                    "tabular-nums text-right",
                    isHighlighted
                      ? "text-stone-900 font-semibold"
                      : isMuted
                      ? "text-stone-500"
                      : "text-stone-800",
                  ].join(" ")}
                >
                  {row.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Discreet copy action */}
      {copySummary && (
        <div className="pt-0.5">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 transition-colors hover:text-stone-900 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#44684f]"
            aria-label="Copy breakdown to clipboard"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {copied ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                />
              )}
            </svg>
            <span>{copied ? "Copied to clipboard" : "Copy breakdown"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
