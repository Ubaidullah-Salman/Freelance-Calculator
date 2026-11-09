import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6 sm:py-24">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-lg font-bold mb-4">
        404
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
        Page Not Found
      </h1>
      <p className="mt-2.5 text-sm text-stone-600 leading-relaxed">
        The page you are looking for doesn&apos;t exist or has been moved. Explore our popular calculators and guides below:
      </p>

      <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
        <Link
          href="/upwork-fee-calculator"
          className="rounded-lg border border-stone-200 bg-white p-3.5 hover:border-stone-400 hover:shadow-xs transition-all"
        >
          <p className="text-xs font-semibold text-stone-900">Upwork Fee Calculator →</p>
          <p className="text-[11px] text-stone-500 mt-0.5">Calculate net take-home from 0%–15% contracts</p>
        </Link>
        <Link
          href="/fiverr-fee-calculator"
          className="rounded-lg border border-stone-200 bg-white p-3.5 hover:border-stone-400 hover:shadow-xs transition-all"
        >
          <p className="text-xs font-semibold text-stone-900">Fiverr Fee Calculator →</p>
          <p className="text-[11px] text-stone-500 mt-0.5">Calculate net payout after 20% commission</p>
        </Link>
        <Link
          href="/usd-to-pkr-calculator"
          className="rounded-lg border border-stone-200 bg-white p-3.5 hover:border-stone-400 hover:shadow-xs transition-all"
        >
          <p className="text-xs font-semibold text-stone-900">Currency Converter →</p>
          <p className="text-[11px] text-stone-500 mt-0.5">Convert USD at real bank exchange rates</p>
        </Link>
        <Link
          href="/guides"
          className="rounded-lg border border-stone-200 bg-white p-3.5 hover:border-stone-400 hover:shadow-xs transition-all"
        >
          <p className="text-xs font-semibold text-stone-900">Freelancer Guides →</p>
          <p className="text-[11px] text-stone-500 mt-0.5">In-depth breakdowns on fees, forex & taxes</p>
        </Link>
      </div>

      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800 transition-colors"
        >
          Return to Homepage
        </Link>
      </div>
    </main>
  );
}
