import { calculateFiverrFee } from "@/lib/fiverr";

describe("calculateFiverrFee", () => {
  it("deducts 20% platform fee correctly (seller receives 80%)", () => {
    const result = calculateFiverrFee(100, "payoneer");
    expect(result.platformFeeAmount).toBeCloseTo(20);
    expect(result.afterPlatformFee).toBeCloseTo(80);
    expect(result.netAmount).toBeCloseTo(80);
  });

  it("applies 20% commission to order extras and tips", () => {
    // $100 order + $50 extras + $20 tip = $170 total gross
    const result = calculateFiverrFee(100, "payoneer", 50, 20);
    expect(result.grossAmount).toBe(170);
    expect(result.platformFeeAmount).toBeCloseTo(34); // 20% of 170
    expect(result.afterPlatformFee).toBeCloseTo(136); // 80% of 170
    expect(result.netAmount).toBeCloseTo(136);
  });

  it("deducts bank transfer withdrawal fee ($3)", () => {
    const result = calculateFiverrFee(100, "bank_transfer");
    expect(result.netAmount).toBeCloseTo(77); // 80 - 3
    expect(result.withdrawalFee).toBe(3);
  });

  it("deducts revenue card withdrawal fee ($1)", () => {
    const result = calculateFiverrFee(100, "fiverr_revenue_card");
    expect(result.netAmount).toBeCloseTo(79); // 80 - 1
    expect(result.withdrawalFee).toBe(1);
  });

  it("calculates optional USD to PKR conversion", () => {
    const result = calculateFiverrFee(100, "payoneer", 0, 0, 278.5);
    expect(result.netAmount).toBeCloseTo(80);
    expect(result.netPkr).toBeCloseTo(80 * 278.5);
  });

  it("handles zero gross amount", () => {
    const result = calculateFiverrFee(0, "paypal");
    expect(result.netAmount).toBe(0);
  });

  it("throws on negative amounts", () => {
    expect(() => calculateFiverrFee(-50, "payoneer")).toThrow();
    expect(() => calculateFiverrFee(100, "payoneer", -10)).toThrow();
    expect(() => calculateFiverrFee(100, "payoneer", 0, -5)).toThrow();
  });
});
