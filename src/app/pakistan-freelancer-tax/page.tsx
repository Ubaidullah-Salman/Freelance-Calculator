import type { Metadata } from "next";
import TaxCalculator from "@/components/calculators/TaxCalculator";
import RelatedLinks from "@/components/ui/RelatedLinks";
import FaqSection from "@/components/ui/FaqSection";
import AffiliateTip from "@/components/ui/AffiliateTip";
import WebApplicationSchema from "@/components/seo/WebApplicationSchema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://freelancecalc.app";

export const metadata: Metadata = {
  title: "Pakistan Freelancer Tax Calculator — FBR Section 154A Withholding Rates",
  description:
    "Calculate withholding tax on IT and export remittances under FBR Tax Year 2027 / Finance Act 2026 rules. Sourced from official FBR Withholding Tax Rate Cards.",
  alternates: { canonical: `${SITE_URL}/pakistan-freelancer-tax` },
  openGraph: {
    title: "Pakistan Freelancer Tax Calculator — FBR Section 154A Withholding Rates",
    description:
      "Calculate withholding tax on IT and export remittances under FBR Tax Year 2027 / Finance Act 2026 rules.",
    url: `${SITE_URL}/pakistan-freelancer-tax`,
    type: "website",
  },
};

const RATE_CARD = [
  {
    category: "IT & IT-enabled Services (Computer Software, BPO, Coding)",
    eligibility: "Active ATL + PSEB Registered + Sales Tax Compliant",
    rate: "0.25%",
    nature: "Final Tax Regime (Section 154A(2))",
  },
  {
    category: "IT & IT-enabled Services",
    eligibility: "Active ATL (Without PSEB registration)",
    rate: "1.00%",
    nature: "Minimum / Adjustable Tax",
  },
  {
    category: "Other Export Services (Consultancy, Marketing, Accounting)",
    eligibility: "Active ATL",
    rate: "1.00%",
    nature: "Minimum / Adjustable Tax",
  },
  {
    category: "Export of any Services (IT or Other)",
    eligibility: "Inactive Taxpayer / Non-Filer",
    rate: "2.00%",
    nature: "Adjustable Tax (Tenth Schedule 100% surcharge)",
  },
  {
    category: "Domestic Services (Local Pakistani clients)",
    eligibility: "Active / Non-Filer",
    rate: "10% / 20%",
    nature: "Adjustable Withholding + Annual Slabs (Sec 153)",
  },
];

const TAX_FAQS = [
  {
    question: "What is the tax rate on IT export remittances in Pakistan for Tax Year 2027?",
    answer:
      "Under Section 154A of the Income Tax Ordinance, 2001 (Finance Act 2026), active filers on the Active Taxpayer List (ATL) who maintain active registration with the Pakistan Software Export Board (PSEB) or PBIT qualify for a 0.25% concessionary withholding tax rate upon realization of proceeds.",
  },
  {
    question: "Is the 0.25% PSEB tax treated as a Final Tax?",
    answer:
      "Yes. Under Section 154A(2), tax deducted at source at 0.25% on export proceeds of computer software and IT-enabled services constitutes a full and final discharge of tax liability on those export revenues, provided PSEB registration is maintained and annual sales tax/income tax filings are submitted.",
  },
  {
    question: "What tax rate applies to IT exporters without PSEB registration?",
    answer:
      "Active taxpayers on the ATL who export IT services without an active PSEB registration are subject to the standard 1.00% withholding rate under Section 154A(1)(a). This deduction is treated as a minimum or adjustable tax.",
  },
  {
    question: "What is the tax rate for non-filers on foreign freelance remittances?",
    answer:
      "Under Rule 1 of the Tenth Schedule to the Income Tax Ordinance, 2001, inactive taxpayers (non-filers) face a 100% increased rate, resulting in a 2.00% withholding tax upon realization of export proceeds.",
  },
];

