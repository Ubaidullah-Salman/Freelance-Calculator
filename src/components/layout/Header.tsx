import Link from "next/link";

const NAV_LINKS = [
  { href: "/upwork-fee-calculator", label: "Upwork Fees" },
  { href: "/fiverr-fee-calculator", label: "Fiverr Fees" },
  { href: "/usd-to-pkr-calculator", label: "Currency Converter" },
  { href: "/pakistan-freelancer-tax", label: "Pakistan Tax" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white">
      <nav
        className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="text-base font-medium tracking-tight text-stone-900 transition-colors hover:text-stone-700"
          aria-label="FreelanceCalc – Home"
        >
          FreelanceCalc
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-6 sm:flex" role="list">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-sm text-stone-600 transition-colors hover:text-stone-950"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile nav */}
        <div className="flex sm:hidden">
          <details className="relative">
            <summary
              className="flex cursor-pointer list-none items-center rounded-md p-1.5 text-stone-600 hover:bg-stone-100 hover:text-stone-900"
              aria-label="Toggle navigation menu"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                />
              </svg>
            </summary>
            <ul
              className="absolute right-0 mt-2 w-48 rounded-md border border-stone-200 bg-white py-1 shadow-sm"
              role="list"
            >
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-stone-950"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </nav>
    </header>
  );
}
