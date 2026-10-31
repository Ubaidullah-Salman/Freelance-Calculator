import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.freelancecalc.app";

export const metadata: Metadata = {
  title: "Fiverr Fees Explained: What Does Fiverr Take in 2026?",
  description:
    "Complete breakdown of Fiverr's 20% seller commission — on base orders, extras, tips, and custom offers. Learn what you actually keep and how to calculate your real take-home pay on Fiverr.",
  alternates: { canonical: `${SITE_URL}/guides/fiverr-fees-explained` },
  openGraph: {
    title: "Fiverr Fees Explained: What Does Fiverr Take in 2026?",
    description:
      "Fiverr charges sellers a flat 20% on everything they earn — gigs, extras, and tips. Here is exactly how that works and how to plan your pricing.",
    url: `${SITE_URL}/guides/fiverr-fees-explained`,
    type: "article",
  },
};

export default function FiverrFeesGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-14">
      {/* Breadcrumb */}
      <nav className="mb-6 text-xs text-stone-500">
        <Link href="/" className="hover:text-stone-900">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/guides" className="hover:text-stone-900">Guides</Link>
        <span className="mx-2">›</span>
        <span className="text-stone-900">Fiverr Fees Explained</span>
      </nav>

      <header className="mb-8 border-b border-stone-200/80 pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800 mb-3">
          Fiverr Policy 2026
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Fiverr Fees Explained: Exactly What Fiverr Takes From Your Earnings
        </h1>
        <p className="mt-3 text-base text-stone-600 leading-relaxed">
          Fiverr is one of the most popular freelancing platforms in the world, but its fee policy catches many sellers off guard. Here is a complete, plain-language breakdown of how Fiverr fees work in 2026 — and how to calculate your actual take-home income.
        </p>
      </header>

      <div className="prose prose-stone max-w-none space-y-8 text-sm leading-relaxed text-stone-700">

        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">Fiverr&apos;s Core Fee: A Flat 20% on Everything</h2>
          <p>
            Unlike Upwork, which applies variable rates between 0% and 15%, Fiverr has a simple, consistent policy: <strong>Fiverr takes 20% of every dollar you earn on the platform</strong>. This applies without exception to:
          </p>
          <ul className="mt-3 space-y-1.5 list-disc list-inside text-stone-600">
            <li>Your base Gig price</li>
            <li>Gig extras and package upgrades</li>
            <li>Custom offers you send to buyers</li>
            <li>Tips and gratuities left by satisfied clients</li>
            <li>Repeat orders from existing buyers</li>
          </ul>
          <p className="mt-3">
            There is no volume discount, no loyalty tier, and no way to reduce this percentage through tenure on the platform. Whether you are a new Level 0 seller or a Top Rated seller with thousands of completed orders, the 20% fee applies equally.
          </p>
        </section>

        <section className="rounded-xl border border-stone-200 bg-stone-50/70 p-5">
          <h2 className="text-lg font-bold text-stone-900 mb-3">Fiverr Seller Fee at a Glance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-white">
                  <th className="text-left px-3 py-2.5 font-semibold text-stone-800">Earning Type</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-stone-800">Fiverr Fee</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-stone-800">You Receive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {[
                  ["Base Gig Order ($100)", "20% → −$20", "$80"],
                  ["Gig Extra ($50)", "20% → −$10", "$40"],
                  ["Custom Offer ($500)", "20% → −$100", "$400"],
                  ["Tip ($20)", "20% → −$4", "$16"],
                ].map(([type, fee, keep], i) => (
                  <tr key={i} className="hover:bg-white/60">
                    <td className="px-3 py-2.5 font-medium text-stone-800">{type}</td>
                    <td className="px-3 py-2.5 text-rose-600 font-bold">{fee}</td>
                    <td className="px-3 py-2.5 text-emerald-700 font-bold">{keep}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">How Fiverr Fees Are Calculated — Step by Step</h2>
          <p>
            The calculation is always the same: multiply your gross order value by 0.80 (or equivalently, subtract 20%) to get what Fiverr credits to your seller balance.
          </p>

          <div className="mt-4 space-y-3">
            {[
              {
                title: "Example 1 — Basic Gig Order",
                items: ["Buyer pays: $50", "Fiverr fee (20%): −$10", "Your seller balance credited: $40"],
              },
              {
                title: "Example 2 — Gig with Extras",
                items: ["Base gig: $100", "Extra services added: +$75", "Total order value: $175", "Fiverr fee (20%): −$35", "Your seller balance: $140"],
              },
              {
                title: "Example 3 — Custom Order plus Tip",
                items: ["Custom offer: $300", "Tip from buyer: $50", "Total collected: $350", "Fiverr fee (20% on $350): −$70", "Your seller balance: $280"],
              },
            ].map((ex, i) => (
              <div key={i} className="rounded-xl border border-stone-200 bg-white p-4 text-xs">
                <p className="font-semibold text-stone-900 mb-2">{ex.title}</p>
                <ul className="space-y-1 text-stone-600">
                  {ex.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">What Is Fiverr&apos;s Revenue Clearance Period?</h2>
          <p>
            Fiverr does not release your earnings immediately after an order is marked complete. There is a mandatory <strong>14-day clearance period</strong> for most sellers (7 days for Top Rated Sellers) during which the funds sit in your pending balance and cannot be withdrawn.
          </p>
          <p className="mt-3">
            This is a buyer protection measure. If a buyer raises a dispute or requests a refund within that window, Fiverr can return the funds without the money having left the platform. Once the clearance period passes, the funds move to your available balance and can be withdrawn.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">Pricing Your Fiverr Gigs to Hit Your Target Income</h2>
          <p>
            Because Fiverr always takes 20%, you need to price your gigs higher than your actual target income to compensate. Use this simple formula:
          </p>
          <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50/70 p-4 text-sm font-mono">
            <p className="text-stone-800">Gig Price = Target Income ÷ 0.80</p>
            <p className="mt-2 text-xs text-stone-500 font-sans">Example: To take home $400, set your gig price at $400 ÷ 0.80 = <strong>$500</strong></p>
          </div>
          <p className="mt-4">
            This reverse-calculation approach ensures your pricing already accounts for the platform fee before you quote any buyer. It is especially important for custom offers where you negotiate a price directly with the client.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">Does Fiverr Charge Buyers a Fee Too?</h2>
          <p>
            Yes. Buyers pay a separate service fee on top of your listed gig price. As of 2026, Fiverr charges buyers:
          </p>
          <ul className="mt-3 space-y-1.5 list-disc list-inside text-stone-600">
            <li><strong>5.5%</strong> of the order price for orders above $50</li>
            <li>A flat <strong>$2.50</strong> on orders of $50 or less</li>
          </ul>
          <p className="mt-3">
            This means your $100 gig might cost the buyer $105.50, while you only receive $80. The total platform cut across both sides of the transaction is approximately 25.5% for a $100 order. This is an important consideration when thinking about your gig&apos;s competitiveness.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">Fiverr vs. Upwork: Which Platform Keeps More of Your Money?</h2>
          <p>
            For a $1,000 project, here is a rough comparison of what you take home on each platform:
          </p>
          <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50/70 p-4">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left px-3 py-2.5 font-semibold text-stone-800">Platform</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-stone-800">Platform Fee</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-stone-800">You Keep (from $1,000)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  <tr>
                    <td className="px-3 py-2.5 font-medium">Fiverr</td>
                    <td className="px-3 py-2.5 text-rose-600">20%</td>
                    <td className="px-3 py-2.5 font-bold text-stone-900">$800</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5 font-medium">Upwork (10% contract)</td>
                    <td className="px-3 py-2.5 text-amber-600">10%</td>
                    <td className="px-3 py-2.5 font-bold text-stone-900">$900</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5 font-medium">Upwork Direct Contract</td>
                    <td className="px-3 py-2.5 text-emerald-600">0%</td>
                    <td className="px-3 py-2.5 font-bold text-stone-900">$1,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-3">
            Fiverr&apos;s 20% flat fee is consistently higher than Upwork&apos;s most common contract rate. However, Fiverr&apos;s marketplace model (where buyers come to you) can lead to much higher order volume for gig-based services — which may more than compensate for the higher platform fee.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">Frequently Asked Questions About Fiverr Fees</h2>
          <div className="space-y-4">
            {[
              {
                q: "Does Fiverr take 20% from tips?",
                a: "Yes. Tips are treated the same as regular earnings on Fiverr. If a buyer sends you a $50 tip, Fiverr deducts $10 (20%), and $40 is credited to your account. Many sellers are surprised by this.",
              },
              {
                q: "Is there a way to reduce the 20% Fiverr fee?",
                a: "No. Fiverr does not offer a lower fee tier for any seller level, volume, or tenure. The 20% rate is fixed for all sellers on the standard platform. Fiverr Pro sellers also pay 20%.",
              },
              {
                q: "When does the 20% get deducted — at order or at withdrawal?",
                a: "The fee is deducted at the time the order is placed. Your seller balance already reflects the net amount (after 20% deduction). You do not see the gross amount and then have a deduction at withdrawal.",
              },
              {
                q: "Does Fiverr charge withdrawal fees?",
                a: "Fiverr may charge withdrawal fees depending on your payment method. PayPal withdrawals are generally free, while bank transfers and other methods may have flat fees or minimum withdrawal amounts. These are separate from the 20% service fee.",
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
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
            <p className="text-xs font-semibold text-blue-900">
              Use our Fiverr Fee Calculator to instantly see your exact take-home from any Fiverr order, including combined gig + extras + tip scenarios.
            </p>
            <Link
              href="/fiverr-fee-calculator"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors"
            >
              Open Fiverr Fee Calculator →
            </Link>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link href="/guides/upwork-fees-explained" className="rounded-lg border border-stone-200 bg-white p-3 hover:border-stone-400 hover:shadow-sm transition-all group">
              <p className="text-xs font-semibold text-stone-900 group-hover:text-emerald-800">Upwork Fees Explained →</p>
              <p className="text-[11px] text-stone-500 mt-0.5">Complete guide to Upwork&apos;s current 0%–15% fee structure.</p>
            </Link>
            <Link href="/guides/freelancer-currency-conversion" className="rounded-lg border border-stone-200 bg-white p-3 hover:border-stone-400 hover:shadow-sm transition-all group">
              <p className="text-xs font-semibold text-stone-900 group-hover:text-emerald-800">Currency Conversion Guide →</p>
              <p className="text-[11px] text-stone-500 mt-0.5">How currency conversion affects your final local bank deposit.</p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
