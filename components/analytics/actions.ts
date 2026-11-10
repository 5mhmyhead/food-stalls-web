import "server-only";
import { and, eq, gte, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { categories, orderItems, orders, products } from "@/db/schema";
import type { AnalyticsMetric, TimeRange } from "@/lib/analytics-types";

type OrderStatus = (typeof orders.$inferSelect)["status"];

// CHANGE THIS IF PENDING ORDERS SHOULD ALSO COUNT, E.G. ["PENDING", "COMPLETED"]
const COUNTED_STATUSES: OrderStatus[] = ["COMPLETED"];

const MANILA_OFFSET_MS = 8 * 60 * 60 * 1000;

// START OF TODAY / THIS WEEK (MONDAY) / THIS MONTH IN MANILA TIME, AS A UTC INSTANT
function getRangeStart(range: TimeRange): Date | null {
  if (range === "all-time") return null;

  // SHIFT "NOW" SO THE UTC FIELDS READ AS MANILA WALL-CLOCK TIME
  const local = new Date(Date.now() + MANILA_OFFSET_MS);
  const y = local.getUTCFullYear();
  const m = local.getUTCMonth();
  const d = local.getUTCDate();

  let startLocal: number;
  if (range === "daily") startLocal = Date.UTC(y, m, d);
  else if (range === "weekly") startLocal = Date.UTC(y, m, d - ((local.getUTCDay() + 6) % 7));
  else startLocal = Date.UTC(y, m, 1);

  return new Date(startLocal - MANILA_OFFSET_MS);
}

// KEEPS THE TOP (limit - 1) ENTRIES AND FOLDS THE REST INTO "OTHER" SO THE 5-COLOR PALETTE NEVER REPEATS
function groupTail(items: { name: string; value: number }[], limit = 5) {
  const sorted = [...items].sort((a, b) => b.value - a.value);
  if (sorted.length <= limit) return sorted;

  const head = sorted.slice(0, limit - 1);
  const other = sorted.slice(limit - 1).reduce((sum, i) => sum + i.value, 0);
  return [...head, { name: "Other", value: other }];
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export async function getAnalytics(range: TimeRange): Promise<AnalyticsMetric> {
  const start = getRangeStart(range);

  // and() IGNORES undefined, SO ALL-TIME SIMPLY SKIPS THE DATE FILTER
  const orderFilter = and(
    inArray(orders.status, COUNTED_STATUSES),
    start ? gte(orders.orderedAt, start) : undefined,
  );

  const [rows, [orderCount]] = await Promise.all([
    db
      .select({
        name: products.name,
        categoryName: categories.name,
        unitsSold: sql<number>`coalesce(sum(${orderItems.quantity}), 0)`.mapWith(Number),
        revenue: sql<number>`coalesce(sum(${orderItems.quantity} * ${orderItems.unitPrice}), 0)`.mapWith(Number),
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .innerJoin(products, eq(orderItems.productId, products.id))
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(orderFilter)
      .groupBy(products.id, products.name, categories.name),

    db
      .select({ customers: sql<number>`count(*)`.mapWith(Number) })
      .from(orders)
      .where(orderFilter),
  ]);

  const productsSold = rows.reduce((sum, r) => sum + r.unitsSold, 0);
  const revenue = rows.reduce((sum, r) => sum + r.revenue, 0);

  const byUnits = [...rows].sort((a, b) => b.unitsSold - a.unitsSold);
  const top = byUnits[0];
  // WITH ONLY ONE SOLD PRODUCT, "LOWEST" WOULD JUST REPEAT THE TOP ONE
  const lowest = byUnits.length > 1 ? byUnits[byUnits.length - 1] : undefined;

  const categoryUnits = new Map<string, number>();
  for (const r of rows) {
    categoryUnits.set(r.categoryName, (categoryUnits.get(r.categoryName) ?? 0) + r.unitsSold);
  }

  return {
    revenue: round2(revenue),
    productsSold,
    customers: orderCount?.customers ?? 0,
    topProduct: top ? { name: top.name, salesCount: top.unitsSold } : null,
    lowestProduct: lowest ? { name: lowest.name, salesCount: lowest.unitsSold } : null,
    incomeBreakdown: groupTail(rows.map((r) => ({ name: r.name, value: r.revenue }))).map(
      (i) => ({ name: i.name, amount: round2(i.value) }),
    ),
    categoryBreakdown: groupTail(
      [...categoryUnits].map(([name, value]) => ({ name, value })),
    ).map((i) => ({
      name: i.name,
      value: productsSold ? Math.round((i.value / productsSold) * 100) : 0,
    })),
  };
}