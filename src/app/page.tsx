import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://freelancecalc.io";

export const metadata: Metadata = {
  title: "Freelance Fee Calculator — Upwork, Fiverr & Global Take-Home Pay",
  description:
    "Clean, simple financial calculators for freelancers worldwide: see exact take-home pay after Upwork and Fiverr fees, convert USD to global currencies, and calculate tax withholding.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Freelance Fee Calculator — Upwork, Fiverr & Global Take-Home Pay",
    description:
      "Clean, simple financial calculators for freelancers: Upwork fees, Fiverr fees, multi-currency conversion, and tax calculations.",
    url: SITE_URL,
    type: "website",
  },
};

const GLOBAL_TOOLS = [
  {
    href: "/upwork-fee-calculator",
    title: "Upwork Fee Calculator",
    description:
      "Calculate take-home pay with configurable 0%–15% per-contract fee, bonus payments, and local currency conversion.",
    cta: "Calculate Upwork fees",
    id: "tool-card-upwork",
  },
  {
    href: "/fiverr-fee-calculator",
    title: "Fiverr Fee Calculator",
    description:
      "Calculate net earnings after Fiverr's standard 20% seller commission across base orders, extras, and buyer tips.",
    cta: "Calculate Fiverr fees",
    id: "tool-card-fiverr",
  },
  {
    href: "/usd-to-pkr-calculator",
    title: "Multi-Currency Converter",
    description:
      "Convert USD freelance payments to local currencies (PKR, INR, PHP, EUR, GBP, CAD, AUD, BDT, NGN) with custom exchange rates.",
    cta: "Convert USD earnings",
    id: "tool-card-usd-pkr",
  },
];

const REGIONAL_TOOLS = [
  {
    href: "/pakistan-freelancer-tax",
    title: "Pakistan Freelancer Tax Calculator",
    region: "🇵🇰 Pakistan",
    description:
      "Calculate withholding tax on IT and export remittances under official FBR Section 154A rules for Tax Year 2027.",
    cta: "Calculate Pakistan tax",
    id: "tool-card-tax",
  },
];

export default function HomePage() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FreelanceCalc",
    url: SITE_URL,
    description:
      "Global freelance fee and take-home pay calculators for Upwork, Fiverr, and multi-currency earnings.",
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* Header */}
      <section className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
          Global freelance fee calculators
        </h1>
        <p className="mt-1.5 text-sm text-stone-500 sm:text-base">
          Accurate, transparent take-home pay calculations for freelancers worldwide on Upwork, Fiverr, and international clients.
        </p>
      </section>

      {/* Universal Calculators */}
      <section className="mb-10" aria-labelledby="universal-tools-heading">
        <h2
          id="universal-tools-heading"
          className="mb-3 text-xs font-medium uppercase tracking-wider text-stone-400"
        >
          Universal Platform Calculators
        </h2>
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {GLOBAL_TOOLS.map(({ href, title, description, cta, id }) => (
            <Link
              key={href}
              href={href}
              id={id}
              className="group flex flex-col justify-between rounded-lg border border-stone-200 bg-white p-5 transition-colors hover:border-stone-300 hover:bg-stone-50/50"
            >
              <div>
                <h3 className="text-base font-medium text-stone-900 group-hover:text-stone-700">
                  {title}
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-stone-500">
                  {description}
                </p>
              </div>
              <p className="mt-4 text-xs font-medium text-stone-900 group-hover:text-[#385842] flex items-center gap-1">
                <span>{cta}</span>
                <span className="text-stone-400 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Regional Taxes Section */}
      <section aria-labelledby="regional-tools-heading">
        <h2
          id="regional-tools-heading"
          className="mb-3 text-xs font-medium uppercase tracking-wider text-stone-400"
        >
          Regional Taxes & Withholding
        </h2>
        <div className="grid gap-3.5 sm:grid-cols-2">
          {REGIONAL_TOOLS.map(({ href, title, region, description, cta, id }) => (
            <Link
              key={href}
              href={href}
              id={id}
              className="group flex flex-col justify-between rounded-lg border border-stone-200 bg-white p-5 transition-colors hover:border-stone-300 hover:bg-stone-50/50"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-stone-900 group-hover:text-stone-700">
                    {title}
                  </h3>
                  <span className="text-xs font-medium text-stone-500">
                    {region}
                  </span>
                </div>
                <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-stone-500">
                  {description}
                </p>
              </div>
              <p className="mt-4 text-xs font-medium text-stone-900 group-hover:text-[#385842] flex items-center gap-1">
                <span>{cta}</span>
                <span className="text-stone-400 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
