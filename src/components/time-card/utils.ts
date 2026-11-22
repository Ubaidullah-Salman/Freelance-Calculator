import { jsPDF } from "jspdf";
import autoTable, { applyPlugin } from "jspdf-autotable";
import {
  Session,
  TimeCardConfig,
  TimeCardData,
  CalculatedTimeCardPreview,
  Currency,
} from "./types";

export const DEFAULT_CONFIG: TimeCardConfig = {
  hourlyRate: 0,
  currency: "USD",
  overtimeEnabled: false,
  overtimeThresholdHours: 8,
  overtimeMultiplier: 1.5,
};

// Ensure autotable plugin is applied to jsPDF
try {
  applyPlugin(jsPDF);
} catch {
  // Ignore if already applied
}

/**
 * Generate a short unique ID.
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

/**
 * Parse HH:mm string to minutes since midnight.
 */
export function parseTime(timestr: string): number {
  if (!timestr || typeof timestr !== "string") return 0;
  const parts = timestr.split(":");
  if (parts.length < 2) return 0;
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  return h * 60 + m;
}

/**
 * Format HH:mm string to 12-hour AM/PM string.
 */
export function formatTime12h(timestr: string): string {
  if (!timestr) return "—";
  const parts = timestr.split(":");
  if (parts.length < 2) return timestr;
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

/**
 * Compute total elapsed minutes between start and end.
 */
export function computeElapsedMinutes({
  startTime,
  endTime,
  endsNextDay,
}: {
  startTime: string;
  endTime: string;
  endsNextDay: boolean;
}): number {
  if (!startTime || !endTime) return 0;
  const startM = parseTime(startTime);
  const endM = parseTime(endTime);
  let duration = endM - startM;

  if (endsNextDay || duration < 0) {
    duration += 24 * 60;
  }
  return duration > 0 ? duration : 0;
}

/**
 * Compute net worked minutes for a single session (elapsed - break).
 */
export function computeWorkedMinutes(session: Session): number {
  const elapsed = computeElapsedMinutes(session);
  const breakM = Math.max(0, session.unpaidBreakMins || 0);
  const net = elapsed - breakM;
  return net > 0 ? net : 0;
}

/**
 * Format total minutes as Hh Mm string.
 */
export function formatMinutes(totalMinutes: number): string {
  const safeMins = Math.max(0, Math.round(totalMinutes));
  const h = Math.floor(safeMins / 60);
  const m = safeMins % 60;
  return `${h}h ${m}m`;
}

/**
 * Format minutes as decimal hours with 2 decimal places.
 */
export function formatDecimalHours(totalMinutes: number): number {
  return Number((Math.max(0, totalMinutes) / 60).toFixed(2));
}

/**
 * Currency symbols for display.
 */
export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "CA$",
  AUD: "A$",
  PKR: "₨",
};

/**
 * Currency display names.
 */
export const CURRENCY_NAMES: Record<Currency, string> = {
  USD: "US Dollar ($)",
  EUR: "Euro (€)",
  GBP: "British Pound (£)",
  CAD: "Canadian Dollar (CA$)",
  AUD: "Australian Dollar (A$)",
  PKR: "Pakistani Rupee (₨)",
};

/**
 * Format money amount consistently with currency code, e.g. "$1,391.25 USD".
 */
