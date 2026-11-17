"use client";

import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import type { DayOfWeekMetric } from "@/lib/analytics-types";

interface BusiestDaysChartProps {
  data: DayOfWeekMetric[];
  peakDay: DayOfWeekMetric | null;
}

export default function BusiestDaysChart({
  data,
  peakDay,
}: BusiestDaysChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalOrders = data.reduce((sum, d) => sum + d.orders, 0);

  if (totalOrders === 0) {
    return (
      <div className="flex h-full min-h-96 flex-col justify-between gap-6 rounded-3xl bg-surface p-6">
        <div className="flex h-full items-center justify-center text-center">
          <div className="flex flex-col items-center gap-3">
            <h2 className="font-serif text-4xl font-bold">
              No orders in the last 7 days.
            </h2>
            <p className="text-muted">
              Completed orders from the past 7 days will appear here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return <div className="h-full min-h-96 w-full rounded-3xl bg-surface" />;
  }

  const maxOrders = Math.max(...data.map((d) => d.orders));

  return (
    <div className="flex h-full min-h-96 flex-col justify-between gap-6 rounded-3xl bg-surface p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-serif text-4xl font-bold">Busiest Days</h2>

        {peakDay && (
          <span className="shrink-0 rounded-xl bg-muted/10 px-3 py-2 font-medium text-muted">
            Peak: {peakDay.fullDay}
          </span>
        )}
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: -16, bottom: 4 }}
          >
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={({ x, y, payload }) => (
                <text
                  x={x}
                  y={y}
                  dy="0.71em"
                  textAnchor="middle"
                  className="fill-onSurface text-base font-medium"
                >
                  {payload.value}
                </text>
              )}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={({ x, y, payload }) => (
                <text
                  x={x}
                  y={y}
                  dy="0.35em"
                  textAnchor="end"
                  className="fill-onSurface text-base font-medium"
                >
                  {payload.value}
                </text>
              )}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const item = payload[0].payload as DayOfWeekMetric;

                return (
                  <div className="rounded-xl border border-muted/10 bg-surface-container p-3">
                    <p className="text-sm font-bold text-onSurface">
                      {item.fullDay}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-primary">
                      {item.orders} {item.orders === 1 ? "order" : "orders"} (
                      {item.unitsSold} items)
                    </p>
                    <p className="text-xs font-medium text-muted">
                      ₱
                      {item.revenue.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="orders" radius={[6, 6, 0, 0]} maxBarSize={44}>
              {data.map((entry) => {
                const isPeak = entry.orders === maxOrders && entry.orders > 0;
                return (
                  <Cell
                    key={entry.day}
                    className={`transition-opacity hover:opacity-85 ${
                      isPeak ? "fill-primary" : "fill-primary/30"
                    }`}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}