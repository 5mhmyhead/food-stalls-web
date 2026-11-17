export type TimeRange = "daily" | "weekly" | "monthly" | "all-time";

export const TIME_RANGES: TimeRange[] = ["daily", "weekly", "monthly", "all-time"];

export function parseRange(value?: string): TimeRange {
  return TIME_RANGES.includes(value as TimeRange) ? (value as TimeRange) : "all-time";
}

export interface RevenueBreakdownItem {
  name: string;
  amount: number;
}

export interface CategoryBreakdownItem {
  name: string;
  value: number;
}

export interface ProductStat {
  name: string;
  salesCount: number;
}

export interface ProductPerformanceItem {
  id: number;
  name: string;
  categoryName: string;
  categoryIcon: string;
  imageUrl: string | null;
  unitsSold: number;
  revenue: number;
  stock: number;
}

export interface PeriodMetricDelta {
  current: number;
  previous: number;
  percentageChange: number | null;
}

export interface PeriodComparison {
  comparisonLabel: string;
  currentLabel: string;
  previousLabel: string;
  revenue: PeriodMetricDelta;
  productsSold: PeriodMetricDelta;
  customers: PeriodMetricDelta;
  avgOrderValue: PeriodMetricDelta;
}

export interface AnalyticsMetric {
  revenue: number;
  productsSold: number;
  customers: number;
  topProduct: ProductStat | null;
  lowestProduct: ProductStat | null;
  incomeBreakdown: RevenueBreakdownItem[];
  categoryBreakdown: CategoryBreakdownItem[];
}

export interface DayOfWeekMetric {
  day: string;
  fullDay: string;
  orders: number;
  revenue: number;
  unitsSold: number;
}

export interface StockForecastItem {
  id: number;
  name: string;
  categoryName: string;
  categoryIcon: string;
  imageUrl: string | null;
  stock: number;
  unitsSold7d: number;
  dailyVelocity: number;
  daysLeft: number | null;
  isLowStock: boolean;
}

export interface SevenDayInsights {
  busiestDays: DayOfWeekMetric[];
  peakDay: DayOfWeekMetric | null;
  stockForecast: StockForecastItem[];
  lowStockThreshold: number;
  topSellers: ProductPerformanceItem[];
  slowMovers: ProductPerformanceItem[];
  periodComparison: PeriodComparison;
}