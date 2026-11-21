import {
  computeElapsedMinutes,
  computeWorkedMinutes,
  calculateTimeCard,
  formatMinutes,
  formatDecimalHours,
  createSampleTimeCard,
  generateTimeCardPdf,
} from "@/components/time-card/utils";
import type { TimeCardData } from "@/components/time-card/types";

describe("Time Card Calculations", () => {
  it("computes standard shift worked minutes correctly", () => {
    const session = {
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
    const session = {
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

  it("generates time card PDF successfully", () => {
    const sample = createSampleTimeCard();
    const preview = calculateTimeCard(sample);
    const doc = generateTimeCardPdf(sample, preview, true, "a4");
    expect(doc).toBeDefined();
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(1);
  });
});
