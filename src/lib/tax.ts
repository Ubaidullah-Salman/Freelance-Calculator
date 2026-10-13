/**
 * Pakistan Freelancer Income Tax & Withholding Tax Calculations.
 *
 * Official reference:
 * FBR Withholding Tax Rate Cards (Tax Year 2027 / Finance Act 2026)
 * https://www.fbr.gov.pk/withholding-taxes-rate-card/174298/174301
 *
 * Section 154A of Income Tax Ordinance, 2001:
 * Export of Computer Software or IT / IT-enabled Services or Other Services.
 *
 * Statutory Withholding Rules:
 * 1. IT / ITES Export Proceeds (Section 154A(1)(a)):
 *    - Active Filer (ATL) + Registered with PSEB/PBIT and sales tax returns up to date:
 *      Rate: 0.25% (Concessionary Final Tax under Section 154A(2))
 *    - Active Filer (ATL) without PSEB registration:
 *      Rate: 1.00% (Standard export service withholding)
 *    - Inactive Taxpayer (Non-Filer) under Tenth Schedule (Rule 1):
 *      Rate: 2.00% (100% increased rate)
 *
 * 2. Other Services Export Proceeds (Section 154A(1)(b)):
 *    - Active Filer (ATL):
 *      Rate: 1.00%
 *    - Inactive Taxpayer (Non-Filer) under Tenth Schedule:
 *      Rate: 2.00%
 *
 * 3. Domestic / Non-Export Services:
 *    - Assessed under standard progressive individual income tax slabs (First Schedule).
 */

export type TaxYear = "2027" | "2026";
export type IncomeCategory = "it_export" | "other_export" | "domestic_services";
export type FilerStatus = "active" | "inactive";
export type PsebRegistration = "registered" | "not_registered";

export interface WithholdingTaxResult {
  taxYear: TaxYear;
  incomeCategory: IncomeCategory;
  filerStatus: FilerStatus;
  psebRegistration: PsebRegistration;
  grossAmountPkr: number;
  applicableRate: number; // e.g. 0.25, 1.0, 2.0
  estimatedWithholdingPkr: number;
  netAfterWithholdingPkr: number;
  taxRegimeType: "Final Tax" | "Minimum / Adjustable Tax" | "Adjustable Withholding";
  sectionReference: string;
  ruleExplanation: string;
  usdAmount?: number;
  exchangeRate?: number;
}

