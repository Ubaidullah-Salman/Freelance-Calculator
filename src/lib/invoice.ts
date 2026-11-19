/**
 * Invoice Generator Library
 *
 * Handles money math using integer minor units (cents) to avoid floating-point errors.
 * Provides validation, draft serialization, and currency-aware formatting.
 */

// ============================================================================
// Types
// ============================================================================

export type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "PKR";

export interface CurrencyMeta {
  code: CurrencyCode;
  name: string;
  symbol: string;
  decimalPlaces: number;
  flag: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number; // Can be decimal (e.g., 2.5 hours)
  rate: number; // Per-unit rate in major units
}

export interface FreelancerDetails {
  name: string;
  email: string;
  address: string;
  phone: string;
  taxId: string;
  logoDataUrl?: string; // Base64 encoded image
}

export interface ClientDetails {
  name: string;
  email: string;
  address: string;
  taxId: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  issueDate: string; // ISO date string
  dueDate?: string; // ISO date string
  currency: CurrencyCode;
  freelancer: FreelancerDetails;
  client: ClientDetails;
  lineItems: LineItem[];
  discountPercent: number; // 0-100
  taxPercent: number; // 0-100, defaults to 0
  notes: string;
  paymentInstructions: string;
  amountPaid: number; // Amount already paid (major units)
}

export interface InvoiceTotals {
  subtotal: number; // In minor units (cents)
  discountAmount: number; // In minor units
  discountedSubtotal: number; // In minor units
  taxAmount: number; // In minor units
  total: number; // In minor units
  amountPaid: number; // In minor units
  balanceDue: number; // In minor units
}

export interface ValidationError {
  field: string;
  message: string;
}

// ============================================================================
// Currency Metadata
// ============================================================================

export const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  USD: {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    decimalPlaces: 2,
    flag: "🇺🇸",
  },
  EUR: {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    decimalPlaces: 2,
    flag: "🇪🇺",
  },
  GBP: {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    decimalPlaces: 2,
    flag: "🇬🇧",
  },
  CAD: {
    code: "CAD",
    name: "Canadian Dollar",
    symbol: "CA$",
    decimalPlaces: 2,
    flag: "🇨🇦",
  },
  AUD: {
    code: "AUD",
    name: "Australian Dollar",
    symbol: "A$",
    decimalPlaces: 2,
    flag: "🇦🇺",
  },
  PKR: {
    code: "PKR",
    name: "Pakistani Rupee",
    symbol: "PKR ",
    decimalPlaces: 0,
    flag: "🇵🇰",
  },
};

// ============================================================================
// Money Math - Integer Minor Units
// ============================================================================

/**
 * Convert major units (dollars) to minor units (cents) as integer.
 * Uses rounding to avoid floating-point accumulation errors.
 */
export function toMinorUnits(amount: number, decimalPlaces: number = 2): number {
  const multiplier = Math.pow(10, decimalPlaces);
  return Math.round(amount * multiplier);
}

/**
 * Convert minor units (cents) back to major units (dollars) as float.
 */
export function toMajorUnits(minor: number, decimalPlaces: number = 2): number {
  const multiplier = Math.pow(10, decimalPlaces);
  return minor / multiplier;
}

/**
 * Calculate line item total in minor units.
 * quantity * rate, then convert to minor units.
 */
export function calculateLineTotal(item: LineItem, decimalPlaces: number): number {
  const rawTotal = item.quantity * item.rate;
  return toMinorUnits(rawTotal, decimalPlaces);
}

/**
 * Calculate all invoice totals using integer arithmetic.
 *
 * Calculation order:
 * 1. Subtotal = sum of rounded line totals
 * 2. Discount applies to subtotal
 * 3. Tax applies to discounted subtotal
 * 4. Total = discounted subtotal + tax
 * 5. Balance due = total - amount paid
 */
