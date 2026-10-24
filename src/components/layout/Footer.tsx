import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/upwork-fee-calculator", label: "Upwork Fees" },
  { href: "/fiverr-fee-calculator", label: "Fiverr Fees" },
  { href: "/usd-to-pkr-calculator", label: "Currency Converter" },
  { href: "/pakistan-freelancer-tax", label: "Pakistan Tax" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-stone-200/80 bg-white py-10 text-xs text-stone-600">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900">
              Freelance<span className="text-emerald-700">Calc</span>.app
            </span>
            <span className="text-stone-400">•</span>
            <span className="text-stone-500 font-medium">Free Financial Utilities</span>
          </div>
          <ul className="flex flex-wrap items-center justify-center gap-4 sm:gap-6" role="list">
            {FOOTER_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="font-medium text-stone-600 transition-colors hover:text-stone-950"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 border-t border-stone-100 pt-5 text-center sm:text-left text-[11px] leading-relaxed text-stone-500">
          Disclaimer: FreelanceCalc provides independent estimates for planning purposes. Not affiliated with or endorsed by Upwork, Fiverr, or FBR Pakistan. Confirm final rates on official platforms.
        </div>
      </div>
    </footer>
  );
}
