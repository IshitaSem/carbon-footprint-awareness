"use client";

import { useCallback, useState } from "react";
import {
  Car,
  CheckCircle2,
  ChevronDown,
  Leaf,
  Sparkles,
  Trash2,
  type LucideIcon,
  Zap,
} from "lucide-react";
import { PriorityBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatKg } from "@/lib/carbon-calculator";
import { cn } from "@/lib/utils";
import type { Recommendation, RecommendationCategory } from "@/types";

interface RecommendationCardProps {
  recommendation: Recommendation;
  index: number;
}

const categoryIcons: Record<RecommendationCategory, LucideIcon> = {
  transport: Car,
  electricity: Zap,
  food: Leaf,
  waste: Trash2,
  lifestyle: Sparkles,
};

const categoryColors: Record<RecommendationCategory, string> = {
  transport: "bg-earth-100 text-earth-700",
  electricity: "bg-blue-100 text-blue-700",
  food: "bg-amber-100 text-amber-700",
  waste: "bg-violet-100 text-violet-700",
  lifestyle: "bg-cyan-100 text-cyan-700",
};

export function RecommendationCard({
  recommendation,
  index,
}: RecommendationCardProps) {
  const [isOpen, setIsOpen] = useState(index === 0);
  const Icon = categoryIcons[recommendation.category];
  const contentId = `recommendation-${recommendation.id}`;

  const toggleOpen = useCallback(() => {
    setIsOpen((current) => !current);
  }, []);

  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={toggleOpen}
        className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-carbon-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-500 focus-visible:ring-inset"
      >
        <span
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
            categoryColors[recommendation.category],
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="mb-2 flex flex-wrap items-center gap-2">
            <PriorityBadge priority={recommendation.priority} />
            <span className="text-sm font-semibold text-carbon-500">
              Save up to {formatKg(recommendation.potentialSavingKgPerYear)} CO2/year
            </span>
          </span>
          <span className="block text-lg font-bold text-carbon-950">
            {recommendation.title}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-carbon-400 transition-transform",
            isOpen ? "rotate-180" : "",
          )}
          aria-hidden
        />
      </button>
      <div
        id={contentId}
        className={cn(
          "grid transition-all duration-300 ease-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-carbon-100 p-5 pt-4">
            <p className="leading-7 text-carbon-600">{recommendation.description}</p>
            <h3 className="mt-5 text-sm font-bold uppercase tracking-wide text-carbon-900">
              Action Steps
            </h3>
            <ul className="mt-3 space-y-3">
              {recommendation.actionItems.map((item) => (
                <li key={item} className="flex gap-3 text-carbon-700">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-earth-600"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
