interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

export function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-xs transition-all duration-200 hover:shadow-md hover:border-stone-300">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-stone-50 text-stone-700">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-stone-900">{title}</h3>
      <p className="text-sm text-stone-600 leading-relaxed">{desc}</p>
    </div>
  );
}