"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { InvoiceData } from "@/lib/invoice";
import type { InvoiceTotals } from "@/lib/invoice";
import { calculateTotals, createEmptyInvoice, loadDraft } from "@/lib/invoice";
import InvoiceEditor from "./InvoiceEditor";
import InvoicePreview from "./InvoicePreview";

interface InvoiceContextValue {
  invoice: InvoiceData | null;
  totals: InvoiceTotals | null;
  onPreviewChange: (inv: InvoiceData, tots: InvoiceTotals) => void;
}

const InvoiceContext = createContext<InvoiceContextValue | null>(null);

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [totals, setTotals] = useState<InvoiceTotals | null>(null);

  // Initialize from draft or empty
  useEffect(() => {
    const saved = loadDraft();
    if (saved) {
      setInvoice(saved);
      setTotals(calculateTotals(saved.lineItems, saved.discountPercent, saved.taxPercent, saved.amountPaid, saved.currency));
    } else {
      const empty = createEmptyInvoice();
      setInvoice(empty);
      setTotals(calculateTotals(empty.lineItems, empty.discountPercent, empty.taxPercent, empty.amountPaid, empty.currency));
    }
  }, []);

  const handlePreviewChange = useCallback((inv: InvoiceData, tots: InvoiceTotals) => {
    setInvoice(inv);
    setTotals(tots);
  }, []);

  return (
    <InvoiceContext.Provider value={{ invoice, totals, onPreviewChange: handlePreviewChange }}>
      {children}
    </InvoiceContext.Provider>
  );
}

/**
 * Renders the invoice editor in the left column.
 */
export function InvoiceEditorWrapper() {
  const ctx = useContext(InvoiceContext);
  if (!ctx) return null;
  return <InvoiceEditor onPreviewChange={ctx.onPreviewChange} />;
}

/**
 * Renders the invoice preview in the right column.
 */
export function InvoicePreviewWrapper() {
  const ctx = useContext(InvoiceContext);
  if (!ctx || !ctx.invoice || !ctx.totals) return null;
  return <InvoicePreview invoice={ctx.invoice} totals={ctx.totals} />;
}