/** Calculates Pakistan withholding tax on export proceeds under Section 154A. */
export function calculatePakistanWithholdingTax(params: {
  grossAmountPkr: number;
  taxYear?: TaxYear;
  incomeCategory?: IncomeCategory;
  filerStatus?: FilerStatus;
  psebRegistration?: PsebRegistration;
  usdAmount?: number;
  exchangeRate?: number;
}): WithholdingTaxResult {
  const {
    grossAmountPkr,
    taxYear = "2027",
    incomeCategory = "it_export",
    filerStatus = "active",
    psebRegistration = "registered",
    usdAmount,
    exchangeRate,
  } = params;

  if (grossAmountPkr < 0) {
    throw new Error("grossAmountPkr must be non-negative");
  }

  let applicableRate = 1.0;
  let taxRegimeType: WithholdingTaxResult["taxRegimeType"] = "Minimum / Adjustable Tax";
  let sectionReference = "Section 154A";
  let ruleExplanation = "";

  if (incomeCategory === "it_export") {
    if (filerStatus === "active") {
      if (psebRegistration === "registered") {
        applicableRate = 0.25;
        taxRegimeType = "Final Tax";
        sectionReference = "Section 154A(1)(a) & 154A(2)";
        ruleExplanation =
          "0.25% concessionary rate for active IT/ITES exporters registered with PSEB with required returns filed. Deducted at source by bank upon realization of export proceeds, treated as Final Tax liability.";
      } else {
        applicableRate = 1.0;
        taxRegimeType = "Minimum / Adjustable Tax";
        sectionReference = "Section 154A(1)(a)";
        ruleExplanation =
          "1.00% standard rate for IT/ITES exporters on ATL without active PSEB registration. Deducted at source upon realization of foreign exchange proceeds.";
      }
    } else {
      applicableRate = 2.0;
      taxRegimeType = "Adjustable Withholding";
      sectionReference = "Section 154A read with Tenth Schedule";
      ruleExplanation =
        "2.00% (100% increased rate under Tenth Schedule) for inactive/non-filers on IT export proceeds. Tax deducted at source is adjustable against final return.";
    }
  } else if (incomeCategory === "other_export") {
    if (filerStatus === "active") {
      applicableRate = 1.0;
      taxRegimeType = "Minimum / Adjustable Tax";
      sectionReference = "Section 154A(1)(b)";
      ruleExplanation =
        "1.00% withholding rate on realization of foreign exchange proceeds from other export services for taxpayers on Active Taxpayer List (ATL).";
    } else {
      applicableRate = 2.0;
      taxRegimeType = "Adjustable Withholding";
      sectionReference = "Section 154A read with Tenth Schedule";
      ruleExplanation =
        "2.00% (100% increased rate under Tenth Schedule) for inactive/non-filers on other service export proceeds.";
    }
  } else {
    // Domestic services: baseline indicative withholding or flat minimum
    applicableRate = filerStatus === "active" ? 10.0 : 20.0;
    taxRegimeType = "Adjustable Withholding";
    sectionReference = "Section 153(1)(b)";
    ruleExplanation =
      "Domestic service income is subject to Section 153 withholding and annual progressive slab assessment (First Schedule).";
  }

  const estimatedWithholdingPkr = (grossAmountPkr * applicableRate) / 100;
  const netAfterWithholdingPkr = Math.max(0, grossAmountPkr - estimatedWithholdingPkr);

  return {
    taxYear,
    incomeCategory,
    filerStatus,
    psebRegistration,
    grossAmountPkr,
    applicableRate,
    estimatedWithholdingPkr,
    netAfterWithholdingPkr,
    taxRegimeType,
    sectionReference,
    ruleExplanation,
    usdAmount,
    exchangeRate,
  };
}

/**
 * General individual income tax slabs (for domestic/annual assessment).
 * Preserved for backwards compatibility and annual reference.
 */
export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
  fixedTax: number;
}

export const TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 600_000, rate: 0.0, fixedTax: 0 },
  { min: 600_001, max: 1_200_000, rate: 0.025, fixedTax: 0 },
  { min: 1_200_001, max: 2_400_000, rate: 0.125, fixedTax: 15_000 },
  { min: 2_400_001, max: 3_600_000, rate: 0.2, fixedTax: 165_000 },
  { min: 3_600_001, max: 6_000_000, rate: 0.25, fixedTax: 405_000 },
  { min: 6_000_001, max: null, rate: 0.35, fixedTax: 1_005_000 },
];

export interface TaxResult {
  annualIncomePkr: number;
  estimatedTax: number;
  effectiveRate: number;
  bracketApplied: TaxBracket;
  monthlyTaxEstimate: number;
  disclaimer: string;
}

const DISCLAIMER =
  "Official reference: FBR Withholding Tax Rate Card (Tax Year 2027) under Section 154A of Income Tax Ordinance, 2001. IT export proceeds received through banking channels qualify for specific withholding and final tax treatments. Consult a chartered accountant for official tax filings.";

/** Estimates Pakistan income tax for a given annual PKR income based on general slabs. */
export function estimatePakistanTax(annualIncomePkr: number): TaxResult {
  if (annualIncomePkr < 0)
    throw new Error("annualIncomePkr must be non-negative");

  const bracket =
    TAX_BRACKETS.find(
      (b) =>
        annualIncomePkr >= b.min &&
        (b.max === null || annualIncomePkr <= b.max)
    ) ?? TAX_BRACKETS[TAX_BRACKETS.length - 1];

  const incomeAboveMin = Math.max(0, annualIncomePkr - bracket.min);
  const estimatedTax = bracket.fixedTax + incomeAboveMin * bracket.rate;
  const effectiveRate =
    annualIncomePkr > 0 ? estimatedTax / annualIncomePkr : 0;

  return {
    annualIncomePkr,
    estimatedTax,
    effectiveRate,
    bracketApplied: bracket,
    monthlyTaxEstimate: estimatedTax / 12,
    disclaimer: DISCLAIMER,
  };
}