export function calculateTotals(
  items: LineItem[],
  discountPercent: number,
  taxPercent: number,
  amountPaid: number,
  currency: CurrencyCode
): InvoiceTotals {
  const meta = CURRENCIES[currency];
  const decimalPlaces = meta.decimalPlaces;

  // 1. Subtotal = sum of line totals (each line rounded to minor units)
  let subtotalMinor = 0;
  for (const item of items) {
    subtotalMinor += calculateLineTotal(item, decimalPlaces);
  }

  // 2. Discount (clamp to 0-100)
  const effectiveDiscount = Math.max(0, Math.min(100, discountPercent));
  const discountAmountMinor = Math.round((subtotalMinor * effectiveDiscount) / 100);
  const discountedSubtotalMinor = subtotalMinor - discountAmountMinor;

  // 3. Tax (clamp to 0-100, applied to discounted subtotal)
  const effectiveTax = Math.max(0, Math.min(100, taxPercent));
  const taxAmountMinor = Math.round((discountedSubtotalMinor * effectiveTax) / 100);

  // 4. Total
  const totalMinor = discountedSubtotalMinor + taxAmountMinor;

  // 5. Amount paid and balance
  const amountPaidMinor = toMinorUnits(amountPaid, decimalPlaces);
  const balanceDueMinor = Math.max(0, totalMinor - amountPaidMinor);

  return {
    subtotal: subtotalMinor,
    discountAmount: discountAmountMinor,
    discountedSubtotal: discountedSubtotalMinor,
    taxAmount: taxAmountMinor,
    total: totalMinor,
    amountPaid: amountPaidMinor,
    balanceDue: balanceDueMinor,
  };
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Validate invoice data and return array of errors.
 * Empty array means valid.
 */
export function validateInvoice(data: Partial<InvoiceData>): ValidationError[] {
  const errors: ValidationError[] = [];

  // Freelancer name required
  if (!data.freelancer?.name || data.freelancer.name.trim() === "") {
    errors.push({ field: "freelancer.name", message: "Freelancer/business name is required" });
  }

  // Client name required
  if (!data.client?.name || data.client.name.trim() === "") {
    errors.push({ field: "client.name", message: "Client/company name is required" });
  }

  // Invoice number required
  if (!data.invoiceNumber || data.invoiceNumber.trim() === "") {
    errors.push({ field: "invoiceNumber", message: "Invoice number is required" });
  }

  // Issue date required
  if (!data.issueDate || data.issueDate === "") {
    errors.push({ field: "issueDate", message: "Issue date is required" });
  }

  // At least one line item required
  if (!data.lineItems || data.lineItems.length === 0) {
    errors.push({ field: "lineItems", message: "At least one line item is required" });
  } else {
    // Validate each line item
    data.lineItems.forEach((item, index) => {
      if (!item.description || item.description.trim() === "") {
        errors.push({ field: `lineItems[${index}].description`, message: `Line item ${index + 1} needs a description` });
      }
      if (item.quantity <= 0 || isNaN(item.quantity)) {
        errors.push({ field: `lineItems[${index}].quantity`, message: `Line item ${index + 1} quantity must be positive` });
      }
      if (item.rate < 0 || isNaN(item.rate)) {
        errors.push({ field: `lineItems[${index}].rate`, message: `Line item ${index + 1} rate cannot be negative` });
      }
    });
  }

  // Currency required
  if (!data.currency || !CURRENCIES[data.currency]) {
    errors.push({ field: "currency", message: "Valid currency is required" });
  }

  // Discount percent must be 0-100
  if (data.discountPercent !== undefined && (data.discountPercent < 0 || data.discountPercent > 100)) {
    errors.push({ field: "discountPercent", message: "Discount must be between 0% and 100%" });
  }

  // Tax percent must be 0-100
  if (data.taxPercent !== undefined && (data.taxPercent < 0 || data.taxPercent > 100)) {
    errors.push({ field: "taxPercent", message: "Tax must be between 0% and 100%" });
  }

  // Amount paid validation (checked against total if we can calculate it)
  if (data.amountPaid !== undefined && data.amountPaid < 0) {
    errors.push({ field: "amountPaid", message: "Amount paid cannot be negative" });
  }

  return errors;
}

/**
 * Check if amount paid exceeds total.
 * Returns the excess amount in major units if it does, or null if valid.
 */
export function checkAmountPaidExcess(
  items: LineItem[],
  discountPercent: number,
  taxPercent: number,
  amountPaid: number,
  currency: CurrencyCode
): number | null {
  const totals = calculateTotals(items, discountPercent, taxPercent, amountPaid, currency);
  const amountPaidMajor = toMajorUnits(totals.amountPaid, CURRENCIES[currency].decimalPlaces);
  const totalMajor = toMajorUnits(totals.total, CURRENCIES[currency].decimalPlaces);

  if (amountPaidMajor > totalMajor) {
    return amountPaidMajor - totalMajor;
  }
  return null;
}

// ============================================================================
// Draft Storage (localStorage)
// ============================================================================

const STORAGE_KEY = "freelancecalc-invoice-draft";
const STORAGE_VERSION = 1;

interface StoredDraft {
  version: number;
  savedAt: string;
  data: InvoiceData;
}

/**
 * Save invoice draft to localStorage.
 * Returns true on success, false on failure (quota exceeded, etc.)
 */
export function saveDraft(data: InvoiceData): { success: boolean; error?: string } {
  try {
    const draft: StoredDraft = {
      version: STORAGE_VERSION,
      savedAt: new Date().toISOString(),
      data,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "QuotaExceededError") {
        return { success: false, error: "Browser storage quota exceeded. Please export backup and clear some data." };
      }
      return { success: false, error: error.message };
    }
    return { success: false, error: "Unknown storage error" };
  }
}

/**
 * Load invoice draft from localStorage.
 * Returns null if no draft exists or if draft is invalid.
 */
