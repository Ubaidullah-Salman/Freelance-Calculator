import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.freelancecalc.app";

export const metadata: Metadata = {
  title: "How to Track Freelance Hours — Free Time Card Guide (2026)",
  description:
    "Best methods for tracking freelance work hours accurately. Free browser-based time card, billable vs non-billable hours, overtime, and PDF timesheet export.",
  keywords: [
    "how to track freelance hours",
    "freelance time tracking",
    "time card calculator",
    "billable hours tracker",
    "freelancer timesheet",
    "track work hours free",
    "time tracking for freelancers",
    "how to bill hours as a freelancer",
  ].join(", "),
  alternates: {
    canonical: `${SITE_URL}/guides/how-to-track-freelance-hours/`,
    languages: {
      en: `${SITE_URL}/guides/how-to-track-freelance-hours/`,
      "x-default": `${SITE_URL}/guides/how-to-track-freelance-hours/`,
    },
  },
  openGraph: {
    title: "How to Track Freelance Hours — Free Time Card Guide (2026)",
    description:
      "Best methods for tracking freelance work hours accurately. Free browser-based time card with PDF and CSV export — no sign-up required.",
    url: `${SITE_URL}/guides/how-to-track-freelance-hours/`,
    type: "article",
  },
};

export default function HowToTrackFreelanceHoursGuide() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Track Freelance Hours — Free Time Card Guide (2026)",
    description:
      "Complete guide to tracking freelance work hours: choosing a method, handling breaks and overtime, billing clients accurately, and exporting professional timesheets.",
    url: `${SITE_URL}/guides/how-to-track-freelance-hours/`,
    datePublished: "2026-11-26T00:00:00Z",
    dateModified: "2026-11-26T00:00:00Z",
    author: { "@type": "Organization", name: "FreelanceCalc", url: SITE_URL },
    publisher: { "@type": "Organization", name: "FreelanceCalc", url: SITE_URL },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/guides/how-to-track-freelance-hours/`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides/` },
      {
        "@type": "ListItem",
        position: 3,
        name: "How to Track Freelance Hours",
        item: `${SITE_URL}/guides/how-to-track-freelance-hours/`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the best way to track freelance hours?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The best method depends on your workflow. For simple hourly billing, a time card or spreadsheet works well. For client-reporting accuracy, use a dedicated time tracker like a browser-based time card calculator that lets you log start/end times, break minutes, and project descriptions — then export a PDF timesheet to attach to your invoice.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between billable and non-billable hours?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Billable hours are time spent directly working on a client's deliverables — writing code, designing, writing, researching for the project. Non-billable hours include administrative tasks like invoicing, marketing, learning new tools, or client calls that you agreed not to charge for. Many freelancers track both but only invoice billable hours.",
        },
      },
      {
        "@type": "Question",
        name: "Should I track time in decimal hours or hours and minutes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Track in hours and minutes for readability, but convert to decimal hours for invoicing. For example, 1 hour 30 minutes = 1.5 decimal hours. Multiply by your hourly rate: 1.5 × $50 = $75. Our time card calculator shows both formats so you can use whichever your client prefers.",
        },
      },
      {
        "@type": "Question",
        name: "How do I handle unpaid lunch breaks when tracking hours?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Log your start time, end time, and the minutes of unpaid break separately. The worked hours should be: (end time − start time) − break minutes. Never include unpaid breaks in your billed total. Our time card calculator has a dedicated break field for each session that handles this automatically.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to send a timesheet with my invoice?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It is not legally required, but sending a timesheet significantly reduces payment disputes with hourly clients. It shows the exact sessions, start/end times, and task descriptions that justify your hours. Many clients — especially agencies and enterprises — require a timesheet as part of their accounts payable process.",
        },
      },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 text-xs text-stone-500">
        <Link href="/" className="hover:text-stone-900">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/guides/" className="hover:text-stone-900">Guides</Link>
        <span className="mx-2">›</span>
        <span className="text-stone-900">How to Track Freelance Hours</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-800">
            Time Tracking Guide
          </span>
          <span className="text-xs text-stone-500">Updated November 2026</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          How to Track Freelance Hours: Methods, Tools, and Best Practices
        </h1>
        <p className="mt-3 text-base text-stone-600 leading-relaxed">
          Accurate time tracking is the foundation of fair billing. Whether you charge hourly or use timesheets to justify fixed-price work, here&apos;s exactly how to do it right.
        </p>
      </header>

      {/* CTA Box */}
      <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50/60 p-5">
        <p className="text-sm font-semibold text-blue-900">Need a free time card right now?</p>
        <p className="mt-1 text-xs text-blue-800 leading-relaxed">
          Use our browser-based time card calculator. Log your work sessions, breaks, and hourly rate — then export a professional PDF or CSV timesheet. No sign-up. 100% private.
        </p>
        <Link
          href="/time-card-calculator/"
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800 transition-colors cursor-pointer"
        >
          Open Free Time Card Calculator →
        </Link>
      </div>

      <div className="prose prose-stone max-w-none space-y-8 text-sm leading-relaxed text-stone-700">

        {/* Section 1 */}
        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">Why Time Tracking Matters for Freelancers</h2>
          <p>
            Freelancers who track time accurately earn more. Not because they work more hours, but because they bill for all the hours they work, can justify their rates to skeptical clients, spot unprofitable projects before they drain too much time, and have the data to raise rates confidently.
          </p>
          <p className="mt-3">
            Without time tracking, most freelancers underestimate the hours they spend on a project by 20%–40%. That gap directly reduces your effective hourly rate — even if your invoice looks correct.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">3 Methods for Tracking Freelance Hours</h2>

          <div className="mt-3 space-y-4">
            {[
              {
                method: "1. Manual Time Card (Start/End Time Logging)",
                pros: ["Simple and transparent for clients", "No app needed — a spreadsheet or browser tool works", "Easy to export as a PDF timesheet"],
                cons: ["Requires discipline to log immediately", "Easy to forget short breaks"],
                best: "Best for: freelancers with predictable work blocks who bill clients hourly",
              },
              {
                method: "2. Running Timer (Stop-the-Clock Tracking)",
                pros: ["Most accurate — captures exactly when you start and stop", "Good for multitasking or interruption-heavy days"],
                cons: ["Requires a timer app to be open at all times", "Stopping the timer when you are in flow can break concentration"],
                best: "Best for: freelancers who frequently context-switch between tasks or clients",
              },
              {
                method: "3. Activity-Based Logging (End-of-Day Estimation)",
                pros: ["No interruption during work", "Works well for remote writers, designers, and developers"],
                cons: ["Less accurate — memory fades within hours", "Clients may dispute vague time entries"],
                best: "Best for: experienced freelancers with well-defined project phases",
              },
            ].map(({ method, pros, cons, best }) => (
              <div key={method} className="rounded-xl border border-stone-200 bg-stone-50/60 p-4">
                <p className="font-semibold text-stone-900 text-sm">{method}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 text-xs">
                  <div>
                    <p className="font-medium text-emerald-800 mb-1">✓ Pros</p>
                    <ul className="space-y-1 text-stone-600">
                      {pros.map((p) => <li key={p}>{p}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-rose-700 mb-1">✗ Cons</p>
                    <ul className="space-y-1 text-stone-600">
                      {cons.map((c) => <li key={c}>{c}</li>)}
                    </ul>
                  </div>
                </div>
                <p className="mt-3 text-[11px] text-stone-500 italic">{best}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">Billable vs Non-Billable Hours: What to Charge</h2>
          <p>
            Not every hour you work should appear on a client invoice. Understanding which hours are billable prevents both undercharging (billing too few hours) and overcharging (billing hours the client didn&apos;t agree to pay for).
          </p>

          <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50/70 overflow-hidden">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100/80 border-b border-stone-200">
                  <th className="text-left px-4 py-3 font-semibold text-stone-800">Activity</th>
                  <th className="text-left px-4 py-3 font-semibold text-stone-800">Billable?</th>
                  <th className="text-left px-4 py-3 font-semibold text-stone-800">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {[
                  ["Directly working on deliverables", "✅ Yes", "Core work — always billable"],
                  ["Responding to client emails & Slack", "✅ Usually", "Agree upfront; some clients cap at 30 min/week"],
                  ["Video calls with the client", "✅ Usually", "Bill in 15-min increments; note meeting duration"],
                  ["Research specific to client's project", "✅ Yes", "Document clearly so client can verify"],
                  ["Revisions within agreed scope", "✅ Yes", "Revisions beyond scope = new billable task"],
                  ["Writing your own invoice", "❌ No", "Admin overhead — factor into your rate instead"],
                  ["Learning a new tool for your own skills", "❌ No", "Unless client specifically requested it"],
                  ["Breaks and lunch", "❌ No", "Track and subtract as unpaid break minutes"],
                  ["Fixing your own bugs or errors", "⚠️ Varies", "Own mistakes = non-billable; client-caused = billable"],
                ].map(([activity, billable, notes]) => (
                  <tr key={activity} className="hover:bg-white/60">
                    <td className="px-4 py-2.5 text-stone-700">{activity}</td>
                    <td className="px-4 py-2.5 font-medium">{billable}</td>
                    <td className="px-4 py-2.5 text-stone-500">{notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">Hours and Minutes vs Decimal Hours: Billing Correctly</h2>
          <p>
            When you bill an hourly client, you need to convert your logged hours and minutes into decimal hours to calculate the correct invoice total.
          </p>

          <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50/70 p-4 text-xs">
            <p className="font-semibold text-stone-900 mb-3">Conversion formula: minutes ÷ 60 = decimal fraction</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                ["1h 15m", "1.25 hrs", "$50/hr → $62.50"],
                ["1h 30m", "1.50 hrs", "$50/hr → $75.00"],
                ["1h 45m", "1.75 hrs", "$50/hr → $87.50"],
                ["2h 20m", "2.33 hrs", "$50/hr → $116.67"],
                ["3h 45m", "3.75 hrs", "$50/hr → $187.50"],
                ["7h 30m", "7.50 hrs", "$50/hr → $375.00"],
              ].map(([hm, dec, ex]) => (
                <div key={hm} className="flex items-center gap-3 bg-white rounded-lg border border-stone-100 p-2.5">
                  <span className="font-mono font-bold text-stone-900 w-14 shrink-0">{hm}</span>
                  <span className="text-stone-500">→</span>
                  <span className="font-mono text-emerald-700 w-16 shrink-0">{dec}</span>
                  <span className="text-stone-400">{ex}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4">
            Our time card calculator shows both formats in the summary — hours:minutes for readability and decimal hours clearly labelled for billing calculations.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">Sending a Timesheet with Your Invoice</h2>
          <p>
            Attaching a timesheet to your invoice builds client trust, dramatically reduces payment disputes, and is often required by larger clients with accounts payable departments.
          </p>
          <p className="mt-3">A good freelance timesheet should include:</p>
          <ul className="mt-3 space-y-2 pl-4">
            {[
              "Your name and the client or project name",
              "The reporting period (e.g. November 1–15, 2026)",
              "One row per work session with date, start time, end time, break minutes, net worked hours",
              "A short description of work done in each session",
              "Total hours worked, total billable hours, hourly rate, and estimated amount",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-stone-600">
                <span className="text-blue-500 mt-0.5 shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50/60 p-4">
            <p className="text-xs font-semibold text-blue-900">
              Export a professional timesheet PDF in seconds
            </p>
            <p className="mt-1 text-xs text-blue-700 leading-relaxed">
              Log your sessions in our free time card calculator and download a formatted PDF or CSV timesheet to attach to your invoice. All data stays in your browser.
            </p>
            <Link
              href="/time-card-calculator/"
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-800 transition-colors cursor-pointer"
            >
              Open Time Card Calculator →
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              {
                q: "What is the best way to track freelance hours?",
                a: "Use a time card with start/end times logged per session. Add break minutes separately. For billing, convert to decimal hours. Export a PDF timesheet to accompany your invoice.",
              },
              {
                q: "What is the difference between billable and non-billable hours?",
                a: "Billable hours are spent directly on the client's deliverables. Non-billable hours include your own admin, learning, and marketing. Agree on what counts as billable in your contract before starting work.",
              },
              {
                q: "Should I track time in decimal hours or hours and minutes?",
                a: "Track in hours:minutes (e.g. 1h 30m) for readability. Convert to decimal (1.5 hrs) for invoicing math. 1h 30m = 1.5 hrs = 1.5 × rate = your invoice line amount.",
              },
              {
                q: "How do I handle unpaid lunch breaks?",
                a: "Log your break minutes in a separate field for each session. Subtract them from elapsed time before calculating worked hours. Never include unpaid breaks in your billed total.",
              },
              {
                q: "Do I need to send a timesheet with my invoice?",
                a: "Not legally required, but strongly recommended for hourly billing. It prevents disputes, helps clients approve payment faster, and many larger clients specifically require it.",
              },
            ].map((item, i) => (
              <div key={i} className="rounded-lg border border-stone-200 bg-white p-4">
                <p className="font-semibold text-stone-900 text-xs">{item.q}</p>
                <p className="mt-1.5 text-xs text-stone-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Tools */}
        <section className="border-t border-stone-200 pt-6">
          <h2 className="text-base font-bold text-stone-900 mb-3">Related Calculators & Guides</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                href: "/time-card-calculator/",
                label: "Free Time Card Calculator →",
                desc: "Log work sessions, breaks, and overtime. Export PDF or CSV timesheet.",
              },
              {
                href: "/invoice-generator/",
                label: "Free Invoice Generator →",
                desc: "Turn your tracked hours into a professional PDF invoice.",
              },
              {
                href: "/upwork-fee-calculator/",
                label: "Upwork Fee Calculator →",
                desc: "Calculate your net take-home after Upwork platform fees.",
              },
              {
                href: "/guides/freelance-invoice-template/",
                label: "Freelance Invoice Template Guide →",
                desc: "What to include on a professional invoice and how to number them.",
              },
            ].map(({ href, label, desc }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg border border-stone-200 bg-white p-3 hover:border-stone-400 hover:shadow-sm transition-all group"
              >
                <p className="text-xs font-semibold text-stone-900 group-hover:text-blue-800">{label}</p>
                <p className="text-[11px] text-stone-500 mt-0.5">{desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
