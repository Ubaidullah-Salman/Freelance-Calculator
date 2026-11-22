import {
  computeElapsedMinutes,
  computeWorkedMinutes,
  calculateTimeCard,
  formatMinutes,
  formatDecimalHours,
  formatMoney,
  getSessionEndDate,
  sanitizeCsvField,
  generateTimeCardCsv,
  createSampleTimeCard,
  generateTimeCardPdf,
  saveTimeCardToLocalStorage,
  loadTimeCardFromLocalStorage,
} from "@/components/time-card/utils";
import type { TimeCardData, Session } from "@/components/time-card/types";

describe("Time Card Calculations", () => {
  it("computes standard shift worked minutes correctly", () => {
    const session: Session = {
      id: "1",
      date: "2026-11-21",
      startTime: "09:00",
      endTime: "17:30",
      unpaidBreakMins: 30,
      endsNextDay: false,
    };
    // 8.5 hours elapsed = 510 mins, minus 30 mins break = 480 mins (8 hours)
    expect(computeElapsedMinutes(session)).toBe(510);
    expect(computeWorkedMinutes(session)).toBe(480);
    expect(formatDecimalHours(480)).toBe(8.0);
    expect(formatMinutes(480)).toBe("8h 0m");
  });

  it("handles overnight shifts spanning midnight", () => {
    const session: Session = {
      id: "2",
      date: "2026-11-21",
      startTime: "22:00",
      endTime: "06:00",
      unpaidBreakMins: 30,
      endsNextDay: true,
    };
    // 8 hours elapsed = 480 mins, minus 30 mins break = 450 mins (7.5 hours)
    expect(computeElapsedMinutes(session)).toBe(480);
    expect(computeWorkedMinutes(session)).toBe(450);
    expect(formatDecimalHours(450)).toBe(7.5);
    expect(formatMinutes(450)).toBe("7h 30m");
    expect(getSessionEndDate(session.date, session.endsNextDay)).toBe("2026-11-22");
  });

  it("handles multiple sessions on the same day", () => {
    const sessions: Session[] = [
      {
        id: "m1",
        date: "2026-11-21",
        startTime: "08:00",
        endTime: "12:00",
        unpaidBreakMins: 0,
        endsNextDay: false,
      }, // 4 hrs = 240m
      {
        id: "m2",
        date: "2026-11-21",
        startTime: "13:00",
        endTime: "17:00",
        unpaidBreakMins: 15,
        endsNextDay: false,
      }, // 4 hrs - 15m = 225m
      {
        id: "m3",
        date: "2026-11-21",
        startTime: "18:00",
        endTime: "20:00",
        unpaidBreakMins: 0,
        endsNextDay: false,
      }, // 2 hrs = 120m
    ];

    const data: TimeCardData = {
      clientName: "Multi Session Client",
      hourlyRate: 50,
      currency: "USD",
      payPeriodStartDate: "2026-11-21",
      overtimeThreshold: 40,
      overtimeMultiplier: 1.5,
      sessions,
    };

    const preview = calculateTimeCard(data);
    // 240 + 225 + 120 = 585 minutes = 9.75 hours
    expect(preview.totalWorkedMinutes).toBe(585);
    expect(preview.netWorkedHours).toBe(9.75);
    expect(formatMinutes(preview.totalWorkedMinutes)).toBe("9h 45m");
    expect(preview.totalPay).toBe(487.5); // 9.75 * 50
  });

  it("calculates weekly overtime correctly", () => {
    const data: TimeCardData = {
      clientName: "Test Client",
      hourlyRate: 20,
      currency: "USD",
      payPeriodStartDate: "2026-11-21",
      overtimeThreshold: 40,
      overtimeMultiplier: 1.5,
      sessions: [
        {
          id: "s1",
          date: "2026-11-21",
          startTime: "08:00",
          endTime: "17:00",
          unpaidBreakMins: 0,
          endsNextDay: false,
        }, // 9 hrs
        {
          id: "s2",
          date: "2026-11-22",
          startTime: "08:00",
          endTime: "17:00",
          unpaidBreakMins: 0,
          endsNextDay: false,
        }, // 9 hrs
        {
          id: "s3",
          date: "2026-11-23",
          startTime: "08:00",
          endTime: "17:00",
          unpaidBreakMins: 0,
          endsNextDay: false,
        }, // 9 hrs
        {
          id: "s4",
          date: "2026-11-24",
          startTime: "08:00",
          endTime: "17:00",
          unpaidBreakMins: 0,
          endsNextDay: false,
        }, // 9 hrs
        {
          id: "s5",
          date: "2026-11-25",
          startTime: "08:00",
          endTime: "17:00",
          unpaidBreakMins: 0,
          endsNextDay: false,
        }, // 9 hrs -> total 45 hrs
      ],
    };

    const res = calculateTimeCard(data);
    expect(res.netWorkedHours).toBe(45);
    expect(res.overtimeApplied).toBe(5);
    // 40 hrs regular @ $20 = $800
    // 5 hrs OT @ $30 = $150
    // Total = $950
    expect(res.grossPay).toBe(800);
    expect(res.overtimePay).toBe(150);
    expect(res.totalPay).toBe(950);
  });
});

