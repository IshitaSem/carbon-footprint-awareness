"use client";

import { memo } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatKg } from "@/lib/carbon-calculator";
import type { PieChartData } from "@/types";

interface EmissionPieChartProps {
  data: PieChartData[];
}

interface PieTooltipPayload {
  name?: string;
  value?: number;
  color?: string;
  payload?: PieChartData;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: PieTooltipPayload[];
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0];

  return (
    <div className="rounded-xl border border-carbon-200 bg-white px-4 py-3 shadow-lg">
      <p className="text-sm font-bold text-carbon-950">{item.name}</p>
      <p className="font-mono text-sm text-carbon-600">
        {formatKg(Number(item.value ?? 0))} CO2/year
      </p>
    </div>
  );
}

function CustomLegend({ payload }: { payload?: PieTooltipPayload[] }) {
  if (!payload?.length) {
    return null;
  }

  return (
    <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2">
      {payload.map((item) => (
        <li
          key={item.name ?? item.payload?.name}
          className="flex items-center gap-2 text-sm text-carbon-600"
        >
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: item.color ?? item.payload?.color }}
            aria-hidden
          />
          {item.name ?? item.payload?.name}
        </li>
      ))}
    </ul>
  );
}

function EmissionPieChartComponent({ data }: EmissionPieChartProps) {
  return (
    <div
      role="img"
      aria-label="Donut chart showing annual emissions split by transport, electricity, food, and waste."
      className="h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export const EmissionPieChart = memo(EmissionPieChartComponent);
