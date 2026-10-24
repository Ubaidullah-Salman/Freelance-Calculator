import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://freelancecalc.app";

export const metadata: Metadata = {
  title: "Terms of Service & Disclaimer — FreelanceCalc",
  description:
    "Terms of Service, educational disclaimers, and platform intellectual property notices for FreelanceCalc.",
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-14">
      {/* Header */}
      <header className="mb-8 border-b border-stone-200/80 pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-stone-700 shadow-xs mb-3">
          <span>Terms of Use</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Terms of Service & Disclaimer
        </h1>
        <p className="mt-2 text-xs text-stone-500">
          Last Updated: October 24, 2026
        </p>
      </header>

      {/* Content */}
      <div className="space-y-6 text-sm leading-relaxed text-stone-700">
        <section>
          <p>
            By accessing or using <strong>FreelanceCalc</strong> (<a href="https://freelancecalc.app" className="text-emerald-700 underline">freelancecalc.app</a>), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, please do not use our website or calculators.
          </p>
        </section>

        <section className="rounded-xl border border-stone-200 bg-stone-50/70 p-4">
          <h2 className="text-base font-bold text-stone-900 mb-1">
            ⚠️ Financial & Tax Disclaimer (Not Legal or Accounting Advice)
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            FreelanceCalc provides calculations, estimates, and currency conversions for <strong>educational and informational planning purposes only</strong>. We do not provide financial, legal, investment, or certified tax advice. Exchange rates fluctuate continuously, and individual contract fee tiers may vary. Always verify active rates on your platform account and consult a certified tax professional (such as a licensed CPA or Chartered Accountant) before filing official tax returns.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-stone-900 mb-2">1. Trademark & Intellectual Property Disclaimers</h2>
          <p>
            All product names, logos, brands, and registered trademarks displayed on this site are property of their respective owners:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-stone-600">
            <li><strong>Upwork®</strong> is a registered trademark of Upwork Global Inc.</li>
            <li><strong>Fiverr®</strong> is a registered trademark of Fiverr International Ltd.</li>
            <li><strong>Wise®</strong> and <strong>Payoneer®</strong> are trademarks of their respective corporations.</li>
            <li>References to the <strong>Federal Board of Revenue (FBR)</strong> and Section 154A of the Income Tax Ordinance refer to published Pakistani statutory tax schedules.</li>
          </ul>
          <p className="mt-2 text-xs text-stone-500">
            The use of these names and trademarks does not imply any affiliation, sponsorship, or endorsement by these entities.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-stone-900 mb-2">2. Permitted Use</h2>
          <p>
            You are granted a non-exclusive, revocable license to use our web calculators for personal or internal business estimation purposes. You agree not to scrape, reverse-engineer, attempt to overwhelm our hosting infrastructure, or use the service for unlawful purposes.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-stone-900 mb-2">3. Accuracy of Calculations</h2>
          <p>
            While we strive to keep all platform rules, formulas, and withholding tax rate schedules up to date, FreelanceCalc makes no warranties or guarantees regarding the 100% accuracy, completeness, or timeliness of results. Calculations depend on user inputs and platform policy updates.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-stone-900 mb-2">4. Limitation of Liability</h2>
          <p>
            In no event shall FreelanceCalc, its creators, or contributors be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use the calculators or reliance on estimates generated on the website.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-stone-900 mb-2">5. Changes to These Terms</h2>
          <p>
            We reserve the right to revise or modify these Terms of Service at any time. Changes will be reflected directly on this page with an updated &quot;Last Updated&quot; date.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-stone-900 mb-2">6. Contact Information</h2>
          <p>
            If you have questions regarding these terms, please contact us at{" "}
            <a
              href="mailto:legal@freelancecalc.app"
              className="font-medium text-emerald-700 underline"
            >
              legal@freelancecalc.app
            </a>.
          </p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-stone-200">
        <Link
          href="/"
          className="text-xs font-semibold text-stone-900 hover:text-emerald-800 transition-colors"
        >
          ← Return to FreelanceCalc Home
        </Link>
      </div>
    </main>
  );
}
