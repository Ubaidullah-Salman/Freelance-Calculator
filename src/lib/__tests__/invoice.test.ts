/**
 * Tests for invoice library - money math, validation, and draft storage.
 */

import {
  toMinorUnits,
  toMajorUnits,
  calculateLineTotal,
  calculateTotals,
  validateInvoice,
  checkAmountPaidExcess,
  formatCurrency,
  formatCurrencyFromMinor,
  generateInvoiceNumber,
  sanitizeFilename,
  generatePdfFilename,
  createEmptyInvoice,
  createSampleInvoice,
  exportDraftJSON,
  importDraftJSON,
  CURRENCIES,
  type LineItem,
  type InvoiceData,
} from "@/lib/invoice";
import { generateInvoicePdf } from "@/lib/invoice-pdf";

// ============================================================================
// Money Math Tests
// ============================================================================

describe("toMinorUnits / toMajorUnits", () => {
  it("converts USD dollars to cents", () => {
    expect(toMinorUnits(10.5, 2)).toBe(1050);
    expect(toMinorUnits(100, 2)).toBe(10000);
    expect(toMinorUnits(0.01, 2)).toBe(1);
  });

  it("converts PKR with 0 decimal places", () => {
    expect(toMinorUnits(100.7, 0)).toBe(101);
    expect(toMinorUnits(100.4, 0)).toBe(100);
  });

  it("rounds to avoid floating point errors", () => {
    // 0.1 + 0.2 = 0.30000000000000004 in floating point
    const sum = 0.1 + 0.2;
    expect(toMinorUnits(sum, 2)).toBe(30);
  });

  it("converts back to major units correctly", () => {
    expect(toMajorUnits(1050, 2)).toBe(10.5);
    expect(toMajorUnits(1, 2)).toBe(0.01);
    expect(toMajorUnits(100, 0)).toBe(100);
  });
});

describe("calculateLineTotal", () => {
  it("calculates simple line total", () => {
    const item: LineItem = {
      id: "1",
      description: "Test item",
      quantity: 2,
      rate: 50,
    };
    expect(calculateLineTotal(item, 2)).toBe(10000); // $100.00 in cents
  });

  it("handles decimal quantities", () => {
    const item: LineItem = {
      id: "1",
      description: "Hourly work",
      quantity: 2.5,
      rate: 40,
    };
    expect(calculateLineTotal(item, 2)).toBe(10000); // $100.00 in cents
  });

  it("handles PKR with 0 decimal places", () => {
    const item: LineItem = {
      id: "1",
      description: "PKR item",
      quantity: 10,
      rate: 1000,
    };
    expect(calculateLineTotal(item, 0)).toBe(10000); // PKR 10000
  });
});

describe("calculateTotals", () => {
  const items: LineItem[] = [
    { id: "1", description: "Item 1", quantity: 2, rate: 100 },
    { id: "2", description: "Item 2", quantity: 1, rate: 50 },
  ];

  it("calculates subtotal correctly", () => {
    const totals = calculateTotals(items, 0, 0, 0, "USD");
    expect(totals.subtotal).toBe(25000); // $250.00 in cents
    expect(totals.discountAmount).toBe(0);
    expect(totals.taxAmount).toBe(0);
    expect(totals.total).toBe(25000);
    expect(totals.balanceDue).toBe(25000);
  });

  it("applies discount to subtotal", () => {
    const totals = calculateTotals(items, 20, 0, 0, "USD"); // 20% discount
    expect(totals.subtotal).toBe(25000);
    expect(totals.discountAmount).toBe(5000); // 20% of $250
    expect(totals.discountedSubtotal).toBe(20000);
    expect(totals.total).toBe(20000);
  });

  it("applies tax to discounted subtotal", () => {
    const totals = calculateTotals(items, 20, 10, 0, "USD"); // 20% discount, 10% tax
    expect(totals.discountedSubtotal).toBe(20000);
    expect(totals.taxAmount).toBe(2000); // 10% of $200
    expect(totals.total).toBe(22000);
  });

  it("calculates balance due after payment", () => {
    const totals = calculateTotals(items, 0, 0, 100, "USD"); // $100 paid
    expect(totals.total).toBe(25000);
    expect(totals.amountPaid).toBe(10000);
    expect(totals.balanceDue).toBe(15000);
  });

  it("handles full payment", () => {
    const totals = calculateTotals(items, 0, 0, 250, "USD");
    expect(totals.balanceDue).toBe(0);
  });

  it("prevents negative balance when overpaid", () => {
    const totals = calculateTotals(items, 0, 0, 300, "USD"); // Overpaid
    expect(totals.balanceDue).toBe(0);
  });

  it("clamps discount percent to 0-100", () => {
    const totalsNegative = calculateTotals(items, -10, 0, 0, "USD");
    expect(totalsNegative.discountAmount).toBe(0);

    const totalsOver = calculateTotals(items, 150, 0, 0, "USD");
    expect(totalsOver.discountAmount).toBe(25000); // 100% discount
  });

  it("clamps tax percent to 0-100", () => {
    const totalsNegative = calculateTotals(items, 0, -10, 0, "USD");
    expect(totalsNegative.taxAmount).toBe(0);

    const totalsOver = calculateTotals(items, 0, 150, 0, "USD");
    expect(totalsOver.taxAmount).toBe(25000); // 100% tax
  });

  it("uses correct decimal places for PKR", () => {
    const pkrItems: LineItem[] = [
      { id: "1", description: "PKR Item", quantity: 5, rate: 1000 },
    ];
    const totals = calculateTotals(pkrItems, 0, 0, 0, "PKR");
    expect(totals.subtotal).toBe(5000); // PKR 5000 (0 decimal places)
  });
});

