"use client";

import { CategoryBreakdownItem } from "@/lib/analytics-types";
import { useState, useEffect } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const CHART_PALETTE = [
  { bg: "bg-primary", fill: "fill-primary" },
  { bg: "bg-secondary", fill: "fill-secondary" },
  { bg: "bg-secondary-soft", fill: "fill-secondary-soft" },
  { bg: "bg-tertiary", fill: "fill-tertiary" },
  { bg: "bg-accent", fill: "fill-accent" },
];

interface CategoryChartProps {
  data: CategoryBreakdownItem[];
  totalProductsSold?: number;
}

export default function CategoryChart({
  data,
  totalProductsSold,
}: CategoryChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (data.length === 0) {
    return (
      <div className="flex h-full flex-col justify-between gap-6 rounded-3xl bg-surface p-6">
        <div className="flex h-full items-center justify-center text-center">
          <div className="flex flex-col items-center gap-3">
            <h2 className="font-serif text-4xl font-bold">
              No category sales yet.
            </h2>
            <p className="text-muted">
              Completed orders for this period will appear here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return <div className="h-full w-full rounded-3xl bg-surface" />;
  }

  return (
    <div className="flex h-full flex-col justify-between gap-6 rounded-3xl bg-surface p-6">
      <h2 className="font-serif text-4xl font-bold">Sales by Category</h2>

      <div className="flex flex-1 items-center gap-6">
        <div className="relative flex h-64 w-1/2 flex-1 items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={85}
                outerRadius={120}
                paddingAngle={4}
                cornerRadius={6}
                dataKey="value"
              >
                {data.map((_, index) => {
                  const palette = CHART_PALETTE[index % CHART_PALETTE.length];

                  return (
                    <Cell
                      key={`cell-${index}`}
                      className={`${palette.fill} stroke-none transition-opacity hover:opacity-90`}
                    />
                  );
                })}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl border border-muted/10 bg-surface-container p-2.5">
                        <p className="text-xs font-bold text-onSurface">
                          {payload[0].name}: {payload[0].value}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            {totalProductsSold !== undefined && (
              <>
                <span className="text-3xl font-bold text-onSurface">
                  {totalProductsSold}
                </span>
                <span className="font-medium text-muted">items sold</span>
              </>
            )}
          </div>
        </div>

        <div className="flex w-1/2 flex-1 flex-col justify-center gap-3">
          {data.map((item, index) => {
            const palette = CHART_PALETTE[index % CHART_PALETTE.length];

            return (
              <div
                key={item.name}
                className="flex items-center justify-between font-semibold"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`size-4 shrink-0 rounded-full ${palette.bg}`}
                  />
                  <span className="font-medium text-onSurface">
                    {item.name}
                  </span>
                </div>
                <span className="font-bold text-onSurface">{item.value}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}