export default function PakistanTaxPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <WebApplicationSchema
        name="Pakistan Freelancer Tax Calculator"
        description="Calculate official FBR Section 154A withholding tax on IT and service export remittances for Tax Year 2027 / Finance Act 2026."
        url={`${SITE_URL}/pakistan-freelancer-tax`}
      />

      {/* Header */}
      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="rounded-md border border-teal-200 bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-800">
            🇵🇰 Pakistan • FBR Section 154A
          </span>
          <span className="text-xs text-stone-500 font-medium">
            Tax Year 2027 Official Withholding Rates
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          Pakistan Freelancer Tax Calculator
        </h1>
        <p className="mt-1.5 text-sm text-stone-600 sm:text-base leading-relaxed">
          Calculate export withholding tax on foreign IT services and freelance remittances credited to Pakistani bank accounts.
        </p>
      </header>

      {/* Main Calculator */}
      <div className="rounded-lg border border-stone-200 bg-white p-5 sm:p-7">
        <TaxCalculator />
      </div>

      {/* Helpful Resource / Affiliate Callout */}
      <div className="mt-6">
        <AffiliateTip platform="tax" />
      </div>

      {/* How it works */}
      <section
        className="mt-10 border-t border-stone-200 pt-8"
        aria-labelledby="how-it-works-heading"
      >
        <h2
          id="how-it-works-heading"
          className="text-base font-semibold text-stone-900"
        >
          How export withholding tax works in Pakistan
        </h2>
        <div className="mt-3 space-y-4 text-sm leading-relaxed text-stone-600">
          <p>
            Under Section 154A of the Income Tax Ordinance, 2001, authorized dealers (banks) realize foreign exchange proceeds from the export of computer software or IT-enabled services and deduct tax at source at the time of realization.
          </p>

          <div className="rounded-md border border-stone-200 bg-stone-50/70 p-3.5 text-xs text-stone-700">
            <p className="font-medium text-stone-900">Worked example (IT Exporter with PSEB):</p>
            <p className="mt-1">
              For an active filer receiving <strong>$2,000 USD</strong> in IT export proceeds via Payoneer/bank transfer at <strong>PKR 278.50</strong> per USD:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-stone-600">
              <li>Gross proceeds realized: $2,000 × 278.50 = <strong>PKR 557,000</strong></li>
              <li>Withholding tax rate (Section 154A(2)): <strong>0.25%</strong></li>
              <li>Tax deducted at source by bank: PKR 557,000 × 0.25% = <strong>PKR 1,392.50 ($5.00)</strong></li>
              <li>Net proceeds credited to account: <strong>PKR 555,607.50 ($1,995.00)</strong></li>
              <li>Tax nature: <strong>Final Tax Regime</strong> (no further income tax liability on this export revenue).</li>
            </ul>
            <p className="mt-2.5 font-mono text-[11px] text-stone-500">
              Formula: Withholding Amount = Gross Proceeds Realized × (Applicable Rate / 100)
            </p>
          </div>

          <div className="rounded-md border border-stone-200 bg-stone-50/50 p-3 text-xs text-stone-600">
            <p className="font-medium text-stone-800">
              Final Tax vs. Adjustable Tax:
            </p>
            <p className="mt-1 text-stone-500">
              For IT/ITES exporters who maintain active PSEB registration, timely file income tax returns, and file sales tax returns with provincial revenue authorities, the <strong>0.25% deduction</strong> is treated as a <em>final tax</em> under Section 154A(2). For other categories or non-filers, deductions may serve as minimum or adjustable tax against annual tax returns.
            </p>
          </div>

          <p className="text-xs text-stone-500">
            Official government source:{" "}
            <a
              href="https://www.fbr.gov.pk/withholding-taxes-rate-card/174298/174301"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-800 underline underline-offset-2 hover:text-[#385842]"
            >
              FBR Withholding Tax Rate Cards (Tax Year 2027)
            </a>
            . Always consult an authorized chartered accountant (ICAP) or tax consultant for your annual tax declarations.
          </p>
        </div>
      </section>

      {/* Official Rate Card Reference Table */}
      <section
        className="mt-8 border-t border-stone-200 pt-6"
        aria-labelledby="rate-card-table-heading"
      >
        <h2
          id="rate-card-table-heading"
          className="text-xs font-medium uppercase tracking-wider text-stone-400"
        >
          FBR Section 154A Withholding Tax Rate Card
        </h2>

        <div className="mt-3 overflow-x-auto rounded-md border border-stone-200 bg-white">
          <table
            className="w-full text-left text-xs"
            aria-label="FBR Section 154A Withholding Tax Rates"
          >
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/80">
                <th className="px-3.5 py-2.5 font-medium text-stone-700">
                  Income Category
                </th>
                <th className="px-3.5 py-2.5 font-medium text-stone-700">
                  Eligibility & Status
                </th>
                <th className="px-3.5 py-2.5 font-medium text-stone-700">
                  Rate
                </th>
                <th className="px-3.5 py-2.5 font-medium text-stone-700">
                  Regime
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {RATE_CARD.map((row, idx) => (
                <tr key={idx} className="hover:bg-stone-50/40">
                  <td className="px-3.5 py-2.5 font-medium text-stone-800">
                    {row.category}
                  </td>
                  <td className="px-3.5 py-2.5 text-stone-600">
                    {row.eligibility}
                  </td>
                  <td className="px-3.5 py-2.5 font-mono font-semibold text-stone-900">
                    {row.rate}
                  </td>
                  <td className="px-3.5 py-2.5 text-stone-500 text-[11px]">
                    {row.nature}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQs Section with FAQPage Schema */}
      <FaqSection items={TAX_FAQS} />

      {/* Related Calculators */}
      <RelatedLinks
        links={[
          {
            href: "/usd-to-pkr-calculator",
            label: "Currency Converter",
            description: "Convert USD freelance earnings to global currencies",
          },
          {
            href: "/upwork-fee-calculator",
            label: "Upwork Fees",
            description: "Calculate what you keep after Upwork's 0%–15% fee",
          },
          {
            href: "/fiverr-fee-calculator",
            label: "Fiverr Fees",
            description: "Calculate what you keep after Fiverr's standard 20% commission",
          },
        ]}
      />
    </main>
  );
}