// ============================================================================
// Validation Tests
// ============================================================================

describe("validateInvoice", () => {
  it("returns errors for empty invoice", () => {
    const errors = validateInvoice({});
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.field === "freelancer.name")).toBe(true);
    expect(errors.some((e) => e.field === "client.name")).toBe(true);
    expect(errors.some((e) => e.field === "invoiceNumber")).toBe(true);
  });

  it("returns no errors for valid minimal invoice", () => {
    const valid: Partial<InvoiceData> = {
      invoiceNumber: "INV-001",
      issueDate: "2026-01-19",
      currency: "USD",
      freelancer: {
        name: "Test Freelancer",
        email: "",
        address: "",
        phone: "",
        taxId: "",
      },
      client: {
        name: "Test Client",
        email: "",
        address: "",
        taxId: "",
      },
      lineItems: [
        { id: "1", description: "Service", quantity: 1, rate: 100 },
      ],
      discountPercent: 0,
      taxPercent: 0,
      notes: "",
      paymentInstructions: "",
      amountPaid: 0,
    };
    const errors = validateInvoice(valid);
    expect(errors).toEqual([]);
  });

  it("validates line items", () => {
    const invalid: Partial<InvoiceData> = {
      invoiceNumber: "INV-001",
      issueDate: "2026-01-19",
      currency: "USD",
      freelancer: { name: "Test", email: "", address: "", phone: "", taxId: "" },
      client: { name: "Test", email: "", address: "", taxId: "" },
      lineItems: [
        { id: "1", description: "", quantity: -1, rate: -10 },
      ],
    };
    const errors = validateInvoice(invalid);
    expect(errors.some((e) => e.field.includes("description"))).toBe(true);
    expect(errors.some((e) => e.field.includes("quantity"))).toBe(true);
    expect(errors.some((e) => e.field.includes("rate"))).toBe(true);
  });

  it("validates discount and tax ranges", () => {
    const invalid: Partial<InvoiceData> = {
      invoiceNumber: "INV-001",
      issueDate: "2026-01-19",
      currency: "USD",
      freelancer: { name: "Test", email: "", address: "", phone: "", taxId: "" },
      client: { name: "Test", email: "", address: "", taxId: "" },
      lineItems: [{ id: "1", description: "Service", quantity: 1, rate: 100 }],
      discountPercent: 150,
      taxPercent: -10,
    };
    const errors = validateInvoice(invalid);
    expect(errors.some((e) => e.field === "discountPercent")).toBe(true);
    expect(errors.some((e) => e.field === "taxPercent")).toBe(true);
  });

  it("rejects negative amount paid", () => {
    const invalid: Partial<InvoiceData> = {
      invoiceNumber: "INV-001",
      issueDate: "2026-01-19",
      currency: "USD",
      freelancer: { name: "Test", email: "", address: "", phone: "", taxId: "" },
      client: { name: "Test", email: "", address: "", taxId: "" },
      lineItems: [{ id: "1", description: "Service", quantity: 1, rate: 100 }],
      amountPaid: -50,
    };
    const errors = validateInvoice(invalid);
    expect(errors.some((e) => e.field === "amountPaid")).toBe(true);
  });
});

describe("checkAmountPaidExcess", () => {
  const items: LineItem[] = [
    { id: "1", description: "Service", quantity: 1, rate: 100 },
  ];

  it("returns null when payment is valid", () => {
    expect(checkAmountPaidExcess(items, 0, 0, 50, "USD")).toBe(null);
    expect(checkAmountPaidExcess(items, 0, 0, 100, "USD")).toBe(null);
  });

  it("returns excess amount when overpaid", () => {
    const excess = checkAmountPaidExcess(items, 0, 0, 150, "USD");
    expect(excess).toBe(50);
  });
});

