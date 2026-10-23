import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://freelancecalc.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Freelance Fee Calculator — Upwork, Fiverr & Global Take-Home Pay",
    template: "%s | FreelanceCalc",
  },
  description:
    "Free, transparent financial calculators for freelancers worldwide: calculate exact take-home pay after Upwork and Fiverr fees, convert USD to global currencies, and view tax rules.",
  robots: { index: true, follow: true },
  openGraph: {
    siteName: "FreelanceCalc",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen bg-[#faf8f5] font-sans text-stone-900 antialiased flex flex-col ${inter.className}`}
      >
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
