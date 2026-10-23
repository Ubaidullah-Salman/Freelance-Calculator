# Freelance Fee & Earnings Calculator

A production-ready MVP for freelancers calculating take-home earnings across Upwork, Fiverr, and international remittances to Pakistan (PKR), along with an informational Pakistan freelancer tax guide.

Built with **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## Features & Routes

- **Homepage (`/`)**: Overview with quick navigation cards, FAQ, and platform comparison.
- **Upwork Fee Calculator (`/upwork-fee-calculator`)**:
  - Calculates fees across Upwork tiers (10% standard, legacy 20% first $500, legacy 5% above $10k).
  - Instant breakdown of gross amount, platform fee, and net take-home earnings.
- **Fiverr Fee Calculator (`/fiverr-fee-calculator`)**:
  - Accounts for Fiverr's flat 20% service fee.
  - Accounts for payout withdrawal fees (Payoneer, PayPal, Bank Transfer wire $3, Fiverr Revenue Card $1).
- **USD to PKR Calculator (`/usd-to-pkr-calculator`)**:
  - Converts USD freelance earnings into Pakistani Rupees (PKR).
  - Frequency toggle (daily, weekly, monthly) with monthly and annual projections.
  - Custom exchange rate input (privacy-first, no external paid API requirement).
- **Pakistan Freelancer Tax Guide (`/pakistan-freelancer-tax`)**:
  - Informational FBR tax brackets guide with clear disclaimers.
  - Interactive estimate calculator based on FBR income tax slabs.
  - Contextual details on IT export remittances (banking channels) and PSEB registration.

---

## Technical SEO Architecture

- **Semantic HTML5** & accessible inputs with `aria-describedby` and label associations.
- **Dynamic Metadata & Open Graph**: Descriptive titles, meta descriptions, canonical URLs, and OpenGraph/Twitter cards on every route.
- **XML Sitemap**: Dynamically generated at `/sitemap.xml` with priority weighting.
- **Robots.txt**: Dynamically generated at `/robots.txt` referencing the sitemap.
- **Self-hosted typography**: Next.js Google Font integration (`next/font/google`) with zero runtime network layout shifts.

---

## Folder Structure

```
freelance-fee-calculator/
├── src/
│   ├── app/
│   │   ├── layout.tsx                     # Root layout with Inter font and metadataBase
│   │   ├── page.tsx                       # Homepage with tool grid & FAQ
│   │   ├── globals.css                    # Tailwind CSS configuration & tokens
│   │   ├── robots.ts                      # Dynamic robots.txt
│   │   ├── sitemap.ts                     # Dynamic XML sitemap
│   │   ├── upwork-fee-calculator/page.tsx
│   │   ├── fiverr-fee-calculator/page.tsx
│   │   ├── usd-to-pkr-calculator/page.tsx
│   │   └── pakistan-freelancer-tax/page.tsx
│   ├── components/
│   │   ├── layout/                        # Header, Footer
│   │   ├── ui/                            # InputField, ResultCard, InfoBox, RelatedLinks
│   │   └── calculators/                   # Interactive client calculators
│   └── lib/
│       ├── upwork.ts                      # Upwork calculations
│       ├── fiverr.ts                      # Fiverr calculations
│       ├── currency.ts                    # USD-PKR currency conversions
│       ├── tax.ts                         # Pakistan income tax slab estimates
│       ├── formatters.ts                  # Currency & percentage formatters
│       └── __tests__/                     # Complete Jest unit test suites
├── jest.config.js
└── package.json
```

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Unit Tests

```bash
npm test
```


### 4. Build for Production

```bash
npm run build
npm start
```
