import Link from "next/link";

const TOOL_LINKS = [
  { href: "/upwork-fee-calculator", label: "Upwork Fees" },
  { href: "/fiverr-fee-calculator", label: "Fiverr Fees" },
  { href: "/usd-to-pkr-calculator", label: "Currency Converter" },
  { href: "/pakistan-freelancer-tax", label: "Pakistan Tax" },
];

const LEGAL_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-stone-200/80 bg-white py-10 text-xs text-stone-600">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-900 text-sm">
                Freelance<span className="text-emerald-700">Calc</span>.app
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-stone-500 font-medium">Free Financial Utilities</span>
            </div>
            <p className="mt-1.5 max-w-xs text-[11px] text-stone-500 leading-relaxed">
              Transparent, private fee and tax calculators for remote freelancers and international contractors.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 sm:gap-12">
            <div>
              <p className="font-semibold text-stone-900 text-[11px] uppercase tracking-wider mb-2.5">
                Calculators
              </p>
              <ul className="space-y-1.5" role="list">
                {TOOL_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-stone-600 transition-colors hover:text-stone-950"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-semibold text-stone-900 text-[11px] uppercase tracking-wider mb-2.5">
                Company & Legal
              </p>
              <ul className="space-y-1.5" role="list">
                {LEGAL_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-stone-600 transition-colors hover:text-stone-950"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-stone-100 pt-5 text-center sm:text-left text-[11px] leading-relaxed text-stone-400">
          Disclaimer: FreelanceCalc provides independent estimates for planning purposes only. Not affiliated with, endorsed by, or sponsored by Upwork, Fiverr, or FBR Pakistan. Official rates should always be verified on each platform.
        </div>
      </div>
    </footer>
  );
}
