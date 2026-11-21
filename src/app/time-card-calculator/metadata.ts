import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.freelancecalc.app";

export const metadata: Metadata = {
  title: "Free Time Card Calculator – Work Hours, Breaks & Overtime",
  description:
    "Calculate work hours, unpaid breaks, and optional overtime. Download a free timesheet PDF or CSV. 100% private in browser.",
  keywords: [
    "time card calculator",
    "free time card calculator",
    "timesheet calculator",
    "work hours calculator",
    "weekly time card calculator",
    "biweekly time card calculator",
    "time card calculator with breaks",
    "time card calculator with lunch",
    "overtime calculator",
    "freelancer timesheet generator",
  ].join(", "),
  alternates: {
    canonical: `${SITE_URL}/time-card-calculator/`,
    languages: {
      en: `${SITE_URL}/time-card-calculator/`,
      "x-default": `${SITE_URL}/time-card-calculator/`,
    },
  },
  openGraph: {
    title: "Free Time Card Calculator – Breaks & Overtime | FreelanceCalc",
    description:
      "Calculate weekly or biweekly work hours, unpaid breaks and optional overtime. Download a free timesheet PDF or CSV. No signup required.",
    url: `${SITE_URL}/time-card-calculator/`,
    type: "website",
  },
};
