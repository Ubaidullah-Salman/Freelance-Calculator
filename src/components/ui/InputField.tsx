import type { InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  helpText?: string;
  error?: string;
  prefix?: string;
  suffix?: string;
}

export default function InputField({
  id,
  label,
  helpText,
  error,
  prefix,
  suffix,
  className,
  ...props
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-stone-800">
        {label}
      </label>

      <div className="relative flex items-center">
        {prefix && (
          <span className="pointer-events-none absolute left-3 select-none text-sm text-stone-400">
            {prefix}
          </span>
        )}
        <input
          id={id}
          aria-describedby={
            error ? `${id}-error` : helpText ? `${id}-help` : undefined
          }
          aria-invalid={error ? "true" : undefined}
          className={[
            "w-full rounded-md border bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400",
            "transition-colors focus:outline-none focus:ring-1",
            prefix ? "pl-7" : "",
            suffix ? "pr-18" : "",
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400"
              : "border-stone-300 focus:border-[#44684f] focus:ring-[#44684f]",
            className ?? "",
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 select-none text-xs text-stone-400">
            {suffix}
          </span>
        )}
      </div>

      {helpText && !error && (
        <p id={`${id}-help`} className="text-xs text-stone-500">
          {helpText}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
