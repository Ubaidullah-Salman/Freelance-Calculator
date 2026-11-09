import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.freelancecalc.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const contentUpdated = new Date("2026-11-08T00:00:00Z");
  const legalUpdated = new Date("2026-10-24T00:00:00Z");

  return [
    {
      url: SITE_URL,
      lastModified: contentUpdated,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/upwork-fee-calculator`,
      lastModified: contentUpdated,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/fiverr-fee-calculator`,
      lastModified: contentUpdated,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/usd-to-pkr-calculator`,
      lastModified: contentUpdated,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/pakistan-freelancer-tax`,
      lastModified: contentUpdated,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/guides`,
      lastModified: contentUpdated,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/guides/upwork-fees-explained`,
      lastModified: contentUpdated,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/guides/fiverr-fees-explained`,
      lastModified: contentUpdated,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/guides/freelancer-currency-conversion`,
      lastModified: contentUpdated,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: legalUpdated,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: legalUpdated,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: legalUpdated,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: legalUpdated,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
