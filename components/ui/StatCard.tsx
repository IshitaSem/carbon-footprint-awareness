import type { ReactNode } from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type Trend = "up" | "down" | "neutral";

interface StatCardProps {
  label: string;
  value: string;
  sublabel?: string;
  icon: ReactNode;
  iconBg?: string;
  trend?: Trend;
  trendLabel?: string;
}

const trendClasses: Record<Trend, string> = {
  up: "text-rose-600",
  down: "text-earth-700",
  neutral: "text-carbon-500",
};

function TrendIcon({ trend }: { trend: Trend }) {
  if (trend === "up") {
    return <ArrowUpRight className="h-4 w-4" aria-hidden />;
  }

  if (trend === "down") {
    return <ArrowDownRight className="h-4 w-4" aria-hidden />;
  }

  return <ArrowRight className="h-4 w-4" aria-hidden />;
}

export function StatCard({
  label,
  value,
  sublabel,
  icon,
  iconBg = "bg-earth-100 text-earth-700",
  trend = "neutral",
  trendLabel,
}: StatCardProps) {
  return (
    <Card className="p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-carbon-900/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-carbon-500">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-normal text-carbon-950">
            {value}
          </p>
          {sublabel ? (
            <p className="mt-1 text-sm text-carbon-500">{sublabel}</p>
          ) : null}
        </div>
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
            iconBg,
          )}
        >
          {icon}
        </div>
      </div>
      {trendLabel ? (
        <div
          className={cn(
            "mt-4 flex items-center gap-1 text-sm font-semibold",
            trendClasses[trend],
          )}
        >
          <TrendIcon trend={trend} />
          {trendLabel}
        </div>
      ) : null}
    </Card>
  );
}
