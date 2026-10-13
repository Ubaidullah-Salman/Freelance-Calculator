"use client";

import { useState } from "react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  items: FaqItem[];
  title?: string;
}

export default function FaqSection({
  items,
  title = "Frequently asked questions",
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="mt-10 border-t border-stone-200 pt-8" aria-labelledby="faq-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <h2
        id="faq-heading"
        className="text-base font-semibold text-stone-900"
      >
        {title}
      </h2>

      <div className="mt-4 divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="px-4 py-3.5 sm:px-5">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-start justify-between text-left text-sm font-medium text-stone-900 transition-colors hover:text-stone-700 focus:outline-none"
                aria-expanded={isOpen}
              >
                <span>{item.question}</span>
                <span className="ml-3 text-stone-400 font-mono text-base">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen && (
                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-stone-600">
                  {item.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
