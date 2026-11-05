"use client";

import { useState } from "react";
import { BarChart3, Package, Users, Flame, TrendingDown } from "lucide-react";
import { mockAnalyticsData, mockOrderHistory, type TimeRange } from "@/lib/mock-data";
import { TimeRangeSelect } from "@/components/home/time-range-select";
import { AnalyticsCard } from "@/components/home/analytics-card";
import PendingOrderCard from "@/components/home/pending-order-card";
import PendingDetailsCard from "@/components/home/pending-details-card";
import Calendar from "@/components/home/calendar";
import WelcomeCard from "@/components/home/welcome-card";

const TIME_RANGE_PREFIXES: Record<TimeRange, string> = {
  daily: "Today's",
  weekly: "This Week",
  monthly: "This Month",
  "all-time": "All Time",
};

export default function HomePage() {
  const [range, setRange] = useState<TimeRange>("all-time");
  const [orders, setOrders] = useState(mockOrderHistory);

  const metrics = mockAnalyticsData[range];
  const prefix = TIME_RANGE_PREFIXES[range];

  const pendingOrders = orders.filter(
    (item) => item.order.status.toUpperCase() === "PENDING"
  );

  const handleComplete = (orderId: number) => {
    setOrders((prev) =>
      prev.map((item) =>
        item.id === orderId
          ? { ...item, order: { ...item.order, status: "COMPLETED" } }
          : item
      )
    );
  };

  const handleCancel = (orderId: number) => {
    setOrders((prev) =>
      prev.map((item) =>
        item.id === orderId
          ? { ...item, order: { ...item.order, status: "CANCELLED" } }
          : item
      )
    );
  };

  return (
    <section className="flex h-full w-full flex-col rounded-3xl gap-6 overflow-y-auto">
      <div className="flex shrink-0 items-end justify-between">
        <h1 className="font-serif text-6xl font-black">Home</h1>
        <TimeRangeSelect value={range} onChange={setRange} />
      </div>

      <div className="grid w-full grid-cols-3 gap-6">
        <WelcomeCard username="username"/>
        <Calendar />
      </div>

      <div className="grid w-full grid-cols-2 gap-6">
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

      <div className="grid w-full grid-cols-3 gap-6">
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

      <div className="flex min-h-175 w-full gap-6">
        <div className="flex flex-1 flex-col rounded-3xl bg-surface p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-4xl font-bold">Pending Orders</h2>
            <span className="rounded-xl px-3 py-2 font-medium bg-muted/10 text-muted">
              {pendingOrders.length} pending
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
            {pendingOrders.length > 0 ? (
              pendingOrders.map((historyItem) => (
                <PendingOrderCard
                  key={historyItem.id}
                  historyItem={historyItem}
                  onComplete={handleComplete}
                  onCancel={handleCancel}
                />
              ))
            ) : (
              <div className="flex h-full items-center justify-center text-muted">
                No pending orders!
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          <PendingDetailsCard />
        </div>
      </div>
    </section>
  );
}