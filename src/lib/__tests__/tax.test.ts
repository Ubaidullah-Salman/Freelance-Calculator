import {
  estimatePakistanTax,
  calculatePakistanWithholdingTax,
} from "@/lib/tax";

describe("calculatePakistanWithholdingTax (Section 154A)", () => {
  it("applies 0.25% concessionary rate for active IT export filer registered with PSEB", () => {
    const result = calculatePakistanWithholdingTax({
      grossAmountPkr: 1_000_000,
      incomeCategory: "it_export",
      filerStatus: "active",
      psebRegistration: "registered",
    });
    expect(result.applicableRate).toBe(0.25);
    expect(result.estimatedWithholdingPkr).toBe(2_500); // 1,000,000 * 0.25%
    expect(result.netAfterWithholdingPkr).toBe(997_500);
    expect(result.taxRegimeType).toBe("Final Tax");
  });

  it("applies 1.00% standard rate for active IT export filer without PSEB", () => {
    const result = calculatePakistanWithholdingTax({
      grossAmountPkr: 1_000_000,
      incomeCategory: "it_export",
      filerStatus: "active",
      psebRegistration: "not_registered",
    });
    expect(result.applicableRate).toBe(1.0);
    expect(result.estimatedWithholdingPkr).toBe(10_000);
    expect(result.netAfterWithholdingPkr).toBe(990_000);
  });

  it("applies 2.00% rate for inactive/non-filer on IT export proceeds under Tenth Schedule", () => {
    const result = calculatePakistanWithholdingTax({
      grossAmountPkr: 1_000_000,
      incomeCategory: "it_export",
      filerStatus: "inactive",
    });
    expect(result.applicableRate).toBe(2.0);
    expect(result.estimatedWithholdingPkr).toBe(20_000);
    expect(result.netAfterWithholdingPkr).toBe(980_000);
  });

  it("applies 1.00% for active filer on other services export", () => {
    const result = calculatePakistanWithholdingTax({
      grossAmountPkr: 500_000,
      incomeCategory: "other_export",
      filerStatus: "active",
    });
    expect(result.applicableRate).toBe(1.0);
    expect(result.estimatedWithholdingPkr).toBe(5_000);
    expect(result.netAfterWithholdingPkr).toBe(495_000);
  });

  it("applies 2.00% for non-filer on other services export", () => {
    const result = calculatePakistanWithholdingTax({
      grossAmountPkr: 500_000,
      incomeCategory: "other_export",
      filerStatus: "inactive",
    });
    expect(result.applicableRate).toBe(2.0);
    expect(result.estimatedWithholdingPkr).toBe(10_000);
    expect(result.netAfterWithholdingPkr).toBe(490_000);
  });

  it("throws on negative gross amount", () => {
    expect(() =>
      calculatePakistanWithholdingTax({ grossAmountPkr: -100 })
    ).toThrow();
  });
});

describe("estimatePakistanTax (Annual Slabs)", () => {
  it("returns zero tax for income within first slab", () => {
    const result = estimatePakistanTax(500_000);
    expect(result.estimatedTax).toBe(0);
    expect(result.effectiveRate).toBe(0);
  });

  it("calculates correct tax for second slab", () => {
    const result = estimatePakistanTax(900_000);
    const expected = (900_000 - 600_001) * 0.025;
    expect(result.estimatedTax).toBeCloseTo(expected, 0);
  });

  it("calculates correct tax for third slab", () => {
    const result = estimatePakistanTax(1_800_000);
    const expected = 15_000 + (1_800_000 - 1_200_001) * 0.125;
    expect(result.estimatedTax).toBeCloseTo(expected, 0);
  });

  it("handles zero income", () => {
    const result = estimatePakistanTax(0);
    expect(result.estimatedTax).toBe(0);
    expect(result.effectiveRate).toBe(0);
  });

  it("throws on negative income", () => {
    expect(() => estimatePakistanTax(-1)).toThrow();
  });

  it("includes a disclaimer in the result", () => {
    const result = estimatePakistanTax(1_000_000);
    expect(result.disclaimer).toBeTruthy();
    expect(result.disclaimer.length).toBeGreaterThan(10);
  });
});
