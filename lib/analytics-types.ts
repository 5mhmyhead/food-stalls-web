
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

export interface AnalyticsMetric {
  revenue: number;
  productsSold: number;
  customers: number;
  topProduct: ProductStat | null;
  lowestProduct: ProductStat | null;
  incomeBreakdown: RevenueBreakdownItem[];
  categoryBreakdown: CategoryBreakdownItem[];
}