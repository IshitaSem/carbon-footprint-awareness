import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";
import { cn, slugify } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  unit?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, unit, id, className, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? `${slugify(label)}-${generatedId}`;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

    return (
      <div className="space-y-2">
        <label htmlFor={inputId} className="block text-sm font-semibold text-carbon-800">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            aria-describedby={describedBy}
            aria-invalid={Boolean(error)}
            className={cn(
              "h-12 w-full rounded-xl border bg-white px-4 text-base text-carbon-950 shadow-sm outline-none transition placeholder:text-carbon-400 focus:border-earth-500 focus:ring-4 focus:ring-earth-500/15",
              unit ? "pr-16" : "",
              error
                ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/15"
                : "border-carbon-300",
              className,
            )}
            {...props}
          />
          {unit ? (
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-carbon-500">
              {unit}
            </span>
          ) : null}
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

Input.displayName = "Input";
