"use client";

import { useState } from "react";
import { BarChart3, Package, Users, Award } from "lucide-react";
import { mockAnalyticsData, type TimeRange } from "@/lib/mock-data";
import { TimeRangeSelect } from "@/components/home/time-range-select";
import { AnalyticsCard } from "@/components/home/analytics-card";

const TIME_RANGE_PREFIXES: Record<TimeRange, string> = {
  daily: "Daily",
  weekly: "This Week",
  monthly: "This Month",
  "all-time": "All Time",
};

export default function HomePage() {
  const [range, setRange] = useState<TimeRange>("all-time");
  const metrics = mockAnalyticsData[range];
  const prefix = TIME_RANGE_PREFIXES[range];

  return (
    <section className="flex h-full w-full flex-col gap-6 overflow-hidden">
      <div className="flex shrink-0 items-center justify-between">
        <h1 className="font-serif text-6xl font-black">Home</h1>
      </div>

      <div className="grid w-full grid-cols-3 gap-6">
        <AnalyticsCard
          icon={<BarChart3 className="size-8" />}
          title={`${prefix} Revenue`}
          value={metrics.revenue}
          iconBgColor="bg-primary"
        />
        <AnalyticsCard
          icon={<Package className="size-8" />}
          title={`${prefix} Products Sold`}
          value={metrics.productsSold}
          iconBgColor="bg-secondary"
        />
        <AnalyticsCard
          icon={<Users className="size-8" />}
          title={`${prefix} Customers`}
          value={metrics.customers}
          iconBgColor="bg-accent" 
        />
      </div>

      <TimeRangeSelect value={range} onChange={setRange} />
    </section>
  );
}