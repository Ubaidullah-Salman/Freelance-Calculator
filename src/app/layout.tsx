import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.freelancecalc.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Freelance Fee Calculator — Upwork, Fiverr & Global Take-Home Pay",
    template: "%s | FreelanceCalc",
  },
  description:
    "Free, transparent financial calculators for freelancers worldwide: calculate exact take-home pay after Upwork and Fiverr fees, convert USD to global currencies, and view tax rules.",
  robots: { index: true, follow: true },
  other: {
    "google-adsense-account": "ca-pub-2344318084516150",
  },
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
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2344318084516150"
          crossOrigin="anonymous"
        />
        <meta
          name="google-adsense-account"
          content="ca-pub-2344318084516150"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0L07XBD601"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-0L07XBD601');
          `}
        </Script>
      </head>
      <body
        className={`min-h-screen bg-[#faf8f5] font-sans text-stone-900 antialiased flex flex-col ${jakarta.variable} ${jakarta.className}`}
      >
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
