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

// Ensure autotable plugin is applied
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
  const breakMins = Math.max(0, session.unpaidBreakMins || 0);
  const net = elapsed - breakMins;
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
 * Calculate totals for a time card.
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
export function formatDateReadable(dateStr: string): string {
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
export function getWeekday(dateStr: string): string {
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
 */
export function createSampleTimeCard(): TimeCardData {
  const today = new Date();
  // Monday of current week
  const dayOfWeek = today.getDay();
  const diffToMonday = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const monday = new Date(today.setDate(diffToMonday));

  const formatDay = (offset: number) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + offset);
    return d.toISOString().split("T")[0];
  };

  return {
    clientName: "Acme Digital Studio",
    hourlyRate: 35,
    currency: "USD",
    payPeriodStartDate: formatDay(0),
    overtimeThreshold: 40,
    overtimeMultiplier: 1.5,
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

/**
 * Generate PDF timesheet using jsPDF and jspdf-autotable.
 */
export function generateTimeCardPdf(
  data: TimeCardData,
  preview: CalculatedTimeCardPreview,
  includePayDetails: boolean = true,
  paperSize: "a4" | "letter" = "a4"
): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: paperSize,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const colors: [number, number, number] = [28, 25, 23]; // stone-900
  const subColor: [number, number, number] = [120, 113, 108]; // stone-500
  const accentColor: [number, number, number] = [16, 149, 106]; // emerald-600
  const sym = CURRENCY_SYMBOLS[data.currency] || "$";

  // Watermark / Brand Header
  doc.setFontSize(8);
  doc.setTextColor(170, 165, 160);
  doc.setFont("helvetica", "normal");
  doc.text("Generated by FreelanceCalc.app — Free Time Card Calculator", margin, y);
  y += 7;

  // Title
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors);
  doc.text("TIMESHEET / TIME CARD", margin, y + 2);

  // Meta Info Box (Right aligned)
  const metaRightX = pageWidth - margin;
  const metaLabelX = metaRightX - 55;
  let metaY = y - 4;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...subColor);
  doc.text("Pay Period Start", metaLabelX, metaY);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors);
  doc.text(formatDateReadable(data.payPeriodStartDate) || "—", metaRightX, metaY, { align: "right" });
  metaY += 5;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...subColor);
  doc.text("Client / Project", metaLabelX, metaY);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors);
  doc.text(data.clientName || "General", metaRightX, metaY, { align: "right" });
  metaY += 5;

  if (includePayDetails && data.hourlyRate > 0) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...subColor);
    doc.text("Hourly Rate", metaLabelX, metaY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors);
    doc.text(`${sym}${data.hourlyRate.toFixed(2)} / hr (${data.currency})`, metaRightX, metaY, { align: "right" });
    metaY += 5;
  }

  y = Math.max(y + 12, metaY + 5);

  // Divider
  doc.setDrawColor(225, 222, 218);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // Table rows
  const tableRows: string[][] = (data.sessions || []).map((session, idx) => {
    const elapsed = computeElapsedMinutes(session);
    const breakM = session.unpaidBreakMins || 0;
    const netM = Math.max(0, elapsed - breakM);
    const netHours = (netM / 60).toFixed(2);
    const weekday = getWeekday(session.date);
    const dateFormatted = formatDateReadable(session.date);

    return [
      `#${idx + 1}`,
      weekday ? `${weekday}, ${dateFormatted}` : dateFormatted || "—",
      formatTime12h(session.startTime),
      formatTime12h(session.endTime) + (session.endsNextDay ? " (+1d)" : ""),
      breakM > 0 ? `${breakM}m` : "0m",
      `${netHours} hrs`,
      session.comment || "—",
    ];
  });

  const commentColWidth = contentWidth - (12 + 32 + 22 + 24 + 18 + 22);

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["#", "Date", "Start", "End", "Break", "Net Worked", "Description / Task"]],
    body: tableRows,
    columnStyles: {
      0: { cellWidth: 12, halign: "center" },
      1: { cellWidth: 32, fontStyle: "bold" },
      2: { cellWidth: 22, halign: "center" },
      3: { cellWidth: 24, halign: "center" },
      4: { cellWidth: 18, halign: "center" },
      5: { cellWidth: 22, halign: "right", fontStyle: "bold" },
      6: { cellWidth: commentColWidth, fontStyle: "normal" },
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

  const lastTable = (doc as any).lastAutoTable;
  y = (lastTable ? lastTable.finalY : y) + 7;

  // Summary and Pay Section
  if (y > pageHeight - 65) {
    doc.addPage();
    y = margin;
  }

  const totalsBlockWidth = 80;
  const totalsLabelX = pageWidth - margin - totalsBlockWidth;
  const totalsValX = pageWidth - margin;

  doc.setFontSize(8.5);

  // Total Elapsed
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...subColor);
  doc.text("Total Elapsed Time", totalsLabelX, y);
  doc.setTextColor(...colors);
  doc.text(`${preview.totalWorkedHours.toFixed(2)} hrs`, totalsValX, y, { align: "right" });
  y += 5;

  // Total Breaks
  doc.setTextColor(...subColor);
  doc.text("Total Unpaid Breaks", totalsLabelX, y);
  doc.setTextColor(220, 38, 38);
  doc.text(`- ${preview.unpaidBreakHours.toFixed(2)} hrs`, totalsValX, y, { align: "right" });
  y += 5;

  // Total Net Hours
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors);
  doc.text("Total Net Worked Hours", totalsLabelX, y);
  doc.setTextColor(...accentColor);
  doc.text(`${preview.netWorkedHours.toFixed(2)} hrs (${formatMinutes(preview.netWorkedHours * 60)})`, totalsValX, y, { align: "right" });
  y += 6;

  if (includePayDetails && data.hourlyRate > 0) {
    doc.setDrawColor(220, 218, 214);
    doc.setLineWidth(0.3);
    doc.line(totalsLabelX, y, totalsValX, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...subColor);
    doc.text(`Regular Pay (${(preview.netWorkedHours - preview.overtimeApplied).toFixed(2)} hrs)`, totalsLabelX, y);
    doc.setTextColor(...colors);
    doc.text(`${sym}${preview.grossPay.toFixed(2)}`, totalsValX, y, { align: "right" });
    y += 5;

    if (preview.overtimeApplied > 0) {
      doc.setTextColor(...subColor);
      doc.text(`Overtime Pay (${preview.overtimeApplied.toFixed(2)} hrs @ ${preview.overtimeMultiplier}x)`, totalsLabelX, y);
      doc.setTextColor(190, 80, 20);
      doc.text(`+ ${sym}${preview.overtimePay.toFixed(2)}`, totalsValX, y, { align: "right" });
      y += 5;
    }

    doc.setDrawColor(...accentColor);
    doc.setLineWidth(0.5);
    doc.line(totalsLabelX, y, totalsValX, y);
    y += 5;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors);
    doc.text("Total Estimated Gross Pay", totalsLabelX, y);
    doc.setTextColor(...accentColor);
    doc.text(`${sym}${preview.totalPay.toFixed(2)} ${data.currency}`, totalsValX, y, { align: "right" });
    y += 8;
  }

  // Signatures Section
  if (y > pageHeight - 40) {
    doc.addPage();
    y = margin;
  } else {
    y += 10;
  }

  const sigColWidth = (contentWidth / 2) - 10;
  const sig1X = margin;
  const sig2X = margin + contentWidth / 2 + 10;

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...subColor);
  doc.text("CONTRACTOR / EMPLOYEE SIGNATURE", sig1X, y);
  doc.text("CLIENT / SUPERVISOR APPROVAL", sig2X, y);
  y += 12;

  doc.setDrawColor(180, 175, 170);
  doc.setLineWidth(0.3);
  doc.line(sig1X, y, sig1X + sigColWidth, y);
  doc.line(sig2X, y, sig2X + sigColWidth, y);
  y += 4;

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120);
  doc.text("Signature & Date", sig1X, y);
  doc.text("Signature & Date", sig2X, y);

  // Footer page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(160);
    doc.setFont("helvetica", "italic");
    doc.text(
      `Timesheet — Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 9,
      { align: "center" }
    );
  }

  return doc;
}

/**
 * Generate CSV string and trigger browser download.
 */
export function downloadTimeCardCsv(
  data: TimeCardData,
  preview: CalculatedTimeCardPreview,
  includePayDetails: boolean = true
): void {
  const escapeCsv = (val: string | number) => {
    const str = String(val ?? "");
    if (/[",\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows: string[][] = [];

  // Header meta
  rows.push(["TIMESHEET / TIME CARD"]);
  rows.push(["Client / Project", data.clientName || "General"]);
  rows.push(["Pay Period Start", data.payPeriodStartDate || ""]);
  rows.push(["Currency", data.currency]);
  if (includePayDetails) {
    rows.push(["Hourly Rate", String(data.hourlyRate)]);
  }
  rows.push([]); // blank line

  // Column Headers
  const cols = [
    "Date",
    "Day",
    "Start Time",
    "End Time",
    "Overnight",
    "Unpaid Break (mins)",
    "Net Worked Hours",
    "Description",
  ];
  if (includePayDetails) {
    cols.push("Hourly Rate", "Estimated Pay");
  }
  rows.push(cols);

  // Session rows
  (data.sessions || []).forEach((session) => {
    const elapsed = computeElapsedMinutes(session);
    const breakM = session.unpaidBreakMins || 0;
    const netM = Math.max(0, elapsed - breakM);
    const netHours = (netM / 60).toFixed(2);
    const pay = (Number(netHours) * data.hourlyRate).toFixed(2);

    const r = [
      session.date,
      getWeekday(session.date),
      session.startTime,
      session.endTime,
      session.endsNextDay ? "Yes" : "No",
      String(breakM),
      netHours,
      session.comment || "",
    ];
    if (includePayDetails) {
      r.push(String(data.hourlyRate), pay);
    }
    rows.push(r);
  });

  // Totals rows
  rows.push([]);
  rows.push(["SUMMARY"]);
  rows.push(["Total Elapsed Hours", preview.totalWorkedHours.toFixed(2)]);
  rows.push(["Total Unpaid Breaks", preview.unpaidBreakHours.toFixed(2)]);
  rows.push(["Total Net Worked Hours", preview.netWorkedHours.toFixed(2)]);

  if (includePayDetails && data.hourlyRate > 0) {
    rows.push(["Regular Pay", preview.grossPay.toFixed(2)]);
    if (preview.overtimeApplied > 0) {
      rows.push(["Overtime Pay", preview.overtimePay.toFixed(2)]);
    }
    rows.push(["Total Estimated Gross Pay", preview.totalPay.toFixed(2)]);
  }

  const csvContent = rows.map((r) => r.map(escapeCsv).join(",")).join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const filename = `timesheet-${(data.clientName || "freelancer").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${data.payPeriodStartDate || "period"}.csv`;
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
