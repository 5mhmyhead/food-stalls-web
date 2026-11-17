"use client";

import Image from "next/image";
import { getCategoryIcon } from "@/lib/category-icons";
import type { StockForecastItem } from "@/lib/analytics-types";

interface StockForecastCardProps {
  items: StockForecastItem[];
}

function getRunoutLabel(item: StockForecastItem) {
  if (item.stock <= 0) return "Out of stock";
  if (item.daysLeft === null) return "No sales in 7d";
  if (item.daysLeft < 1) return "< 1 day left";
  return `~${item.daysLeft} ${item.daysLeft === 1 ? "day" : "days"} left`;
}

export default function StockForecastCard({ items }: StockForecastCardProps) {
  if (items.length === 0) {
    return (
      <div className="flex h-full min-h-92 flex-col overflow-hidden rounded-3xl bg-surface p-6">
        <div className="flex h-full items-center justify-center text-center">
          <div className="flex flex-col items-center gap-3">
            <h2 className="font-serif text-4xl font-bold">
              No stock alerts yet.
            </h2>
            <p className="text-muted">
              Active items with recent sales or low stock will appear here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const atRiskCount = items.filter(
    (item) =>
      item.stock <= 0 ||
      item.isLowStock ||
      (item.daysLeft !== null && item.daysLeft <= 5)
  ).length;

  return (
    <div className="flex h-full min-h-92 flex-col overflow-hidden rounded-3xl bg-surface">
      <div className="flex shrink-0 items-center justify-between p-6 pb-4">
        <h2 className="font-serif text-4xl font-bold">Stock Forecast</h2>

        <span className="shrink-0 rounded-xl bg-muted/10 px-3 py-2 font-medium text-muted">
          {atRiskCount} at risk
        </span>
      </div>

      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-0 flex flex-col gap-3.5 overflow-y-auto px-6 pb-6">
          {items.map((item) => {
            const soldOut = item.stock <= 0;
            const critical =
              soldOut || (item.daysLeft !== null && item.daysLeft <= 2);
            const warning =
              !critical &&
              (item.isLowStock ||
                (item.daysLeft !== null && item.daysLeft <= 5));

            const theme = critical
              ? {
                  borderHover: "hover:border-tertiary",
                  text: "text-tertiary",
                  badgeBg: "bg-tertiary/10",
                }
              : warning
                ? {
                    borderHover: "hover:border-secondary",
                    text: "text-secondary",
                    badgeBg: "bg-secondary/10",
                  }
                : {
                    borderHover: "hover:border-primary",
                    text: "text-primary",
                    badgeBg: "bg-primary/10",
                  };

            const CategoryIcon = getCategoryIcon(item.categoryIcon);

            return (
              <article
                key={item.id}
                className={`group flex h-32 w-full shrink-0 overflow-hidden rounded-2xl border-2 border-transparent bg-surface-container transition-all duration-300 ${
                  theme.borderHover
                } ${soldOut ? "opacity-70" : ""}`}
              >
                <div className="relative flex w-32 shrink-0 items-center justify-center bg-background">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="128px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <CategoryIcon className="size-12 text-muted/50 transition-colors duration-300 group-hover:text-muted" />
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm text-muted">
                        {item.categoryName}
                      </p>
                      <h3 className="mt-0.5 line-clamp-1 font-serif text-2xl font-bold leading-tight text-onSurface">
                        {item.name}
                      </h3>
                    </div>

                    <span
                      className={`shrink-0 rounded-xl px-3 py-2 text-sm font-medium ${theme.badgeBg} ${theme.text}`}
                    >
                      {getRunoutLabel(item)}
                    </span>
                  </div>

                  <div className="flex items-end justify-between pt-1">
                    <p className="text-sm font-medium text-muted">
                      {item.unitsSold7d > 0
                        ? `${item.dailyVelocity}/day (${item.unitsSold7d} sold in 7d)`
                        : "0 sold in 7d"}
                    </p>

                    <p className={`text-base font-semibold ${theme.text}`}>
                      {soldOut
                        ? "No stock"
                        : item.isLowStock
                          ? `Only ${item.stock} left`
                          : `${item.stock} in stock`}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}