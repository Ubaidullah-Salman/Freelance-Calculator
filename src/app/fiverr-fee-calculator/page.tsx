import type { Metadata } from "next";
import FiverrCalculator from "@/components/calculators/FiverrCalculator";
import RelatedLinks from "@/components/ui/RelatedLinks";
import FaqSection from "@/components/ui/FaqSection";
import WebApplicationSchema from "@/components/seo/WebApplicationSchema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://freelancecalc.app";

export const metadata: Metadata = {
  title: "Fiverr Fee Calculator — Calculate Your Net Take-Home Pay",
  description:
    "See how much you'll keep after Fiverr's standard 20% seller service fee and withdrawal costs. Calculate net earnings across base orders, extras, and tips.",
  alternates: { canonical: `${SITE_URL}/fiverr-fee-calculator` },
  openGraph: {
    title: "Fiverr Fee Calculator — Calculate Your Net Take-Home Pay",
    description:
      "See how much you'll keep after Fiverr's standard 20% seller service fee and withdrawal costs.",
    url: `${SITE_URL}/fiverr-fee-calculator`,
    type: "website",
  },
};

const FIVERR_FAQS = [
  {
    question: "What is Fiverr's standard seller fee in 2026?",
    answer:
      "According to Fiverr's official Help Center, Fiverr takes a flat 20% platform commission on all completed orders. The seller receives 80% of the total purchase amount credited to their revenues balance.",
  },
  {
    question: "Does Fiverr deduct 20% from tips and gig extras?",
    answer:
      "Yes. The 20% commission applies uniformly to base packages, custom offers, gig extras (such as rush delivery or additional revisions), and buyer tips.",
  },
  {
    question: "How do buyer checkout fees affect seller earnings?",
    answer:
      "Buyer service fees (charged to clients at checkout) are paid entirely by the client on top of the gig price. They are separate from the seller commission and do not reduce the seller's 80% share.",
  },
  {
    question: "What are the fees for withdrawing earnings from Fiverr?",
    answer:
      "Fiverr does not charge a fee for withdrawing to Payoneer or PayPal (though Payoneer/PayPal may charge independent transfer or forex fees). Direct Bank Transfer incurs a flat $3 fee per withdrawal, and the Fiverr Revenue Card incurs a $1 fee.",
  },
];

export default function FiverrPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <WebApplicationSchema
        name="Fiverr Fee Calculator"
        description="Calculate exact seller take-home pay after Fiverr's 20% commission across orders, extras, tips, and withdrawal methods."
        url={`${SITE_URL}/fiverr-fee-calculator`}
      />

      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
          Fiverr Fee Calculator
        </h1>
        <p className="mt-1.5 text-sm text-stone-600 sm:text-base">
          See how much you&apos;ll keep after Fiverr&apos;s standard 20% seller commission and withdrawal costs.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-stone-500">
          According to Fiverr&apos;s official Help Center, sellers receive 80% of completed order proceeds. The standard 20% platform commission applies uniformly to base gigs, custom offers, gig extras, and buyer tips.
        </p>
      </header>

      {/* Main Calculator */}
      <div className="rounded-lg border border-stone-200 bg-white p-5 sm:p-7">
        <FiverrCalculator />
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
          How Fiverr seller fees work
        </h2>
        <div className="mt-3 space-y-4 text-sm leading-relaxed text-stone-600">
          <p>
            When an order is completed, Fiverr automatically takes 20% of the total amount billed to the buyer. You receive 80% in your revenues balance. These funds clear after a standard 14-day clearance window (7 days for Top Rated Sellers).
          </p>

          <div className="rounded-md border border-stone-200 bg-stone-50/70 p-3.5 text-xs text-stone-700">
            <p className="font-medium text-stone-900">Worked example:</p>
            <p className="mt-1">
              For an order with a <strong>$200</strong> base package, <strong>$50</strong> extra fast delivery, and a <strong>$20</strong> tip:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-stone-600">
              <li>Gross total: $200 + $50 + $20 = <strong>$270.00</strong></li>
              <li>Fiverr seller fee (20%): −$54.00</li>
              <li>Net proceeds in balance: <strong>$216.00 (80.0%)</strong></li>
              <li>With Bank Transfer withdrawal (−$3.00): <strong>$213.00</strong></li>
            </ul>
            <p className="mt-2.5 font-mono text-[11px] text-stone-500">
              Seller Payout = (Base Order + Extras + Tips) × 80% − Withdrawal Fee
            </p>
          </div>

          <div className="rounded-md border border-stone-200 bg-stone-50/50 p-3 text-xs text-stone-600">
            <p className="font-medium text-stone-800">
              Seller commission vs Buyer checkout fee:
            </p>
            <p className="mt-1 text-stone-500">
              Fiverr also charges buyers a separate service fee at checkout (e.g., $2.50 on small orders or around 5.5% on higher orders). This buyer fee is paid entirely by the client on top of the order total and does not affect your 80% payout.
            </p>
          </div>

          <p className="text-xs text-stone-500">
            Official source: Sourced from{" "}
            <a
              href="https://help.fiverr.com/hc/en-us/articles/360010776317"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-800 underline underline-offset-2 hover:text-[#385842]"
            >
              Fiverr Help Center — Service Fees
            </a>{" "}
            and{" "}
            <a
              href="https://help.fiverr.com/hc/en-us/articles/360011219218"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-800 underline underline-offset-2 hover:text-[#385842]"
            >
              Withdrawal Fees Documentation
            </a>
            .
          </p>
        </div>
      </section>

      {/* FAQs Section with FAQPage Schema */}
      <FaqSection items={FIVERR_FAQS} />

      {/* Related Calculators */}
      <RelatedLinks
        links={[
          {
            href: "/upwork-fee-calculator",
            label: "Upwork Fees",
            description: "Calculate Upwork's 0%–15% per-contract fee",
          },
          {
            href: "/usd-to-pkr-calculator",
            label: "Currency Converter",
            description: "Convert net USD earnings into local currencies (PKR, INR, PHP, EUR, GBP)",
          },
          {
            href: "/pakistan-freelancer-tax",
            label: "Pakistan Tax",
            description: "Calculate withholding tax under FBR Section 154A",
          },
        ]}
      />
    </main>
  );
}
