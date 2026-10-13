import { convertUsdToPkr, convertUsdToCurrency, GLOBAL_FREELANCE_CURRENCIES } from "@/lib/currency";

describe("convertUsdToPkr", () => {
  it("converts a monthly amount correctly", () => {
    const result = convertUsdToPkr(1000, 280, "monthly");
    expect(result.pkrAmount).toBe(280_000);
    expect(result.monthlyPkr).toBe(280_000);
    expect(result.annualPkr).toBe(3_360_000);
  });

  it("scales daily earnings to monthly and annual", () => {
    const result = convertUsdToPkr(50, 280, "daily");
    expect(result.pkrAmount).toBe(14_000); // 50 * 280
    expect(result.monthlyPkr).toBeCloseTo(50 * 22 * 280); // 22 working days
    expect(result.annualPkr).toBeCloseTo(50 * 22 * 280 * 12);
  });

  it("scales weekly earnings to monthly and annual", () => {
    const result = convertUsdToPkr(500, 280, "weekly");
    expect(result.monthlyPkr).toBeCloseTo(500 * 4.33 * 280);
    expect(result.annualPkr).toBeCloseTo(500 * 4.33 * 280 * 12);
  });

  it("throws on negative usdAmount", () => {
    expect(() => convertUsdToPkr(-100, 280, "monthly")).toThrow();
  });

  it("throws on zero or negative exchangeRate", () => {
    expect(() => convertUsdToPkr(100, 0, "monthly")).toThrow();
    expect(() => convertUsdToPkr(100, -280, "monthly")).toThrow();
  });
});

describe("convertUsdToCurrency (Multi-Currency)", () => {
  it("converts USD to INR correctly", () => {
    const res = convertUsdToCurrency(1000, 83.9, "monthly", "INR");
    expect(res.currencyCode).toBe("INR");
    expect(res.currencySymbol).toBe("₹");
    expect(res.convertedAmount).toBe(83_900);
    expect(res.monthlyConverted).toBe(83_900);
    expect(res.annualConverted).toBe(83_900 * 12);
  });

  it("converts USD to EUR correctly", () => {
    const res = convertUsdToCurrency(2000, 0.92, "monthly", "EUR");
    expect(res.currencyCode).toBe("EUR");
    expect(res.currencySymbol).toBe("€");
    expect(res.convertedAmount).toBe(1840);
  });

  it("contains all major global freelance currencies in dictionary", () => {
    const codes = Object.keys(GLOBAL_FREELANCE_CURRENCIES);
    expect(codes).toContain("PKR");
    expect(codes).toContain("INR");
    expect(codes).toContain("PHP");
    expect(codes).toContain("EUR");
    expect(codes).toContain("GBP");
    expect(codes).toContain("CAD");
    expect(codes).toContain("AUD");
    expect(codes).toContain("BDT");
    expect(codes).toContain("NGN");
  });
});
