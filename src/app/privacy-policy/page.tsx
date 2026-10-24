import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://freelancecalc.app";

export const metadata: Metadata = {
  title: "Privacy Policy — FreelanceCalc",
  description:
    "Privacy Policy for FreelanceCalc. Learn how we handle your data, our client-side calculations guarantee, and our cookie and advertising disclosures.",
  alternates: { canonical: `${SITE_URL}/privacy-policy` },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-14">
      {/* Header */}
      <header className="mb-8 border-b border-stone-200/80 pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-stone-700 shadow-xs mb-3">
          <span>Legal & Compliance</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-xs text-stone-500">
          Last Updated: October 24, 2026
        </p>
      </header>

      {/* Content */}
      <div className="space-y-6 text-sm leading-relaxed text-stone-700">
        <section>
          <p>
            At <strong>FreelanceCalc</strong> (accessible from <a href="https://freelancecalc.app" className="text-emerald-700 underline">https://freelancecalc.app</a>), the privacy of our visitors is of paramount importance to us. This Privacy Policy document outlines the types of information that is collected and recorded by FreelanceCalc and how we use it.
          </p>
        </section>

        <section className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
          <h2 className="text-base font-bold text-emerald-900">
            🔒 Core Guarantee: Zero Storage of Financial Inputs
          </h2>
          <p className="mt-1 text-xs text-emerald-800 leading-relaxed">
            All calculations performed on FreelanceCalc—including project rates, bonuses, platform percentages, and currency exchange figures—are processed entirely inside your local browser via JavaScript. <strong>We do not transmit, log, store, or sell any financial figures you enter.</strong>
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-stone-900 mb-2">1. Log Files</h2>
          <p>
            Like most standard website hosting providers, FreelanceCalc follows standard log file protocols (via hosting networks such as Vercel). The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable and are used solely for website maintenance and performance monitoring.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-stone-900 mb-2">2. Cookies and Web Beacons</h2>
          <p>
            FreelanceCalc uses &quot;cookies&quot; to store information including visitors&apos; preferences and the pages on the website that the visitor accessed or visited. The information is used to optimize the users&apos; experience by customizing our web page content based on visitors&apos; browser type and/or other information.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-stone-900 mb-2">3. Google Analytics (gtag.js)</h2>
          <p>
            We use Google Analytics to understand how visitors interact with our calculators. Google Analytics uses cookies to collect aggregated, non-personally identifiable traffic information. You can review how Google uses data when you use partner sites at:{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 underline"
            >
              policies.google.com/technologies/partner-sites
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-stone-900 mb-2">4. Google AdSense & Third-Party Advertising</h2>
          <p>
            Google is a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to freelancecalc.app and other sites on the internet.
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-stone-600">
            <li>
              Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to your website or other websites.
            </li>
            <li>
              Google&apos;s use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.
            </li>
            <li>
              Users may opt out of personalized advertising by visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline"
              >
                Google Ads Settings
              </a>{" "}
              or by visiting{" "}
              <a
                href="https://www.aboutads.info"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline"
              >
                www.aboutads.info
              </a>.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-stone-900 mb-2">5. Affiliate Disclosure</h2>
          <p>
            FreelanceCalc may participate in affiliate marketing programs (such as Payoneer, Wise, and Fiverr Affiliates). Some links on this site may be affiliate links. If you click on an affiliate link and open an account or purchase a service, we may receive a commission at no additional cost to you. We only recommend services that we believe add genuine value to remote contractors and freelancers.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-stone-900 mb-2">6. GDPR & CCPA Privacy Rights</h2>
          <p>
            Under data protection regulations, users have the right to request access to any personal data collected, request correction, or request erasure. Since FreelanceCalc does not require user registration or maintain user account profiles, we do not store personal profiles.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-stone-900 mb-2">7. Contact Us</h2>
          <p>
            If you have any questions or require more information about our Privacy Policy, do not hesitate to contact us by email at{" "}
            <a
              href="mailto:privacy@freelancecalc.app"
              className="font-medium text-emerald-700 underline"
            >
              privacy@freelancecalc.app
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