export function loadDraft(): InvoiceData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const draft: StoredDraft = JSON.parse(stored);

    // Version check for future migrations
    if (draft.version !== STORAGE_VERSION) {
      console.warn("Draft version mismatch, clearing old draft");
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return draft.data;
  } catch (error) {
    console.warn("Failed to load draft:", error);
    return null;
  }
}

/**
 * Clear invoice draft from localStorage.
 */
export function clearDraft(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Export draft as JSON for backup.
 */
export function exportDraftJSON(data: InvoiceData): string {
  const exportData: StoredDraft = {
    version: STORAGE_VERSION,
    savedAt: new Date().toISOString(),
    data,
  };
  return JSON.stringify(exportData, null, 2);
}

/**
 * Import draft from JSON.
 * Returns the data on success, or an error message on failure.
 */
export function importDraftJSON(json: string): { data?: InvoiceData; error?: string } {
  try {
    const parsed: unknown = JSON.parse(json);

    if (!parsed || typeof parsed !== "object") {
      return { error: "Invalid JSON format" };
    }

    const draft = parsed as StoredDraft;

    // Basic structure validation
    if (!draft.data || typeof draft.data !== "object") {
      return { error: "Missing invoice data" };
    }

    // Version handling
    if (draft.version && draft.version !== STORAGE_VERSION) {
      return { error: `Unsupported draft version: ${draft.version}` };
    }

    return { data: draft.data as InvoiceData };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return { error: "Invalid JSON: " + error.message };
    }
    return { error: "Failed to parse JSON" };
  }
}

// ============================================================================
// Formatting
// ============================================================================

/**
 * Format amount in major units with currency symbol and proper decimal places.
 */
export function formatCurrency(amountMajor: number, currency: CurrencyCode): string {
  const meta = CURRENCIES[currency];
  const decimalPlaces = meta.decimalPlaces;

  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(amountMajor);

  return `${meta.symbol}${formatted}`;
}

/**
 * Format amount from minor units.
 */
export function formatCurrencyFromMinor(minor: number, currency: CurrencyCode): string {
  const major = toMajorUnits(minor, CURRENCIES[currency].decimalPlaces);
  return formatCurrency(major, currency);
}

/**
 * Generate a simple invoice number suggestion.
 * Format: INV-YYYYMMDD-XXXX (random 4 digits)
 */
export function generateInvoiceNumber(): string {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `INV-${datePart}-${randomPart}`;
}

/**
 * Sanitize filename for download.
 */
export function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-z0-9-_.]/gi, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .toLowerCase();
}

/**
 * Generate PDF filename for invoice.
 */
export function generatePdfFilename(invoiceNumber: string, clientName: string): string {
  const safeInvoice = sanitizeFilename(invoiceNumber || "invoice");
  const safeClient = sanitizeFilename(clientName || "client");
  return `${safeInvoice}-${safeClient}.pdf`;
}

// ============================================================================
// Default/Empty State Factories
// ============================================================================

/**
 * Create empty invoice data with sensible defaults.
 */
export function createEmptyInvoice(): InvoiceData {
  const today = new Date().toISOString().slice(0, 10);

  return {
    invoiceNumber: generateInvoiceNumber(),
    issueDate: today,
    dueDate: "",
    currency: "USD",
    freelancer: {
      name: "",
      email: "",
      address: "",
      phone: "",
      taxId: "",
    },
    client: {
      name: "",
      email: "",
      address: "",
      taxId: "",
    },
    lineItems: [],
    discountPercent: 0,
    taxPercent: 0,
    notes: "",
    paymentInstructions: "",
    amountPaid: 0,
  };
}

/**
 * Create a sample invoice for demonstration.
 */
export function createSampleInvoice(): InvoiceData {
  const today = new Date().toISOString().slice(0, 10);
  const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  return {
    invoiceNumber: "INV-20260119-0001",
    issueDate: today,
    dueDate,
    currency: "USD",
    freelancer: {
      name: "Jane Doe Design",
      email: "jane@example.com",
      address: "123 Creative Street, Design City, DC 12345",
      phone: "+1 (555) 123-4567",
      taxId: "12-3456789",
    },
    client: {
      name: "Acme Corporation",
      email: "billing@acme.example.com",
      address: "456 Business Ave, Corporate Town, CT 67890",
      taxId: "98-7654321",
    },
    lineItems: [
      {
        id: "item-1",
        description: "Logo Design - Initial Concepts",
        quantity: 10,
        rate: 50,
      },
      {
        id: "item-2",
        description: "Brand Guidelines Document",
        quantity: 1,
        rate: 150,
      },
    ],
    discountPercent: 0,
    taxPercent: 0,
    notes: "Thank you for your business! Payment is due within 14 days.",
    paymentInstructions: "Bank Transfer: Bank of Example, Account: 123456789, Routing: 987654321",
    amountPaid: 150,
  };
}
