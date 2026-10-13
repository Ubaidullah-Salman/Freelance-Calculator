import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/upwork-fee-calculator", label: "Upwork Fees" },
  { href: "/fiverr-fee-calculator", label: "Fiverr Fees" },
  { href: "/usd-to-pkr-calculator", label: "Currency Converter" },
  { href: "/pakistan-freelancer-tax", label: "Pakistan Tax" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-white py-8 text-xs text-stone-500">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-medium text-stone-700">
            FreelanceCalc — Independent Freelancer Financial Utilities
          </p>
          <ul className="flex items-center gap-4" role="list">
            {FOOTER_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-stone-500 transition-colors hover:text-stone-900"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 border-t border-stone-100 pt-4 text-center sm:text-left text-[11px] leading-relaxed text-stone-400">
          Disclaimer: FreelanceCalc provides calculations for educational and financial planning purposes only. We are not affiliated with, endorsed by, or sponsored by Upwork, Fiverr, or the Federal Board of Revenue (FBR). Official rates should always be verified on each platform&apos;s portal. Consult a licensed tax advisor or chartered accountant for official tax filings.
        </div>
      </div>
    </footer>
  );
}
