import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://freelancecalc.app";

export const metadata: Metadata = {
  title: "Freelance Fee Calculator — Upwork, Fiverr & Global Take-Home Pay",
  description:
    "Instant take-home pay calculator for freelancers: Upwork fees (0%–15%), Fiverr (20%), multi-currency conversion, and freelance tax withholding.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Freelance Fee Calculator — Upwork, Fiverr & Global Take-Home Pay",
    description:
      "Instant take-home pay calculator for freelancers: Upwork fees, Fiverr fees, multi-currency conversion, and freelance tax withholding.",
    url: SITE_URL,
    type: "website",
  },
};

const PLATFORM_TOOLS = [
  {
    href: "/upwork-fee-calculator",
    badge: "Upwork",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    fee: "0% to 15% sliding",
    title: "Upwork Fee Calculator",
    subtitle: "Calculate your exact take-home pay on fixed-price or hourly Upwork contracts.",
    features: [
      "Per-contract fee (standard 10% or BYO 0%)",
      "Bonus & additional payment support",
      "Converts USD to your local bank currency",
    ],
    cta: "Calculate Upwork Payout",
    id: "tool-card-upwork",
  },
  {
    href: "/fiverr-fee-calculator",
    badge: "Fiverr",
    badgeColor: "bg-green-50 text-green-800 border-green-200",
    fee: "20% flat seller cut",
    title: "Fiverr Fee Calculator",
    subtitle: "See what you keep after Fiverr's standard commission across gigs and tips.",
    features: [
      "Standard 20% platform cut on orders",
      "Gig extras and buyer tips included",
      "Bank transfer and withdrawal estimates",
    ],
    cta: "Calculate Fiverr Payout",
    id: "tool-card-fiverr",
  },
  {
    href: "/usd-to-pkr-calculator",
    badge: "Currency",
    badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
    fee: "9 Currencies",
    title: "Multi-Currency Converter",
    subtitle: "Convert foreign earnings with your real bank transfer rate, not inflated mid-market rates.",
    features: [
      "Supports PKR, INR, PHP, EUR, GBP, CAD, AUD",
      "Daily, weekly, monthly & yearly projections",
      "Customizable bank exchange rate",
    ],
    cta: "Convert Freelance Income",
    id: "tool-card-usd-pkr",
  },
];

