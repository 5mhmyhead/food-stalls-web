"use client";

import { RevenueBreakdownItem } from "@/lib/analytics-types";

const CHART_PALETTE = [
  "bg-primary",
  "bg-secondary",
  "bg-secondary-soft",
  "bg-tertiary",
  "bg-accent",
];

interface RevenueChartProps {
  data: RevenueBreakdownItem[];
  totalRevenue: string;
}

export default function RevenueChart({ data, totalRevenue }: RevenueChartProps) {
  return (
    <div className="flex h-full flex-col justify-between gap-6 rounded-3xl bg-surface p-6">

      <div className="flex flex-col gap-3">
        <h2 className="font-serif text-4xl font-bold">Item Revenue Chart</h2>
        <span className="text-5xl font-bold text-onSurface">
          {totalRevenue}
        </span>
      </div>

      <div className="my-2 flex h-8 w-full items-center gap-1.5 overflow-hidden rounded-sm">
        {data.map((item, index) => {
          const color = CHART_PALETTE[index % CHART_PALETTE.length];

          return (
            <div
              key={item.name}
              style={{ flexGrow: item.amount }}
              className={`h-full basis-0 shrink transition-opacity hover:opacity-90 ${color}`}
              title={`${item.name}: ₱${item.amount.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
            />
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        {data.map((item, index) => {
          const color = CHART_PALETTE[index % CHART_PALETTE.length];

          return (
            <div
              key={item.name}
              className="flex items-center justify-between font-semibold"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-4 shrink-0 rounded-full ${color}`}
                />
                <span className="text-onSurface font-medium">{item.name}</span>
              </div>
              <span className="font-bold text-onSurface">
                ₱
                {item.amount.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}