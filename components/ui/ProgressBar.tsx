import { cn, clamp } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  label?: string;
  showValue?: boolean;
  color?: string;
  size?: "sm" | "md";
}

export function ProgressBar({
  value,
  label,
  showValue = true,
  color = "#22c55e",
  size = "md",
}: ProgressBarProps) {
  const boundedValue = clamp(value, 0, 100);
  const heightClass = size === "sm" ? "h-2" : "h-3";

  return (
    <div className="space-y-2">
      {label || showValue ? (
        <div className="flex items-center justify-between gap-4 text-sm">
          {label ? (
            <span className="font-semibold text-carbon-700">{label}</span>
          ) : (
            <span />
          )}
          {showValue ? (
            <span className="font-mono text-carbon-500">
              {Math.round(boundedValue)}%
            </span>
          ) : null}
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuenow={Math.round(boundedValue)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
        className={cn("overflow-hidden rounded-full bg-carbon-100", heightClass)}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${boundedValue}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
