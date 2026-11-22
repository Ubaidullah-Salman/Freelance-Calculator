/**
 * Invoice PDF Generator
 * Generates a clean, selectable-text PDF invoice using jsPDF and jspdf-autotable.
 * Runs entirely in the browser — no server upload.
 */

import { jsPDF } from "jspdf";
import autoTable, { applyPlugin } from "jspdf-autotable";
import type { InvoiceData, InvoiceTotals } from "@/lib/invoice";
import {
  formatCurrency,
  formatCurrencyFromMinor,
} from "@/lib/invoice";

// Ensure autotable plugin is applied to jsPDF
try {
  applyPlugin(jsPDF);
} catch {
  // Plugin already applied or running in environment where prototype is ready
}

/**
 * Generate a PDF invoice and return the jsPDF instance.
 * Caller is responsible for triggering download.
 */
export function generateInvoicePdf(
  invoice: InvoiceData,
  totals: InvoiceTotals,
  paperSize: "a4" | "letter" = "a4"
): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: paperSize,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20; // mm from left/right
  const contentWidth = pageWidth - margin * 2;
  let y = margin; // Current vertical position

  const currency = invoice.currency;
  const colors: [number, number, number] = [28, 25, 23]; // stone-900
  const subColor: [number, number, number] = [120, 113, 108]; // stone-500

  // ========================================================================
  // Invoice Header
  // ========================================================================
  // Header row: Logo / Title on left, Meta details on right
  const headerStartY = y;

  if (invoice.freelancer.logoDataUrl) {
    try {
      doc.addImage(
        invoice.freelancer.logoDataUrl,
        "PNG",
        margin,
        y,
        30,
        15
      );
      y += 17;
    } catch {
      // Invalid image format, skip gracefully
    }
  }

  // "INVOICE" heading
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors);
  doc.text("INVOICE", margin, y + 4);
  const leftHeaderEndY = y + 7;

  // Invoice number and dates (right-aligned)
  let rightY = headerStartY;
  const rightX = pageWidth - margin;
  const labelX = rightX - 55;

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...subColor);
  doc.text("Invoice #", labelX, rightY);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors);
  doc.text(invoice.invoiceNumber || "—", rightX, rightY, { align: "right" });
  rightY += 4.5;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...subColor);
  doc.text("Issue Date", labelX, rightY);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors);
  doc.text(formatDate(invoice.issueDate), rightX, rightY, { align: "right" });
  rightY += 4.5;

  if (invoice.dueDate) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...subColor);
    doc.text("Due Date", labelX, rightY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors);
    doc.text(formatDate(invoice.dueDate), rightX, rightY, { align: "right" });
    rightY += 4.5;
  }

  // Synchronize vertical position below header with tightened gap
  y = Math.max(leftHeaderEndY, rightY) + 5;

  // Subtle separator line
  doc.setDrawColor(230, 228, 225);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  // ========================================================================
  // From / To section
  // ========================================================================

  const fromX = margin;
  const toX = margin + contentWidth / 2 + 5;
  const colWidth = (contentWidth / 2) - 10;
  const addressesStartY = y;

  // FROM Column
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...subColor);
  doc.text("FROM", fromX, addressesStartY);

  let fromY = addressesStartY + 4.5;
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors);
  doc.text(invoice.freelancer.name || "—", fromX, fromY);
  fromY += 4;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(80);
  doc.setFontSize(8);
  if (invoice.freelancer.email) {
    doc.text(invoice.freelancer.email, fromX, fromY);
    fromY += 3.8;
  }
  if (invoice.freelancer.address) {
    const fromAddrLines = doc.splitTextToSize(invoice.freelancer.address, colWidth);
    fromAddrLines.forEach((line: string) => {
      doc.text(line, fromX, fromY);
      fromY += 3.8;
    });
  }
  if (invoice.freelancer.phone) {
    doc.text(invoice.freelancer.phone, fromX, fromY);
    fromY += 3.8;
  }
  if (invoice.freelancer.taxId) {
    doc.setFontSize(7.5);
    doc.setTextColor(110);
    doc.text(`Tax ID: ${invoice.freelancer.taxId}`, fromX, fromY);
    fromY += 3.8;
  }

  // TO Column
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...subColor);
  doc.text("BILL TO", toX, addressesStartY);

  let toY = addressesStartY + 4.5;
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors);
  doc.text(invoice.client.name || "—", toX, toY);
  toY += 4;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(80);
  doc.setFontSize(8);
  if (invoice.client.email) {
    doc.text(invoice.client.email, toX, toY);
    toY += 3.8;
  }
  if (invoice.client.address) {
    const toAddrLines = doc.splitTextToSize(invoice.client.address, colWidth);
    toAddrLines.forEach((line: string) => {
      doc.text(line, toX, toY);
      toY += 3.8;
    });
  }
  if (invoice.client.taxId) {
    doc.setFontSize(7.5);
    doc.setTextColor(110);
    doc.text(`Tax ID: ${invoice.client.taxId}`, toX, toY);
    toY += 3.8;
  }

  // Set y below whichever column is taller with reduced gap
  y = Math.max(fromY, toY) + 5;

  // ========================================================================
  // Line Items Table
  // Left-align description; right-align qty, rate, amount (including headings)
  // ========================================================================

  const lineItemsTable: string[][] = invoice.lineItems.map((item, idx) => {
    const amount = item.quantity * item.rate;
    return [
      item.description || `Item ${idx + 1}`,
      `${item.quantity}`,
      formatCurrency(item.rate, currency),
      formatCurrency(amount, currency),
    ];
  });

  const colWidthDesc = contentWidth - (20 + 30 + 35);

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [[
      { content: "Description", styles: { halign: "left" } },
      { content: "Qty", styles: { halign: "right" } },
      { content: "Rate", styles: { halign: "right" } },
      { content: "Amount", styles: { halign: "right" } },
    ]],
    body: lineItemsTable,
    columnStyles: {
      0: { cellWidth: colWidthDesc, halign: "left", fontStyle: "normal" },
      1: { cellWidth: 20, halign: "right" },
      2: { cellWidth: 30, halign: "right" },
      3: { cellWidth: 35, halign: "right", fontStyle: "bold" },
    },
    headStyles: {
      fillColor: colors,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 8.5,
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

  // ========================================================================
  // Totals Section
  // ========================================================================

  const lastTable = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable;
  y = (lastTable ? lastTable.finalY : y) + 5;

  const totalsBlockWidth = 75;
  const totalsLabelX = pageWidth - margin - totalsBlockWidth;
  const totalsValueX = pageWidth - margin;

  doc.setFontSize(8.5);

  // Subtotal
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...subColor);
  doc.text("Subtotal", totalsLabelX, y);
  doc.setTextColor(...colors);
  doc.text(formatCurrencyFromMinor(totals.subtotal, currency), totalsValueX, y, { align: "right" });
  y += 5;

  // Discount (if applicable)
  if (invoice.discountPercent > 0) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...subColor);
    doc.text(`Discount (${invoice.discountPercent}%)`, totalsLabelX, y);
    doc.setTextColor(220, 38, 38);
    doc.text(`- ${formatCurrencyFromMinor(totals.discountAmount, currency)}`, totalsValueX, y, { align: "right" });
    y += 5;
  }

  // Tax (if applicable)
  if (invoice.taxPercent > 0) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...subColor);
    doc.text(`Tax (${invoice.taxPercent}%)`, totalsLabelX, y);
    doc.setTextColor(...colors);
    doc.text(`+ ${formatCurrencyFromMinor(totals.taxAmount, currency)}`, totalsValueX, y, { align: "right" });
    y += 5;
  }

  // Total Divider
  doc.setDrawColor(210, 208, 205);
  doc.setLineWidth(0.3);
  doc.line(totalsLabelX, y, totalsValueX, y);
  y += 4.5;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors);
  doc.text("Total", totalsLabelX, y);
  doc.text(formatCurrencyFromMinor(totals.total, currency), totalsValueX, y, { align: "right" });
  y += 5.5;

  // Amount Paid (shown WITHOUT minus sign per requirement)
  if (invoice.amountPaid > 0) {
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...subColor);
    doc.text("Amount Paid", totalsLabelX, y);
    doc.setTextColor(...colors);
    doc.text(formatCurrencyFromMinor(totals.amountPaid, currency), totalsValueX, y, { align: "right" });
    y += 5.5;
  }

  // Prominent Balance Due Box
  const isFullyPaid = totals.balanceDue === 0 && totals.total > 0;
  const boxWidth = totalsBlockWidth + 4;
  const boxX = pageWidth - margin - boxWidth;
  const hasDueDateNotice = Boolean(invoice.dueDate && !isFullyPaid);
  const boxHeight = hasDueDateNotice ? 14 : 11;

  if (isFullyPaid) {
    // Subtle emerald container for paid in full
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);
    doc.setLineWidth(0.3);
    doc.roundedRect(boxX, y, boxWidth, boxHeight, 1.5, 1.5, "FD");

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 101, 52);
    doc.text("PAID IN FULL", boxX + 3.5, y + 4.5);

    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 101, 52);
    doc.text(`${formatCurrencyFromMinor(0, currency)}`, boxX + boxWidth - 3.5, y + 7.5, { align: "right" });

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(22, 101, 52);
    doc.text("Balance Due", boxX + 3.5, y + 8.5);
  } else {
    // Subtle stone container for active balance due
    doc.setFillColor(248, 247, 245);
    doc.setDrawColor(214, 211, 209);
    doc.setLineWidth(0.3);
    doc.roundedRect(boxX, y, boxWidth, boxHeight, 1.5, 1.5, "FD");

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors);
    doc.text("Balance Due", boxX + 3.5, y + 5);

    doc.setFontSize(10.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors);
    doc.text(`${formatCurrencyFromMinor(totals.balanceDue, currency)} ${currency}`, boxX + boxWidth - 3.5, y + 5.5, { align: "right" });

    if (hasDueDateNotice) {
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...subColor);
      doc.text(`Due by: ${formatDate(invoice.dueDate)}`, boxX + 3.5, y + 10.5);
    }
  }

  y += boxHeight + 6;

  // ========================================================================
  // Notes / Structured Payment Details
  // ========================================================================

  const hasStructuredDetails = Boolean(
    invoice.paymentDetails &&
      (invoice.paymentDetails.method ||
        invoice.paymentDetails.bankName ||
        invoice.paymentDetails.accountName ||
        invoice.paymentDetails.accountNumber ||
        invoice.paymentDetails.routingNumber ||
        invoice.paymentDetails.paymentReference)
  );

  if (hasStructuredDetails || invoice.paymentInstructions || invoice.notes) {
    if (y > pageHeight - 45) {
      doc.addPage();
      y = margin;
    }

    // Payment Details
    if (hasStructuredDetails || invoice.paymentInstructions) {
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...subColor);
      doc.text("PAYMENT DETAILS", margin, y);
      y += 4;

      if (hasStructuredDetails && invoice.paymentDetails) {
        doc.setFontSize(8);
        const details = [
          { label: "Method", val: invoice.paymentDetails.method },
          { label: "Bank", val: invoice.paymentDetails.bankName },
          { label: "Account Name", val: invoice.paymentDetails.accountName },
          { label: "Account Number", val: invoice.paymentDetails.accountNumber },
          { label: "Routing / IBAN / SWIFT", val: invoice.paymentDetails.routingNumber },
          { label: "Reference", val: invoice.paymentDetails.paymentReference },
        ].filter((d) => Boolean(d.val));

        details.forEach((d) => {
          if (y > pageHeight - margin - 15) {
            doc.addPage();
            y = margin;
          }
          doc.setFont("helvetica", "bold");
          doc.setTextColor(100);
          doc.text(`${d.label}:`, margin, y);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(...colors);
          doc.text(`${d.val}`, margin + 35, y);
          y += 3.8;
        });
        y += 1.5;
      }

      if (invoice.paymentInstructions) {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(70);
        doc.setFontSize(8);
        const paymentLines = doc.splitTextToSize(invoice.paymentInstructions, contentWidth);
        paymentLines.forEach((line: string) => {
          if (y > pageHeight - margin - 15) {
            doc.addPage();
            y = margin;
          }
          doc.text(line, margin, y);
          y += 3.8;
        });
      }
      y += 3;
    }

    // Notes
    if (invoice.notes) {
      if (y > pageHeight - 35) {
        doc.addPage();
        y = margin;
      }
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...subColor);
      doc.text("NOTES", margin, y);
      y += 4;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(70);
      doc.setFontSize(8);
      const noteLines = doc.splitTextToSize(invoice.notes, contentWidth);
      noteLines.forEach((line: string) => {
        if (y > pageHeight - margin - 15) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += 3.8;
      });
    }
  }

  // ========================================================================
  // Footer
  // Separate footer credit (left) from invoice number and page count (right)
  // ========================================================================

  const footerY = pageHeight - 10;
  const pageCount = doc.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Optional credit setting (OFF by default)
    if (invoice.includeCredit) {
      doc.setFontSize(7.5);
      doc.setTextColor(160);
      doc.setFont("helvetica", "normal");
      doc.text("Created with FreelanceCalc.app", margin, footerY, { align: "left" });
    }

    doc.setFontSize(7.5);
    doc.setTextColor(160);
    doc.setFont("helvetica", "italic");
    doc.text(
      `Invoice ${invoice.invoiceNumber || ""} — Page ${i} of ${pageCount}`,
      pageWidth - margin,
      footerY,
      { align: "right" }
    );
  }

  return doc;
}

/**
 * Format ISO date string to readable format.
 */
function formatDate(dateStr?: string): string {
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
