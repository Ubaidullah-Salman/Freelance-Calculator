export interface WebAppSchemaProps {
  name: string;
  description: string;
  url?: string;
  applicationCategory?: string;
  operatingSystem?: string;
  offersPrice?: string;
  offersPriceCurrency?: string;
}

export default function WebApplicationSchema({
  name,
  description,
  url,
  applicationCategory = "FinanceApplication",
  operatingSystem = "All",
  offersPrice = "0",
  offersPriceCurrency = "USD",
}: WebAppSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: url ?? (typeof window !== "undefined" ? window.location.href : undefined),
    applicationCategory,
    operatingSystem,
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: offersPrice,
      priceCurrency: offersPriceCurrency,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
