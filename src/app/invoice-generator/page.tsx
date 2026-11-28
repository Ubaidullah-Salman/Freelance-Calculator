"use client";

import dynamic from "next/dynamic";
import { AdSlotLeaderboard } from "@/components/ads/AdSlot";
import WebApplicationSchema from "@/components/seo/WebApplicationSchema";
import RelatedLinks from "@/components/ui/RelatedLinks";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.freelancecalc.app";

const InvoiceProvider = dynamic(
  () => import("@/components/invoice/InvoicePageClient").then((m) => m.InvoiceProvider),
  { ssr: false }
);

const InvoiceEditorWrapper = dynamic(
  () => import("@/components/invoice/InvoicePageClient").then((m) => m.InvoiceEditorWrapper),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[560px] rounded-xl border border-stone-200 bg-white p-6 animate-pulse" aria-hidden="true" />
    ),
  }
);

const InvoicePreviewWrapper = dynamic(
  () => import("@/components/invoice/InvoicePageClient").then((m) => m.InvoicePreviewWrapper),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[560px] rounded-xl border border-stone-200 bg-white p-6 animate-pulse" aria-hidden="true" />
    ),
  }
);

export default function InvoiceGeneratorPage() {
  const faqs = [
    {
      q: "Is this invoice generator really free?",
      a: "Yes, completely free with no sign-up required. All invoice data stays in your browser — nothing is uploaded to servers. Export your invoices as PDF or JSON backup anytime.",
    },
    {
      q: "Can I save my invoice and come back later?",
      a: "Yes, invoices auto-save to your browser's local storage every time you make a change. However, clearing browser data will remove saved drafts, so export a JSON backup for important invoices.",
    },
    {
      q: "What currencies are supported?",
      a: "USD (US Dollar), EUR (Euro), GBP (British Pound), CAD (Canadian Dollar), AUD (Australian Dollar), and PKR (Pakistani Rupee). More currencies can be added on request.",
    },
    {
      q: "Can I add my logo to invoices?",
      a: "Yes, upload a PNG or JPEG logo (max 2MB) in the Your Details section. Your logo appears at the top of the invoice and in the PDF download.",
    },
    {
      q: "How do I handle partial payments?",
      a: "Click '+ Record partial payment' in the totals section to enter an amount already paid. The balance due updates automatically and shows on the invoice.",
    },
    {
      q: "Can I add discount and tax?",
      a: "Yes, expand the 'Discount, Tax & Totals' section to enter discount percentage (0-100%) and tax percentage (0-100%). Tax is calculated on the discounted subtotal.",
    },
    {
      q: "Is my invoice data private?",
      a: "Yes, all invoice data is stored only in your browser's local storage. Nothing is sent to servers or third parties. On shared devices, clear your invoice when finished.",
    },
    {
      q: "What paper sizes are supported?",
      a: "A4 (international standard) and US Letter. Select your preferred size from the dropdown before downloading the PDF.",
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <WebApplicationSchema
        name="FreelanceCalc Invoice Generator"
        description="Free professional invoice generator for freelancers. Create PDF invoices with customizable branding, line items, discount, tax, and partial payments."
      />

      {/* Header */}
      <section className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          <span>100% Free • No Sign-Up • Private</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Invoice Generator
        </h1>
        <p className="mt-2.5 max-w-3xl text-base text-stone-600 sm:text-lg leading-relaxed">
          Create professional PDF invoices in minutes. Customize your branding, add line items with decimal quantities, apply discounts and taxes, and download print-ready invoices. All data stays in your browser.
        </p>
      </section>

      {/* Editor + Preview Grid */}
      <InvoiceProvider>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div>
            <InvoiceEditorWrapper />
          </div>
          <div className="lg:sticky lg:top-6 lg:self-start">
            <InvoicePreviewWrapper />
          </div>
        </div>
      </InvoiceProvider>

      {/* Features Section */}
      <section className="mb-12" aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-sm font-semibold uppercase tracking-wider text-stone-600 mb-4">
          Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            title="Private by Design"
            desc="All invoice data stored only in your browser. No uploads, no servers, no tracking."
          />
          <FeatureCard
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            }
            title="Export & Backup"
            desc="Download PDFs ready to send, or export JSON backups to restore later."
          />
          <FeatureCard
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="Auto-Save Drafts"
            desc="Changes save automatically every 500ms. Never lose work accidentally."
          />
          <FeatureCard
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
              </svg>
            }
            title="Custom Branding"
            desc="Add your logo, business details, and payment instructions."
          />
          <FeatureCard
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="6 Currencies"
            desc="USD, EUR, GBP, CAD, AUD, and PKR with proper decimal formatting."
          />
          <FeatureCard
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
            title="Decimal Quantities"
            desc="Bill partial hours or units with decimal quantity support (e.g., 2.5 hrs)."
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-12" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-sm font-semibold uppercase tracking-wider text-stone-600 mb-4">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <details key={idx} className="group rounded-lg border border-stone-200 bg-white p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-stone-900">
                {faq.q}
                <svg className="h-4 w-4 text-stone-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </summary>
              <p className="mt-3 text-sm text-stone-700 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* AdSense Leaderboard */}
      <section className="mb-8" aria-label="Advertisement">
        <div className="text-center text-xs text-stone-500 mb-1">Advertisement</div>
        <AdSlotLeaderboard slotName="1234567890" />
      </section>

      {/* Privacy Notice */}
      <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 className="text-sm font-semibold text-amber-800">Shared Device Warning</h3>
            <p className="mt-1 text-xs text-amber-700 leading-relaxed">
              Invoice drafts are stored in this browser&apos;s local storage. Anyone using this device can access saved invoices. Clear your invoice when finished on shared computers, or export a JSON backup for safekeeping.
            </p>
          </div>
        </div>
      </section>

      <RelatedLinks
        title="Related Guides & Tools"
        links={[
          {
            href: "/guides/freelance-invoice-template/",
            label: "Freelance Invoice Template Guide",
            description: "What to include, invoice numbering, and payment terms.",
          },
          {
            href: "/time-card-calculator/",
            label: "Time Card Calculator",
            description: "Track billable hours and export PDF/CSV timesheets.",
          },
          {
            href: "/upwork-fee-calculator/",
            label: "Upwork Fee Calculator",
            description: "Calculate exact take-home pay after platform fees.",
          },
        ]}
      />
    </main>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-emerald-700">{icon}</span>
        <h3 className="text-sm font-semibold text-stone-900">{title}</h3>
      </div>
      <p className="text-xs text-stone-600 leading-relaxed">{desc}</p>
    </div>
  );
}