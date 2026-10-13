import Link from "next/link";

interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

interface RelatedLinksProps {
  links: RelatedLink[];
  title?: string;
}

export default function RelatedLinks({
  links,
  title = "Other calculators",
}: RelatedLinksProps) {
  return (
    <section className="mt-8 border-t border-stone-200 pt-6" aria-label={title}>
      <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-stone-400">
        {title}
      </h2>
      <div className="grid gap-2.5 sm:grid-cols-3">
        {links.map(({ href, label, description }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-md border border-stone-200 bg-white p-3 transition-colors hover:border-stone-300 hover:bg-stone-50/60"
          >
            <p className="text-xs font-medium text-stone-900 group-hover:text-stone-700">
              {label} <span className="text-stone-400 transition-transform group-hover:translate-x-0.5 inline-block">→</span>
            </p>
            <p className="mt-1 text-[11px] text-stone-500 leading-normal">
              {description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
