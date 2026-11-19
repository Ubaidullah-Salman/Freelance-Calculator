"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { InvoiceData, ClientDetails, FreelancerDetails, LineItem, CurrencyCode } from "@/lib/invoice";
import {
  CURRENCIES,
  calculateTotals,
  validateInvoice,
  checkAmountPaidExcess,
  formatCurrency,
  formatCurrencyFromMinor,
  saveDraft,
  loadDraft,
  clearDraft,
  exportDraftJSON,
  importDraftJSON,
  createEmptyInvoice,
  createSampleInvoice,
  toMajorUnits,
  sanitizeFilename,
  generatePdfFilename,
} from "@/lib/invoice";
import { generateInvoicePdf } from "@/lib/invoice-pdf";

type SectionKey = "freelancer" | "client" | "details" | "lineItems" | "totals" | "notes";

export default function InvoiceEditor({
  onPreviewChange,
}: {
  onPreviewChange?: (invoice: InvoiceData, totals: ReturnType<typeof calculateTotals>) => void;
}) {
  const [invoice, setInvoice] = useState<InvoiceData>(createEmptyInvoice);
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    freelancer: true,
    client: true,
    details: true,
    lineItems: true,
    totals: false,
    notes: false,
  });
  const [draftStatus, setDraftStatus] = useState<"saved" | "saving" | "error" | "none">("none");
  const [showAmountPaid, setShowAmountPaid] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [paperSize, setPaperSize] = useState<"a4" | "letter">("a4");
  const [showImportExport, setShowImportExport] = useState(false);
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load draft on mount
  useEffect(() => {
    const saved = loadDraft();
    if (saved) {
      setInvoice(saved);
      setDraftStatus("saved");
      if (saved.amountPaid > 0) setShowAmountPaid(true);
    }
  }, []);

  // Auto-save draft with debounce
  useEffect(() => {
    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    setDraftStatus("saving");
    draftTimerRef.current = setTimeout(() => {
      const result = saveDraft(invoice);
      if (result.success) {
        setDraftStatus("saved");
      } else {
        setDraftStatus("error");
      }
    }, 500);
    return () => {
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    };
  }, [invoice]);

  // Notify parent of changes
  useEffect(() => {
    const totals = calculateTotals(
      invoice.lineItems,
      invoice.discountPercent,
      invoice.taxPercent,
      invoice.amountPaid,
      invoice.currency
    );
    onPreviewChange?.(invoice, totals);
  }, [invoice, onPreviewChange]);

  const totals = calculateTotals(
    invoice.lineItems,
    invoice.discountPercent,
    invoice.taxPercent,
    invoice.amountPaid,
    invoice.currency
  );

  const toggleSection = (key: SectionKey) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const updateFreelancer = (field: keyof FreelancerDetails, value: string) =>
    setInvoice((prev) => ({ ...prev, freelancer: { ...prev.freelancer, [field]: value } }));

  const updateClient = (field: keyof ClientDetails, value: string) =>
    setInvoice((prev) => ({ ...prev, client: { ...prev.client, [field]: value } }));

  const addLineItem = () =>
    setInvoice((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, { id: `item-${Date.now()}`, description: "", quantity: 0, rate: 0 }],
    }));

  const removeLineItem = (id: string) =>
    setInvoice((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((item) => item.id !== id),
    }));

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) =>
    setInvoice((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate file type and size (max 2MB)
    if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
      alert("Please upload a PNG or JPEG image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setInvoice((prev) => ({
        ...prev,
        freelancer: { ...prev.freelancer, logoDataUrl: reader.result as string },
      }));
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const handleDownload = useCallback(() => {
    setDownloadError("");
    const errors = validateInvoice(invoice);
    if (errors.length > 0) {
      setDownloadError(errors[0].message);
      return;
    }
    const excess = checkAmountPaidExcess(
      invoice.lineItems,
      invoice.discountPercent,
      invoice.taxPercent,
      invoice.amountPaid,
      invoice.currency
    );
    if (excess !== null) {
      setDownloadError(`Amount paid exceeds total by ${formatCurrency(excess, invoice.currency)}. Reduce the amount paid or increase line items.`);
      return;
    }
    try {
      const doc = generateInvoicePdf(invoice, totals, paperSize);
      const filename = generatePdfFilename(invoice.invoiceNumber, invoice.client.name);
      doc.save(filename);
    } catch (err) {
      setDownloadError("Failed to generate PDF. Please check your inputs.");
    }
  }, [invoice, totals, paperSize]);

  const handleClear = () => {
    if (window.confirm("Clear the current invoice? This cannot be undone. Any saved draft will be removed.")) {
      const empty = createEmptyInvoice();
      setInvoice(empty);
      clearDraft();
      setDraftStatus("saved");
      setShowAmountPaid(false);
    }
  };

  const loadSample = () => {
    if (invoice.lineItems.length > 0 || invoice.freelancer.name) {
      if (!window.confirm("This will replace your current invoice. Continue?")) return;
    }
    const sample = createSampleInvoice();
    setInvoice(sample);
    setShowAmountPaid(true);
  };

  const handleExport = () => {
    const json = exportDraftJSON(invoice);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-backup-${sanitizeFilename(invoice.invoiceNumber || "export")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = importDraftJSON(reader.result as string);
      if (result.data) {
        setInvoice(result.data);
        if (result.data.amountPaid > 0) setShowAmountPaid(true);
      } else {
        alert(`Import failed: ${result.error}`);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Amount paid validation
  const amountPaidExcess = checkAmountPaidExcess(
    invoice.lineItems,
    invoice.discountPercent,
    invoice.taxPercent,
    invoice.amountPaid,
    invoice.currency
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-stone-200 bg-white p-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-stone-900">Invoice Editor</span>
          {draftStatus === "saved" && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Draft saved
            </span>
          )}
          {draftStatus === "saving" && (
            <span className="text-[10px] text-stone-400">Saving...</span>
          )}
          {draftStatus === "error" && (
            <span className="text-[10px] text-rose-600 font-medium bg-rose-50 px-2 py-0.5 rounded">
              Save failed — storage full?
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={loadSample}
            className="text-xs px-2.5 py-1.5 rounded-md border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 transition-colors"
          >
            Load sample
          </button>
          <button
            type="button"
            onClick={() => setShowImportExport(!showImportExport)}
            className="text-xs px-2.5 py-1.5 rounded-md border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 transition-colors"
          >
            Import/Export
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs px-2.5 py-1.5 rounded-md border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Import/Export panel */}
      {showImportExport && (
        <div className="rounded-lg border border-stone-200 bg-white p-4 space-y-3">
          <p className="text-xs text-stone-500">
            Export a JSON backup or import a previously exported invoice. Drafts are stored only on this device and may be lost if browser data is cleared.
          </p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleExport} className="text-xs px-3 py-1.5 rounded-md bg-stone-900 text-white hover:bg-stone-700 transition-colors">
              Export JSON
            </button>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs px-3 py-1.5 rounded-md border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors">
              Import JSON
            </button>
            <input ref={fileInputRef} type="file" accept=".json,application/json" onChange={handleImport} className="hidden" />
          </div>
          <p className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1.5">
            Shared device warning: Invoice data stored in this browser is accessible to anyone using this device. Clear your invoice when finished on shared computers.
          </p>
        </div>
      )}

      {/* Download bar */}
      <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label className="text-xs text-stone-600">Paper size:</label>
          <select
            value={paperSize}
            onChange={(e) => setPaperSize(e.target.value as "a4" | "letter")}
            className="text-xs rounded-md border border-stone-200 bg-white px-2 py-1"
          >
            <option value="a4">A4</option>
            <option value="letter">US Letter</option>
          </select>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download PDF
        </button>
      </div>
      {downloadError && (
        <div role="alert" className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded px-3 py-2">
          {downloadError}
        </div>
      )}

      {/* ===================== SECTIONS ===================== */}

      {/* Freelancer Details */}
      <SectionCard title="Your Details" isOpen={openSections.freelancer} onToggle={() => toggleSection("freelancer")}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            id="invoice-freelancer-name"
            label="Business / Freelancer name *"
            value={invoice.freelancer.name}
            onChange={(v) => updateFreelancer("name", v)}
            placeholder="Your Name or Business"
            required
          />
          <TextField
            id="invoice-freelancer-email"
            label="Email"
            value={invoice.freelancer.email}
            onChange={(v) => updateFreelancer("email", v)}
            placeholder="you@example.com"
            type="email"
          />
          <TextField
            id="invoice-freelancer-address"
            label="Address"
            value={invoice.freelancer.address}
            onChange={(v) => updateFreelancer("address", v)}
            placeholder="123 Main St, City, Country"
          />
          <TextField
            id="invoice-freelancer-phone"
            label="Phone"
            value={invoice.freelancer.phone}
            onChange={(v) => updateFreelancer("phone", v)}
            placeholder="+1 (555) 123-4567"
            type="tel"
          />
          <TextField
            id="invoice-freelancer-tax"
            label="Tax / Business ID"
            value={invoice.freelancer.taxId}
            onChange={(v) => updateFreelancer("taxId", v)}
            placeholder="Tax ID or VAT number"
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="invoice-logo" className="text-sm font-medium text-stone-800">Logo</label>
            <input id="invoice-logo" type="file" accept="image/png,image/jpeg" onChange={handleLogoUpload} className="text-xs text-stone-500" />
            {invoice.freelancer.logoDataUrl && (
              <button type="button" onClick={() => updateFreelancer("logoDataUrl", "")} className="text-xs text-rose-600 hover:text-rose-700 self-start">
                Remove logo
              </button>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Client Details */}
      <SectionCard title="Client Details" isOpen={openSections.client} onToggle={() => toggleSection("client")}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            id="invoice-client-name"
            label="Client / Company name *"
            value={invoice.client.name}
            onChange={(v) => updateClient("name", v)}
            placeholder="Client Name"
            required
          />
          <TextField
            id="invoice-client-email"
            label="Email"
            value={invoice.client.email}
            onChange={(v) => updateClient("email", v)}
            placeholder="client@example.com"
            type="email"
          />
          <TextField
            id="invoice-client-address"
            label="Billing Address"
            value={invoice.client.address}
            onChange={(v) => updateClient("address", v)}
            placeholder="456 Business Ave, City"
          />
          <TextField
            id="invoice-client-tax"
            label="Client Tax ID"
            value={invoice.client.taxId}
            onChange={(v) => updateClient("taxId", v)}
            placeholder="Client Tax ID"
          />
        </div>
      </SectionCard>

      {/* Invoice Details */}
      <SectionCard title="Invoice Details" isOpen={openSections.details} onToggle={() => toggleSection("details")}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            id="invoice-number"
            label="Invoice Number *"
            value={invoice.invoiceNumber}
            onChange={(v) => setInvoice((prev) => ({ ...prev, invoiceNumber: v }))}
            placeholder="INV-001"
            required
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="invoice-currency" className="text-sm font-medium text-stone-800">Currency</label>
            <select
              id="invoice-currency"
              value={invoice.currency}
              onChange={(e) => setInvoice((prev) => ({ ...prev, currency: e.target.value as CurrencyCode }))}
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 focus:border-[#44684f] focus:outline-none focus:ring-1 focus:ring-[#44684f]"
            >
              {Object.values(CURRENCIES).map((c) => (
                <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
              ))}
            </select>
          </div>
          <TextField
            id="invoice-issue-date"
            label="Issue Date *"
            value={invoice.issueDate}
            onChange={(v) => setInvoice((prev) => ({ ...prev, issueDate: v }))}
            type="date"
            required
          />
          <TextField
            id="invoice-due-date"
            label="Due Date (optional)"
            value={invoice.dueDate}
            onChange={(v) => setInvoice((prev) => ({ ...prev, dueDate: v }))}
            type="date"
          />
        </div>
      </SectionCard>

      {/* Line Items */}
      <SectionCard title="Line Items" isOpen={openSections.lineItems} onToggle={() => toggleSection("lineItems")}>
        <div className="space-y-3">
          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-stone-500 uppercase tracking-wider pb-1">
            <span className="col-span-5 sm:col-span-6">Description</span>
            <span className="col-span-3 sm:col-span-2">Qty</span>
            <span className="col-span-3 sm:col-span-2">Rate</span>
            <span className="col-span-4 sm:col-span-2 text-right">Amount</span>
          </div>
          {invoice.lineItems.map((item, idx) => {
            const lineTotal = item.quantity * item.rate;
            return (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-start">
                <div className="col-span-5 sm:col-span-6">
                  <input
                    id={`item-desc-${idx}`}
                    type="text"
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                    placeholder={`Service description ${idx + 1}`}
                    className="w-full rounded-md border border-stone-300 bg-white px-2.5 py-2 text-sm focus:border-[#44684f] focus:outline-none focus:ring-1 focus:ring-[#44684f]"
                  />
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <input
                    id={`item-qty-${idx}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.quantity || ""}
                    onChange={(e) => updateLineItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full rounded-md border border-stone-300 bg-white px-2 py-2 text-sm text-right focus:border-[#44684f] focus:outline-none focus:ring-1 focus:ring-[#44684f]"
                  />
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-stone-400 pointer-events-none">
                      {CURRENCIES[invoice.currency].symbol}
                    </span>
                    <input
                      id={`item-rate-${idx}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate || ""}
                      onChange={(e) => updateLineItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full rounded-md border border-stone-300 bg-white pl-6 pr-2 py-2 text-sm text-right focus:border-[#44684f] focus:outline-none focus:ring-1 focus:ring-[#44684f]"
                    />
                  </div>
                </div>
                <div className="col-span-4 sm:col-span-2 flex items-center justify-end gap-2">
                  <span className="text-sm font-medium text-stone-900 tabular-nums whitespace-nowrap">
                    {lineTotal > 0 ? formatCurrency(lineTotal, invoice.currency) : "—"}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeLineItem(item.id)}
                    disabled={invoice.lineItems.length === 1}
                    className="shrink-0 p-1 rounded text-stone-400 hover:text-rose-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label={`Remove line item ${idx + 1}`}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
          <button
            type="button"
            onClick={addLineItem}
            className="text-xs font-medium text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add line item
          </button>
        </div>
      </SectionCard>

      {/* Totals */}
      <SectionCard title="Discount, Tax & Totals" isOpen={openSections.totals} onToggle={() => toggleSection("totals")}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="invoice-discount" className="text-sm font-medium text-stone-800">Discount (%)</label>
            <input
              id="invoice-discount"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={invoice.discountPercent || ""}
              onChange={(e) => setInvoice((prev) => ({ ...prev, discountPercent: parseFloat(e.target.value) || 0 }))}
              placeholder="0"
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm focus:border-[#44684f] focus:outline-none focus:ring-1 focus:ring-[#44684f]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="invoice-tax" className="text-sm font-medium text-stone-800">Tax (%)</label>
            <input
              id="invoice-tax"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={invoice.taxPercent || ""}
              onChange={(e) => setInvoice((prev) => ({ ...prev, taxPercent: parseFloat(e.target.value) || 0 }))}
              placeholder="0"
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm focus:border-[#44684f] focus:outline-none focus:ring-1 focus:ring-[#44684f]"
            />
            <p className="text-[10px] text-stone-400">Enter your applicable tax rate manually. We do not infer tax rates.</p>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-4 rounded-lg border border-stone-200 bg-stone-50 p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-600">Subtotal</span>
              <span className="font-medium tabular-nums">{formatCurrencyFromMinor(totals.subtotal, invoice.currency)}</span>
            </div>
            {invoice.discountPercent > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>Discount ({invoice.discountPercent}%)</span>
                <span className="tabular-nums">- {formatCurrencyFromMinor(totals.discountAmount, invoice.currency)}</span>
              </div>
            )}
            {invoice.taxPercent > 0 && (
              <div className="flex justify-between">
                <span className="text-stone-600">Tax ({invoice.taxPercent}%)</span>
                <span className="tabular-nums">+ {formatCurrencyFromMinor(totals.taxAmount, invoice.currency)}</span>
              </div>
            )}
            <div className="border-t border-stone-200 pt-2 mt-2 flex justify-between font-semibold text-base">
              <span>Total</span>
              <span className="tabular-nums">{formatCurrencyFromMinor(totals.total, invoice.currency)}</span>
            </div>

            {/* Amount Paid toggle */}
            {!showAmountPaid && (
              <button type="button" onClick={() => setShowAmountPaid(true)} className="text-xs text-emerald-700 hover:text-emerald-800 mt-1">
                + Record partial payment
              </button>
            )}
            {showAmountPaid && (
              <>
                <div className="flex flex-col gap-1.5 pt-1">
                  <div className="flex items-center gap-2">
                    <label htmlFor="invoice-amount-paid" className="text-sm text-stone-600">Amount Already Paid</label>
                    <button type="button" onClick={() => { setShowAmountPaid(false); setInvoice((prev) => ({ ...prev, amountPaid: 0 })); }} className="text-[10px] text-stone-400 hover:text-stone-600 ml-auto">
                      Remove
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-stone-400 pointer-events-none">
                      {CURRENCIES[invoice.currency].symbol}
                    </span>
                    <input
                      id="invoice-amount-paid"
                      type="number"
                      min="0"
                      step={CURRENCIES[invoice.currency].decimalPlaces === 0 ? "1" : "0.01"}
                      value={invoice.amountPaid || ""}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setInvoice((prev) => ({ ...prev, amountPaid: val }));
                      }}
                      placeholder="0"
                      className={`w-full rounded-md border bg-white pl-8 pr-3 py-2.5 text-sm focus:outline-none focus:ring-1 ${
                        amountPaidExcess
                          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400"
                          : "border-stone-300 focus:border-[#44684f] focus:ring-[#44684f]"
                      }`}
                    />
                  </div>
                  {amountPaidExcess && (
                    <p className="text-xs text-rose-600" role="alert">
                      Amount paid exceeds the total by {formatCurrency(amountPaidExcess, invoice.currency)}. This is not allowed — reduce the amount paid.
                    </p>
                  )}
                </div>
                <div className="border-t border-emerald-200 pt-2 mt-2 flex justify-between font-semibold text-emerald-800">
                  <span>Balance Due</span>
                  <span className="tabular-nums">{formatCurrencyFromMinor(totals.balanceDue, invoice.currency)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Notes */}
      <SectionCard title="Notes & Payment Details" isOpen={openSections.notes} onToggle={() => toggleSection("notes")}>
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="invoice-notes" className="text-sm font-medium text-stone-800">Invoice Notes</label>
            <textarea
              id="invoice-notes"
              value={invoice.notes}
              onChange={(e) => setInvoice((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Thank you for your business! Payment terms, late fee policy, etc."
              rows={3}
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm focus:border-[#44684f] focus:outline-none focus:ring-1 focus:ring-[#44684f] resize-y"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="invoice-payment-instructions" className="text-sm font-medium text-stone-800">Payment Instructions</label>
            <textarea
              id="invoice-payment-instructions"
              value={invoice.paymentInstructions}
              onChange={(e) => setInvoice((prev) => ({ ...prev, paymentInstructions: e.target.value }))}
              placeholder="Bank name, account number, routing number, SWIFT code..."
              rows={3}
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm focus:border-[#44684f] focus:outline-none focus:ring-1 focus:ring-[#44684f] resize-y"
            />
            <p className="text-[10px] text-stone-400">Do not enter payment account passwords or card PIN numbers.</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

interface SectionCardProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function SectionCard({ title, isOpen, onToggle, children }: SectionCardProps) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-stone-50 transition-colors focus:outline-none focus:bg-stone-50"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-semibold text-stone-900">{title}</span>
        <svg
          className={`h-4 w-4 text-stone-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

function TextField({ id, label, value, onChange, type = "text", placeholder, required }: TextFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-stone-800">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#44684f] focus:outline-none focus:ring-1 focus:ring-[#44684f] transition-colors"
      />
    </div>
  );
}
