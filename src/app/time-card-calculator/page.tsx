"use client";

import dynamic from "next/dynamic";
import { AdSlotLeaderboard } from "@/components/ads/AdSlot";
import WebApplicationSchema from "@/components/seo/WebApplicationSchema";
import { FeatureCard } from "@/components/time-card/FeatureCard";


const TimeCardProvider = dynamic(
  () => import("@/components/time-card/TimeCardPageClient").then((m) => m.TimeCardProviderWrapper),
  { ssr: false }
);

const TimeCardEditorWrapper = dynamic(
  () => import("@/components/time-card/TimeCardPageClient").then((m) => m.TimeCardEditorWrapper),
  { ssr: false }
);

const TimeCardPreviewWrapper = dynamic(
  () => import("@/components/time-card/TimeCardPageClient").then((m) => m.TimeCardPreviewWrapper),
  { ssr: false }
);

export default function TimeCardCalculatorPage() {
  const faqs = [
    {
      q: "Is this time card calculator really free?",
      a: "Yes, completely free with no sign-up required. All timesheet data stays in your browser — nothing is uploaded to servers. Export your timesheet as PDF or CSV anytime.",
    },
    {
      q: "Can I save my timesheet and come back later?",
      a: "Yes, timesheets auto-save to your browser's local storage every time you make a change. However, clearing browser data will remove saved drafts, so export a JSON backup for important timesheets.",
    },
    {
      q: "What currencies are supported?",
      a: "USD (US Dollar), EUR (Euro), GBP (British Pound), CAD (Canadian Dollar), AUD (Australian Dollar), and PKR (Pakistani Rupee). More currencies can be added on request.",
    },
    {
      q: "How are unpaid lunch breaks handled?",
      a: "You enter unpaid breaks in minutes per session. The calculator automatically subtracts this from your total elapsed time to give you accurate worked hours.",
    },
    {
      q: "Can I enter more than one work session per day?",
      a: "Yes, you can add multiple work sessions for each day. The calculator will sum up all worked hours for that day.",
    },
    {
      q: "Can I calculate overnight shifts?",
      a: "Yes, use the 'Ends next day' checkbox for sessions that span across midnight. This ensures accurate calculation of hours.",
    },
    {
      q: "How do weekly and biweekly periods work?",
      a: "You can choose between weekly (7 days) or biweekly (14 days) time periods. The calculator will sum hours and pay for the selected period.",
    },
    {
      q: "How is overtime estimated?",
      a: "Overtime is optional. You can set daily or weekly thresholds and a custom multiplier (e.g., 1.5x for time and a half). These are estimates and not legal advice.",
    },
    {
      q: "What happens with partial overtime weeks?",
      a: "Overtime calculations only include entered dates within the selected period. If your period is a partial week for overtime calculation, it will only account for the hours entered.",
    },
    {
      q: "Are timesheets uploaded?",
      a: "No, all timesheet data is processed and stored only in your browser. Nothing is sent to servers or third parties.",
    },
    {
      q: "Where are drafts saved?",
      a: "Drafts are saved automatically to your browser's local storage. This allows you to close and reopen the page without losing your work. Remember to export backups for critical data.",
    },
    {
      q: "Can I download PDF and CSV reports?",
      a: "Yes, you can download professional PDF timesheets and CSV files for easy integration with spreadsheets. Both options allow you to include or exclude pay details.",
    },
    {
      q: "Does this calculate take-home pay after tax?",
      a: "No, this calculator provides an estimated gross pay before any taxes, deductions, or withholdings. It does not account for specific tax jurisdictions or personal financial situations.",
    },
    {
      q: "Does it account for daylight-saving changes?",
      a: "No, the calculator uses manually entered local clock times and does not perform automatic timezone conversions or daylight-saving adjustments. Please ensure your entries reflect the actual clock times worked.",
    },
    {
      q: "Can I turn my timesheet into a client invoice?",
      a: "Yes, after calculating your timesheet, you can generate an invoice by clicking the 'Create Client Invoice' button (if available). This will transfer relevant details to our Invoice Generator tool, where you can finalize and download your invoice.",
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <WebApplicationSchema
        name="FreelanceCalc Time Card Calculator"
        description="Free time card calculator for freelancers and hourly workers. Calculate work hours, breaks, overtime, and estimated pay. Download timesheet as PDF or CSV."
      />

      {/* Header */}
      <section className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          <span>100% Free • No Sign-Up • Private</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Free Time Card Calculator
        </h1>
        <p className="mt-2.5 max-w-3xl text-base text-stone-600 sm:text-lg leading-relaxed">
          Calculate weekly work hours, unpaid breaks, overtime, and estimated pay. Download a timesheet PDF or CSV—no signup required.
        </p>
      </section>

      {/* Editor + Preview Grid */}
      <TimeCardProvider>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div>
            <TimeCardEditorWrapper />
          </div>
          <div className="lg:sticky lg:top-6 lg:self-start">
            <TimeCardPreviewWrapper />
          </div>
        </div>
      </TimeCardProvider>

      {/* Features Section */}
      <section className="mb-12" aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-sm font-semibold uppercase tracking-wider text-stone-600 mb-4">
          Key Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            title="Private & Secure"
            desc="All timesheet data stored only in your browser. No uploads, no servers, no tracking."
          />
          <FeatureCard
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            }
            title="Export to PDF & CSV"
            desc="Download professional PDF timesheets or flexible CSV files for any payroll system."
          />
          <FeatureCard
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="Auto-Save Drafts"
            desc="Changes save automatically every few seconds. Never lose work accidentally."
          />
          <FeatureCard
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="Multi-Currency Pay"
            desc="Supports USD, EUR, GBP, CAD, AUD, and PKR for estimated pay calculations."
          />
          <FeatureCard
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
            title="Overtime & Breaks"
            desc="Calculate unpaid breaks, and optional daily or weekly overtime with custom multipliers."
          />
          <FeatureCard
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 1.657-1.343 3-3 3s-3-1.343-3-3V7m9 4c0 1.657-1.343 3-3 3s-3-1.343-3-3V7m0 0a3 3 0 016 0V7m-3 0V4m-9 8a9 9 0 1118 0V7A3 3 0 009 7h1.5" />
              </svg>
            }
            title="Multiple Sessions"
            desc="Enter multiple work sessions per day, including overnight shifts. Handles overlaps."
          />
        </div>
      </section>

      {/* How to Use Section */}
      <section className="mb-12" aria-labelledby="how-to-use-heading">
        <h2 id="how-to-use-heading" className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-3">
          <span>📅</span> How to Use the Time Card Calculator
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-3 mb-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">1</span>
              <h3 className="font-semibold text-stone-900 text-sm">Set Up Project</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">Enter client details and select your pay period start date.</p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-3 mb-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">2</span>
              <h3 className="font-semibold text-stone-900 text-sm">Add Work Sessions</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">Input start/end times, break duration (mins), and check overnight if shift crosses midnight.</p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-3 mb-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">3</span>
              <h3 className="font-semibold text-stone-900 text-sm">Configure Pay & Overtime</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">Set hourly rate, currency, and custom daily overtime threshold & multiplier.</p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-3 mb-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">4</span>
              <h3 className="font-semibold text-stone-900 text-sm">Review Live Totals</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">See instant live calculations for total worked hours, overtime, and estimated gross pay.</p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">5</span>
              <h3 className="font-semibold text-stone-900 text-sm">Export Timesheet</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">Download your timesheet in PDF format for clients, CSV for Excel/spreadsheets, or JSON for local backups.</p>
          </div>
        </div>
      </section>

      {/* Worked Example Section */}
      <section className="mb-12" aria-labelledby="worked-example-heading">
        <h2 id="worked-example-heading" className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-3">
          <span>💡</span> Worked Example
        </h2>
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Scenario</span>
              <p className="text-sm font-medium text-stone-900 mt-0.5">9:00 AM → 5:30 PM shift with 30-minute unpaid lunch. Hourly rate: <strong className="text-emerald-700">$25.00/hr</strong></p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1 text-center">
            <div className="bg-stone-50 rounded-lg p-3 border border-stone-100">
              <span className="block text-[11px] font-medium text-stone-500 uppercase">Elapsed Time</span>
              <span className="text-base font-bold font-mono text-stone-800">8h 30m</span>
            </div>
            <div className="bg-stone-50 rounded-lg p-3 border border-stone-100">
              <span className="block text-[11px] font-medium text-stone-500 uppercase">Unpaid Break</span>
              <span className="text-base font-bold font-mono text-stone-800">- 30m</span>
            </div>
            <div className="bg-stone-50 rounded-lg p-3 border border-stone-100">
              <span className="block text-[11px] font-medium text-stone-500 uppercase">Worked Hours</span>
              <span className="text-base font-bold font-mono text-stone-800">8.00 hrs</span>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
              <span className="block text-[11px] font-medium text-emerald-700 uppercase">Gross Pay</span>
              <span className="text-base font-bold text-emerald-900">$200.00</span>
            </div>
          </div>

          <p className="text-xs text-stone-500 leading-relaxed pt-2">
            This demonstrates a basic daily calculation. Overtime rules, multiple sessions per day, and overnight shifts adjust your final summary automatically.
          </p>
        </div>
      </section>

      {/* Decimal Hours Explained */}
      <section className="mb-12" aria-labelledby="decimal-hours-heading">
        <h2 id="decimal-hours-heading" className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-3">
          <span>⏱️</span> Decimal Hours Made Simple
        </h2>
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
          <p className="text-sm text-stone-600 leading-relaxed">
            Payroll systems calculate pay using decimal hours rather than minutes (e.g., 30 minutes is 0.50 hours, not 0.30). Here is a quick reference table:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-lg border border-stone-200 bg-stone-50">
              <span className="block text-xs text-stone-500">7h 00m</span>
              <span className="text-lg font-bold font-mono text-stone-900 mt-1 block">= 7.00 hrs</span>
            </div>
            <div className="p-3 rounded-lg border border-stone-200 bg-stone-50">
              <span className="block text-xs text-stone-500">7h 15m</span>
              <span className="text-lg font-bold font-mono text-stone-900 mt-1 block">= 7.25 hrs</span>
            </div>
            <div className="p-3 rounded-lg border border-stone-200 bg-stone-50">
              <span className="block text-xs text-stone-500">7h 30m</span>
              <span className="text-lg font-bold font-mono text-stone-900 mt-1 block">= 7.50 hrs</span>
            </div>
            <div className="p-3 rounded-lg border border-stone-200 bg-stone-50">
              <span className="block text-xs text-stone-500">7h 45m</span>
              <span className="text-lg font-bold font-mono text-stone-900 mt-1 block">= 7.75 hrs</span>
            </div>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed pt-1">
            💡 <strong>Calculator Tip:</strong> You can enter exact start/end times directly—our calculator automatically performs all decimal conversions accurately.
          </p>
        </div>
      </section>

      {/* Overnight Shifts */}
      <section className="mb-12" aria-labelledby="overnight-shifts-heading">
        <h2 id="overnight-shifts-heading" className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-3">
          <span>🌙</span> Handling Overnight Shifts
        </h2>
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-xs">
          <p className="text-sm text-stone-600 leading-relaxed mb-4">
            For work sessions that start on one day and end the following morning (e.g. 10:00 PM to 6:00 AM):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">Instructions</h3>
              <ol className="list-decimal list-inside text-xs text-stone-600 space-y-1 leading-relaxed">
                <li>Select the <strong>start date</strong> of the shift.</li>
                <li>Enter start time and end time.</li>
                <li>Check the <strong>"Ends next day"</strong> box.</li>
              </ol>
            </div>
            <div className="p-4 rounded-lg bg-indigo-50/50 border border-indigo-100 space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-900">Example Session</h3>
              <ul className="text-xs text-indigo-800 space-y-1 font-mono">
                <li>• Start: 10:00 PM (Tuesday)</li>
                <li>• End: 06:00 AM (Wednesday)</li>
                <li>• Checkbox: [✓] Ends next day</li>
                <li>• Total Duration: 8h 00m worked</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Overtime Limitations */}
      <section className="mb-12" aria-labelledby="overtime-limitations-heading">
        <h2 id="overtime-limitations-heading" className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-3">
          <span>⚠️</span> Overtime Estimates: Important Notes
        </h2>
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
          <p className="text-sm text-stone-600 leading-relaxed">
            Our calculator provides estimated overtime based on your inputs. Please keep these guidelines in mind:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
              <h3 className="font-semibold text-stone-900 text-xs uppercase tracking-wider mb-1">1. Custom Thresholds</h3>
              <p className="text-xs text-stone-600 leading-relaxed">Set threshold hours (e.g. 8h/day) and multiplier (e.g. 1.5x) to match your specific contract terms.</p>
            </div>
            <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
              <h3 className="font-semibold text-stone-900 text-xs uppercase tracking-wider mb-1">2. Break Deductions</h3>
              <p className="text-xs text-stone-600 leading-relaxed">Unpaid breaks are deducted from total worked hours before overtime threshold checks are applied.</p>
            </div>
            <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
              <h3 className="font-semibold text-stone-900 text-xs uppercase tracking-wider mb-1">3. Period-Specific</h3>
              <p className="text-xs text-stone-600 leading-relaxed">Calculations only apply to recorded dates in your active session list.</p>
            </div>
            <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
              <h3 className="font-semibold text-stone-900 text-xs uppercase tracking-wider mb-1">4. Estimation Only</h3>
              <p className="text-xs text-stone-600 leading-relaxed">This tool provides gross pay estimates. Always check official local payroll laws for tax & legal compliance.</p>
            </div>
          </div>
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
        <div className="text-center text-xs text-stone-400 mb-1">Advertisement</div>
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
              Timesheet drafts are stored in this browser's local storage. Anyone using this device can access saved timesheets. Clear your timesheet when finished on shared computers, or export a JSON backup for safekeeping.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}