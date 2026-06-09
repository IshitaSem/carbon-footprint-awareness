"use client";

import { memo } from "react";
import { RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { RATING_THRESHOLDS } from "@/lib/constants";
import { formatKg } from "@/lib/carbon-calculator";
import { clamp } from "@/lib/utils";
import type { CarbonRating } from "@/types";

interface CarbonGaugeProps {
  totalKg: number;
  rating: CarbonRating;
}

interface GaugeData {
  name: string;
  value: number;
  fill: string;
}

function CarbonGaugeComponent({ totalKg, rating }: CarbonGaugeProps) {
  const percentage = clamp((totalKg / 12000) * 100, 0, 100);
  const ratingConfig = RATING_THRESHOLDS[rating];
  const data: GaugeData[] = [
    {
      name: "Annual footprint",
      value: percentage,
      fill: ratingConfig.color,
    },
  ];

  return (
    <div
      role="img"
      aria-label={`Half-circle gauge showing ${formatKg(totalKg)} annual carbon footprint with ${ratingConfig.label} rating.`}
      className="relative h-[240px] w-full"
    >
      <ResponsiveContainer width="100%" height={220}>
        <RadialBarChart
          data={data}
          startAngle={180}
          endAngle={0}
          innerRadius="70%"
          outerRadius="100%"
          barSize={22}
        >
          <RadialBar
            dataKey="value"
            background={{ fill: "#e2e8f0" }}
            cornerRadius={12}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-x-0 top-[88px] text-center">
        <p className="font-display text-4xl font-bold text-carbon-950">
          {formatKg(totalKg)}
        </p>
        <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-carbon-500">
          CO2 per year
        </p>
      </div>
      <p
        className="absolute inset-x-0 bottom-4 text-center text-sm font-bold uppercase tracking-wide"
        style={{ color: ratingConfig.color }}
      >
        {ratingConfig.label} footprint
      </p>
    </div>
  );
}

export const CarbonGauge = memo(CarbonGaugeComponent);
