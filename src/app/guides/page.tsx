import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.freelancecalc.app";

export const metadata: Metadata = {
  title: "Freelancer Guides — Fees, Tax & Currency Explained",
  description:
    "Free, detailed guides for freelancers on Upwork fees, Fiverr commissions, currency conversion, and Pakistan tax — written in plain language with real examples.",
  alternates: { canonical: `${SITE_URL}/guides` },
};

const GUIDES = [
  {
    href: "/guides/upwork-fees-explained",
    badge: "Upwork",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    title: "How Much Does Upwork Take? Complete Fee Guide 2026",
    desc: "A detailed breakdown of Upwork's current 0%–15% service fee — how it's calculated, worked examples, and how to maximize your take-home pay.",
    readTime: "7 min read",
  },
  {
    href: "/guides/fiverr-fees-explained",
    badge: "Fiverr",
    badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
    title: "Fiverr Fees Explained: What Fiverr Takes in 2026",
    desc: "Fiverr charges a flat 20% on all earnings including tips. Learn exactly what you keep from gig orders, extras, and custom offers — with pricing formulas.",
    readTime: "6 min read",
  },
  {
    href: "/guides/freelancer-currency-conversion",
    badge: "Currency",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    title: "Freelancer Currency Conversion: Why You Get Less Than Google's Rate",
    desc: "Why your USD earnings shrink by 3–7% during conversion — and how freelancers in Pakistan, India, and Bangladesh can keep more of their money.",
    readTime: "8 min read",
  },
];

export default function GuidesIndex() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-14">
      <nav className="mb-6 text-xs text-stone-500">
        <Link href="/" className="hover:text-stone-900">Home</Link>
        <span className="mx-2">›</span>
        <span className="text-stone-900">Guides</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Freelancer Guides
        </h1>
        <p className="mt-3 text-base text-stone-600 leading-relaxed">
          Plain-language guides covering everything freelancers need to know about platform fees, currency conversion, and local tax — with real-world examples and exact calculations.
        </p>
      </header>

      <div className="space-y-4">
        {GUIDES.map((g) => (
          <Link key={g.href} href={g.href} className="group block rounded-xl border border-stone-200 bg-white p-5 hover:border-stone-400 hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold mb-2 ${g.badgeColor}`}>
                  {g.badge}
                </div>
                <h2 className="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition-colors leading-snug">
                  {g.title}
                </h2>
                <p className="mt-2 text-xs text-stone-500 leading-relaxed">{g.desc}</p>
                <p className="mt-3 text-[11px] text-stone-400">{g.readTime}</p>
              </div>
              <span className="text-stone-300 group-hover:text-emerald-500 transition-colors text-lg mt-0.5">→</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 border-t border-stone-200 pt-8">
        <h2 className="text-sm font-bold text-stone-900 mb-4">Quick Calculators</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { href: "/upwork-fee-calculator", title: "Upwork Fee Calculator", desc: "Instant take-home from any Upwork contract." },
            { href: "/fiverr-fee-calculator", title: "Fiverr Fee Calculator", desc: "Calculate net earnings after Fiverr's 20% cut." },
            { href: "/usd-to-pkr-calculator", title: "Currency Converter", desc: "USD to PKR, INR, PHP and more at your bank rate." },
            { href: "/pakistan-freelancer-tax", title: "Pakistan Tax Calculator", desc: "FBR Section 154A withholding on remittances." },
          ].map((c) => (
            <Link key={c.href} href={c.href} className="rounded-lg border border-stone-200 bg-stone-50/70 p-3 hover:bg-white hover:border-stone-400 hover:shadow-sm transition-all group">
              <p className="text-xs font-semibold text-stone-900 group-hover:text-emerald-800">{c.title} →</p>
              <p className="text-[11px] text-stone-500 mt-0.5">{c.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