export function formatMoney(amount: number, currency: Currency): string {
  const sym = CURRENCY_SYMBOLS[currency] || "$";
  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${sym}${formatted} ${currency}`;
}

/**
 * Calculate the calendar end date of a session, taking into account overnight shifts.
 */
export function getSessionEndDate(startDateStr: string, endsNextDay: boolean): string {
  if (!startDateStr) return "";
  if (!endsNextDay) return startDateStr;
  try {
    const parts = startDateStr.split("-").map(Number);
    if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
      return startDateStr;
    }
    const [y, m, d] = parts;
    const date = new Date(Date.UTC(y, m - 1, d + 1));
    return date.toISOString().split("T")[0];
  } catch {
    return startDateStr;
  }
}

/**
 * Calculate totals for a time card.
 * Uses exact minutes rather than rounded display strings to prevent rounding drift.
 */
export function calculateTimeCard(data: TimeCardData): CalculatedTimeCardPreview {
  let totalElapsedMinutes = 0;
  let totalBreakMinutes = 0;
  let totalWorkedMinutes = 0;

  (data.sessions || []).forEach((session) => {
    const elapsed = computeElapsedMinutes(session);
    const breakM = Math.max(0, session.unpaidBreakMins || 0);
    const net = Math.max(0, elapsed - breakM);

    totalElapsedMinutes += elapsed;
    totalBreakMinutes += breakM;
    totalWorkedMinutes += net;
  });

  const totalWorkedHours = formatDecimalHours(totalElapsedMinutes);
  const unpaidBreakHours = formatDecimalHours(totalBreakMinutes);
  const netWorkedHours = formatDecimalHours(totalWorkedMinutes);

  const hourlyRate = Math.max(0, Number(data.hourlyRate) || 0);
  const currency = data.currency || "USD";
  const overtimeThreshold = Math.max(0, Number(data.overtimeThreshold) || 0);
  const overtimeMultiplier = Math.max(1, Number(data.overtimeMultiplier) || 1.5);

  const overtimeEnabled = overtimeThreshold > 0 && overtimeMultiplier > 1;

  let regularHours = netWorkedHours;
  let overtimeApplied = 0;

  if (overtimeEnabled && netWorkedHours > overtimeThreshold) {
    regularHours = overtimeThreshold;
    overtimeApplied = Number((netWorkedHours - overtimeThreshold).toFixed(2));
  }

  const regularPay = Number((regularHours * hourlyRate).toFixed(2));
  const overtimePay = Number(
    (overtimeApplied * hourlyRate * overtimeMultiplier).toFixed(2)
  );
  const grossPay = regularPay;
  const totalPay = Number((regularPay + overtimePay).toFixed(2));

  return {
    totalWorkedHours,
    unpaidBreakHours,
    netWorkedHours,
    totalElapsedMinutes,
    totalBreakMinutes,
    totalWorkedMinutes,
    hourlyRate,
    currency,
    grossPay,
    overtimeApplied,
    overtimeMultiplier,
    overtimePay,
    totalPay,
  };
}

/**
 * Format ISO date string into readable format (e.g., "Nov 21, 2026").
 */
export function formatDateReadable(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Get weekday abbreviation from ISO date string (e.g., "Mon").
 */
export function getWeekday(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", { weekday: "short" });
  } catch {
    return "";
  }
}

/**
 * Generate sample time card data for testing.
 * Verified to total exactly 39h 45m and $1,391.25 at $35/hour.
 */
export function createSampleTimeCard(): TimeCardData {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diffToMonday = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const monday = new Date(today.setDate(diffToMonday));

  const formatDay = (offset: number) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + offset);
    return d.toISOString().split("T")[0];
  };

  return {
    workerName: "Alex Morgan",
    clientName: "Acme Digital Studio",
    projectName: "Web App Refactor",
    hourlyRate: 35,
    rateType: "pay",
    currency: "USD",
    payPeriodStartDate: formatDay(0),
    payPeriodEndDate: formatDay(4),
    overtimeThreshold: 40,
    overtimeMultiplier: 1.5,
    includePayDetails: true,
    includeSignatures: false,
    includeCredit: false,
    csvFormat: "data_only",
    sessions: [
      {
        id: "sample-1",
        date: formatDay(0),
        startTime: "09:00",
        endTime: "17:30",
        unpaidBreakMins: 30,
        endsNextDay: false,
        comment: "Frontend UI implementation and component refactor",
      },
      {
        id: "sample-2",
        date: formatDay(1),
        startTime: "09:00",
        endTime: "17:30",
        unpaidBreakMins: 30,
        endsNextDay: false,
        comment: "API integration and webhook setup",
      },
      {
        id: "sample-3",
        date: formatDay(2),
        startTime: "09:00",
        endTime: "18:00",
        unpaidBreakMins: 45,
        endsNextDay: false,
        comment: "Database schema migration and query optimization",
      },
      {
        id: "sample-4",
        date: formatDay(3),
        startTime: "09:30",
        endTime: "18:00",
        unpaidBreakMins: 30,
        endsNextDay: false,
        comment: "Bug fixing and cross-browser testing",
      },
      {
        id: "sample-5",
        date: formatDay(4),
        startTime: "09:00",
        endTime: "17:00",
        unpaidBreakMins: 30,
        endsNextDay: false,
        comment: "Sprint review, client demo, and documentation",
      },
    ],
  };
}

export interface TimeCardPdfOptions {
  includePayDetails?: boolean;
  includeSignatures?: boolean;
  includeCredit?: boolean;
  paperSize?: "a4" | "letter";
}

/**
 * Generate PDF timesheet using jsPDF and jspdf-autotable.
 * Runs entirely on-device in the browser — no server upload.
 */
export function generateTimeCardPdf(
  data: TimeCardData,
  preview: CalculatedTimeCardPreview,
  optionsOrIncludePay: boolean | TimeCardPdfOptions = true,
  paperSizeFallback: "a4" | "letter" = "a4"
): jsPDF {
  // Resolve options with backward-compatible defaults
  const options: TimeCardPdfOptions =
    typeof optionsOrIncludePay === "boolean"
      ? {
          includePayDetails: optionsOrIncludePay,
          includeSignatures: Boolean(data.includeSignatures),
          includeCredit: Boolean(data.includeCredit),
          paperSize: paperSizeFallback,
        }
      : {
          includePayDetails:
            optionsOrIncludePay.includePayDetails ?? data.includePayDetails ?? true,
          includeSignatures:
            optionsOrIncludePay.includeSignatures ?? Boolean(data.includeSignatures),
          includeCredit:
            optionsOrIncludePay.includeCredit ?? Boolean(data.includeCredit),
          paperSize: optionsOrIncludePay.paperSize ?? paperSizeFallback,
        };

  const paperSize = options.paperSize || "a4";
  const includePay = Boolean(options.includePayDetails);
  const includeSigs = Boolean(options.includeSignatures);
  const includeCredit = Boolean(options.includeCredit);

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: paperSize,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const colors: [number, number, number] = [28, 25, 23]; // stone-900
  const subColor: [number, number, number] = [120, 113, 108]; // stone-500
  const accentColor: [number, number, number] = [16, 149, 106]; // emerald-600

  // Title (slightly reduced title size for cleaner hierarchy)
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors);
  doc.text("TIME CARD / TIMESHEET", margin, y + 2);

  // Meta Info Box (Right-aligned, displaying populated fields only)
  // Give sufficient width (95mm) to prevent label / date collisions
  const metaRightX = pageWidth - margin;
  const metaBlockWidth = 95;
  const metaLabelX = metaRightX - metaBlockWidth;
  let metaY = y - 1;

  doc.setFontSize(8.5);

  const renderMetaRow = (label: string, value: string) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...subColor);
    doc.text(label, metaLabelX, metaY);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors);

    const labelW = doc.getTextWidth(label);
    const valW = doc.getTextWidth(value);

    // If combined width exceeds available block width, wrap value to next line to avoid overlap
    if (labelW + valW + 4 > metaBlockWidth) {
      metaY += 4;
      doc.text(value, metaRightX, metaY, { align: "right" });
      metaY += 4.5;
    } else {
      doc.text(value, metaRightX, metaY, { align: "right" });
      metaY += 4.5;
    }
  };

  if (data.workerName) {
    renderMetaRow("Worker", data.workerName);
  }

  if (data.clientName) {
    renderMetaRow("Client", data.clientName);
  }

  if (data.projectName) {
    renderMetaRow("Project", data.projectName);
  }

  // Full reporting period
  if (data.payPeriodStartDate) {
    const periodText = data.payPeriodEndDate
      ? `${formatDateReadable(data.payPeriodStartDate)} – ${formatDateReadable(data.payPeriodEndDate)}`
      : formatDateReadable(data.payPeriodStartDate);
    renderMetaRow("Reporting Period", periodText);
  }

  // Rate label (distinguishing worker gross pay rate from client billing rate)
  if (includePay && data.hourlyRate > 0) {
    const rateLabel = data.rateType === "billing" ? "Billing Rate" : "Pay Rate";
    renderMetaRow(rateLabel, `${formatMoney(data.hourlyRate, data.currency)} / hr`);
  }

  // Synchronize vertical position below header with tightened gap
  y = Math.max(y + 8, metaY + 2);

  // Subtle separator line
  doc.setDrawColor(225, 222, 218);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 4.5;

  // Table rows (without unnecessary row number column, giving task descriptions more room)
  const tableRows: string[][] = (data.sessions || []).map((session) => {
    const elapsed = computeElapsedMinutes(session);
    const breakM = session.unpaidBreakMins || 0;
    const netM = Math.max(0, elapsed - breakM);
    const netHours = (netM / 60).toFixed(2);
    const weekday = getWeekday(session.date);
    const dateFormatted = formatDateReadable(session.date);

    return [
      weekday ? `${weekday}, ${dateFormatted}` : dateFormatted || "—",
      formatTime12h(session.startTime),
      formatTime12h(session.endTime) + (session.endsNextDay ? " (+1d)" : ""),
      breakM > 0 ? `${breakM}m` : "0m",
      `${formatMinutes(netM)} (${netHours}h)`,
      session.comment || "—",
    ];
  });

  const commentColWidth = contentWidth - (34 + 20 + 24 + 18 + 32);

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Date", "Start", "End", "Break", "Worked Time", "Description / Task"]],
    body: tableRows,
    columnStyles: {
      0: { cellWidth: 34, fontStyle: "bold" },
      1: { cellWidth: 20, halign: "center" },
      2: { cellWidth: 24, halign: "center" },
      3: { cellWidth: 18, halign: "center" },
      4: { cellWidth: 32, halign: "right", fontStyle: "bold" },
      5: { cellWidth: commentColWidth, fontStyle: "normal" },
    },
    headStyles: {
      fillColor: colors,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 8,
      textColor: colors,
    },
    alternateRowStyles: {
      fillColor: [248, 247, 245],
    },
    theme: "striped",
    tableWidth: contentWidth,
    showHead: "everyPage",
    rowPageBreak: "avoid",
  });

  const lastTable = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable;
  y = (lastTable ? lastTable.finalY : y) + 5;

  // Avoid awkwardly split totals block across page breaks
  const totalsBlockHeight = includePay && data.hourlyRate > 0 ? 46 : 22;
  if (y + totalsBlockHeight > pageHeight - margin - (includeSigs ? 35 : 10)) {
    doc.addPage();
    y = margin;
  }

  // Widen totals block to 115mm to guarantee no label/value overlap
  const totalsBlockWidth = 115;
  const totalsLabelX = pageWidth - margin - totalsBlockWidth;
  const totalsValX = pageWidth - margin;

  const renderTotalRow = (
    label: string,
    value: string,
    options?: {
      isBold?: boolean;
      fontSize?: number;
      labelColor?: [number, number, number];
      valColor?: [number, number, number];
    }
  ) => {
    const isBold = options?.isBold ?? false;
    const fontSize = options?.fontSize ?? 8.5;
    const labelColor = options?.labelColor ?? (isBold ? colors : subColor);
    const valColor = options?.valColor ?? (isBold ? colors : colors);

    doc.setFontSize(fontSize);
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setTextColor(...labelColor);
    doc.text(label, totalsLabelX, y);

    doc.setTextColor(...valColor);
    const labelW = doc.getTextWidth(label);
    const valW = doc.getTextWidth(value);

    // If combined width exceeds block width, wrap value to next line to prevent overlap
    if (labelW + valW + 4 > totalsBlockWidth) {
      y += 4;
      doc.text(value, totalsValX, y, { align: "right" });
      y += 4.5;
    } else {
      doc.text(value, totalsValX, y, { align: "right" });
      y += 4.5;
    }
  };

  // Total Elapsed
  renderTotalRow(
    "Total Elapsed Time",
    `${formatMinutes(preview.totalElapsedMinutes)} (${preview.totalWorkedHours.toFixed(2)} hrs)`
  );

  // Total Unpaid Breaks (neutrally shown, not red and without minus sign)
  renderTotalRow(
    "Total Unpaid Breaks",
    `${formatMinutes(preview.totalBreakMinutes)} (${preview.unpaidBreakHours.toFixed(2)} hrs)`
  );

  // Total Net Worked Time (with decimal hours clearly labeled for billing)
  renderTotalRow(
    "Total Net Worked Time",
    `${formatMinutes(preview.totalWorkedMinutes)} (${preview.netWorkedHours.toFixed(2)} hrs billed)`,
    { isBold: true, valColor: accentColor }
  );

  // Financial details (optional)
  if (includePay && data.hourlyRate > 0) {
    const isBilling = data.rateType === "billing";
    const regularHours = preview.netWorkedHours - preview.overtimeApplied;
    const regularLabel = isBilling
      ? `Regular Billing (${regularHours.toFixed(2)} hrs)`
      : `Regular Pay (${regularHours.toFixed(2)} hrs)`;
    const overtimeLabel = isBilling
      ? `Overtime Billing (${preview.overtimeApplied.toFixed(2)} hrs @ ${preview.overtimeMultiplier}x)`
      : `Overtime Pay (${preview.overtimeApplied.toFixed(2)} hrs @ ${preview.overtimeMultiplier}x)`;
    const totalPayLabel = isBilling
      ? "Total Estimated Client Billing"
      : "Total Estimated Gross Pay";

    doc.setDrawColor(220, 218, 214);
    doc.setLineWidth(0.3);
    doc.line(totalsLabelX, y, totalsValX, y);
    y += 4.5;

    renderTotalRow(regularLabel, formatMoney(preview.grossPay, data.currency));

    if (preview.overtimeApplied > 0) {
      renderTotalRow(
        overtimeLabel,
        `+ ${formatMoney(preview.overtimePay, data.currency)}`,
        { valColor: [190, 80, 20] }
      );
    }

    doc.setDrawColor(...accentColor);
    doc.setLineWidth(0.4);
    doc.line(totalsLabelX, y, totalsValX, y);
    y += 4.5;

    renderTotalRow(
      totalPayLabel,
      formatMoney(preview.totalPay, data.currency),
      { isBold: true, fontSize: 10, valColor: accentColor }
    );

    // Overtime rule and tax exclusion disclaimer (wrapped to avoid overflowing block)
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...subColor);
    const otRule =
      data.overtimeThreshold > 0 && data.overtimeMultiplier > 1
        ? `Overtime: ${data.overtimeMultiplier}x after ${data.overtimeThreshold.toFixed(1)} hrs/period.`
        : "Overtime: None / standard rate for all hours.";
    const taxNote = isBilling
      ? "Estimates exclude applicable sales taxes, client fees, and reimbursable expenses."
      : "Estimates represent gross earnings and exclude taxes, withholdings, and deductions.";
    const disclaimerLines = doc.splitTextToSize(`${otRule} ${taxNote}`, totalsBlockWidth);
    disclaimerLines.forEach((line: string) => {
      doc.text(line, totalsValX, y, { align: "right" });
      y += 3.2;
    });
    y += 2;
  }

  // Signature Block (optional)
  if (includeSigs) {
    if (y + 30 > pageHeight - margin - 10) {
      doc.addPage();
      y = margin;
    } else {
      y += 7;
    }

    const sigColWidth = contentWidth / 2 - 10;
    const sig1X = margin;
    const sig2X = margin + contentWidth / 2 + 10;

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...subColor);
    doc.text("WORKER / CONTRACTOR SIGNATURE", sig1X, y);
    doc.text("CLIENT / SUPERVISOR APPROVAL", sig2X, y);
    y += 11;

    doc.setDrawColor(180, 175, 170);
    doc.setLineWidth(0.3);
    doc.line(sig1X, y, sig1X + sigColWidth, y);
    doc.line(sig2X, y, sig2X + sigColWidth, y);
    y += 3.5;

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(130);
    doc.text("Signature & Date", sig1X, y);
    doc.text("Signature & Date", sig2X, y);
  }

  // Footer page numbering and optional credit (separate from page numbers)
  const pageCount = doc.getNumberOfPages();
  const footerY = pageHeight - 8;

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    if (includeCredit) {
      doc.setFontSize(7.5);
      doc.setTextColor(160);
      doc.setFont("helvetica", "normal");
      doc.text("Created with FreelanceCalc.app", margin, footerY, { align: "left" });
    }

    doc.setFontSize(7.5);
    doc.setTextColor(160);
    doc.setFont("helvetica", "italic");
    doc.text(
      `Timesheet — Page ${i} of ${pageCount}`,
      pageWidth - margin,
      footerY,
      { align: "right" }
    );
  }

  return doc;
}

/**
 * Protect text against spreadsheet formula injection and escape CSV special characters.
 */
export function sanitizeCsvField(val: string | number | boolean | null | undefined): string {
  if (val === null || val === undefined) return "";
  if (typeof val === "number") {
    return isNaN(val) ? "" : String(val);
  }
  if (typeof val === "boolean") {
    return val ? "true" : "false";
  }

  let str = String(val);

  // Neutralize formula injection risk in Excel/Google Sheets/Calc
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }

  // Standard CSV escaping if comma, double quotes, newline, or leading single quote
  if (/[",\n\r]/.test(str) || str.startsWith("'")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export interface TimeCardCsvOptions {
  includePayDetails?: boolean;
  format?: "data_only" | "with_summary";
}

/**
 * Generate CSV string.
 * Supports two options:
 * 1. "data_only" (default): one rectangular machine-readable table with consistent columns.
 * 2. "with_summary": metadata header, sessions table, and labeled totals summary.
 */
export function generateTimeCardCsv(
  data: TimeCardData,
  preview: CalculatedTimeCardPreview,
  optionsOrIncludePay: boolean | TimeCardCsvOptions = true
): string {
  const options: TimeCardCsvOptions =
    typeof optionsOrIncludePay === "boolean"
      ? {
          includePayDetails: optionsOrIncludePay,
          format: data.csvFormat || "data_only",
        }
      : {
          includePayDetails:
            optionsOrIncludePay.includePayDetails ?? data.includePayDetails ?? true,
          format: optionsOrIncludePay.format ?? data.csvFormat ?? "data_only",
        };

  const includePay = Boolean(options.includePayDetails);
  const format = options.format || "data_only";

  const rows: string[][] = [];

  // Summary header block when "with_summary" is chosen
  if (format === "with_summary") {
    rows.push(["TIMESHEET / TIME CARD SUMMARY"]);
    if (data.workerName) rows.push(["Worker", data.workerName]);
    if (data.clientName) rows.push(["Client", data.clientName]);
    if (data.projectName) rows.push(["Project", data.projectName]);
    rows.push(["Period Start", data.payPeriodStartDate || ""]);
    if (data.payPeriodEndDate) rows.push(["Period End", data.payPeriodEndDate]);
    if (includePay && data.hourlyRate > 0) {
      const rateLabel = data.rateType === "billing" ? "Client Billing Rate" : "Worker Pay Rate";
      rows.push([rateLabel, data.hourlyRate.toFixed(2)]);
      rows.push(["Currency", data.currency]);
      if (data.overtimeThreshold > 0 && data.overtimeMultiplier > 1) {
        rows.push(["Overtime Threshold (hours)", String(data.overtimeThreshold)]);
        rows.push(["Overtime Multiplier", `${data.overtimeMultiplier}x`]);
      }
    }
    rows.push([]); // blank separator line
  }

  // Consistent rectangular column headers
  const cols = [
    "worker_name",
    "client_name",
    "project_name",
    "period_start_date",
    "period_end_date",
    "session_number",
    "start_date",
    "end_date",
    "start_time",
    "end_time",
    "overnight",
    "unpaid_break_minutes",
    "worked_minutes",
    "decimal_hours",
    "description",
  ];

  if (includePay) {
    cols.push("currency", "rate_per_hour", "amount");
  }

  rows.push(cols);

  // Session rows: repeated metadata for machine-readability, no invented per-session overtime
  (data.sessions || []).forEach((session, idx) => {
    const elapsed = computeElapsedMinutes(session);
    const breakM = session.unpaidBreakMins || 0;
    const netM = Math.max(0, elapsed - breakM);
    const decimalHours = (netM / 60).toFixed(2);
    const endDate = getSessionEndDate(session.date, session.endsNextDay);

    const r = [
      data.workerName || "",
      data.clientName || "",
      data.projectName || "",
      data.payPeriodStartDate || "",
      data.payPeriodEndDate || "",
      String(idx + 1),
      session.date || "",
      endDate || "",
      session.startTime || "",
      session.endTime || "",
      session.endsNextDay ? "true" : "false",
      String(breakM),
      String(netM),
      decimalHours,
      session.comment || "",
    ];

    if (includePay) {
      const sessionAmount = ((netM / 60) * data.hourlyRate).toFixed(2);
      r.push(data.currency, data.hourlyRate.toFixed(2), sessionAmount);
    }

    rows.push(r);
  });

  // Labeled totals block when "with_summary" is chosen
  if (format === "with_summary") {
    rows.push([]);
    rows.push(["TOTALS SUMMARY"]);
    rows.push(["Total Sessions", String((data.sessions || []).length)]);
    rows.push(["Total Elapsed Minutes", String(preview.totalElapsedMinutes)]);
    rows.push(["Total Elapsed Hours", preview.totalWorkedHours.toFixed(2)]);
    rows.push(["Total Unpaid Break Minutes", String(preview.totalBreakMinutes)]);
    rows.push(["Total Unpaid Break Hours", preview.unpaidBreakHours.toFixed(2)]);
    rows.push(["Total Net Worked Minutes", String(preview.totalWorkedMinutes)]);
    rows.push(["Total Net Worked Hours", preview.netWorkedHours.toFixed(2)]);

    if (includePay && data.hourlyRate > 0) {
      const regularHours = (preview.netWorkedHours - preview.overtimeApplied).toFixed(2);
      rows.push(["Regular Hours", regularHours]);
      rows.push(["Regular Amount", preview.grossPay.toFixed(2)]);
      if (preview.overtimeApplied > 0) {
        rows.push(["Overtime Hours", preview.overtimeApplied.toFixed(2)]);
        rows.push(["Overtime Multiplier", `${preview.overtimeMultiplier}x`]);
        rows.push(["Overtime Amount", preview.overtimePay.toFixed(2)]);
      }
      const totalLabel =
        data.rateType === "billing"
          ? "Total Estimated Client Billing"
          : "Total Estimated Gross Pay";
      rows.push([totalLabel, preview.totalPay.toFixed(2)]);
      rows.push(["Currency", data.currency]);
    }
  }

  // Prepend UTF-8 BOM to ensure spreadsheet programs open UTF-8 characters cleanly
  return "\uFEFF" + rows.map((r) => r.map(sanitizeCsvField).join(",")).join("\r\n");
}

/**
 * Generate CSV and trigger browser download.
 */
export function downloadTimeCardCsv(
  data: TimeCardData,
  preview: CalculatedTimeCardPreview,
  optionsOrIncludePay: boolean | TimeCardCsvOptions = true
): void {
  const csvContent = generateTimeCardCsv(data, preview, optionsOrIncludePay);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  const baseName =
    [data.workerName, data.clientName, data.projectName].filter(Boolean).join("-") ||
    "timesheet";
  const safeName = baseName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const filename = `timesheet-${safeName || "export"}-${data.payPeriodStartDate || "period"}.csv`;

  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * LocalStorage save and load helpers.
 */
export function saveTimeCardToLocalStorage(data: TimeCardData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("timeCardData_v2", JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save time card data:", error);
  }
}

export function loadTimeCardFromLocalStorage(): TimeCardData | null {
  if (typeof window === "undefined") return null;
  try {
    const savedData = localStorage.getItem("timeCardData_v2");
    if (savedData) {
      return JSON.parse(savedData) as TimeCardData;
    }
  } catch (error) {
    console.error("Failed to load time card data:", error);
  }
  return null;
}
