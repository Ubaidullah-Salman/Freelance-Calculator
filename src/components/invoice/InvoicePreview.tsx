"use client";

import type { InvoiceData, InvoiceTotals } from "@/lib/invoice";
import { CURRENCIES, formatCurrencyFromMinor } from "@/lib/invoice";

interface InvoicePreviewProps {
  invoice: InvoiceData;
  totals: InvoiceTotals;
}

export default function InvoicePreview({ invoice, totals }: InvoicePreviewProps) {
  const currency = CURRENCIES[invoice.currency];

  const formatDate = (dateStr: string) => {
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
  };

  const hasPaymentDetails = Boolean(
    invoice.paymentDetails &&
      (invoice.paymentDetails.method ||
        invoice.paymentDetails.bankName ||
        invoice.paymentDetails.accountName ||
        invoice.paymentDetails.accountNumber ||
        invoice.paymentDetails.routingNumber ||
        invoice.paymentDetails.paymentReference)
  );

  return (
    <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
      {/* Preview Header */}
      <div className="border-b border-stone-200 bg-stone-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">Live Preview</span>
        </div>
        <span className="text-xs text-stone-500">Matches PDF output</span>
      </div>

      {/* Invoice Content */}
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {invoice.freelancer.logoDataUrl && (
              <img src={invoice.freelancer.logoDataUrl} alt="" className="h-10 w-auto mb-2 object-contain" />
            )}
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight">INVOICE</h2>
          </div>
          <div className="text-right">
            <div className="text-xs text-stone-500">Invoice #</div>
            <div className="text-sm font-bold text-stone-900">{invoice.invoiceNumber || "—"}</div>
            <div className="text-xs text-stone-500 mt-1">Issue Date</div>
            <div className="text-sm font-semibold text-stone-900">{formatDate(invoice.issueDate)}</div>
            {invoice.dueDate && (
              <>
                <div className="text-xs text-stone-500 mt-1">Due Date</div>
                <div className="text-sm font-semibold text-stone-900">{formatDate(invoice.dueDate)}</div>
              </>
            )}
          </div>
        </div>

        {/* From / To */}
        <div className="grid grid-cols-2 gap-6 pt-3 border-t border-stone-100">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">From</h3>
            <div className="text-sm font-semibold text-stone-900">{invoice.freelancer.name || "—"}</div>
            {invoice.freelancer.email && (
              <div className="text-xs text-stone-600 mt-0.5">{invoice.freelancer.email}</div>
            )}
            {invoice.freelancer.address && (
              <div className="text-xs text-stone-600 whitespace-pre-line">{invoice.freelancer.address}</div>
            )}
            {invoice.freelancer.phone && (
              <div className="text-xs text-stone-600">{invoice.freelancer.phone}</div>
            )}
            {invoice.freelancer.taxId && (
              <div className="text-[10px] text-stone-500 mt-1">Tax ID: {invoice.freelancer.taxId}</div>
            )}
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">Bill To</h3>
            <div className="text-sm font-semibold text-stone-900">{invoice.client.name || "—"}</div>
            {invoice.client.email && (
              <div className="text-xs text-stone-600 mt-0.5">{invoice.client.email}</div>
            )}
            {invoice.client.address && (
              <div className="text-xs text-stone-600 whitespace-pre-line">{invoice.client.address}</div>
            )}
            {invoice.client.taxId && (
              <div className="text-[10px] text-stone-500 mt-1">Tax ID: {invoice.client.taxId}</div>
            )}
          </div>
        </div>

        {/* Line Items */}
        <div className="pt-3 border-t border-stone-100">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="text-left py-2 text-[10px] font-bold uppercase tracking-wider text-stone-500 w-1/2">Description</th>
                <th className="text-right py-2 text-[10px] font-bold uppercase tracking-wider text-stone-500">Qty</th>
                <th className="text-right py-2 text-[10px] font-bold uppercase tracking-wider text-stone-500">Rate</th>
                <th className="text-right py-2 text-[10px] font-bold uppercase tracking-wider text-stone-500">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item, idx) => (
                <tr key={item.id} className={idx % 2 === 1 ? "bg-stone-50" : ""}>
                  <td className="py-2.5 text-sm font-medium text-stone-900 text-left">{item.description || `Item ${idx + 1}`}</td>
                  <td className="py-2.5 text-sm text-stone-700 text-right tabular-nums">{item.quantity}</td>
                  <td className="py-2.5 text-sm text-stone-700 text-right tabular-nums">
                    {currency.symbol}{item.rate.toLocaleString("en-US", { minimumFractionDigits: currency.decimalPlaces, maximumFractionDigits: currency.decimalPlaces })}
                  </td>
                  <td className="py-2.5 text-sm font-semibold text-stone-900 text-right tabular-nums">
                    {formatCurrencyFromMinor(Math.round(item.quantity * item.rate * Math.pow(10, currency.decimalPlaces)), invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="pt-3 border-t border-stone-100">
          <div className="ml-auto w-full max-w-xs space-y-1.5">
            <div className="flex justify-between py-1 text-xs">
              <span className="text-stone-600">Subtotal</span>
              <span className="font-medium tabular-nums">{formatCurrencyFromMinor(totals.subtotal, invoice.currency)}</span>
            </div>
            {invoice.discountPercent > 0 && (
              <div className="flex justify-between py-1 text-xs text-rose-600">
                <span>Discount ({invoice.discountPercent}%)</span>
                <span className="tabular-nums">- {formatCurrencyFromMinor(totals.discountAmount, invoice.currency)}</span>
              </div>
            )}
            {invoice.taxPercent > 0 && (
              <div className="flex justify-between py-1 text-xs">
                <span className="text-stone-600">Tax ({invoice.taxPercent}%)</span>
                <span className="tabular-nums">+ {formatCurrencyFromMinor(totals.taxAmount, invoice.currency)}</span>
              </div>
            )}
            <div className="border-t border-stone-200 pt-1.5 flex justify-between font-bold text-sm">
              <span>Total</span>
              <span className="tabular-nums">{formatCurrencyFromMinor(totals.total, invoice.currency)}</span>
            </div>
            {invoice.amountPaid > 0 && (
              <div className="flex justify-between py-1 text-xs text-stone-600">
                <span>Amount Paid</span>
                <span className="font-medium tabular-nums text-stone-800">
                  {formatCurrencyFromMinor(totals.amountPaid, invoice.currency)}
                </span>
              </div>
            )}

            {/* Prominent Balance Due box */}
            {totals.balanceDue === 0 && totals.total > 0 ? (
              <div className="mt-3 rounded-lg border border-emerald-300 bg-emerald-50/70 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Paid in Full
                  </span>
                  <span className="text-xs font-semibold text-emerald-700">{invoice.currency}</span>
                </div>
                <div className="flex items-baseline justify-between pt-0.5">
                  <span className="text-xs font-semibold text-emerald-900">Balance Due</span>
                  <span className="text-base font-bold text-emerald-800 tabular-nums">
                    {formatCurrencyFromMinor(0, invoice.currency)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-3 rounded-lg border border-stone-300 bg-stone-50/90 p-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-700">Balance Due</span>
                    {invoice.dueDate && (
                      <div className="text-[11px] text-stone-500 font-normal mt-0.5">
                        Due by {formatDate(invoice.dueDate)}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-stone-900 tabular-nums">
                      {formatCurrencyFromMinor(totals.balanceDue, invoice.currency)}
                    </span>
                    <span className="text-xs font-bold text-stone-600 ml-1.5">{invoice.currency}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Structured Payment Instructions & Notes */}
        {(hasPaymentDetails || invoice.paymentInstructions || invoice.notes) && (
          <div className="pt-3 border-t border-stone-100 space-y-3">
            {(hasPaymentDetails || invoice.paymentInstructions) && (
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">Payment Details</h3>
                {hasPaymentDetails && (
                  <dl className="text-xs grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mb-2 bg-stone-50 rounded-lg p-3 border border-stone-200">
                    {invoice.paymentDetails?.method && (
                      <div className="flex justify-between sm:block">
                        <dt className="text-stone-500 text-[11px]">Method:</dt>
                        <dd className="font-medium text-stone-900">{invoice.paymentDetails.method}</dd>
                      </div>
                    )}
                    {invoice.paymentDetails?.bankName && (
                      <div className="flex justify-between sm:block">
                        <dt className="text-stone-500 text-[11px]">Bank:</dt>
                        <dd className="font-medium text-stone-900">{invoice.paymentDetails.bankName}</dd>
                      </div>
                    )}
                    {invoice.paymentDetails?.accountName && (
                      <div className="flex justify-between sm:block">
                        <dt className="text-stone-500 text-[11px]">Account Name:</dt>
                        <dd className="font-medium text-stone-900">{invoice.paymentDetails.accountName}</dd>
                      </div>
                    )}
                    {invoice.paymentDetails?.accountNumber && (
                      <div className="flex justify-between sm:block">
                        <dt className="text-stone-500 text-[11px]">Account Number:</dt>
                        <dd className="font-mono font-medium text-stone-900">{invoice.paymentDetails.accountNumber}</dd>
                      </div>
                    )}
                    {invoice.paymentDetails?.routingNumber && (
                      <div className="flex justify-between sm:block">
                        <dt className="text-stone-500 text-[11px]">Routing / IBAN / SWIFT:</dt>
                        <dd className="font-mono font-medium text-stone-900">{invoice.paymentDetails.routingNumber}</dd>
                      </div>
                    )}
                    {invoice.paymentDetails?.paymentReference && (
                      <div className="flex justify-between sm:block">
                        <dt className="text-stone-500 text-[11px]">Payment Reference:</dt>
                        <dd className="font-medium text-stone-900">{invoice.paymentDetails.paymentReference}</dd>
                      </div>
                    )}
                  </dl>
                )}
                {invoice.paymentInstructions && (
                  <p className="text-xs text-stone-700 whitespace-pre-wrap">{invoice.paymentInstructions}</p>
                )}
              </div>
            )}
            {invoice.notes && (
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">Notes</h3>
                <p className="text-xs text-stone-700 whitespace-pre-wrap">{invoice.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Optional Credit Footer */}
        {invoice.includeCredit && (
          <div className="pt-3 border-t border-stone-100 text-center text-xs text-stone-400">
            Created with FreelanceCalc.app
          </div>
        )}
      </div>
    </div>
  );
}
