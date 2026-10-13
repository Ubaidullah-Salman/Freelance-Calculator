import { calculateUpworkFee, getUpworkFeeRate } from "@/lib/upwork";

describe("getUpworkFeeRate", () => {
  it("returns 0.20 for legacy 20% tier", () => {
    expect(getUpworkFeeRate("20")).toBe(0.2);
  });
  it("returns 0.10 for 10% tier or number", () => {
    expect(getUpworkFeeRate("10")).toBe(0.1);
    expect(getUpworkFeeRate(10)).toBe(0.1);
  });
  it("returns 0.05 for 5% tier", () => {
    expect(getUpworkFeeRate("5")).toBe(0.05);
  });
  it("returns 0 for 0% fee", () => {
    expect(getUpworkFeeRate(0)).toBe(0);
  });
  it("returns 0.15 for 15% fee", () => {
    expect(getUpworkFeeRate(15)).toBe(0.15);
  });
});

describe("calculateUpworkFee", () => {
  it("calculates 10% standard fee correctly", () => {
    const result = calculateUpworkFee(500, 10);
    expect(result.feeAmount).toBeCloseTo(50);
    expect(result.netAmount).toBeCloseTo(450);
    expect(result.feePercentage).toBe(10);
  });

  it("calculates 0% fee (Direct Contracts / BYO)", () => {
    const result = calculateUpworkFee(500, 0);
    expect(result.feeAmount).toBe(0);
    expect(result.netAmount).toBe(500);
  });

  it("calculates 15% fee correctly", () => {
    const result = calculateUpworkFee(500, 15);
    expect(result.feeAmount).toBeCloseTo(75);
    expect(result.netAmount).toBeCloseTo(425);
  });

  it("supports legacy 20% tier ($500 invoice -> $100 fee, $400 payout)", () => {
    const result = calculateUpworkFee(500, "20");
    expect(result.feeAmount).toBeCloseTo(100);
    expect(result.netAmount).toBeCloseTo(400);
  });

  it("includes optional bonus in calculations", () => {
    const result = calculateUpworkFee(500, 10, 100);
    expect(result.grossAmount).toBe(500);
    expect(result.bonusAmount).toBe(100);
    expect(result.totalGross).toBe(600);
    expect(result.feeAmount).toBeCloseTo(60);
    expect(result.netAmount).toBeCloseTo(540);
  });

  it("calculates optional USD to PKR conversion", () => {
    const result = calculateUpworkFee(500, 10, 0, 280);
    expect(result.netAmount).toBeCloseTo(450);
    expect(result.netPkr).toBeCloseTo(450 * 280);
  });

  it("handles zero gross amount", () => {
    const result = calculateUpworkFee(0, 10);
    expect(result.feeAmount).toBe(0);
    expect(result.netAmount).toBe(0);
  });

  it("throws on negative gross or bonus amount", () => {
    expect(() => calculateUpworkFee(-100, 10)).toThrow();
    expect(() => calculateUpworkFee(100, 10, -50)).toThrow();
  });
});