const TAX_TOOLS = [
  {
    href: "/pakistan-freelancer-tax",
    badge: "🇵🇰 Pakistan",
    badgeColor: "bg-teal-50 text-teal-800 border-teal-200",
    fee: "FBR Section 154A",
    title: "Pakistan Freelancer Tax Calculator",
    subtitle: "Official export withholding tax for IT services and freelance remittances.",
    features: [
      "0.25% PSEB registered IT export rate",
      "1.00% Non-registered freelance services rate",
      "Updated for current Tax Year 2027 rules",
    ],
    cta: "Calculate Pakistan Tax",
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
      "Simple, transparent take-home pay calculators for freelancers on Upwork, Fiverr, and global clients.",
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* Hero Section */}
      <section className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-700 shadow-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          <span>100% Free • Updated 2026 Platform Rules</span>
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Know your real freelance earnings.
        </h1>
        <p className="mt-2.5 max-w-2xl text-base text-stone-600 sm:text-lg leading-relaxed">
          See exactly how much hits your bank account after platform commissions, withdrawal fees, exchange rates, and taxes.
        </p>

        {/* Feature Badges */}
        <div className="mt-5 flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs text-stone-700 font-medium">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-stone-100 px-2.5 py-1">
            ✓ Upwork 0%–15% Rules
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-stone-100 px-2.5 py-1">
            ✓ Fiverr 20% Breakdown
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-stone-100 px-2.5 py-1">
            ✓ 9 Global Currencies
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-stone-100 px-2.5 py-1">
            ✓ Zero Sign-Up Required
          </span>
        </div>
      </section>

      {/* Main Platform Calculators */}
      <section className="mb-12" aria-labelledby="platform-tools-heading">
        <div className="mb-4 flex items-center justify-between border-b border-stone-200/80 pb-2.5">
          <h2
            id="platform-tools-heading"
            className="text-sm font-semibold uppercase tracking-wider text-stone-600"
          >
            Platform Calculators
          </h2>
          <span className="text-xs text-stone-500">Instant results</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLATFORM_TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              id={tool.id}
              className="group flex flex-col justify-between rounded-xl border border-stone-200/90 bg-white p-5 shadow-xs transition-all hover:border-stone-400 hover:shadow-md"
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${tool.badgeColor}`}
                  >
                    {tool.badge}
                  </span>
                  <span className="text-[11px] font-medium text-stone-500">
                    {tool.fee}
                  </span>
                </div>

                {/* Title & Short Subtitle */}
                <h3 className="mt-3 text-lg font-semibold text-stone-900 group-hover:text-emerald-800 transition-colors">
                  {tool.title}
                </h3>
                <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                  {tool.subtitle}
                </p>

                {/* Scannable Micro-bullets */}
                <ul className="mt-3 space-y-1.5 border-t border-stone-100 pt-3 text-xs text-stone-700">
                  {tool.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-stone-100">
                <span className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-stone-50 py-2 text-xs font-semibold text-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-all">
                  <span>{tool.cta}</span>
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Regional Tax Section */}
      <section className="mb-12" aria-labelledby="tax-tools-heading">
        <div className="mb-4 flex items-center justify-between border-b border-stone-200/80 pb-2.5">
          <h2
            id="tax-tools-heading"
            className="text-sm font-semibold uppercase tracking-wider text-stone-600"
          >
            Regional Tax Calculators
          </h2>
          <span className="text-xs text-stone-500">Official FBR Rules</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-1">
          {TAX_TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              id={tool.id}
              className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-stone-200/90 bg-white p-5 shadow-xs transition-all hover:border-stone-400 hover:shadow-md gap-4"
            >
              <div className="max-w-xl">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${tool.badgeColor}`}
                  >
                    {tool.badge}
                  </span>
                  <span className="text-xs font-medium text-stone-500">
                    {tool.fee}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-semibold text-stone-900 group-hover:text-teal-800 transition-colors">
                  {tool.title}
                </h3>
                <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                  {tool.subtitle}
                </p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-700">
                  {tool.features.map((feature, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <span className="text-teal-600 font-bold">✓</span>
                      <span>{feature}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="sm:self-center shrink-0">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-stone-50 px-4 py-2.5 text-xs font-semibold text-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-all">
                  <span>{tool.cta}</span>
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3-Step Simple Guide */}
      <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-xs">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-600">
          How It Works
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-stone-50 p-4 border border-stone-100">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-[11px] font-bold text-white">
              1
            </span>
            <h3 className="mt-2 text-sm font-semibold text-stone-900">
              Enter Project Rate
            </h3>
            <p className="mt-1 text-xs text-stone-600 leading-relaxed">
              Put your milestone budget or hourly billing amount.
            </p>
          </div>

          <div className="rounded-lg bg-stone-50 p-4 border border-stone-100">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-[11px] font-bold text-white">
              2
            </span>
            <h3 className="mt-2 text-sm font-semibold text-stone-900">
              Select Fee & Rate
            </h3>
            <p className="mt-1 text-xs text-stone-600 leading-relaxed">
              Deduct platform commission and enter your receiving bank exchange rate.
            </p>
          </div>

          <div className="rounded-lg bg-stone-50 p-4 border border-stone-100">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white">
              3
            </span>
            <h3 className="mt-2 text-sm font-semibold text-stone-900">
              See Exact Take-Home
            </h3>
            <p className="mt-1 text-xs text-stone-600 leading-relaxed">
              Know exactly how much cash lands in your local bank account.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

