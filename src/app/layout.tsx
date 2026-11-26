import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#faf8f5",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Freelance Fee Calculator — Upwork, Fiverr & Net Payouts",
    template: "%s | FreelanceCalc",
  },
  description:
    "Free calculators for freelancers: Upwork & Fiverr fee breakdowns, USD to local currency exchange, Pakistan freelancer tax, time card tracker, and professional invoice generator.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: `${SITE_URL}/`,
    languages: {
      en: `${SITE_URL}/`,
      "x-default": `${SITE_URL}/`,
    },
  },
  other: {
    "google-adsense-account": "ca-pub-2344318084516150",
  },
  openGraph: {
    siteName: "FreelanceCalc",
    title: "FreelanceCalc — Free Financial Tools for Freelancers",
    description:
      "Calculate take-home pay, Upwork & Fiverr platform cuts, generate client invoices, and track work sessions with free browser-only tools.",
    type: "website",
    locale: "en_US",
    url: `${SITE_URL}/`,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FreelanceCalc - Free Financial Tools for Freelancers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FreelanceCalc — Free Financial Tools for Freelancers",
    description:
      "Accurate Upwork & Fiverr fee calculators, currency converters, time card tracker, and professional PDF invoice generator.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  "url": `${SITE_URL}/`,
                  "name": "FreelanceCalc",
                  "description": "Free online calculators, time card exporter, and invoice generator for freelancers.",
                  "publisher": {
                    "@id": `${SITE_URL}/#organization`,
                  },
                },
                {
                  "@type": "Organization",
                  "@id": `${SITE_URL}/#organization`,
                  "name": "FreelanceCalc",
                  "url": `${SITE_URL}/`,
                  "logo": {
                    "@type": "ImageObject",
                    "url": `${SITE_URL}/icon-512.png`,
                  },
                },
              ],
            }),
          }}
        />
        <Script
          id="adsense-script"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2344318084516150"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0L07XBD601"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-0L07XBD601');
          `}
        </Script>
      </head>
      <body
        suppressHydrationWarning
        className={`min-h-screen bg-[#faf8f5] font-sans text-stone-900 antialiased flex flex-col ${jakarta.variable} ${jakarta.className}`}
      >
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
