"use client";

import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Package,
  ShoppingBag,
  Receipt,
} from "lucide-react";
import type {
  PeriodComparison,
  PeriodMetricDelta,
} from "@/lib/analytics-types";

interface PeriodComparisonCardProps {
  comparison: PeriodComparison;
}

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

function DeltaBadge({ delta }: { delta: PeriodMetricDelta }) {
  if (delta.percentageChange === null) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
        <TrendingUp className="size-4" />
        New
      </span>
    );
  }

  if (delta.percentageChange > 0) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
        <TrendingUp className="size-4" />+{delta.percentageChange}%
      </span>
    );
  }

  if (delta.percentageChange < 0) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-tertiary/10 px-3 py-2 text-sm font-medium text-tertiary">
        <TrendingDown className="size-4" />
        {delta.percentageChange}%
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-muted/10 px-3 py-2 text-sm font-medium text-muted">
      <Minus className="size-4" />
      0%
    </span>
  );
}

export default function PeriodComparisonCard({
  comparison,
}: PeriodComparisonCardProps) {
  const hasAnyData =
    comparison.revenue.current > 0 ||
    comparison.revenue.previous > 0 ||
    comparison.customers.current > 0 ||
    comparison.customers.previous > 0;

  if (!hasAnyData) {
    return (
      <div className="flex h-full min-h-96 flex-col justify-between gap-6 rounded-3xl bg-surface p-6">
        <div className="flex h-full items-center justify-center text-center">
          <div className="flex flex-col items-center gap-3">
            <h2 className="font-serif text-4xl font-bold">
              No comparison data yet.
            </h2>
            <p className="text-muted">
              Completed orders across consecutive periods will appear here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      label: "Revenue",
      currentValue: peso.format(comparison.revenue.current),
      previousValue: `${comparison.previousLabel}: ${peso.format(
        comparison.revenue.previous
      )}`,
      delta: comparison.revenue,
      icon: <BarChart3 className="size-5 stroke-[2.5]" />,
      iconBgColor: "bg-primary",
    },
    {
      label: "Items Sold",
      currentValue: comparison.productsSold.current.toLocaleString("en-PH"),
      previousValue: `${comparison.previousLabel}: ${comparison.productsSold.previous.toLocaleString(
        "en-PH"
      )}`,
      delta: comparison.productsSold,
      icon: <Package className="size-5 stroke-[2.5]" />,
      iconBgColor: "bg-secondary",
    },
    {
      label: "Orders",
      currentValue: comparison.customers.current.toLocaleString("en-PH"),
      previousValue: `${comparison.previousLabel}: ${comparison.customers.previous.toLocaleString(
        "en-PH"
      )}`,
      delta: comparison.customers,
      icon: <ShoppingBag className="size-5 stroke-[2.5]" />,
      iconBgColor: "bg-accent",
    },
    {
      label: "Avg. Order Value",
      currentValue: peso.format(comparison.avgOrderValue.current),
      previousValue: `${comparison.previousLabel}: ${peso.format(
        comparison.avgOrderValue.previous
      )}`,
      delta: comparison.avgOrderValue,
      icon: <Receipt className="size-5 stroke-[2.5]" />,
      iconBgColor: "bg-secondary-soft",
    },
  ];

  return (
    <div className="flex h-full flex-col justify-between gap-5 rounded-3xl bg-surface p-6">
      <h2 className="font-serif text-4xl font-bold">Period Comparison</h2>

      <div className="flex flex-1 flex-col gap-2.5">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="flex flex-col justify-between gap-2.5 rounded-2xl border-2 border-transparent bg-surface-container p-4 text-left transition-colors duration-300 hover:border-primary/40"
          >
            <div className="flex w-full items-center justify-between gap-3">
              <div
                className={`flex size-11 shrink-0 items-center justify-center rounded-full text-onSurface ${metric.iconBgColor}`}
              >
                {metric.icon}
              </div>

              <DeltaBadge delta={metric.delta} />
            </div>

            <div className="flex w-full flex-col items-start gap-0.5 text-left">
              <span className="text-base font-medium text-muted">
                {metric.label}
              </span>
              <div className="flex w-full items-baseline justify-between gap-2">
                <span className="min-w-0 truncate text-3xl font-bold text-onSurface">
                  {metric.currentValue}
                </span>
                <span className="shrink-0 text-sm font-medium text-muted">
                  {metric.previousValue}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}