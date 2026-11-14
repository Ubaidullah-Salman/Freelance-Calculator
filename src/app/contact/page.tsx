import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.freelancecalc.app";

export const metadata: Metadata = {
  title: "Contact FreelanceCalc — Support, Feedback & Inquiries",
  description:
    "Get in touch with the FreelanceCalc team for support, fee update suggestions, bug reports, or general freelance tool inquiries.",
  alternates: {
    canonical: `${SITE_URL}/contact`,
    languages: {
      en: `${SITE_URL}/contact`,
      "x-default": `${SITE_URL}/contact`,
    },
  },
};

export default function ContactPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Contact",
        item: `${SITE_URL}/contact`,
      },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Header */}
      <header className="mb-8 border-b border-stone-200/80 pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-stone-700 shadow-xs mb-3">
          <span>Get in Touch</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Contact Us
        </h1>
        <p className="mt-2 text-base text-stone-600 leading-relaxed">
          Have a question about our calculators, spotted an outdated platform fee rule, or want to suggest a new tool? We are here to help.
        </p>
      </header>

      <div className="space-y-8 text-sm text-stone-700">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 font-bold mb-3 text-base">
              ✉️
            </div>
            <h2 className="text-base font-bold text-stone-900">Email Support</h2>
            <p className="mt-1 text-xs text-stone-600 leading-relaxed">
              For general inquiries, bug reports, or suggestions:
            </p>
            <a
              href="mailto:support@freelancecalc.app"
              className="mt-3 inline-block font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
            >
              support@freelancecalc.app
            </a>
            <p className="mt-2 text-[11px] text-stone-400">Typical response time: within 24–48 hours</p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700 font-bold mb-3 text-base">
              💡
            </div>
            <h2 className="text-base font-bold text-stone-900">Fee Updates & Policy</h2>
            <p className="mt-1 text-xs text-stone-600 leading-relaxed">
              Did Upwork, Fiverr, or local tax authorities announce a rate change? Let our research team know:
            </p>
            <a
              href="mailto:support@freelancecalc.app?subject=Fee%20Update%20Report"
              className="mt-3 inline-block font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-900"
            >
              Report a Fee Change →
            </a>
            <p className="mt-2 text-[11px] text-stone-400">Help us keep data 100% accurate</p>
          </div>
        </div>

        <section className="rounded-xl border border-stone-200 bg-stone-50/70 p-5">
          <h2 className="text-base font-bold text-stone-900 mb-2">Frequently Asked Inquiries</h2>
          <div className="space-y-3 text-xs">
            <div>
              <p className="font-semibold text-stone-800">Is FreelanceCalc free to use?</p>
              <p className="mt-0.5 text-stone-600">Yes, 100% free with no sign-up or subscription required.</p>
            </div>
            <div>
              <p className="font-semibold text-stone-800">Do you store any financial details I enter?</p>
              <p className="mt-0.5 text-stone-600">Never. All calculations are executed purely in your browser client-side.</p>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <div className="border-t border-stone-200 pt-6 flex flex-wrap gap-3">
          <Link
            href="/about"
            className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/privacy-policy"
            className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </main>
  );
}

