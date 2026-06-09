"use client";

import { memo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatKg } from "@/lib/carbon-calculator";
import type { BarChartData } from "@/types";

interface ComparisonBarChartProps {
  data: BarChartData[];
}

interface BarTooltipPayload {
  dataKey?: string;
  name?: string;
  value?: number;
  color?: string;
}

const labels: Record<string, string> = {
  yours: "Yours",
  average: "Average",
  optimal: "Optimal",
};

function CustomTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean;
  label?: string;
  payload?: BarTooltipPayload[];
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-carbon-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-2 text-sm font-bold text-carbon-950">{label}</p>
      <div className="space-y-1">
        {payload.map((item) => (
          <p key={item.dataKey} className="flex items-center gap-2 text-sm text-carbon-600">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
              aria-hidden
            />
            <span className="font-semibold">{labels[item.dataKey ?? ""] ?? item.name}:</span>
            <span className="font-mono">{formatKg(Number(item.value ?? 0))}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

function formatTonnesAxis(value: number): string {
  return `${(value / 1000).toFixed(1)}t`;
}

function ComparisonBarChartComponent({ data }: ComparisonBarChartProps) {
  return (
    <div
      role="img"
      aria-label="Bar chart comparing your emissions with global average and sustainable optimal levels."
      className="h-[340px] w-full"
    >
      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={data} margin={{ top: 16, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="category" tickLine={false} axisLine={false} />
          <YAxis
            tickFormatter={formatTonnesAxis}
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="yours" name="Yours" fill="#16a34a" radius={[8, 8, 0, 0]} />
          <Bar
            dataKey="average"
            name="Average"
            fill="#64748b"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="optimal"
            name="Optimal"
            fill="#86efac"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export const ComparisonBarChart = memo(ComparisonBarChartComponent);
