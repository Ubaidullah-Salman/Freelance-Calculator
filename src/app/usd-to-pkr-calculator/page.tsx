import type { Metadata } from "next";
import UsdPkrCalculator from "@/components/calculators/UsdPkrCalculator";
import RelatedLinks from "@/components/ui/RelatedLinks";
import FaqSection from "@/components/ui/FaqSection";
import WebApplicationSchema from "@/components/seo/WebApplicationSchema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://freelancecalc.app";

export const metadata: Metadata = {
  title: "USD Freelance Currency Converter — PKR, INR, PHP, EUR, GBP",
  description:
    "Convert your USD freelance earnings to Pakistani Rupees, Indian Rupees, Philippine Pesos, Euros, and British Pounds with custom bank exchange rates.",
  alternates: { canonical: `${SITE_URL}/usd-to-pkr-calculator` },
  openGraph: {
    title: "USD Freelance Currency Converter — Multi-Currency Take-Home Pay",
    description:
      "Convert USD freelance income to local currencies with monthly and annual projections.",
    url: `${SITE_URL}/usd-to-pkr-calculator`,
    type: "website",
  },
};

const CURRENCY_FAQS = [
  {
    question: "How do I calculate net freelance earnings in my local currency?",
    answer:
      "Multiply your net USD earnings by your receiving bank or provider's telegraphic transfer (TT) buying rate after deducting any flat withdrawal charges. Use the calculator to project monthly and annual local currency equivalents.",
  },
  {
    question: "Which global freelance currencies are supported?",
    answer:
      "The converter supports PKR (Pakistani Rupee), INR (Indian Rupee), PHP (Philippine Peso), EUR (Euro), GBP (British Pound), CAD (Canadian Dollar), AUD (Australian Dollar), BDT (Bangladeshi Taka), and NGN (Nigerian Naira).",
  },
  {
    question: "Why does my receiving bank's exchange rate differ from Google or Wise?",
    answer:
      "Search engines show the interbank mid-market rate. Commercial retail banks apply a foreign exchange margin (spread) when converting incoming USD remittance proceeds into local currency accounts.",
  },
];

export default function UsdPkrPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <WebApplicationSchema
        name="Freelance Multi-Currency Converter"
        description="Convert USD client payments into global local currencies (PKR, INR, PHP, EUR, GBP, CAD, AUD, BDT, NGN) with custom bank exchange rates."
        url={`${SITE_URL}/usd-to-pkr-calculator`}
      />

      {/* Header */}
      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-800">
            Multi-Currency • 9 Countries
          </span>
          <span className="text-xs text-stone-500 font-medium">
            PKR, INR, PHP, EUR, GBP, CAD, AUD, BDT, NGN
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          Freelance Currency Converter
        </h1>
        <p className="mt-1.5 text-sm text-stone-600 sm:text-base leading-relaxed">
          Convert your foreign USD earnings using your actual bank or payment provider transfer rate.
        </p>
      </header>

      {/* Main Calculator */}
      <div className="rounded-lg border border-stone-200 bg-white p-5 sm:p-7">
        <UsdPkrCalculator />
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
          How freelance currency conversion works
        </h2>
        <div className="mt-3 space-y-4 text-sm leading-relaxed text-stone-600">
          <p>
            When international clients pay you in USD through Upwork, Fiverr, or direct bank transfer, the amount you actually receive in your local bank account depends on your provider&apos;s telegraphic transfer (TT) buying rate and forex spreads.
          </p>

          <div className="rounded-md border border-stone-200 bg-stone-50/70 p-3.5 text-xs text-stone-700">
            <p className="font-medium text-stone-900">Supported global freelance currencies:</p>
            <ul className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3 text-stone-600">
              <li>🇵🇰 <strong>PKR</strong> — Pakistani Rupee</li>
              <li>🇮🇳 <strong>INR</strong> — Indian Rupee</li>
              <li>🇵🇭 <strong>PHP</strong> — Philippine Peso</li>
              <li>🇪🇺 <strong>EUR</strong> — Euro</li>
              <li>🇬🇧 <strong>GBP</strong> — British Pound</li>
              <li>🇨🇦 <strong>CAD</strong> — Canadian Dollar</li>
              <li>🇦🇺 <strong>AUD</strong> — Australian Dollar</li>
              <li>🇧🇩 <strong>BDT</strong> — Bangladeshi Taka</li>
              <li>🇳🇬 <strong>NGN</strong> — Nigerian Naira</li>
            </ul>
          </div>

          <p className="text-xs text-stone-500">
            Exchange rates fluctuate continually. Enter your provider&apos;s settlement rate for exact take-home projections.
          </p>
        </div>
      </section>

      {/* FAQs Section with FAQPage Schema */}
      <FaqSection items={CURRENCY_FAQS} />

      {/* Related Calculators */}
      <RelatedLinks
        links={[
          {
            href: "/upwork-fee-calculator",
            label: "Upwork Fees",
            description: "Calculate what you keep after Upwork's 0%–15% fee",
          },
          {
            href: "/fiverr-fee-calculator",
            label: "Fiverr Fees",
            description: "Calculate net payout after Fiverr's standard 20% commission",
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
