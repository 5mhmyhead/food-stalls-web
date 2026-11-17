import {
  BarChart3,
  Package,
  Users,
  Flame,
  TrendingDown,
} from "lucide-react";
import { TimeRangeSelect } from "@/components/analytics/time-range-select";
import { AnalyticsCard } from "@/components/analytics/analytics-card";
import RevenueChart from "@/components/analytics/revenue-chart";
import CategoryChart from "@/components/analytics/category-chart";
import BusiestDaysChart from "@/components/analytics/busiest-days-chart";
import StockForecastCard from "@/components/analytics/stock-forecast-card";
import PeriodComparisonCard from "@/components/analytics/period-comparison-card";
import ProductMoversCard from "@/components/analytics/product-movers-card";
import {
  getAnalytics,
  getSevenDayInsights,
} from "@/components/analytics/actions";
import { parseRange, type TimeRange } from "@/lib/analytics-types";
import { peso } from "@/lib/product-utils";
import { requireAdmin } from "@/lib/dal";

const TIME_RANGE_PREFIXES: Record<TimeRange, string> = {
  daily: "Today's",
  weekly: "This Week's",
  monthly: "This Month's",
  "all-time": "All Time",
};

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  await requireAdmin();

  const { range: rangeParam } = await searchParams;
  const range = parseRange(rangeParam);

  const [metrics, sevenDayInsights] = await Promise.all([
    getAnalytics(range),
    getSevenDayInsights(),
  ]);

  const prefix = TIME_RANGE_PREFIXES[range];
  const revenueLabel = peso.format(metrics.revenue);

  return (
    <section className="flex h-full w-full flex-col gap-6 overflow-y-auto rounded-3xl">
      <div className="flex shrink-0 items-end justify-between px-1">
        <h1 className="pl-2 font-serif text-6xl font-black leading-tight">
          Analytics
        </h1>
        <TimeRangeSelect value={range} />
      </div>

      <div className="grid w-full shrink-0 grid-cols-2 gap-6">
        <AnalyticsCard
          variant="featured"
          icon={<Flame className="size-10 stroke-[2.5]" />}
          title={`${prefix} Top-selling Product`}
          value={metrics.topProduct?.name ?? "No sales yet"}
          subtext={
            metrics.topProduct
              ? `${metrics.topProduct.salesCount} sales during this period`
              : "Nothing sold in this period"
          }
          bgColor="bg-primary"
        />
        <AnalyticsCard
          variant="featured"
          icon={<TrendingDown className="size-10 stroke-[2.5]" />}
          title={`${prefix} Lowest Sales`}
          value={metrics.lowestProduct?.name ?? "—"}
          subtext={
            metrics.lowestProduct
              ? `${metrics.lowestProduct.salesCount} sales during this period`
              : "Needs at least two active products"
          }
          bgColor="bg-secondary"
        />
      </div>

      <div className="grid w-full shrink-0 grid-cols-3 gap-6">
        <AnalyticsCard
          icon={<BarChart3 className="size-8 stroke-[2.5]" />}
          title={`${prefix} Revenue`}
          value={revenueLabel}
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

      <div className="grid w-full shrink-0 grid-cols-2 gap-6">
        <CategoryChart
          data={metrics.categoryBreakdown}
          totalProductsSold={metrics.productsSold}
        />
        <RevenueChart
          data={metrics.incomeBreakdown}
          totalRevenue={revenueLabel}
        />
      </div>

      <div className="flex w-full shrink-0 flex-col gap-6">
        <h1 className="pl-2 font-serif text-6xl font-black leading-tight">
          Weekly Operations
        </h1>

        <div className="grid w-full grid-cols-2 gap-6">
          <BusiestDaysChart
            data={sevenDayInsights.busiestDays}
            peakDay={sevenDayInsights.peakDay}
          />
          <ProductMoversCard
            topSellers={sevenDayInsights.topSellers}
            slowMovers={sevenDayInsights.slowMovers}
          />
        </div>

        <div className="grid w-full grid-cols-3 gap-6">
          <div className="col-span-1">
            <PeriodComparisonCard
              comparison={sevenDayInsights.periodComparison}
            />
          </div>
          <div className="col-span-2">
            <StockForecastCard items={sevenDayInsights.stockForecast} />
          </div>
        </div>
      </div>
    </section>
  );
}