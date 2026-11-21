"use client";

import { useState, useEffect } from "react";
import {
  TimeCardData,
  CalculatedTimeCardPreview,
  Currency,
  Session,
  defaultTimeCardData,
} from "./types";
import {
  CURRENCY_SYMBOLS,
  CURRENCY_NAMES,
  computeWorkedMinutes,
  formatMinutes,
  createSampleTimeCard,
  generateTimeCardPdf,
  downloadTimeCardCsv,
} from "./utils";

interface TimeCardEditorProps {
  timeCardData: TimeCardData;
  onUpdate: (updates: Partial<TimeCardData>) => void;
  calculatedPreview: CalculatedTimeCardPreview;
}

export function TimeCardEditor({
  timeCardData,
  onUpdate,
  calculatedPreview,
}: TimeCardEditorProps) {
  const [isAutoSave, setIsAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [paperSize, setPaperSize] = useState<"a4" | "letter">("a4");
  const [exportError, setExportError] = useState("");

  // Auto-save indicator
  useEffect(() => {
    if (isAutoSave) {
      setLastSaved(new Date());
    }
  }, [timeCardData, isAutoSave]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleAddSession = () => {
    // Default next session date to last session date or today
    const lastSession = timeCardData.sessions[timeCardData.sessions.length - 1];
    let nextDate = new Date().toISOString().split("T")[0];
    if (lastSession?.date) {
      try {
        const d = new Date(lastSession.date + "T00:00:00");
        d.setDate(d.getDate() + 1);
        nextDate = d.toISOString().split("T")[0];
      } catch {
        // fallback to today
      }
    }

    const newSession: Session = {
      id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: nextDate,
      startTime: "09:00",
      endTime: "17:00",
      unpaidBreakMins: 30,
      endsNextDay: false,
      comment: "",
    };
    onUpdate({ sessions: [...timeCardData.sessions, newSession] });
  };

  const handleRemoveSession = (index: number) => {
    const updated = timeCardData.sessions.filter((_, i) => i !== index);
    onUpdate({ sessions: updated });
  };

  const handleUpdateSession = (
    index: number,
    updates: Partial<Session>
  ) => {
    const updated = timeCardData.sessions.map((s, i) =>
      i === index ? { ...s, ...updates } : s
    );
    onUpdate({ sessions: updated });
  };

  const handleLoadSample = () => {
    if (
      timeCardData.sessions.length > 1 ||
      timeCardData.clientName ||
      timeCardData.hourlyRate > 0
    ) {
      if (
        !window.confirm(
          "Load 5-day sample timesheet? This will replace your current entries."
        )
      ) {
        return;
      }
    }
    const sample = createSampleTimeCard();
    onUpdate(sample);
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        "Clear all sessions and reset to default? This cannot be undone."
      )
    ) {
      onUpdate(defaultTimeCardData);
    }
  };

  const handleExportPDF = () => {
    setExportError("");
    try {
      if (!timeCardData.sessions || timeCardData.sessions.length === 0) {
        setExportError("Please add at least one work session before exporting.");
        return;
      }
      const doc = generateTimeCardPdf(timeCardData, calculatedPreview, true, paperSize);
      const safeName = (timeCardData.clientName || "freelancer")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");
      doc.save(`timesheet-${safeName}-${timeCardData.payPeriodStartDate || "export"}.pdf`);
    } catch (err) {
      setExportError("Failed to generate PDF. Please check your session inputs.");
    }
  };

  const handleExportCSV = () => {
    setExportError("");
    try {
      if (!timeCardData.sessions || timeCardData.sessions.length === 0) {
        setExportError("Please add at least one work session before exporting.");
        return;
      }
      downloadTimeCardCsv(timeCardData, calculatedPreview, true);
    } catch (err) {
      setExportError("Failed to export CSV. Please check your session inputs.");
    }
  };

  const curSymbol = CURRENCY_SYMBOLS[timeCardData.currency] || "$";

  return (
    <div className="space-y-5 rounded-xl border border-stone-200 bg-white p-5 sm:p-6 shadow-xs">
      {/* Top Header & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            Time Card Editor
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Record shifts, breaks, and calculate gross billings
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lastSaved && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Draft saved {formatTime(lastSaved)}
            </span>
          )}

          <div className="flex items-center gap-1.5">
            <span
              className={`text-xs font-medium ${
                isAutoSave ? "text-emerald-700" : "text-stone-400"
              }`}
            >
              Auto-save
            </span>
            <button
              type="button"
              onClick={() => setIsAutoSave(!isAutoSave)}
              className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 ${
                isAutoSave ? "bg-emerald-600" : "bg-stone-300"
              }`}
              aria-label="Toggle auto save"
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform ${
                  isAutoSave ? "translate-x-4.5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-lg border border-stone-200/80 bg-stone-50/70 p-2.5 text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadSample}
            className="rounded border border-stone-200 bg-white px-2.5 py-1 font-medium text-stone-700 hover:bg-stone-100 transition-colors shadow-2xs"
          >
            Load 5-Day Sample
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="rounded border border-stone-200 bg-white px-2.5 py-1 font-medium text-stone-600 hover:text-rose-600 hover:bg-rose-50 transition-colors shadow-2xs"
          >
            Clear All
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[11px] text-stone-500 font-medium">Paper:</label>
          <select
            value={paperSize}
            onChange={(e) => setPaperSize(e.target.value as "a4" | "letter")}
            className="rounded border border-stone-200 bg-white px-2 py-0.5 text-xs text-stone-700 focus:border-emerald-500 focus:outline-none"
          >
            <option value="a4">A4</option>
            <option value="letter">US Letter</option>
          </select>
        </div>
      </div>

      {/* Error Notice */}
      {exportError && (
        <div
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700"
        >
          {exportError}
        </div>
      )}

      {/* Project & Client Settings */}
      <div className="rounded-lg border border-stone-200/90 bg-stone-50/40 p-4 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">
          Project & Pay Period
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label
              htmlFor="tc-clientName"
              className="block text-xs font-semibold text-stone-700 mb-1"
            >
              Client / Project Name
            </label>
            <input
              id="tc-clientName"
              type="text"
              value={timeCardData.clientName}
              onChange={(e) => onUpdate({ clientName: e.target.value })}
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="e.g., Acme Studio, Freelance Contract"
            />
          </div>

          <div>
            <label
              htmlFor="tc-payPeriodStartDate"
              className="block text-xs font-semibold text-stone-700 mb-1"
            >
              Pay Period Start Date
            </label>
            <input
              id="tc-payPeriodStartDate"
              type="date"
              value={timeCardData.payPeriodStartDate}
              onChange={(e) => onUpdate({ payPeriodStartDate: e.target.value })}
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          <div>
            <label
              htmlFor="tc-currency"
              className="block text-xs font-semibold text-stone-700 mb-1"
            >
              Currency
            </label>
            <select
              id="tc-currency"
              value={timeCardData.currency}
              onChange={(e) =>
                onUpdate({ currency: e.target.value as Currency })
              }
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {(Object.keys(CURRENCY_NAMES) as Currency[]).map((c) => (
                <option key={c} value={c}>
                  {CURRENCY_NAMES[c]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="tc-hourlyRate"
              className="block text-xs font-semibold text-stone-700 mb-1"
            >
              Hourly Rate
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-stone-500">
                {curSymbol}
              </span>
              <input
                id="tc-hourlyRate"
                type="number"
                value={timeCardData.hourlyRate === 0 ? "" : timeCardData.hourlyRate}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onUpdate({ hourlyRate: isNaN(val) ? 0 : Math.max(0, val) });
                }}
                className="w-full rounded-lg border border-stone-300 bg-white pl-8 pr-3 py-2 text-sm text-stone-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="0.00"
                step="0.5"
                min="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Work Sessions List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-stone-900">
            Work Sessions ({timeCardData.sessions.length})
          </label>
          <span className="text-xs text-stone-500">
            Net Worked: <strong className="text-emerald-700 font-semibold">{calculatedPreview.netWorkedHours.toFixed(2)} hrs</strong>
          </span>
        </div>

        {timeCardData.sessions.map((session, index) => {
          const sessionWorkedMins = computeWorkedMinutes(session);
          const sessionHours = (sessionWorkedMins / 60).toFixed(2);
          const formattedDuration = formatMinutes(sessionWorkedMins);

          return (
            <div
              key={session.id}
              className="rounded-lg border border-stone-200 bg-white p-4 transition-all hover:border-stone-300 shadow-2xs space-y-3"
            >
              {/* Session Header */}
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-900 text-[10px] font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="text-xs font-semibold text-stone-800">
                    Session {index + 1}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800 border border-emerald-200/60">
                    {formattedDuration} ({sessionHours} hrs)
                  </span>
                </div>

                {timeCardData.sessions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSession(index)}
                    className="text-xs font-medium text-stone-400 hover:text-rose-600 transition-colors"
                    aria-label={`Remove session ${index + 1}`}
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Time Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={session.date}
                    onChange={(e) =>
                      handleUpdateSession(index, { date: e.target.value })
                    }
                    className="w-full rounded border border-stone-300 px-2.5 py-1.5 text-xs text-stone-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={session.startTime}
                    onChange={(e) =>
                      handleUpdateSession(index, { startTime: e.target.value })
                    }
                    className="w-full rounded border border-stone-300 px-2.5 py-1.5 text-xs text-stone-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={session.endTime}
                    onChange={(e) =>
                      handleUpdateSession(index, { endTime: e.target.value })
                    }
                    className="w-full rounded border border-stone-300 px-2.5 py-1.5 text-xs text-stone-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">
                    Unpaid Break (mins)
                  </label>
                  <input
                    type="number"
                    value={session.unpaidBreakMins === 0 ? "" : session.unpaidBreakMins}
                    onChange={(e) =>
                      handleUpdateSession(index, {
                        unpaidBreakMins: Math.max(0, parseInt(e.target.value, 10) || 0),
                      })
                    }
                    className="w-full rounded border border-stone-300 px-2.5 py-1.5 text-xs text-stone-900 focus:border-emerald-500 focus:outline-none"
                    placeholder="0"
                    min="0"
                    step="5"
                  />
                </div>
              </div>

              {/* Extra Shift Options: Overnight & Notes */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                <div className="flex-1">
                  <input
                    type="text"
                    value={session.comment || ""}
                    onChange={(e) =>
                      handleUpdateSession(index, { comment: e.target.value })
                    }
                    placeholder="Task or notes (optional, e.g., UI Refactor, Client Meeting)"
                    className="w-full rounded border border-stone-200 bg-stone-50/50 px-2.5 py-1 text-xs text-stone-700 placeholder:text-stone-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs text-stone-600 shrink-0 select-none">
                  <input
                    type="checkbox"
                    checked={session.endsNextDay}
                    onChange={(e) =>
                      handleUpdateSession(index, { endsNextDay: e.target.checked })
                    }
                    className="h-3.5 w-3.5 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Ends next day (crosses midnight)</span>
                </label>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={handleAddSession}
          className="w-full rounded-lg border border-dashed border-stone-300 bg-stone-50/80 py-2.5 text-xs font-semibold text-stone-700 hover:border-emerald-500 hover:bg-emerald-50/40 hover:text-emerald-800 transition-colors"
        >
          + Add Work Session
        </button>
      </div>

      {/* Overtime Configuration */}
      <div className="rounded-lg border border-stone-200/90 bg-stone-50/40 p-4 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">
          Overtime Settings (Optional)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label
              htmlFor="tc-overtimeThreshold"
              className="block text-xs font-semibold text-stone-700 mb-1"
            >
              Overtime Threshold (hours/period)
            </label>
            <input
              id="tc-overtimeThreshold"
              type="number"
              value={timeCardData.overtimeThreshold === 0 ? "" : timeCardData.overtimeThreshold}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onUpdate({
                  overtimeThreshold: isNaN(val) ? 0 : Math.max(0, val),
                });
              }}
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="e.g. 40 (0 = disabled)"
              step="1"
              min="0"
            />
            <span className="block text-[11px] text-stone-400 mt-1">
              Hours above this threshold are billed at the overtime rate.
            </span>
          </div>

          <div>
            <label
              htmlFor="tc-overtimeMultiplier"
              className="block text-xs font-semibold text-stone-700 mb-1"
            >
              Overtime Multiplier
            </label>
            <input
              id="tc-overtimeMultiplier"
              type="number"
              value={timeCardData.overtimeMultiplier}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onUpdate({
                  overtimeMultiplier: isNaN(val) ? 1 : Math.max(1, val),
                });
              }}
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="1.5"
              step="0.25"
              min="1"
            />
            <span className="block text-[11px] text-stone-400 mt-1">
              Default is 1.5x (time-and-a-half).
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Export Toolbar */}
      <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleExportPDF}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 py-2.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download PDF Timesheet
        </button>

        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white py-2.5 px-4 text-sm font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
        >
          <svg className="h-4 w-4 text-stone-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12L12 16.5m0 0L16.5 12M12 3v13.5" />
          </svg>
          Download CSV
        </button>
      </div>
    </div>
  );
}
