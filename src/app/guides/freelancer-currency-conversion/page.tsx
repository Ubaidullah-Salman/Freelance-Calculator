import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.freelancecalc.app";

export const metadata: Metadata = {
  title: "Freelancer Currency Conversion Guide: USD to PKR, INR & More (2026)",
  description:
    "Why Google's exchange rate differs from what hits your bank account. A complete guide to currency conversion for freelancers on Upwork, Fiverr, and Payoneer — with real examples for Pakistan, India, and Bangladesh.",
  alternates: { canonical: `${SITE_URL}/guides/freelancer-currency-conversion` },
  openGraph: {
    title: "Freelancer Currency Conversion: Why You Get Less Than Google's Rate",
    description:
      "The real reason your USD earnings lose 3–7% in currency conversion — and what you can do about it as a freelancer.",
    url: `${SITE_URL}/guides/freelancer-currency-conversion`,
    type: "article",
  },
};

export default function CurrencyConversionGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-14">
      {/* Breadcrumb */}
      <nav className="mb-6 text-xs text-stone-500">
        <Link href="/" className="hover:text-stone-900">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/guides" className="hover:text-stone-900">Guides</Link>
        <span className="mx-2">›</span>
        <span className="text-stone-900">Freelancer Currency Conversion</span>
      </nav>

      <header className="mb-8 border-b border-stone-200/80 pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 mb-3">
          Money Guide for Freelancers
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Currency Conversion for Freelancers: Why You Always Get Less Than the Google Rate
        </h1>
        <p className="mt-3 text-base text-stone-600 leading-relaxed">
          You earned $500 on Upwork. Google says $1 = PKR 280. But when the money hits your Pakistani bank account, you received only PKR 133,000 instead of PKR 140,000. What happened? This guide explains the full picture — and what you can do to keep more of your money.
        </p>
      </header>

      <div className="prose prose-stone max-w-none space-y-8 text-sm leading-relaxed text-stone-700">

        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">The Three Rates You Need to Know</h2>
          <p>
            Most freelancers know about the <strong>mid-market rate</strong> — the rate shown on Google, XE.com, or any financial website. What many do not know is that this rate is essentially a theoretical benchmark. No bank or payment service will give you this rate.
          </p>
          <p className="mt-3">There are actually three different exchange rates that matter to you:</p>

          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-stone-200 bg-white p-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-100 text-stone-700 text-xs font-bold flex items-center justify-center">1</span>
                <div>
                  <p className="font-semibold text-stone-900 text-xs">Mid-Market Rate (Interbank Rate)</p>
                  <p className="mt-1 text-xs text-stone-600">The rate shown on Google, XE.com, Bloomberg. This is the rate banks use to trade with each other — not the rate you get as a retail customer. Think of it as the &apos;wholesale&apos; price of currency.</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center">2</span>
                <div>
                  <p className="font-semibold text-stone-900 text-xs">Platform Rate (Upwork / Fiverr / Payoneer)</p>
                  <p className="mt-1 text-xs text-stone-600">When your USD earnings are converted to local currency directly within a platform, they apply their own exchange rate, which includes a markup of typically 1–3% above the mid-market rate. This spread is their additional revenue from your transaction.</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center">3</span>
                <div>
                  <p className="font-semibold text-stone-900 text-xs">Bank Rate (Your Local Bank)</p>
                  <p className="mt-1 text-xs text-stone-600">When USD arrives in your local bank account as a wire transfer, your bank converts it at their own buying rate, which is typically 2–5% below the mid-market rate. Banks call this their &apos;spread&apos; — it is their profit on the conversion.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">Real Example: $500 on Upwork Reaching a Pakistani Bank</h2>
          <p>
            Let us trace exactly what happens to a $500 Upwork payment from the moment the client releases the milestone to when it arrives in a Pakistani bank account.
          </p>
          <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50/70 p-5 text-xs">
            <div className="space-y-3">
              {[
                { label: "Client releases milestone on Upwork", value: "$500.00", note: "", highlight: false },
                { label: "Upwork service fee deducted (10%)", value: "−$50.00", note: "", highlight: false },
                { label: "Net USD in Upwork balance", value: "$450.00", note: "", highlight: false },
                { label: "Withdrawal via wire to bank", value: "$450.00", note: "Flat fee: usually $0–$30 depending on method", highlight: false },
                { label: "Mid-market rate (PKR 280 / USD)", value: "= PKR 126,000", note: "Reference only — you will not get this", highlight: false },
                { label: "Bank buying rate (PKR 267 / USD, ~4.6% spread)", value: "= PKR 120,150", note: "", highlight: true },
                { label: "Bank's flat incoming wire fee", value: "−PKR 500–1,000", note: "Varies by bank", highlight: false },
                { label: "Approximate actual deposit", value: "~PKR 119,150–119,650", note: "", highlight: false },
              ].map((row, i) => (
                <div key={i} className={`flex justify-between items-start gap-4 py-2 border-b border-stone-100 last:border-0 ${row.highlight ? "bg-amber-50 -mx-2 px-2 rounded-md" : ""}`}>
                  <div>
                    <p className={`font-medium ${row.highlight ? "text-amber-900" : "text-stone-800"}`}>{row.label}</p>
                    {row.note && <p className="text-[10px] text-stone-500 mt-0.5">{row.note}</p>}
                  </div>
                  <p className={`font-bold whitespace-nowrap ${row.highlight ? "text-amber-700" : "text-stone-700"}`}>{row.value}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-3 text-xs text-stone-500">
            This is illustrative and uses approximate real-world figures. Actual bank rates vary by institution and date.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">Why Pakistani Freelancers Get a Lower Bank Rate</h2>
          <p>
            Pakistan&apos;s foreign exchange regulations mean that USD-to-PKR conversions are subject to State Bank of Pakistan oversight. The interbank rate published by SBP is the baseline, but individual commercial banks apply their own buying rates that can be 3–7% below the mid-market rate shown on financial websites.
          </p>
          <p className="mt-3">
            For freelancers earning consistent USD income, this conversion spread can add up to tens of thousands of rupees lost every month — not to fees, but simply to the rate differential.
          </p>
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-xs">
            <p className="font-semibold text-amber-900 mb-2">Monthly impact example (freelancer earning $2,000/month):</p>
            <ul className="space-y-1 text-amber-800">
              <li>At mid-market rate (PKR 280): PKR 560,000</li>
              <li>At typical bank buying rate (PKR 267): PKR 534,000</li>
              <li><strong>Monthly difference: ~PKR 26,000 (~$93)</strong></li>
              <li>Annualized: ~PKR 312,000 (~$1,114)</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">How to Get a Better Exchange Rate as a Freelancer</h2>
          <p>
            There are several strategies that professional freelancers use to reduce their currency conversion losses:
          </p>
          <div className="mt-4 space-y-3">
            {[
              {
                icon: "💳",
                title: "Use Payoneer or Wise to Hold USD",
                detail: "Instead of immediately converting to PKR, keep your earnings in USD in a Payoneer or Wise account. Convert only when the exchange rate is favorable or when you need local funds. Both platforms also offer better rates than local commercial banks.",
              },
              {
                icon: "🏦",
                title: "Compare Bank Buying Rates",
                detail: "Banks publish their daily buying rates online. Before initiating a wire transfer, check which bank is offering the best buying rate that day. The difference between the best and worst bank can be PKR 5–10 per dollar.",
              },
              {
                icon: "📊",
                title: "Convert in Larger Batches",
                detail: "Most banks and services charge a flat fee per conversion transaction. Converting once a month instead of weekly can save you in per-transaction fees, even if the rate stays the same.",
              },
              {
                icon: "🌐",
                title: "Accept Payment in Multiple Currencies",
                detail: "If you work with clients in the UK, EU, or Canada, consider invoicing them in GBP, EUR, or CAD respectively. Sometimes converting from a third currency (like EUR to PKR) offers a better effective rate than USD to PKR depending on current market conditions.",
              },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-stone-200 bg-white p-4">
                <div className="flex items-start gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-stone-900 text-xs">{item.title}</p>
                    <p className="mt-1 text-xs text-stone-600 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">Currency Conversion Across Freelancing Platforms</h2>
          <p>
            Different platforms handle currency conversion differently. Here is a quick comparison of the most common paths from USD earnings to local currency:
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50">
                  <th className="text-left px-3 py-2.5 font-semibold text-stone-800">Platform & Method</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-stone-800">Typical FX Spread</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-stone-800">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {[
                  ["Upwork → Direct to Bank Wire", "4–6% below mid-market", "Bank applies its own buying rate"],
                  ["Upwork → Payoneer USD Balance", "0% (stays in USD)", "Convert later at better timing"],
                  ["Fiverr → PayPal → Bank", "3–5% spread total", "PayPal + bank both take a cut"],
                  ["Payoneer → Local Bank", "2–3% below mid-market", "Better than most local banks"],
                  ["Wise (TransferWise) → Bank", "0.5–1.5% above mid-market", "Best rates available for most currencies"],
                ].map(([method, spread, note], i) => (
                  <tr key={i} className="hover:bg-stone-50/50">
                    <td className="px-3 py-2.5 font-medium text-stone-800">{method}</td>
                    <td className="px-3 py-2.5 text-stone-700">{spread}</td>
                    <td className="px-3 py-2.5 text-stone-500">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-stone-500">Spreads are approximate and vary with market conditions and individual bank policies.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">Pakistan FBR Freelancer Tax on Remittances</h2>
          <p>
            For Pakistani freelancers, there is one more deduction to factor in: <strong>FBR withholding tax under Section 154A</strong>. When foreign remittance payments are received for freelance work, banks are required to deduct tax at source.
          </p>
          <p className="mt-3">
            As of Tax Year 2027 (Finance Act 2026), the applicable rates are:
          </p>
          <ul className="mt-2 space-y-1 list-disc list-inside text-stone-600">
            <li><strong>1%</strong> for active tax filers registered in FBR</li>
            <li><strong>2%</strong> for non-filers or those not on the active taxpayer list</li>
          </ul>
          <p className="mt-3">
            This tax is deducted by your bank at the time of credit. Being an active tax filer halves your withholding tax burden, which on $2,000/month of earnings saves approximately PKR 5,000–6,000 per month at current rates.
          </p>
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
            <p className="text-xs font-semibold text-emerald-900">
              Use our Pakistan Freelancer Tax Calculator to instantly see your exact withholding tax deduction based on your earnings and filer status.
            </p>
            <Link
              href="/pakistan-freelancer-tax"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              Open Pakistan Tax Calculator →
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Why does my bank deposit amount not match my Upwork balance?",
                a: "Multiple deductions happen between your Upwork balance and your bank deposit: Upwork's platform fee (already deducted before balance), wire transfer fees, your bank's currency conversion spread, and any incoming wire processing fee. Each of these takes a small percentage.",
              },
              {
                q: "Is the exchange rate I see on Google reliable for planning?",
                a: "It is useful as a reference benchmark but never the rate you will actually receive. For financial planning, use a rate that is 4–6% below the current Google rate as your conservative estimate for what will land in a Pakistani bank account.",
              },
              {
                q: "Should I use Payoneer or Wise?",
                a: "Both are excellent for freelancers. Payoneer integrates directly with Upwork and Fiverr (free USD-to-Payoneer transfers). Wise typically offers the closest rates to mid-market and is excellent for final conversion to local currency. Many professional freelancers use both — Payoneer to receive, Wise to convert.",
              },
              {
                q: "Does Upwork's withdrawal method affect my exchange rate?",
                a: "Yes significantly. Withdrawing to a Payoneer USD account keeps your money in USD with no conversion. Withdrawing directly to a local bank means conversion happens at the bank's rate. Keeping USD in Payoneer and converting only when needed generally gives you better control over your effective rate.",
              },
            ].map((item, i) => (
              <div key={i} className="rounded-lg border border-stone-200 bg-white p-4">
                <p className="font-semibold text-stone-900 text-xs">{item.q}</p>
                <p className="mt-1.5 text-xs text-stone-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-stone-200 pt-6">
          <h2 className="text-base font-bold text-stone-900 mb-3">Related Calculators & Guides</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { href: "/usd-to-pkr-calculator", title: "Currency Converter →", desc: "Convert USD earnings to PKR, INR, PHP, EUR using your actual bank rate." },
              { href: "/pakistan-freelancer-tax", title: "Pakistan Tax Calculator →", desc: "Calculate Section 154A withholding tax on freelance remittances." },
              { href: "/guides/upwork-fees-explained", title: "Upwork Fees Guide →", desc: "Complete breakdown of Upwork's current 0%–15% fee structure." },
              { href: "/guides/fiverr-fees-explained", title: "Fiverr Fees Guide →", desc: "Everything about Fiverr's flat 20% seller commission." },
            ].map((link, i) => (
              <Link key={i} href={link.href} className="rounded-lg border border-stone-200 bg-white p-3 hover:border-stone-400 hover:shadow-sm transition-all group">
                <p className="text-xs font-semibold text-stone-900 group-hover:text-emerald-800">{link.title}</p>
                <p className="text-[11px] text-stone-500 mt-0.5">{link.desc}</p>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
