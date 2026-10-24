import type { Metadata } from "next";
import UpworkCalculator from "@/components/calculators/UpworkCalculator";
import RelatedLinks from "@/components/ui/RelatedLinks";
import FaqSection from "@/components/ui/FaqSection";
import WebApplicationSchema from "@/components/seo/WebApplicationSchema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://freelancecalc.app";

export const metadata: Metadata = {
  title: "Upwork Fee Calculator — Calculate Your Net Take-Home Pay",
  description:
    "Calculate take-home pay under Upwork's current 0% to 15% per-contract fee model. Includes bonus payments, withdrawal methods, and local currency payouts.",
  alternates: { canonical: `${SITE_URL}/upwork-fee-calculator` },
  openGraph: {
    title: "Upwork Fee Calculator — Calculate Your Net Take-Home Pay",
    description:
      "Calculate take-home pay under Upwork's current 0% to 15% per-contract fee model.",
    url: `${SITE_URL}/upwork-fee-calculator`,
    type: "website",
  },
};

const UPWORK_FAQS = [
  {
    question: "What is the current Upwork freelancer service fee in 2026?",
    answer:
      "According to current official Upwork documentation, the freelancer service fee ranges from 0% to 15% per contract. Most standard hourly and fixed-price contracts are charged at 10%. Direct Contracts and Bring-Your-Own (BYO) client relationships are charged at 0%. The exact percentage is locked at the time you submit a proposal or accept an offer.",
  },
  {
    question: "Did Upwork discontinue the 20% to 10% to 5% sliding fee scale?",
    answer:
      "Yes. The legacy sliding scale based on lifetime billings with a single client ($500 at 20%, $10,000 at 10%, etc.) is no longer the active universal policy. Upwork transitioned to a flat per-contract model (commonly 10%).",
  },
  {
    question: "Are bonus payments subject to Upwork's platform service fee?",
    answer:
      "Yes. Any discretionary bonus or additional payment paid by your client through Upwork is treated as earnings on that contract and is subject to the same contract fee percentage.",
  },
  {
    question: "How can I convert my net Upwork USD earnings into local currency?",
    answer:
      "You can toggle the 'Convert take-home to local currency' option in the calculator. Select your destination currency (PKR, INR, PHP, EUR, GBP, CAD, AUD, BDT, NGN) and enter the telegraphic transfer (TT) buying rate provided by your receiving bank or Wise/Payoneer.",
  },
];

export default function UpworkPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <WebApplicationSchema
        name="Upwork Fee Calculator"
        description="Calculate net freelance earnings after Upwork's 0% to 15% per-contract service fees, bonus deductions, and local currency conversion."
        url={`${SITE_URL}/upwork-fee-calculator`}
      />

      {/* Header */}
      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800">
            Upwork • 2026 Rules
          </span>
          <span className="text-xs text-stone-500 font-medium">
            0% to 15% per contract (10% standard)
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          Upwork Fee Calculator
        </h1>
        <p className="mt-1.5 text-sm text-stone-600 sm:text-base leading-relaxed">
          Calculate your exact take-home payout after Upwork platform fees, contract bonuses, and local currency conversion.
        </p>
      </header>

      {/* Main Calculator */}
      <div className="rounded-lg border border-stone-200 bg-white p-5 sm:p-7">
        <UpworkCalculator />
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
          How current Upwork fees work
        </h2>
        <div className="mt-3 space-y-4 text-sm leading-relaxed text-stone-600">
          <p>
            Unlike the legacy lifetime-billing model (which scaled from 20% down to 5%), current Upwork contracts carry an individual fee locked between <strong>0% and 15%</strong>.
          </p>

          <div className="rounded-md border border-stone-200 bg-stone-50/70 p-3.5 text-xs text-stone-700">
            <p className="font-medium text-stone-900">Worked example:</p>
            <p className="mt-1">
              For a <strong>$500</strong> milestone with a <strong>$50</strong> bonus at the standard <strong>10%</strong> rate:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-stone-600">
              <li>Gross billed: $500 + $50 = <strong>$550.00</strong></li>
              <li>Upwork fee (10%): −$55.00</li>
              <li>You keep: <strong>$495.00 (90.0%)</strong></li>
            </ul>
            <p className="mt-2.5 font-mono text-[11px] text-stone-500">
              Formula: Net Take-Home = (Project Amount + Bonus) × (1 − Fee Rate)
            </p>
          </div>

          <p className="text-xs text-stone-500">
            Official source: Sourced from{" "}
            <a
              href="https://support.upwork.com/hc/en-us/articles/211062538-Freelancer-Service-Fees"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-800 underline underline-offset-2 hover:text-[#385842]"
            >
              Upwork Help Center — Freelancer Service Fees
            </a>
            . Always review the locked fee displayed on your active proposal or offer before submitting work.
          </p>
        </div>
      </section>

      {/* FAQs Section with FAQPage Schema */}
      <FaqSection items={UPWORK_FAQS} />

      {/* Related Calculators */}
      <RelatedLinks
        links={[
          {
            href: "/fiverr-fee-calculator",
            label: "Fiverr Fees",
            description: "Calculate what you keep after Fiverr's 20% flat commission",
          },
          {
            href: "/usd-to-pkr-calculator",
            label: "Currency Converter",
            description: "Convert net USD earnings into local currencies (PKR, INR, PHP, EUR, GBP)",
          },
          {
            href: "/pakistan-freelancer-tax",
            label: "Pakistan Tax",
            description: "Calculate export withholding tax under FBR Section 154A",
          },
        ]}
      />
    </main>
  );
}
