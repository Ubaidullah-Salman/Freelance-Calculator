"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  {
    href: "/upwork-fee-calculator",
    label: "Upwork",
    tag: "0%–15%",
    icon: (
      <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33" />
      </svg>
    ),
  },
  {
    href: "/fiverr-fee-calculator",
    label: "Fiverr",
    tag: "20% Flat",
    icon: (
      <svg className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    href: "/usd-to-pkr-calculator",
    label: "Currency",
    tag: "Global",
    icon: (
      <svg className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
  {
    href: "/pakistan-freelancer-tax",
    label: "Pakistan Tax",
    tag: "FBR 154A",
    icon: (
      <svg className="h-4 w-4 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    href: "/guides",
    label: "Guides",
    tag: "Learn",
    icon: (
      <svg className="h-4 w-4 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/95 backdrop-blur-md transition-all">
      <nav
        className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5 sm:px-6"
        aria-label="Main navigation"
      >
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="FreelanceCalc Home"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 text-white shadow-xs transition-transform group-hover:scale-105">
            <svg
              className="h-4.5 w-4.5 text-emerald-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="3" />
              <line x1="8" x2="16" y1="8" y2="8" />
              <line x1="12" x2="16" y1="12" y2="12" />
              <line x1="8" x2="8.01" y1="12" y2="12" />
              <line x1="8" x2="8.01" y1="16" y2="16" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
              <line x1="16" x2="16.01" y1="16" y2="16" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold tracking-tight text-stone-900">
              Freelance<span className="text-emerald-700">Calc</span>
            </span>
            <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-semibold text-stone-600 border border-stone-200/60">
              .app
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 sm:flex">
          <ul className="flex items-center gap-1 rounded-full bg-stone-100/80 p-1 border border-stone-200/60" role="list">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                      isActive
                        ? "bg-white text-stone-900 shadow-xs border border-stone-200/80 font-semibold"
                        : "text-stone-600 hover:text-stone-950 hover:bg-white/60"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Intelligent Live Status Indicator */}
        <div className="hidden items-center gap-2 sm:flex">
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/70 px-2.5 py-1 text-[11px] font-medium text-emerald-800">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span>2026 Rules Active</span>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-stone-200 bg-white/95 px-4 pt-3 pb-4 sm:hidden shadow-lg backdrop-blur-md animate-in fade-in duration-150">
          <div className="mb-2 flex items-center justify-between px-1 text-[11px] font-medium text-stone-500 uppercase tracking-wider">
            <span>Tools &amp; Guides</span>
            <span className="text-emerald-700 font-semibold">100% Free</span>
          </div>
          <ul className="space-y-1.5" role="list">
            {NAV_LINKS.map(({ href, label, tag, icon }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all ${
                      isActive
                        ? "bg-stone-900 text-white font-medium shadow-xs"
                        : "bg-stone-50/80 text-stone-800 hover:bg-stone-100 border border-stone-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? "text-emerald-400" : ""}>{icon}</span>
                      <span className="font-medium">{label}</span>
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-stone-200/70 text-stone-600"
                      }`}
                    >
                      {tag}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 px-1">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Live Fee Rules
            </span>
            <span>No sign-up required</span>
          </div>
        </div>
      )}
    </header>
  );
}
