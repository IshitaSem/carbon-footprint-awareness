"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Filter,
  Lightbulb,
  RefreshCcw,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { RecommendationCard } from "@/components/calculator/RecommendationCard";
import { RatingBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import {
  calculateCarbonFootprint,
  formatKg,
  generateRecommendations,
} from "@/lib/carbon-calculator";
import { useStoredCalculatorInputs } from "@/hooks/useStoredCalculatorInputs";
import { cn } from "@/lib/utils";
import type { Recommendation, RecommendationCategory } from "@/types";

type FilterCategory = "all" | RecommendationCategory;

const filters: Array<{ value: FilterCategory; label: string }> = [
  { value: "all", label: "All" },
  { value: "transport", label: "Transport" },
  { value: "electricity", label: "Electricity" },
  { value: "food", label: "Food" },
  { value: "waste", label: "Waste" },
  { value: "lifestyle", label: "Lifestyle" },
];

function countForFilter(
  recommendations: Recommendation[],
  filter: FilterCategory,
): number {
  if (filter === "all") {
    return recommendations.length;
  }

  return recommendations.filter((recommendation) => recommendation.category === filter)
    .length;
}

export default function InsightsPage() {
  const router = useRouter();
  const { inputs, isLoading } = useStoredCalculatorInputs();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");

  const result = useMemo(
    () => (inputs ? calculateCarbonFootprint(inputs) : null),
    [inputs],
  );
  const recommendations = useMemo(
    () => (inputs && result ? generateRecommendations(inputs, result) : []),
    [inputs, result],
  );
  const filteredRecommendations = useMemo(
    () =>
      activeFilter === "all"
        ? recommendations
        : recommendations.filter(
            (recommendation) => recommendation.category === activeFilter,
          ),
    [activeFilter, recommendations],
  );
  const highImpactCount = useMemo(
    () =>
      recommendations.filter((recommendation) => recommendation.priority === "high")
        .length,
    [recommendations],
  );
  const potentialSaving = useMemo(
    () =>
      recommendations.reduce(
        (sum, recommendation) => sum + recommendation.potentialSavingKgPerYear,
        0,
      ),
    [recommendations],
  );

  const selectFilter = useCallback((filter: FilterCategory) => {
    setActiveFilter(filter);
  }, []);

  if (isLoading || !result) {
    return <LoadingState />;
  }

  return (
    <section className="section-container py-10 sm:py-14">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link
            href="/dashboard"
            className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-earth-700 transition hover:text-earth-900"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to dashboard
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <Lightbulb className="h-6 w-6" aria-hidden />
            </span>
            <h1 className="page-title">Your Insights</h1>
            <RatingBadge rating={result.rating} />
          </div>
          <p className="page-subtitle">
            Your current estimate is {formatKg(result.totalKgPerYear)} CO2 per year.
          </p>
        </div>
        <Button variant="ghost" onClick={() => router.push("/calculator")}>
          <RefreshCcw className="h-4 w-4" aria-hidden />
          Recalculate
        </Button>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <Card className="p-5">
          <Sparkles className="h-7 w-7 text-earth-600" aria-hidden />
          <p className="mt-4 text-sm font-semibold text-carbon-500">
            Total recommendations
          </p>
          <p className="mt-1 text-3xl font-bold text-carbon-950">
            {recommendations.length}
          </p>
        </Card>
        <Card className="p-5">
          <Zap className="h-7 w-7 text-rose-600" aria-hidden />
          <p className="mt-4 text-sm font-semibold text-carbon-500">
            High-impact actions
          </p>
          <p className="mt-1 text-3xl font-bold text-rose-600">
            {highImpactCount}
          </p>
        </Card>
        <Card className="p-5">
          <Target className="h-7 w-7 text-earth-600" aria-hidden />
          <p className="mt-4 text-sm font-semibold text-carbon-500">
            Potential saving
          </p>
          <p className="mt-1 text-3xl font-bold text-earth-600">
            {formatKg(potentialSaving)}
          </p>
        </Card>
      </div>

      <div className="mt-10 rounded-2xl border border-carbon-200 bg-white p-4">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-carbon-500">
          <Filter className="h-4 w-4" aria-hidden />
          Filter
        </div>
        <div
          role="group"
          aria-label="Filter recommendations by category"
          className="flex flex-wrap gap-2"
        >
          {filters.map((filter) => {
            const active = activeFilter === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                aria-pressed={active}
                onClick={() => selectFilter(filter.value)}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-500",
                  active
                    ? "border-earth-600 bg-earth-600 text-white"
                    : "border-carbon-200 bg-white text-carbon-700 hover:border-earth-300",
                )}
              >
                {filter.label}
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs",
                    active ? "bg-white/20 text-white" : "bg-carbon-100 text-carbon-600",
                  )}
                >
                  {countForFilter(recommendations, filter.value)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 space-y-4" role="list">
        {filteredRecommendations.length > 0 ? (
          filteredRecommendations.map((recommendation, index) => (
            <div key={recommendation.id} role="listitem">
              <RecommendationCard recommendation={recommendation} index={index} />
            </div>
          ))
        ) : (
          <Card className="p-10 text-center">
            <p className="text-lg font-bold text-carbon-950">
              No recommendations in this category.
            </p>
            <p className="mt-2 text-carbon-600">
              Try another filter to see the actions generated from your footprint.
            </p>
          </Card>
        )}
      </div>

      <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-6 text-carbon-500">
        Estimates are designed for awareness and planning. Actual emissions vary by region, technology, household size, supplier mix, and travel details.
      </p>
    </section>
  );
}
