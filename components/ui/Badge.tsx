import type { HTMLAttributes } from "react";
import { RATING_THRESHOLDS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { CarbonRating, RecommendationPriority } from "@/types";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide",
        className,
      )}
      {...props}
    />
  );
}

export function RatingBadge({ rating }: { rating: CarbonRating }) {
  const config = RATING_THRESHOLDS[rating];

  return (
    <Badge
      role="status"
      aria-label={`Carbon rating: ${config.label}`}
      style={{ color: config.color, backgroundColor: config.bgColor }}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: config.color }}
        aria-hidden
      />
      {config.label}
    </Badge>
  );
}

export function PriorityBadge({
  priority,
}: {
  priority: RecommendationPriority;
}) {
  const classes: Record<RecommendationPriority, string> = {
    high: "bg-rose-100 text-rose-700",
    medium: "bg-amber-100 text-amber-700",
    low: "bg-blue-100 text-blue-700",
  };

  return <Badge className={classes[priority]}>{priority}</Badge>;
}
