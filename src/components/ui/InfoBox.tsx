type InfoBoxVariant = "info" | "warning" | "tip";

interface InfoBoxProps {
  variant?: InfoBoxVariant;
  children: React.ReactNode;
}

export default function InfoBox({ variant = "info", children }: InfoBoxProps) {
  const bgClass =
    variant === "warning"
      ? "bg-[#faf7f0] border-stone-200 text-stone-700"
      : "bg-stone-50 border-stone-200 text-stone-600";

  return (
    <div
      className={`rounded-md border p-3.5 text-xs sm:text-sm leading-relaxed ${bgClass}`}
      role={variant === "warning" ? "alert" : "note"}
    >
      {children}
    </div>
  );
}