describe("Sample Verification", () => {
  it("verifies the sample still totals 39h 45m and $1,391.25 at $35/hour", () => {
    const sample = createSampleTimeCard();
    expect(sample.hourlyRate).toBe(35);
    expect(sample.currency).toBe("USD");

    const preview = calculateTimeCard(sample);
    // Day 0: 510 - 30 = 480m (8h 0m)
    // Day 1: 510 - 30 = 480m (8h 0m)
    // Day 2: 540 - 45 = 495m (8h 15m)
    // Day 3: 510 - 30 = 480m (8h 0m)
    // Day 4: 480 - 30 = 450m (7h 30m)
    // Total: 2385 mins = 39h 45m = 39.75 hrs
    expect(preview.totalWorkedMinutes).toBe(2385);
    expect(formatMinutes(preview.totalWorkedMinutes)).toBe("39h 45m");
    expect(preview.netWorkedHours).toBe(39.75);

    // Pay at $35/hr: 39.75 * 35 = 1391.25
    expect(preview.totalPay).toBe(1391.25);
    expect(formatMoney(preview.totalPay, "USD")).toBe("$1,391.25 USD");
  });
});

describe("Money and Classification Formatting", () => {
  it("formats money consistently across currencies", () => {
    expect(formatMoney(1391.25, "USD")).toBe("$1,391.25 USD");
    expect(formatMoney(1391.25, "EUR")).toBe("€1,391.25 EUR");
    expect(formatMoney(1391.25, "GBP")).toBe("£1,391.25 GBP");
    expect(formatMoney(1391.25, "CAD")).toBe("CA$1,391.25 CAD");
    expect(formatMoney(1391.25, "AUD")).toBe("A$1,391.25 AUD");
    expect(formatMoney(1391.25, "PKR")).toBe("₨1,391.25 PKR");
  });
});

describe("PDF Generation", () => {
  it("generates a valid time card PDF without errors", () => {
    const sample = createSampleTimeCard();
    const preview = calculateTimeCard(sample);
    const doc = generateTimeCardPdf(sample, preview);
    expect(doc).toBeDefined();
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(1);
  });

  it("omits empty optional fields cleanly", () => {
    const data: TimeCardData = {
      clientName: "Acme Corp",
      hourlyRate: 40,
      currency: "USD",
      payPeriodStartDate: "2026-11-21",
      overtimeThreshold: 40,
      overtimeMultiplier: 1.5,
      sessions: [
        {
          id: "1",
          date: "2026-11-21",
          startTime: "09:00",
          endTime: "17:00",
          unpaidBreakMins: 30,
          endsNextDay: false,
        },
      ],
    };
    const preview = calculateTimeCard(data);
    const doc = generateTimeCardPdf(data, preview, {
      includePayDetails: true,
      includeSignatures: false,
      includeCredit: false,
    });
    expect(doc).toBeDefined();
  });

  it("respects hidden pay details in PDF", () => {
    const sample = createSampleTimeCard();
    const preview = calculateTimeCard(sample);
    const doc = generateTimeCardPdf(sample, preview, {
      includePayDetails: false,
    });
    expect(doc).toBeDefined();
  });

  it("renders signature blocks when enabled", () => {
    const sample = createSampleTimeCard();
    const preview = calculateTimeCard(sample);
    const doc = generateTimeCardPdf(sample, preview, {
      includeSignatures: true,
      includeCredit: true,
    });
    expect(doc).toBeDefined();
  });

  it("handles multi-page PDFs with many sessions and long text", () => {
    const manySessions: Session[] = Array.from({ length: 30 }, (_, i) => ({
      id: `s-${i}`,
      date: `2026-11-${String((i % 28) + 1).padStart(2, "0")}`,
      startTime: "09:00",
      endTime: "17:00",
      unpaidBreakMins: 30,
      endsNextDay: false,
      comment: `Task for milestone ${i + 1}: detailed architectural overview, continuous integration pipeline optimization, and client code review.`,
    }));

    const data: TimeCardData = {
      ...createSampleTimeCard(),
      sessions: manySessions,
    };

    const preview = calculateTimeCard(data);
    const doc = generateTimeCardPdf(data, preview);
    expect(doc).toBeDefined();
    expect(doc.getNumberOfPages()).toBeGreaterThan(1);
  });
});

