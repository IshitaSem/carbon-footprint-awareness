import { forwardRef, useId } from "react";
import type { SelectHTMLAttributes } from "react";
import { cn, slugify } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  hint?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, hint, id, className, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? `${slugify(label)}-${generatedId}`;
    const hintId = hint ? `${selectId}-hint` : undefined;
    const errorId = error ? `${selectId}-error` : undefined;
    const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

    return (
      <div className="space-y-2">
        <label htmlFor={selectId} className="block text-sm font-semibold text-carbon-800">
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-describedby={describedBy}
            aria-invalid={Boolean(error)}
            className={cn(
              "h-12 w-full appearance-none rounded-xl border bg-white px-4 pr-11 text-base text-carbon-950 shadow-sm outline-none transition focus:border-earth-500 focus:ring-4 focus:ring-earth-500/15",
              error
                ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/15"
                : "border-carbon-300",
              className,
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.description
                  ? `${option.label} - ${option.description}`
                  : option.label}
              </option>
            ))}
          </select>
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-carbon-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {hint ? (
          <p id={hintId} className="text-sm leading-6 text-carbon-500">
            {hint}
          </p>
        ) : null}
        {error ? (
          <p id={errorId} className="text-sm font-semibold text-rose-600">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

Select.displayName = "Select";
