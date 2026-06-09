"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Car,
  Globe2,
  Leaf,
  PlugZap,
  RefreshCcw,
  Salad,
  Target,
  Trash2,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { CarbonGauge } from "@/components/charts/CarbonGauge";
import { ComparisonBarChart } from "@/components/charts/ComparisonBarChart";
import { EmissionPieChart } from "@/components/charts/EmissionPieChart";
import { RatingBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatCard } from "@/components/ui/StatCard";
import {
  calculateCarbonFootprint,
  formatKg,
  formatTonnes,
  toBarChartData,
  toPieChartData,
} from "@/lib/carbon-calculator";
import {
  AVERAGE_BREAKDOWN,
  CHART_COLORS,
  GLOBAL_AVERAGE_KG_PER_YEAR,
  SUSTAINABLE_TARGET_KG_PER_YEAR,
} from "@/lib/constants";
import { useStoredCalculatorInputs } from "@/hooks/useStoredCalculatorInputs";
import { clamp } from "@/lib/utils";
import type { EmissionBreakdown } from "@/types";

const categoryIcons: Record<keyof EmissionBreakdown, LucideIcon> = {
  transport: Car,
  electricity: PlugZap,
  food: Salad,
  waste: Trash2,
};

const categoryLabels: Record<keyof EmissionBreakdown, string> = {
  transport: "Transport",
  electricity: "Electricity",
  food: "Food",
  waste: "Waste",
};

export default function DashboardPage() {
  const router = useRouter();
  const { inputs, isLoading } = useStoredCalculatorInputs();

  const result = useMemo(
    () => (inputs ? calculateCarbonFootprint(inputs) : null),
    [inputs],
  );
  const pieData = useMemo(
    () => (result ? toPieChartData(result.breakdown) : []),
    [result],
  );
  const barData = useMemo(
    () => (result ? toBarChartData(result.breakdown) : []),
    [result],
  );

  if (isLoading || !result) {
    return <LoadingState />;
  }

  const isAboveAverage = result.totalKgPerYear > GLOBAL_AVERAGE_KG_PER_YEAR;
  const reductionNeeded = Math.max(
    0,
    result.totalKgPerYear - SUSTAINABLE_TARGET_KG_PER_YEAR,
  );
  const sustainableProgress = clamp(
    (SUSTAINABLE_TARGET_KG_PER_YEAR / Math.max(result.totalKgPerYear, 1)) * 100,
    0,
    100,
  );

  return (
    <section className="section-container py-10 sm:py-14">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="page-title">Your Dashboard</h1>
            <RatingBadge rating={result.rating} />
          </div>
          <p className="page-subtitle">
            Your estimated annual footprint across transport, electricity, food, and waste.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/insights"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-earth-600 px-4 font-bold text-white transition hover:bg-earth-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-500 focus-visible:ring-offset-2"
          >
            View Insights
          </Link>
          <Button variant="ghost" onClick={() => router.push("/calculator")}>
            <RefreshCcw className="h-4 w-4" aria-hidden />
            Recalculate
          </Button>
        </div>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total CO2"
          value={formatTonnes(result.totalKgPerYear)}
          sublabel={formatKg(result.totalKgPerYear)}
          icon={<Globe2 className="h-6 w-6" aria-hidden />}
          trend={isAboveAverage ? "up" : "down"}
          trendLabel={`${Math.abs(result.comparisonToAverage).toFixed(0)}% ${isAboveAverage ? "above" : "below"} average`}
        />
        <StatCard
          label="Global Average"
          value="4.7t"
          sublabel="Per person per year"
          icon={<TrendingUp className="h-6 w-6" aria-hidden />}
          iconBg="bg-carbon-100 text-carbon-700"
          trend="neutral"
          trendLabel="Benchmark"
        />
        <StatCard
          label="Sustainable Target"
          value="2.0t"
          sublabel="Long-term climate target"
          icon={<Target className="h-6 w-6" aria-hidden />}
          iconBg="bg-blue-100 text-blue-700"
          trend="neutral"
          trendLabel="Goal"
        />
        <StatCard
          label="Reduction Needed"
          value={reductionNeeded > 0 ? formatKg(reductionNeeded) : "Goal Met"}
          sublabel="To reach the 2t target"
          icon={<Leaf className="h-6 w-6" aria-hidden />}
          iconBg="bg-earth-100 text-earth-700"
          trend={reductionNeeded > 0 ? "up" : "down"}
          trendLabel={reductionNeeded > 0 ? "Action opportunity" : "Below target"}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Carbon Gauge</CardTitle>
          </CardHeader>
          <CardBody>
            <CarbonGauge totalKg={result.totalKgPerYear} rating={result.rating} />
            <ProgressBar
              value={sustainableProgress}
              label="Progress towards sustainable"
              color={CHART_COLORS.transport}
            />
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Emission Breakdown</CardTitle>
          </CardHeader>
          <CardBody>
            <EmissionPieChart data={pieData} />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {(Object.keys(result.breakdown) as Array<keyof EmissionBreakdown>).map(
                (category) => {
                  const Icon = categoryIcons[category];
                  return (
                    <div
                      key={category}
                      className="flex items-center justify-between gap-4 rounded-xl bg-carbon-50 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                          <Icon
                            className="h-5 w-5"
                            style={{ color: CHART_COLORS[category] }}
                            aria-hidden
                          />
                        </span>
                        <div>
                          <p className="font-bold text-carbon-950">
                            {categoryLabels[category]}
                          </p>
                          <p className="font-mono text-sm text-carbon-500">
                            {formatKg(result.breakdown[category])}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 font-mono text-sm text-carbon-600">
                        {Math.round(result.percentages[category])}%
                      </span>
                    </div>
                  );
                },
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How You Compare</CardTitle>
          <p className="mt-2 text-carbon-600">
            The bars compare your footprint with a broad global average and an illustrative sustainable level.
          </p>
        </CardHeader>
        <CardBody>
          <ComparisonBarChart data={barData} />
        </CardBody>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Category Progress</CardTitle>
        </CardHeader>
        <CardBody className="space-y-5">
          {(Object.keys(result.breakdown) as Array<keyof EmissionBreakdown>).map(
            (category) => (
              <ProgressBar
                key={category}
                value={(result.breakdown[category] / AVERAGE_BREAKDOWN[category]) * 100}
                label={`${categoryLabels[category]}: ${formatKg(result.breakdown[category])} vs ${formatKg(AVERAGE_BREAKDOWN[category])} average`}
                color={CHART_COLORS[category]}
              />
            ),
          )}
        </CardBody>
      </Card>

      <div className="mt-8 rounded-2xl bg-earth-950 p-8 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold">Ready to reduce?</h2>
            <p className="mt-2 text-earth-50/80">
              See personalised recommendations ranked by potential impact.
            </p>
          </div>
          <Link
            href="/insights"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-earth-400 px-5 font-bold text-earth-950 transition hover:bg-earth-300"
          >
            Open Insights
          </Link>
        </div>
      </div>
    </section>
  );
}
