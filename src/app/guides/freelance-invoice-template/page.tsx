import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.freelancecalc.app";

export const metadata: Metadata = {
  title: "Freelance Invoice Template — Free PDF Generator (2026)",
  description:
    "Create a professional freelance invoice in minutes. Free PDF template with auto-calculated totals, partial payments, and client branding. No sign-up needed.",
  keywords: [
    "freelance invoice template",
    "free invoice template",
    "freelancer invoice PDF",
    "invoice generator free",
    "invoice maker online",
    "professional invoice template",
    "small business invoice",
    "consultant invoice template",
  ].join(", "),
  alternates: {
    canonical: `${SITE_URL}/guides/freelance-invoice-template/`,
    languages: {
      en: `${SITE_URL}/guides/freelance-invoice-template/`,
      "x-default": `${SITE_URL}/guides/freelance-invoice-template/`,
    },
  },
  openGraph: {
    title: "Freelance Invoice Template — Free PDF Generator (2026)",
    description:
      "Create a professional freelance invoice in minutes. Free, browser-only PDF generator with auto-calculated totals, partial payments, and client branding.",
    url: `${SITE_URL}/guides/freelance-invoice-template/`,
    type: "article",
  },
};

export default function FreelanceInvoiceTemplateGuide() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Freelance Invoice Template — Free PDF Generator (2026)",
    description:
      "Complete guide to creating professional freelance invoices: what to include, how to number them, handling partial payments, and exporting to PDF — all free and browser-only.",
    url: `${SITE_URL}/guides/freelance-invoice-template/`,
    datePublished: "2026-11-26T00:00:00Z",
    dateModified: "2026-11-26T00:00:00Z",
    author: { "@type": "Organization", name: "FreelanceCalc", url: SITE_URL },
    publisher: { "@type": "Organization", name: "FreelanceCalc", url: SITE_URL },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/guides/freelance-invoice-template/`,
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
        name: "Freelance Invoice Template",
        item: `${SITE_URL}/guides/freelance-invoice-template/`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What should I include on a freelance invoice?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A professional freelance invoice must include: your business name and contact details, the client's name and address, a unique invoice number, the issue date and payment due date, an itemised list of services with quantities, rates and amounts, the currency and total amount due, payment instructions (bank account, PayPal, Wise), and your payment terms (e.g. Net 15, Net 30).",
        },
      },
      {
        "@type": "Question",
        name: "How do I number freelance invoices?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use a sequential numbering system such as INV-001, INV-002 or include the year (INV-2026-001). Consistent numbering helps you and your client track payments and is required for tax record-keeping in most countries. Never reuse invoice numbers, even after cancellations.",
        },
      },
      {
        "@type": "Question",
        name: "What is a Net 30 payment term?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Net 30 means payment is due within 30 calendar days of the invoice date. Other common terms are Net 15 (15 days), Net 60 (60 days), or Due on Receipt. Many freelancers use Net 15 or Net 7 for smaller projects to maintain healthy cash flow.",
        },
      },
      {
        "@type": "Question",
        name: "Should I charge tax on freelance invoices?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It depends on your country and business structure. In the UK, once you're VAT-registered you must charge 20% VAT. In the US, service providers generally don't charge sales tax on services but should consult a CPA. In Pakistan, registered IT exporters may apply 0% withholding on foreign-currency invoices under PSEB exemption rules.",
        },
      },
      {
        "@type": "Question",
        name: "Can I invoice in a foreign currency (USD, EUR, GBP)?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Freelancers commonly invoice international clients in USD, EUR, or GBP regardless of their home currency. Clearly state the billing currency on the invoice. Your client pays in that currency, and your bank or payment provider (Wise, Payoneer) converts it to your local currency when you receive funds.",
        },
      },
      {
        "@type": "Question",
        name: "How do I record a partial payment on an invoice?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Show the total invoice amount, then add a line showing the deposit or partial amount already paid, and calculate the remaining balance due. This keeps records clear for both parties. Our free invoice generator handles partial payments automatically — just enter the amount paid and the balance due updates instantly.",
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
        <span className="text-stone-900">Freelance Invoice Template</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="rounded-md border border-violet-200 bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-800">
            Invoicing Guide
          </span>
          <span className="text-xs text-stone-500">Updated November 2026</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          Freelance Invoice Template: What to Include, How to Number, and When to Get Paid
        </h1>
        <p className="mt-3 text-base text-stone-600 leading-relaxed">
          A well-structured invoice is the difference between getting paid on time and chasing clients for weeks. This guide covers every field on a professional freelance invoice — plus a free, browser-based PDF generator you can use right now.
        </p>
      </header>

      {/* CTA Box */}
      <div className="mb-8 rounded-xl border border-emerald-200 bg-emerald-50/60 p-5">
        <p className="text-sm font-semibold text-emerald-900">Skip the reading — just want to create an invoice?</p>
        <p className="mt-1 text-xs text-emerald-800 leading-relaxed">
          Use our free invoice generator. No sign-up, no watermarks. All data stays in your browser. Download a professional PDF in under 2 minutes.
        </p>
        <Link
          href="/invoice-generator/"
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition-colors cursor-pointer"
        >
          Open Free Invoice Generator →
        </Link>
      </div>

      <div className="prose prose-stone max-w-none space-y-8 text-sm leading-relaxed text-stone-700">

        {/* Section 1 */}
        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">What Every Freelance Invoice Must Include</h2>
          <p>
            A professional invoice isn&apos;t just a payment request — it&apos;s a legal document that protects both you and your client. Courts and tax authorities in most countries require invoices to contain specific fields to be legally valid.
          </p>
          <p className="mt-3">
            Here is what every freelance invoice needs:
          </p>

          <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50/70 overflow-hidden">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100/80 border-b border-stone-200">
                  <th className="text-left px-4 py-3 font-semibold text-stone-800">Field</th>
                  <th className="text-left px-4 py-3 font-semibold text-stone-800">Why It Matters</th>
                  <th className="text-left px-4 py-3 font-semibold text-stone-800">Required?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {[
                  ["Your name / business name", "Identifies you legally as the service provider", "✅ Always"],
                  ["Your address / contact info", "Legal requirement in most jurisdictions", "✅ Always"],
                  ["Client name and address", "Addresses the invoice to the correct entity", "✅ Always"],
                  ["Unique invoice number", "Required for record-keeping and tax filing", "✅ Always"],
                  ["Invoice issue date", "Establishes when the invoice was created", "✅ Always"],
                  ["Payment due date / terms", "Sets the deadline (Net 15, Net 30, etc.)", "✅ Always"],
                  ["Itemised service lines", "Describes what was delivered with quantities and rates", "✅ Always"],
                  ["Currency and totals", "Prevents currency confusion with international clients", "✅ Always"],
                  ["Payment instructions", "Bank account, PayPal, Wise, or other method details", "✅ Always"],
                  ["Tax number (VAT/GST)", "Required only if you are VAT/GST registered", "⚠️ If registered"],
                  ["Your logo", "Adds professionalism and brand recognition", "Optional"],
                  ["Notes / payment reference", "Useful for clients who need PO numbers or references", "Optional"],
                ].map(([field, why, req]) => (
                  <tr key={field} className="hover:bg-white/60">
                    <td className="px-4 py-2.5 font-medium text-stone-800">{field}</td>
                    <td className="px-4 py-2.5 text-stone-600">{why}</td>
                    <td className="px-4 py-2.5">{req}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">How to Number Your Freelance Invoices</h2>
          <p>
            Invoice numbers must be unique, sequential, and never reused. This is a tax and accounting requirement in almost every country, and it also makes it easy to reference invoices in client communications.
          </p>
          <p className="mt-3">Common invoice numbering formats:</p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              { format: "INV-001, INV-002, INV-003", label: "Simple Sequential", note: "Best for new freelancers with one client stream" },
              { format: "2026-001, 2026-002", label: "Year-Prefixed", note: "Resets each year; useful for annual tax filing" },
              { format: "FC-CLIENT-001", label: "Client-Specific", note: "Groups invoices per client; ideal for multiple long-term clients" },
              { format: "INV-20261126-001", label: "Date-Stamped", note: "Includes issue date; completely unique by definition" },
            ].map(({ format, label, note }) => (
              <div key={label} className="rounded-lg border border-stone-200 bg-white p-3.5">
                <p className="font-mono text-xs font-bold text-emerald-700">{format}</p>
                <p className="text-xs font-semibold text-stone-900 mt-1">{label}</p>
                <p className="text-[11px] text-stone-500 mt-0.5 leading-normal">{note}</p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-stone-500 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <strong className="text-amber-900">Important:</strong> Never delete or renumber an invoice, even if it was sent in error. Instead, issue a credit note against the original invoice and issue a new corrected one with a new number.
          </p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">Setting Payment Terms That Actually Get You Paid</h2>
          <p>
            Payment terms tell your client when they must pay. Vague terms like &quot;payment on delivery&quot; invite delays. Specific terms like &quot;Net 15&quot; or &quot;Due on Receipt&quot; are unambiguous.
          </p>

          <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50/70 p-4">
            <div className="grid gap-2 sm:grid-cols-2 text-xs">
              {[
                { term: "Due on Receipt", meaning: "Pay immediately upon receiving the invoice", best: "Small one-off tasks, new clients" },
                { term: "Net 7", meaning: "Pay within 7 calendar days", best: "Small agencies, fast-turnaround work" },
                { term: "Net 15", meaning: "Pay within 15 days — industry sweet spot", best: "Most freelancers, most project types" },
                { term: "Net 30", meaning: "Pay within 30 days", best: "Enterprise clients, large projects" },
                { term: "Net 60", meaning: "Pay within 60 days", best: "Government or large corporate clients only" },
                { term: "50% upfront, 50% on delivery", meaning: "Split payment schedule", best: "New client relationships, large projects" },
              ].map(({ term, meaning, best }) => (
                <div key={term} className="bg-white rounded-lg border border-stone-200 p-3">
                  <p className="font-semibold text-stone-900">{term}</p>
                  <p className="text-stone-600 mt-0.5 leading-normal">{meaning}</p>
                  <p className="text-stone-400 mt-1 text-[10px]">Best for: {best}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4">
            For international freelancers billing clients in the US, UK, or EU, <strong>Net 15</strong> is the most effective balance between professional flexibility and fast payment. Add a late fee clause (e.g. 1.5% per month) in your contract, and reference it on the invoice.
          </p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">Handling Partial Payments and Deposits</h2>
          <p>
            Many freelancers require a deposit before starting work — typically 25%–50% of the total project cost. When you receive a deposit, you should still issue a full invoice for the total amount, then show the deposit as a payment received, with the remaining balance clearly stated.
          </p>

          <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50/70 p-4 text-xs">
            <p className="font-semibold text-stone-900 mb-3">Example: $2,000 project with $500 deposit</p>
            <div className="space-y-1.5">
              <div className="flex justify-between py-1.5 border-b border-stone-200">
                <span className="text-stone-700">Web design — 20 hours @ $100/hr</span>
                <span className="font-medium text-stone-900">$2,000.00</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-200">
                <span className="text-stone-700">Invoice Total</span>
                <span className="font-medium text-stone-900">$2,000.00</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-200">
                <span className="text-stone-600">Deposit received (2026-11-01)</span>
                <span className="text-stone-600">$500.00</span>
              </div>
              <div className="flex justify-between py-2 bg-emerald-50 rounded-lg px-2">
                <span className="font-bold text-stone-900">Balance Due</span>
                <span className="font-bold text-emerald-800">$1,500.00</span>
              </div>
            </div>
          </div>

          <p className="mt-4">
            Our free invoice generator handles this automatically — enter the deposit amount in the &quot;Amount Paid&quot; field and the balance due updates instantly.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">Invoicing International Clients in USD, EUR, or GBP</h2>
          <p>
            When billing clients from a different country, always state the invoice currency explicitly. Write &quot;All amounts in USD&quot; in your invoice notes. Never assume both parties understand which dollar or which currency applies.
          </p>
          <p className="mt-3">
            Key considerations for international invoices:
          </p>
          <ul className="mt-3 space-y-2 pl-4">
            {[
              "State the currency code (USD, EUR, GBP) next to every amount — not just the symbol ($, €, £)",
              "Specify your preferred payment method: Wise, Payoneer, direct SWIFT/bank transfer, or PayPal",
              "Include your IBAN/routing number, SWIFT/BIC code, or digital wallet address in the payment instructions section",
              "If the client may pay in their local currency, state the conversion method (e.g. 'at the exchange rate on the payment date')",
              "For Pakistan-based freelancers: add your PSEB registration or NTN number for clients who require it for bookkeeping",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-stone-600">
                <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">Free Invoice Template: What You Get with FreelanceCalc</h2>
          <p>
            Rather than downloading a static Word or Excel template that you have to edit manually every time, our browser-based invoice generator auto-calculates all totals, handles partial payments, and exports a clean PDF — without uploading your data anywhere.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { icon: "📄", title: "Professional PDF export", desc: "Instant PDF download with no watermarks, no sign-up" },
              { icon: "🧮", title: "Auto-calculated totals", desc: "Tax %, discounts, and partial payments computed instantly" },
              { icon: "🔐", title: "100% private", desc: "All invoice data stays in your browser — never uploaded" },
              { icon: "💱", title: "Multi-currency support", desc: "Bill in USD, EUR, GBP, CAD, AUD, or PKR" },
              { icon: "🏢", title: "Your branding", desc: "Upload your logo; it embeds in the PDF" },
              { icon: "💾", title: "Auto-save drafts", desc: "Browser localStorage preserves your work between sessions" },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-3 rounded-lg border border-stone-200 bg-white p-3.5">
                <span className="text-lg shrink-0">{icon}</span>
                <div>
                  <p className="text-xs font-semibold text-stone-900">{title}</p>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-normal">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <p className="text-xs font-semibold text-emerald-900">
              Ready to create your first invoice?
            </p>
            <Link
              href="/invoice-generator/"
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              Open Free Invoice Generator →
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              {
                q: "What should I include on a freelance invoice?",
                a: "Your name, client name and address, unique invoice number, issue date, due date, itemised services with quantities and rates, currency, total amount, and payment instructions. Optionally add your logo, tax number, and notes.",
              },
              {
                q: "How do I number freelance invoices?",
                a: "Use a sequential system like INV-001 or INV-2026-001. Never reuse a number even if an invoice was cancelled. For cancelled invoices, issue a credit note against the original.",
              },
              {
                q: "What is a Net 30 payment term?",
                a: "Payment is due within 30 calendar days of the invoice issue date. Net 15 is better for freelancers who need faster cash flow. For new clients, consider requiring 50% upfront.",
              },
              {
                q: "Should I charge tax on freelance invoices?",
                a: "Only if you are VAT/GST registered in your jurisdiction. In Pakistan, IT freelancers exporting services may apply PSEB exemption. In the US, services are generally not subject to sales tax. Always consult a local accountant.",
              },
              {
                q: "Can I invoice in a foreign currency?",
                a: "Yes. State the currency code clearly (USD, EUR, GBP). Your payment provider (Wise, Payoneer) converts the received amount to your local currency when you withdraw.",
              },
              {
                q: "How do I record a partial payment?",
                a: "Show the full invoice total, then subtract the deposit amount paid, and display the remaining balance due. Our invoice generator does this automatically in the payment summary section.",
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
                href: "/invoice-generator/",
                label: "Free Invoice Generator →",
                desc: "Create and download professional PDF invoices in your browser.",
              },
              {
                href: "/time-card-calculator/",
                label: "Time Card Calculator →",
                desc: "Track work sessions and export a PDF timesheet to attach to your invoice.",
              },
              {
                href: "/upwork-fee-calculator/",
                label: "Upwork Fee Calculator →",
                desc: "Calculate your net take-home after Upwork platform fees.",
              },
              {
                href: "/guides/how-to-track-freelance-hours/",
                label: "How to Track Freelance Hours →",
                desc: "Best practices for logging work sessions and billing clients accurately.",
              },
            ].map(({ href, label, desc }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg border border-stone-200 bg-white p-3 hover:border-stone-400 hover:shadow-sm transition-all group"
              >
                <p className="text-xs font-semibold text-stone-900 group-hover:text-emerald-800">{label}</p>
                <p className="text-[11px] text-stone-500 mt-0.5">{desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
