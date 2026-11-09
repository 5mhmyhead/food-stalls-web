"use client";

import { useState } from "react";
import { BarChart3, Package, Users, Flame, TrendingDown } from "lucide-react";
import { mockAnalyticsData, type TimeRange } from "@/lib/mock-data";
import { TimeRangeSelect } from "@/components/analytics/time-range-select";
import { AnalyticsCard } from "@/components/analytics/analytics-card";
import RevenueChart from "@/components/analytics/revenue-chart";
import CategoryChart from "@/components/analytics/category-chart";

const TIME_RANGE_PREFIXES: Record<TimeRange, string> = {
  daily: "Today's",
  weekly: "This Week",
  monthly: "This Month",
  "all-time": "All Time",
};

export default function AnalyticsPage() {
  const [range, setRange] = useState<TimeRange>("all-time");

  const metrics = mockAnalyticsData[range];
  const prefix = TIME_RANGE_PREFIXES[range];

  return (
    <section className="flex h-full w-full flex-col gap-6 overflow-y-auto rounded-3xl">
      {/* Fixed Header */}
      <div className="flex shrink-0 items-end justify-between px-1">
        <h1 className="font-serif text-6xl font-black leading-tight">Analytics</h1>
        <TimeRangeSelect value={range} onChange={setRange} />
      </div>

      <div className="grid flex-1 min-h-0 w-full grid-cols-2 gap-6">
        <AnalyticsCard
          variant="featured"
          icon={<Flame className="size-10 stroke-[2.5]" />}
          title={`${prefix} Top-selling Product`}
          value={metrics.topProduct.name}
          subtext={`${metrics.topProduct.salesCount} sales during this period`}
          bgColor="bg-primary"
        />
        <AnalyticsCard
          variant="featured"
          icon={<TrendingDown className="size-10 stroke-[2.5]" />}
          title={`${prefix} Lowest Sales`}
          value={metrics.lowestProduct.name}
          subtext={`${metrics.lowestProduct.salesCount} sales during this period`}
          bgColor="bg-secondary"
        />
      </div>

      <div className="grid flex-1 min-h-0 w-full grid-cols-3 gap-6">
        <AnalyticsCard
          icon={<BarChart3 className="size-8 stroke-[2.5]" />}
          title={`${prefix} Revenue`}
          value={metrics.revenue}
          iconBgColor="bg-primary"
        />
        <AnalyticsCard
          icon={<Package className="size-8 stroke-[2.5]" />}
          title={`${prefix} Products Sold`}
          value={metrics.productsSold}
          iconBgColor="bg-secondary"
        />
        <AnalyticsCard
          icon={<Users className="size-8 stroke-[2.5]" />}
          title={`${prefix} Customers`}
          value={metrics.customers}
          iconBgColor="bg-accent"
        />
      </div>

      <div className="grid flex-1 min-h-0 w-full grid-cols-2 gap-6">
        <CategoryChart
          data={metrics.categoryBreakdown}
          totalProductsSold={metrics.productsSold}
        />
        <RevenueChart
          data={metrics.incomeBreakdown}
          totalRevenue={metrics.revenue}
        />
      </div>
    </section>
  );
}