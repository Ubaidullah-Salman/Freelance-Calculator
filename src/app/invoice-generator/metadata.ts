import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.freelancecalc.app";

export const metadata: Metadata = {
  title: "Invoice Generator — Create Professional Invoices Free | FreelanceCalc",
  description:
    "Generate professional PDF invoices in minutes. Free invoice template with customizable branding, auto-calculated totals, and browser-based draft storage. No sign-up required.",
  keywords: [
    "invoice generator",
    "free invoice template",
    "PDF invoice creator",
    "freelance invoice",
    "professional invoice",
    "invoice maker",
    "small business invoice",
    "consultant invoice",
  ].join(", "),
  alternates: {
    canonical: `${SITE_URL}/invoice-generator/`,
    languages: {
      en: `${SITE_URL}/invoice-generator/`,
      "x-default": `${SITE_URL}/invoice-generator/`,
    },
  },
  openGraph: {
    title: "Invoice Generator — Create Professional Invoices Free",
    description:
      "Generate professional PDF invoices in minutes. Free invoice template with customizable branding, auto-calculated totals, and browser-based draft storage.",
    url: `${SITE_URL}/invoice-generator/`,
    type: "website",
  },
};