// ============================================================================
// Formatting Tests
// ============================================================================

describe("formatCurrency", () => {
  it("formats USD correctly", () => {
    expect(formatCurrency(1234.56, "USD")).toBe("$1,234.56");
    expect(formatCurrency(0.5, "USD")).toBe("$0.50");
  });

  it("formats EUR correctly", () => {
    expect(formatCurrency(1234.56, "EUR")).toBe("€1,234.56");
  });

  it("formats GBP correctly", () => {
    expect(formatCurrency(1234.56, "GBP")).toBe("£1,234.56");
  });

  it("formats PKR with no decimals", () => {
    expect(formatCurrency(1234, "PKR")).toBe("PKR 1,234");
  });

  it("formats CAD and AUD correctly", () => {
    expect(formatCurrency(1234.56, "CAD")).toBe("CA$1,234.56");
    expect(formatCurrency(1234.56, "AUD")).toBe("A$1,234.56");
  });
});

describe("formatCurrencyFromMinor", () => {
  it("formats from minor units correctly", () => {
    expect(formatCurrencyFromMinor(123456, "USD")).toBe("$1,234.56");
    expect(formatCurrencyFromMinor(50, "USD")).toBe("$0.50");
    expect(formatCurrencyFromMinor(1234, "PKR")).toBe("PKR 1,234");
  });
});

describe("generateInvoiceNumber", () => {
  it("generates invoice number with current date when no date provided", () => {
    const num = generateInvoiceNumber();
    expect(num).toMatch(/^INV-\d{8}-\d{4}$/);
  });

  it("generates invoice number based on provided issueDate", () => {
    const num = generateInvoiceNumber("2026-03-15");
    expect(num).toMatch(/^INV-20260315-\d{4}$/);
  });
});

describe("sanitizeFilename", () => {
  it("removes invalid characters", () => {
    expect(sanitizeFilename("Invoice #001.pdf")).toBe("invoice_001.pdf");
    expect(sanitizeFilename("Client/Name")).toBe("client_name");
  });

  it("collapses multiple underscores", () => {
    expect(sanitizeFilename("test___file")).toBe("test_file");
  });

  it("trims leading/trailing underscores", () => {
    expect(sanitizeFilename("_test_")).toBe("test");
  });
});

describe("generatePdfFilename", () => {
  it("generates safe PDF filename", () => {
    const filename = generatePdfFilename("INV-001", "Acme Corp");
    expect(filename).toBe("inv-001-acme_corp.pdf");
  });
});

// ============================================================================
// Factory Functions Tests
// ============================================================================

describe("createEmptyInvoice", () => {
  it("creates valid empty invoice structure with default values", () => {
    const invoice = createEmptyInvoice();
    expect(invoice.invoiceNumber).toMatch(/^INV-\d{8}-\d{4}$/);
    expect(invoice.issueDate).toBeDefined();
    expect(invoice.currency).toBe("USD");
    expect(invoice.lineItems).toEqual([]);
    expect(invoice.discountPercent).toBe(0);
    expect(invoice.taxPercent).toBe(0);
    expect(invoice.amountPaid).toBe(0);
    expect(invoice.includeCredit).toBe(false);
    expect(invoice.paymentDetails).toBeDefined();
  });
});

describe("createSampleInvoice", () => {
  it("creates valid sample invoice with dynamic invoice date", () => {
    const invoice = createSampleInvoice();
    const errors = validateInvoice(invoice);
    expect(errors).toEqual([]);
    expect(invoice.lineItems.length).toBe(2);
    expect(invoice.freelancer.name).toBe("Jane Doe Design");
    expect(invoice.client.name).toBe("Acme Corporation");
    expect(invoice.paymentDetails?.method).toBe("Bank Wire / ACH");
    expect(invoice.includeCredit).toBe(false);
  });

  it("sample invoice calculates correctly", () => {
    const invoice = createSampleInvoice();
    const totals = calculateTotals(
      invoice.lineItems,
      invoice.discountPercent,
      invoice.taxPercent,
      invoice.amountPaid,
      invoice.currency
    );
    // Line 1: 10 × $50 = $500
    // Line 2: 1 × $150 = $150
    // Subtotal: $650
    // Amount paid: $150
    // Balance: $500
    expect(totals.subtotal).toBe(65000);
    expect(totals.balanceDue).toBe(50000);
  });
});

// ============================================================================
// Draft Export/Import Tests
// ============================================================================

describe("exportDraftJSON", () => {
  it("exports valid JSON", () => {
    const invoice = createEmptyInvoice();
    const json = exportDraftJSON(invoice);
    const parsed = JSON.parse(json);
    expect(parsed.version).toBe(1);
    expect(parsed.savedAt).toBeDefined();
    expect(parsed.data).toEqual(invoice);
  });
});

