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
import type { ProductPerformanceItem } from "@/lib/analytics-types";

interface ProductMoversCardProps {
  topSellers: ProductPerformanceItem[];
  slowMovers: ProductPerformanceItem[];
}

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

function truncateLabel(label: string, max = 16) {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}

export default function ProductMoversCard({
  topSellers,
  slowMovers,
}: ProductMoversCardProps) {
  const [activeTab, setActiveTab] = useState<"top" | "slow">("top");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const items = activeTab === "top" ? topSellers : slowMovers;
  const hasAnyItems = topSellers.length > 0 || slowMovers.length > 0;

  if (!hasAnyItems) {
    return (
      <div className="flex h-full min-h-96 flex-col justify-between gap-6 rounded-3xl bg-surface p-6">
        <div className="flex h-full items-center justify-center text-center">
          <div className="flex flex-col items-center gap-3">
            <h2 className="font-serif text-4xl font-bold">
              No product movement yet.
            </h2>
            <p className="text-muted">
              Active menu items and their 7-day sales performance will appear
              here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return <div className="h-full min-h-96 w-full rounded-3xl bg-surface" />;
  }

  const maxUnits =
    items.length > 0 ? Math.max(...items.map((item) => item.unitsSold)) : 0;

  return (
    <div className="flex h-full min-h-96 flex-col justify-between gap-6 rounded-3xl bg-surface p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-serif text-4xl font-bold">
          {activeTab === "top" ? "Top Sellers" : "Slow Movers"}
        </h2>

        <div className="flex shrink-0 items-center gap-1 rounded-xl bg-muted/10 p-1 font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("top")}
            className={`rounded-lg px-3 py-1 transition-colors ${
              activeTab === "top"
                ? "bg-primary text-background"
                : "text-muted hover:text-onSurface"
            }`}
          >
            Top Sellers
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("slow")}
            className={`rounded-lg px-3 py-1 transition-colors ${
              activeTab === "slow"
                ? "bg-tertiary text-background"
                : "text-muted hover:text-onSurface"
            }`}
          >
            Slow Movers
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex h-full items-center justify-center text-center">
          <div className="flex flex-col items-center gap-3">
            <h2 className="font-serif text-4xl font-bold">
              {activeTab === "top"
                ? "No sales in the last 7 days."
                : "No slow movers found."}
            </h2>
            <p className="text-muted">
              {activeTab === "top"
                ? "Completed orders from the past 7 days will rank top sellers here."
                : "All active items sold well over the past 7 days."}
            </p>
          </div>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={items}
              layout="vertical"
              margin={{ top: 4, right: 12, left: 0, bottom: 6 }}
            >
              <XAxis
                type="number"
                allowDecimals={false}
                domain={[0, (dataMax: number) => Math.max(dataMax, 4)]}
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
                type="category"
                dataKey="name"
                width={148}
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
                    {truncateLabel(String(payload.value))}
                  </text>
                )}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const item = payload[0].payload as ProductPerformanceItem;
                  const isDeadStock =
                    activeTab === "slow" && item.unitsSold === 0;

                  return (
                    <div className="rounded-xl border border-muted/10 bg-surface-container p-3">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-onSurface">
                          {item.name}
                        </p>
                        {isDeadStock && (
                          <span className="rounded-md bg-tertiary/15 px-1.5 py-0.5 text-[10px] font-bold text-tertiary">
                            Dead stock
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-muted">
                        {item.categoryName}
                      </p>
                      <p
                        className={`mt-1.5 text-xs font-semibold ${
                          activeTab === "top"
                            ? "text-primary"
                            : isDeadStock
                              ? "text-tertiary"
                              : "text-secondary"
                        }`}
                      >
                        {item.unitsSold}{" "}
                        {item.unitsSold === 1 ? "unit" : "units"} sold •{" "}
                        {peso.format(item.revenue)}
                      </p>
                      <p className="text-xs font-medium text-muted">
                        {item.stock <= 0
                          ? "No stock"
                          : `${item.stock} in stock`}
                      </p>
                    </div>
                  );
                }}
              />
              <Bar
                dataKey="unitsSold"
                radius={[0, 6, 6, 0]}
                maxBarSize={32}
                minPointSize={8}
              >
                {items.map((entry) => {
                  const isTopLeader =
                    activeTab === "top" &&
                    entry.unitsSold === maxUnits &&
                    entry.unitsSold > 0;
                  const isDeadStock =
                    activeTab === "slow" && entry.unitsSold === 0;

                  const fillClass =
                    activeTab === "top"
                      ? isTopLeader
                        ? "fill-primary"
                        : "fill-primary/35"
                      : isDeadStock
                        ? "fill-tertiary"
                        : "fill-secondary";

                  return (
                    <Cell
                      key={entry.id}
                      className={`transition-opacity hover:opacity-85 ${fillClass}`}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}