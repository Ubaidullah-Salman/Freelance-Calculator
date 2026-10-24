"use client";

interface AffiliateTipProps {
  platform: "upwork" | "fiverr" | "currency" | "tax";
  className?: string;
}

const TIPS: Record<
  AffiliateTipProps["platform"],
  {
    badge: string;
    title: string;
    description: string;
    linkText: string;
    defaultUrl: string;
    provider: string;
  }
> = {
  upwork: {
    badge: "Withdrawal Tip",
    title: "Save on USD to local bank exchange rates",
    description:
      "Direct bank transfers to local accounts often lose 2%–4% in bank currency spreads. Using a digital USD account or international transfer provider like Payoneer can help retain more of your take-home pay.",
    linkText: "Learn about Payoneer USD payouts →",
    defaultUrl: "https://www.payoneer.com/",
    provider: "Payoneer",
  },
  fiverr: {
    badge: "Fee Tip",
    title: "Reduce withdrawal costs on completed orders",
    description:
      "Fiverr charges $3 per direct bank withdrawal. Linking a digital wallet or international account allows you to batch withdrawals and convert at competitive market exchange rates.",
    linkText: "Explore fee-saving payout options →",
    defaultUrl: "https://www.payoneer.com/",
    provider: "Payoneer",
  },
  currency: {
    badge: "Rate Tip",
    title: "Get closer to real mid-market rates",
    description:
      "Retail commercial banks often charge hidden margins over the interbank exchange rate. Compare your bank's telegraphic transfer rate with international transfer services before withdrawing.",
    linkText: "Check Wise international transfer rates →",
    defaultUrl: "https://wise.com/",
    provider: "Wise",
  },
  tax: {
    badge: "Compliance Tip",
    title: "Qualify for the 0.25% PSEB tax rate",
    description:
      "If you export IT services or software from Pakistan, registering with PSEB (Pakistan Software Export Board) reduces your bank withholding tax from 1.00% to just 0.25% under FBR Section 154A.",
    linkText: "Visit official PSEB registration portal →",
    defaultUrl: "https://pseb.org.pk/",
    provider: "PSEB",
  },
};

export default function AffiliateTip({ platform, className }: AffiliateTipProps) {
  const tip = TIPS[platform];

  return (
    <aside
      className={`rounded-xl border border-stone-200/90 bg-stone-50/70 p-4 transition-all hover:bg-stone-50 ${className ?? ""}`}
      aria-label="Financial and fee saving recommendation"
    >
      <div className="flex items-center gap-2">
        <span className="rounded bg-emerald-100/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
          {tip.badge}
        </span>
        <span className="text-[11px] text-stone-500 font-medium">Helpful Resource</span>
      </div>
      <h4 className="mt-2 text-sm font-semibold text-stone-900">{tip.title}</h4>
      <p className="mt-1 text-xs text-stone-600 leading-relaxed">{tip.description}</p>
      <div className="mt-3">
        <a
          href={tip.defaultUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
        >
          <span>{tip.linkText}</span>
        </a>
      </div>
    </aside>
  );
}
