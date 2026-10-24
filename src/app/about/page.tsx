import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://freelancecalc.app";

export const metadata: Metadata = {
  title: "About Us — Independent Freelancer Financial Tools",
  description:
    "Learn about FreelanceCalc, our mission to bring transparent, accurate, and private financial calculators to freelancers worldwide.",
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-14">
      {/* Header */}
      <header className="mb-8 border-b border-stone-200/80 pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-stone-700 shadow-xs mb-3">
          <span>About FreelanceCalc</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Empowering freelancers with transparent math.
        </h1>
        <p className="mt-2 text-base text-stone-600 leading-relaxed">
          FreelanceCalc was built to solve a simple yet frustrating problem: knowing exactly how much money lands in your bank account after platform commissions, conversion rates, and taxes.
        </p>
      </header>

      {/* Main Content */}
      <div className="space-y-8 text-sm leading-relaxed text-stone-700">
        <section>
          <h2 className="text-lg font-bold text-stone-900 mb-2">Our Mission</h2>
          <p>
            Freelancing gives people freedom, but platform fees and foreign exchange spreads are notoriously confusing. Upwork transitioned from a lifetime sliding scale to variable 0%–15% contracts. Fiverr takes 20% across all orders, extras, and tips. Local banks deduct hidden spreads and withholding taxes.
          </p>
          <p className="mt-2.5">
            Our goal is to eliminate financial guesswork. We provide instant, accurate, and clean calculators designed by freelancers, for freelancers.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 font-bold mb-2">
              🔒
            </div>
            <h3 className="font-semibold text-stone-900">100% Private</h3>
            <p className="mt-1 text-xs text-stone-600">
              Every single calculation runs client-side in your browser. We never store or track your rates or earnings.
            </p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 font-bold mb-2">
              📜
            </div>
            <h3 className="font-semibold text-stone-900">Official Rules</h3>
            <p className="mt-1 text-xs text-stone-600">
              Constantly updated against current Upwork policy, Fiverr documentation, and official FBR Tax Year 2027 cards.
            </p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 font-bold mb-2">
              🌍
            </div>
            <h3 className="font-semibold text-stone-900">Global Focus</h3>
            <p className="mt-1 text-xs text-stone-600">
              Built for international creators and remote contractors across 9 major currencies and regional tax hubs.
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-stone-200 bg-stone-50/70 p-5">
          <h2 className="text-base font-bold text-stone-900 mb-1.5">Independent & Unbiased</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            FreelanceCalc is an independent utility. We are not owned by, affiliated with, or sponsored by Upwork Global Inc., Fiverr International Ltd., or any government authority. Our calculations are neutral and based strictly on publicly published fee schedules.
          </p>
        </section>

        <section className="border-t border-stone-200 pt-6">
          <h2 className="text-base font-bold text-stone-900 mb-2">Contact & Feedback</h2>
          <p>
            Have a suggestion, noticed a fee change on your platform, or want to partner with us? We love hearing from fellow remote workers.
          </p>
          <p className="mt-2">
            Reach out via email at:{" "}
            <a
              href="mailto:support@freelancecalc.app"
              className="font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
            >
              support@freelancecalc.app
            </a>
          </p>
        </section>
      </div>

      {/* Navigation CTA */}
      <div className="mt-10 pt-6 border-t border-stone-200 flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-lg bg-stone-900 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800 transition-colors"
        >
          Explore All Calculators →
        </Link>
        <Link
          href="/privacy-policy"
          className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
        >
          Privacy Policy
        </Link>
      </div>
    </main>
  );
}
