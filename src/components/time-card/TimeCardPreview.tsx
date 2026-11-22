"use client";

import { useState } from "react";
import { CalculatedTimeCardPreview, TimeCardData } from "./types";
import {
  formatDateReadable,
  formatTime12h,
  getWeekday,
  computeElapsedMinutes,
  formatMinutes,
  formatMoney,
  generateTimeCardPdf,
  downloadTimeCardCsv,
} from "./utils";

interface TimeCardPreviewProps {
  timeCardData: TimeCardData;
  calculatedPreview: CalculatedTimeCardPreview;
}

export function TimeCardPreview({
  timeCardData,
  calculatedPreview,
}: TimeCardPreviewProps) {
  const [showPayDetails, setShowPayDetails] = useState(
    timeCardData.includePayDetails ?? true
  );
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleExportPDF = () => {
    setErrorMessage("");
    setIsExportingPDF(true);
    try {
      if (!timeCardData.sessions || timeCardData.sessions.length === 0) {
        setErrorMessage("Please enter at least one session to export.");
        return;
      }
      const doc = generateTimeCardPdf(timeCardData, calculatedPreview, {
        includePayDetails: showPayDetails,
        includeSignatures: Boolean(timeCardData.includeSignatures),
        includeCredit: Boolean(timeCardData.includeCredit),
        paperSize: "a4",
      });
      const baseName =
        [timeCardData.workerName, timeCardData.clientName, timeCardData.projectName]
          .filter(Boolean)
          .join("-") || "timesheet";
      const safeName = baseName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      doc.save(`timesheet-${safeName || "export"}-${timeCardData.payPeriodStartDate || "period"}.pdf`);
    } catch {
      setErrorMessage("PDF generation failed. Please check inputs.");
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportCSV = () => {
    setErrorMessage("");
    setIsExportingCSV(true);
    try {
      if (!timeCardData.sessions || timeCardData.sessions.length === 0) {
        setErrorMessage("Please enter at least one session to export.");
        return;
      }
      downloadTimeCardCsv(timeCardData, calculatedPreview, {
        includePayDetails: showPayDetails,
        format: timeCardData.csvFormat || "data_only",
      });
    } catch {
      setErrorMessage("CSV generation failed. Please check inputs.");
    } finally {
      setIsExportingCSV(false);
    }
  };

  const isBilling = timeCardData.rateType === "billing";
  const rateLabel = isBilling ? "Client Billing Rate" : "Worker Pay Rate";
  const totalPayLabel = isBilling ? "Total Estimated Client Billing" : "Total Estimated Gross Pay";

  return (
    <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="border-b border-stone-200 bg-stone-50 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
            Timesheet Live Preview
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="toggle-pay-details" className="text-xs text-stone-600 font-medium cursor-pointer select-none">
            Pay details
          </label>
          <button
            id="toggle-pay-details"
            type="button"
            onClick={() => setShowPayDetails(!showPayDetails)}
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 cursor-pointer ${
              showPayDetails ? "bg-emerald-600" : "bg-stone-300"
            }`}
            aria-label="Toggle show pay details"
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform ${
                showPayDetails ? "translate-x-4.5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="p-5 sm:p-6 space-y-5">
        {/* Document Meta Header (omitting empty optional fields) */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-stone-900 tracking-tight">
              TIMESHEET
            </h3>
            {timeCardData.workerName && (
              <p className="text-xs text-stone-600 mt-0.5">
                Worker: <strong className="text-stone-900 font-semibold">{timeCardData.workerName}</strong>
              </p>
            )}
            {timeCardData.clientName && (
              <p className="text-xs text-stone-600 mt-0.5">
                Client: <strong className="text-stone-900 font-semibold">{timeCardData.clientName}</strong>
              </p>
            )}
            {timeCardData.projectName && (
              <p className="text-xs text-stone-600 mt-0.5">
                Project: <strong className="text-stone-900 font-semibold">{timeCardData.projectName}</strong>
              </p>
            )}
          </div>

          <div className="sm:text-right">
            <div className="text-[11px] text-stone-500 font-medium uppercase tracking-wider">Reporting Period</div>
            <div className="text-sm font-semibold text-stone-900">
              {timeCardData.payPeriodStartDate ? (
                timeCardData.payPeriodEndDate ? (
                  `${formatDateReadable(timeCardData.payPeriodStartDate)} – ${formatDateReadable(timeCardData.payPeriodEndDate)}`
                ) : (
                  formatDateReadable(timeCardData.payPeriodStartDate)
                )
              ) : (
                "—"
              )}
            </div>
            {showPayDetails && timeCardData.hourlyRate > 0 && (
              <div className="text-xs text-stone-600 mt-1">
                {rateLabel}: <strong className="text-stone-900">{formatMoney(timeCardData.hourlyRate, timeCardData.currency)}/hr</strong>
              </div>
            )}
          </div>
        </div>

        {/* 3 Summary Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg bg-stone-50 p-3.5 border border-stone-200">
            <span className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-0.5">
              Elapsed Time
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-stone-900">
                {formatMinutes(calculatedPreview.totalElapsedMinutes)}
              </span>
              <span className="text-xs text-stone-400">
                ({calculatedPreview.totalWorkedHours.toFixed(2)}h)
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-stone-50 p-3.5 border border-stone-200">
            <span className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-0.5">
              Unpaid Breaks
            </span>
            <div className="flex items-baseline gap-1.5 text-stone-700">
              <span className="text-xl font-bold">
                {formatMinutes(calculatedPreview.totalBreakMinutes)}
              </span>
              <span className="text-xs text-stone-400">
                ({calculatedPreview.unpaidBreakHours.toFixed(2)}h)
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-emerald-50/70 p-3.5 border border-emerald-200">
            <span className="block text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-0.5">
              Net Worked Time
            </span>
            <div className="flex items-baseline gap-1.5 text-emerald-950">
              <span className="text-xl font-extrabold">
                {formatMinutes(calculatedPreview.totalWorkedMinutes)}
              </span>
              <span className="text-xs text-emerald-700 font-semibold">
                ({calculatedPreview.netWorkedHours.toFixed(2)}h billed)
              </span>
            </div>
          </div>
        </div>

        {/* Sessions Table Breakdown (without unnecessary row number column) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-600">
            <span>Shift Breakdown ({timeCardData.sessions.length})</span>
            <span>Total: {formatMinutes(calculatedPreview.totalWorkedMinutes)} ({calculatedPreview.netWorkedHours.toFixed(2)} hrs)</span>
          </div>

          <div className="rounded-lg border border-stone-200 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-[11px] font-bold uppercase tracking-wider text-stone-600 border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-2">Shift</th>
                  <th className="py-2.5 px-2 text-center">Break</th>
                  <th className="py-2.5 px-3 text-right">Worked Time</th>
                  <th className="py-2.5 px-3">Task / Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {timeCardData.sessions.map((session, idx) => {
                  const elapsed = computeElapsedMinutes(session);
                  const breakM = session.unpaidBreakMins || 0;
                  const netM = Math.max(0, elapsed - breakM);
                  const netH = (netM / 60).toFixed(2);
                  const weekday = getWeekday(session.date);

                  return (
                    <tr key={session.id || idx} className={idx % 2 === 1 ? "bg-stone-50/50" : ""}>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="font-semibold text-stone-900">
                          {session.date ? formatDateReadable(session.date) : `Session ${idx + 1}`}
                          {weekday && <span className="ml-1 text-[11px] font-normal text-stone-500">({weekday})</span>}
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-stone-700 whitespace-nowrap">
                        {formatTime12h(session.startTime)} – {formatTime12h(session.endTime)}
                        {session.endsNextDay && (
                          <span className="ml-1 rounded bg-amber-100 px-1 py-0.2 text-[9px] font-bold text-amber-800">
                            +1d
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-center text-stone-600 whitespace-nowrap">
                        {breakM > 0 ? `${breakM}m` : "0m"}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-stone-900 tabular-nums whitespace-nowrap">
                        {formatMinutes(netM)} <span className="font-normal text-stone-500 text-[11px]">({netH}h)</span>
                      </td>
                      <td className="py-2.5 px-3 text-stone-600">
                        {session.comment || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pay Calculation (if toggled) */}
        {showPayDetails && timeCardData.hourlyRate > 0 && (
          <div className="rounded-lg border border-stone-200 bg-stone-50/60 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200/80 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                {isBilling ? "Client Billing Calculation" : "Gross Pay Calculation"}
              </span>
              <span className="text-xs text-stone-600">
                {rateLabel}: <strong>{formatMoney(timeCardData.hourlyRate, timeCardData.currency)}/hr</strong>
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>
                  {isBilling ? "Regular Hours" : "Regular Hours"} ({(calculatedPreview.netWorkedHours - calculatedPreview.overtimeApplied).toFixed(2)} hrs)
                </span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  {formatMoney(calculatedPreview.grossPay, timeCardData.currency)}
                </span>
              </div>

              {calculatedPreview.overtimeApplied > 0 && (
                <div className="flex justify-between text-amber-800">
                  <span>
                    Overtime ({calculatedPreview.overtimeApplied.toFixed(2)} hrs @ {calculatedPreview.overtimeMultiplier}x)
                  </span>
                  <span className="font-semibold tabular-nums">
                    + {formatMoney(calculatedPreview.overtimePay, timeCardData.currency)}
                  </span>
                </div>
              )}

              <div className="border-t border-stone-200 pt-2 flex justify-between items-center text-sm font-bold text-emerald-900">
                <span>{totalPayLabel}</span>
                <span className="text-base tabular-nums">
                  {formatMoney(calculatedPreview.totalPay, timeCardData.currency)}
                </span>
              </div>

              <div className="text-[11px] text-stone-500 pt-1">
                {timeCardData.overtimeThreshold > 0 && timeCardData.overtimeMultiplier > 1
                  ? `Overtime: ${timeCardData.overtimeMultiplier}x after ${timeCardData.overtimeThreshold.toFixed(1)} hrs/period.`
                  : "Overtime: None / standard rate for all hours."}
                {" "}
                {isBilling
                  ? "Estimates exclude applicable sales taxes, client fees, and reimbursable expenses."
                  : "Estimates represent gross earnings and exclude taxes, withholdings, and deductions."}
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="rounded border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700">
            {errorMessage}
          </div>
        )}

        {/* Export Buttons */}
        <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-stone-900 py-2.5 px-4 text-xs font-bold text-white shadow-xs hover:bg-stone-800 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            {isExportingPDF ? "Generating PDF..." : "Download PDF"}
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            disabled={isExportingCSV}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white py-2.5 px-4 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg className="h-4 w-4 text-stone-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12L12 16.5m0 0L16.5 12M12 3v13.5" />
            </svg>
            {isExportingCSV ? "Exporting CSV..." : "Download CSV"}
          </button>
        </div>
      </div>
    </div>
  );
}
