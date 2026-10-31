import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.freelancecalc.app";

export const metadata: Metadata = {
  title: "How Much Does Upwork Take? Complete Fee Guide 2026",
  description:
    "Detailed breakdown of Upwork's current 0%–15% service fee structure. Learn exactly how Upwork fees are calculated, which contract types pay 0%, and how to maximize your take-home pay.",
  alternates: { canonical: `${SITE_URL}/guides/upwork-fees-explained` },
  openGraph: {
    title: "How Much Does Upwork Take? Complete Fee Guide 2026",
    description:
      "Everything freelancers need to know about Upwork's current fee structure — from Direct Contracts at 0% to standard contracts at 10%.",
    url: `${SITE_URL}/guides/upwork-fees-explained`,
    type: "article",
  },
};

export default function UpworkFeesGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-14">
      {/* Breadcrumb */}
      <nav className="mb-6 text-xs text-stone-500">
        <Link href="/" className="hover:text-stone-900">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/guides" className="hover:text-stone-900">Guides</Link>
        <span className="mx-2">›</span>
        <span className="text-stone-900">Upwork Fees Explained</span>
      </nav>

      <header className="mb-8 border-b border-stone-200/80 pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 mb-3">
          Updated for 2026 Upwork Policy
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          How Much Does Upwork Take? The Complete Fee Guide for 2026
        </h1>
        <p className="mt-3 text-base text-stone-600 leading-relaxed">
          If you have ever wondered exactly how much Upwork deducts from your earnings before the money reaches your bank account, this guide gives you the complete, up-to-date answer — without the confusion.
        </p>
      </header>

      <div className="prose prose-stone max-w-none space-y-8 text-sm leading-relaxed text-stone-700">

        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">The Short Answer</h2>
          <p>
            Upwork currently charges freelancers a service fee between <strong>0% and 15%</strong> per contract. The most common rate for standard hourly and fixed-price contracts is <strong>10%</strong>. The exact percentage is shown to you when you submit a proposal or receive an offer, and it locks in permanently once the contract starts.
          </p>
          <p className="mt-3">
            This is different from Upwork&apos;s old model, where the platform used a sliding scale based on your lifetime earnings with each individual client. That legacy system (20% up to $500, then 10% up to $10,000, then 5% above that) is no longer the universal standard. The current per-contract model is simpler and more transparent.
          </p>
        </section>

        <section className="rounded-xl border border-stone-200 bg-stone-50/70 p-5">
          <h2 className="text-lg font-bold text-stone-900 mb-3">Upwork Fee Breakdown by Contract Type (2026)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-white">
                  <th className="text-left px-3 py-2.5 font-semibold text-stone-800">Contract Type</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-stone-800">Service Fee</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-stone-800">What You Keep</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr className="hover:bg-white/60">
                  <td className="px-3 py-2.5 font-medium text-stone-800">Direct Contracts (BYO Client)</td>
                  <td className="px-3 py-2.5 text-emerald-700 font-bold">0%</td>
                  <td className="px-3 py-2.5">100% of billed amount</td>
                </tr>
                <tr className="hover:bg-white/60">
                  <td className="px-3 py-2.5 font-medium text-stone-800">Standard Hourly & Fixed-Price</td>
                  <td className="px-3 py-2.5 font-bold text-stone-900">10% (most common)</td>
                  <td className="px-3 py-2.5">90% of billed amount</td>
                </tr>
                <tr className="hover:bg-white/60">
                  <td className="px-3 py-2.5 font-medium text-stone-800">Certain Enterprise / Specialized Contracts</td>
                  <td className="px-3 py-2.5 text-rose-700 font-bold">Up to 15%</td>
                  <td className="px-3 py-2.5">85% of billed amount</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-stone-500">
            Source: Upwork Help Center — Freelancer Service Fees (official documentation, 2026).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">What Changed from the Old Upwork Fee Model?</h2>
          <p>
            Many freelancers remember the old tiered model. It worked like this: for the first $500 you billed to a client, Upwork charged 20%. Once you crossed $500 with that same client, the rate dropped to 10%. After $10,000 with that same client, the rate fell to just 5%.
          </p>
          <p className="mt-3">
            This legacy system rewarded long-term client relationships but was confusing for newer freelancers who had to track their lifetime billing per client. The current model eliminates that complexity. Your fee rate is set at the proposal stage and does not change as your earnings grow.
          </p>
          <p className="mt-3">
            If you are on an older contract that started under the legacy model, your original rate may still apply for that specific contract. But all new contracts since the policy change operate under the current 0%–15% framework.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">How Upwork Fees Are Calculated in Practice</h2>
          <p>
            The math is straightforward once you know your rate. Upwork deducts the service fee from your gross billed amount — meaning the total charged to the client — before depositing your share into your Upwork account balance.
          </p>

          <div className="mt-4 rounded-xl border border-stone-200 bg-white p-4 text-xs">
            <p className="font-semibold text-stone-900 mb-2">Example 1 — Standard Fixed-Price Contract at 10%</p>
            <ul className="space-y-1 text-stone-600">
              <li>Client milestone: <strong>$800</strong></li>
              <li>Upwork service fee (10%): <strong>−$80</strong></li>
              <li>Your earnings credited: <strong>$720</strong></li>
            </ul>
          </div>

          <div className="mt-3 rounded-xl border border-stone-200 bg-white p-4 text-xs">
            <p className="font-semibold text-stone-900 mb-2">Example 2 — Direct Contract (BYO) at 0%</p>
            <ul className="space-y-1 text-stone-600">
              <li>Client invoice: <strong>$1,200</strong></li>
              <li>Upwork service fee (0%): <strong>−$0</strong></li>
              <li>Your earnings credited: <strong>$1,200</strong></li>
            </ul>
          </div>

          <div className="mt-3 rounded-xl border border-stone-200 bg-white p-4 text-xs">
            <p className="font-semibold text-stone-900 mb-2">Example 3 — Project with $200 Bonus at 10%</p>
            <ul className="space-y-1 text-stone-600">
              <li>Base project: <strong>$500</strong></li>
              <li>Client bonus: <strong>+$200</strong></li>
              <li>Total gross billed: <strong>$700</strong></li>
              <li>Upwork service fee (10% on total): <strong>−$70</strong></li>
              <li>Your net earnings: <strong>$630</strong></li>
            </ul>
            <p className="mt-2 text-stone-500">Note: Bonuses are subject to the same contract fee rate as the base amount.</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">Does Upwork Fee Apply to Bonuses and Extra Payments?</h2>
          <p>
            Yes. Any additional payment or discretionary bonus your client sends through the Upwork platform is treated as earnings on that contract and is subject to the same locked fee percentage. If your contract rate is 10%, then a $500 bonus will also incur a 10% deduction, leaving you with $450 from that bonus.
          </p>
          <p className="mt-3">
            This is an important detail many freelancers overlook when negotiating bonuses. Always factor in the platform fee when calculating your target payout from any bonus arrangement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">How to Reduce Your Upwork Service Fee</h2>
          <p>There are two primary strategies to legally reduce the fee you pay Upwork:</p>
          <ol className="mt-3 space-y-3 list-decimal list-inside text-stone-700">
            <li>
              <strong>Use Direct Contracts (Bring Your Own Client):</strong> If you already know a client or have been working with someone outside Upwork, you can invite them to pay you through an Upwork Direct Contract at a 0% service fee. This is by far the most effective way to keep your full invoice amount.
            </li>
            <li>
              <strong>Negotiate your rate at proposal stage:</strong> The fee is set at the time a proposal is reviewed. Certain clients — particularly Upwork Enterprise clients — may have different fee arrangements. Always read the fee disclosure shown on your proposal confirmation screen.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">Upwork Fees vs. Your Local Currency Take-Home</h2>
          <p>
            Your net earnings in USD are credited to your Upwork account balance after the service fee. However, the final amount that reaches your local bank account depends on additional factors: the withdrawal method you choose, the foreign exchange spread applied by Upwork or your bank, and any flat withdrawal fees.
          </p>
          <p className="mt-3">
            For freelancers in Pakistan, India, Bangladesh, Nigeria, and other countries receiving USD payments, the real-world take-home is often 3%–6% lower than the net USD figure shown in your Upwork balance, due to currency conversion spreads and withdrawal fees.
          </p>
          <div className="mt-4 p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
            <p className="text-xs font-semibold text-emerald-900">
              Use our free Upwork Fee Calculator to instantly see your exact take-home pay — including optional bonus deductions and local currency conversion at your bank&apos;s specific exchange rate.
            </p>
            <Link
              href="/upwork-fee-calculator"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              Open Upwork Fee Calculator →
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">Frequently Asked Questions About Upwork Fees</h2>
          <div className="space-y-4">
            {[
              {
                q: "Can my Upwork fee change after a contract starts?",
                a: "No. Once a contract is active, the service fee rate is locked for that specific contract. It cannot be changed by either you or the client after the contract has started.",
              },
              {
                q: "Is the Upwork service fee charged to me or to the client?",
                a: "The service fee is charged to the freelancer and is deducted from your earnings. The client pays a separate Upwork service fee on their side, which does not affect your payout.",
              },
              {
                q: "What happens to the fee rate if I earn more on a contract?",
                a: "Under the current model, earning more on a contract does not change your fee rate. The rate set at the start applies to all earnings on that contract regardless of the total billed amount.",
              },
              {
                q: "Does Upwork charge fees on hourly contracts differently?",
                a: "No. The same service fee percentage applies to both hourly and fixed-price contract types. The only difference is that hourly billing is based on tracked hours approved through Upwork's weekly billing cycle.",
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
            <Link href="/fiverr-fee-calculator" className="rounded-lg border border-stone-200 bg-white p-3 hover:border-stone-400 hover:shadow-sm transition-all group">
              <p className="text-xs font-semibold text-stone-900 group-hover:text-emerald-800">Fiverr Fee Calculator →</p>
              <p className="text-[11px] text-stone-500 mt-0.5">Calculate what you keep after Fiverr&apos;s 20% seller commission.</p>
            </Link>
            <Link href="/usd-to-pkr-calculator" className="rounded-lg border border-stone-200 bg-white p-3 hover:border-stone-400 hover:shadow-sm transition-all group">
              <p className="text-xs font-semibold text-stone-900 group-hover:text-emerald-800">Currency Converter →</p>
              <p className="text-[11px] text-stone-500 mt-0.5">Convert your USD Upwork earnings to local currency at your real bank rate.</p>
            </Link>
            <Link href="/guides/fiverr-fees-explained" className="rounded-lg border border-stone-200 bg-white p-3 hover:border-stone-400 hover:shadow-sm transition-all group">
              <p className="text-xs font-semibold text-stone-900 group-hover:text-emerald-800">Fiverr Fees Explained →</p>
              <p className="text-[11px] text-stone-500 mt-0.5">Complete guide to Fiverr&apos;s 20% seller commission, extras, and tips.</p>
            </Link>
            <Link href="/guides/freelancer-currency-conversion" className="rounded-lg border border-stone-200 bg-white p-3 hover:border-stone-400 hover:shadow-sm transition-all group">
              <p className="text-xs font-semibold text-stone-900 group-hover:text-emerald-800">Currency Conversion for Freelancers →</p>
              <p className="text-[11px] text-stone-500 mt-0.5">Why your bank rate matters more than Google&apos;s exchange rate.</p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