describe("CSV Generation", () => {
  it("generates data_only rectangular CSV with repeated metadata and unallocated overtime", () => {
    const sample = createSampleTimeCard();
    const preview = calculateTimeCard(sample);
    const csv = generateTimeCardCsv(sample, preview, {
      format: "data_only",
      includePayDetails: true,
    });

    // Verify UTF-8 BOM
    expect(csv.startsWith("\uFEFF")).toBe(true);

    const lines = csv.replace(/^\uFEFF/, "").trim().split("\r\n");
    // 1 header row + 5 session rows = 6 rows
    expect(lines.length).toBe(6);

    // Check header
    expect(lines[0]).toBe(
      "worker_name,client_name,project_name,period_start_date,period_end_date,session_number,start_date,end_date,start_time,end_time,overnight,unpaid_break_minutes,worked_minutes,decimal_hours,description,currency,rate_per_hour,amount"
    );

    // Check that each row starts with identifying metadata
    for (let i = 1; i <= 5; i++) {
      expect(lines[i].startsWith("Alex Morgan,Acme Digital Studio,Web App Refactor")).toBe(true);
    }
  });

  it("generates with_summary CSV with header and summary totals", () => {
    const sample = createSampleTimeCard();
    const preview = calculateTimeCard(sample);
    const csv = generateTimeCardCsv(sample, preview, {
      format: "with_summary",
      includePayDetails: true,
    });

    expect(csv).toContain("TIMESHEET / TIME CARD SUMMARY");
    expect(csv).toContain("TOTALS SUMMARY");
    expect(csv).toContain("Total Net Worked Hours,39.75");
    expect(csv).toContain("Total Estimated Gross Pay,1391.25");
  });

  it("removes rates and amounts when financial details are hidden", () => {
    const sample = createSampleTimeCard();
    const preview = calculateTimeCard(sample);
    const csv = generateTimeCardCsv(sample, preview, {
      includePayDetails: false,
    });

    expect(csv).not.toContain("rate_per_hour");
    expect(csv).not.toContain("amount");
    expect(csv).not.toContain("1391.25");
  });

  it("escapes commas, quotes, newlines, and protects against formula injection", () => {
    // Formula injection tests: leading =, +, -, @, \t
    expect(sanitizeCsvField("=cmd|'/C calc'!A0")).toBe("\"'=cmd|'/C calc'!A0\"");
    expect(sanitizeCsvField("+12345")).toBe("\"'+12345\"");
    expect(sanitizeCsvField("@SUM(1,2)")).toBe("\"'@SUM(1,2)\"");

    // Commas and quotes
    expect(sanitizeCsvField('UI "Button", Navbar')).toBe('"UI ""Button"", Navbar"');

    // Newlines
    expect(sanitizeCsvField("Line 1\nLine 2")).toBe('"Line 1\nLine 2"');

    // Numbers stay clean
    expect(sanitizeCsvField(42)).toBe("42");
    expect(sanitizeCsvField(0)).toBe("0");

    // International characters
    expect(sanitizeCsvField("München Café €")).toBe("München Café €");
  });
});

describe("Local Storage Draft Restoration", () => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();

  beforeEach(() => {
    Object.defineProperty(global, "localStorage", {
      value: localStorageMock,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(global, "window", {
      value: { localStorage: localStorageMock },
      writable: true,
      configurable: true,
    });
    localStorageMock.clear();
  });

  it("saves and loads time card data accurately", () => {
    const sample = createSampleTimeCard();
    saveTimeCardToLocalStorage(sample);
    const loaded = loadTimeCardFromLocalStorage();
    expect(loaded).toEqual(sample);
    expect(loaded?.workerName).toBe("Alex Morgan");
    expect(loaded?.sessions.length).toBe(5);
  });
});