describe("importDraftJSON", () => {
  it("imports valid JSON", () => {
    const invoice = createSampleInvoice();
    const json = exportDraftJSON(invoice);
    const result = importDraftJSON(json);
    expect(result.error).toBeUndefined();
    expect(result.data).toEqual(invoice);
  });

  it("rejects invalid JSON", () => {
    const result = importDraftJSON("not valid json");
    expect(result.error).toBeDefined();
    expect(result.data).toBeUndefined();
  });

  it("rejects missing data", () => {
    const result = importDraftJSON('{"version": 1}');
    expect(result.error).toBe("Missing invoice data");
  });

  it("rejects unsupported version", () => {
    const json = '{"version": 999, "data": {}}';
    const result = importDraftJSON(json);
    expect(result.error).toContain("Unsupported draft version");
  });
});

// ============================================================================
// Currency Metadata Tests
// ============================================================================

describe("CURRENCIES", () => {
  it("contains all required currencies", () => {
    expect(CURRENCIES.USD).toBeDefined();
    expect(CURRENCIES.EUR).toBeDefined();
    expect(CURRENCIES.GBP).toBeDefined();
    expect(CURRENCIES.CAD).toBeDefined();
    expect(CURRENCIES.AUD).toBeDefined();
    expect(CURRENCIES.PKR).toBeDefined();
  });

  it("has correct decimal places", () => {
    expect(CURRENCIES.USD.decimalPlaces).toBe(2);
    expect(CURRENCIES.EUR.decimalPlaces).toBe(2);
    expect(CURRENCIES.GBP.decimalPlaces).toBe(2);
    expect(CURRENCIES.CAD.decimalPlaces).toBe(2);
    expect(CURRENCIES.AUD.decimalPlaces).toBe(2);
    expect(CURRENCIES.PKR.decimalPlaces).toBe(0);
  });

  it("has symbols for all currencies", () => {
    Object.values(CURRENCIES).forEach((currency) => {
      expect(currency.symbol).toBeDefined();
      expect(currency.symbol.length).toBeGreaterThan(0);
    });
  });
});

// ============================================================================
// PDF Generation Tests
// ============================================================================

describe("generateInvoicePdf", () => {
  it("generates a valid jsPDF document without errors", () => {
    const invoice = createSampleInvoice();
    const totals = calculateTotals(
      invoice.lineItems,
      invoice.discountPercent,
      invoice.taxPercent,
      invoice.amountPaid,
      invoice.currency
    );
    const doc = generateInvoicePdf(invoice, totals, "a4");
    expect(doc).toBeDefined();
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(1);
  });

  it("generates PDF with optional credit enabled", () => {
    const invoice = {
      ...createSampleInvoice(),
      includeCredit: true,
    };
    const totals = calculateTotals(
      invoice.lineItems,
      invoice.discountPercent,
      invoice.taxPercent,
      invoice.amountPaid,
      invoice.currency
    );
    const doc = generateInvoicePdf(invoice, totals, "letter");
    expect(doc).toBeDefined();
  });

  it("generates PDF for fully paid invoices", () => {
    const sample = createSampleInvoice();
    const invoice: InvoiceData = {
      ...sample,
      amountPaid: 650, // Full payment of $650
    };
    const totals = calculateTotals(
      invoice.lineItems,
      invoice.discountPercent,
      invoice.taxPercent,
      invoice.amountPaid,
      invoice.currency
    );
    expect(totals.balanceDue).toBe(0);
    const doc = generateInvoicePdf(invoice, totals, "a4");
    expect(doc).toBeDefined();
  });

  it("generates multi-page PDF with long item lists and long payment instructions", () => {
    const manyItems: LineItem[] = Array.from({ length: 30 }, (_, i) => ({
      id: `item-${i}`,
      description: `Detailed project milestone and deliverables item ${i + 1} with extra descriptive text`,
      quantity: 2,
      rate: 100,
    }));
    const invoice: InvoiceData = {
      ...createSampleInvoice(),
      lineItems: manyItems,
      paymentInstructions: "Please send funds via wire transfer with memo referencing invoice.\nAdditional multi-line instruction 1.\nAdditional multi-line instruction 2.",
      notes: "Standard terms and conditions apply. Invoices unpaid after 30 days are subject to interest.",
    };
    const totals = calculateTotals(
      invoice.lineItems,
      invoice.discountPercent,
      invoice.taxPercent,
      invoice.amountPaid,
      invoice.currency
    );
    const doc = generateInvoicePdf(invoice, totals, "a4");
    expect(doc).toBeDefined();
    expect(doc.getNumberOfPages()).toBeGreaterThan(1);
  });
});
