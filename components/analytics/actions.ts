import "server-only";
import { and, eq, gte, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { categories, orderItems, orders, products } from "@/db/schema";
import type { AnalyticsMetric, TimeRange } from "@/lib/analytics-types";

type OrderStatus = (typeof orders.$inferSelect)["status"];

const COUNTED_STATUSES: OrderStatus[] = ["COMPLETED"];

const MANILA_OFFSET_MS = 8 * 60 * 60 * 1000;

function getRangeStart(range: TimeRange): Date | null {
  if (range === "all-time") return null;

  const local = new Date(Date.now() + MANILA_OFFSET_MS);
  const y = local.getUTCFullYear();
  const m = local.getUTCMonth();
  const d = local.getUTCDate();

  let startLocal: number;
  if (range === "daily") startLocal = Date.UTC(y, m, d);
  else if (range === "weekly")
    startLocal = Date.UTC(y, m, d - ((local.getUTCDay() + 6) % 7));
  else startLocal = Date.UTC(y, m, 1);

  return new Date(startLocal - MANILA_OFFSET_MS);
}

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

  const orderFilter = and(
    inArray(orders.status, COUNTED_STATUSES),
    start ? gte(orders.orderedAt, start) : undefined
  );

  const activeProductFilter = and(
    orderFilter,
    eq(products.isArchived, false)
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
      .where(activeProductFilter)
      .groupBy(products.id, products.name, categories.name),

    db
      .select({
        customers: sql<number>`count(distinct ${orders.id})`.mapWith(Number),
      })
      .from(orders)
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(activeProductFilter),
  ]);

  const productsSold = rows.reduce((sum, r) => sum + r.unitsSold, 0);
  const revenue = rows.reduce((sum, r) => sum + r.revenue, 0);

  const byUnits = [...rows].sort((a, b) => b.unitsSold - a.unitsSold);
  const top = byUnits[0];

  const lowest = byUnits.length > 1 ? byUnits[byUnits.length - 1] : undefined;

  const categoryUnits = new Map<string, number>();
  for (const r of rows) {
    categoryUnits.set(
      r.categoryName,
      (categoryUnits.get(r.categoryName) ?? 0) + r.unitsSold
    );
  }

  return {
    revenue: round2(revenue),
    productsSold,
    customers: orderCount?.customers ?? 0,
    topProduct: top ? { name: top.name, salesCount: top.unitsSold } : null,
    lowestProduct: lowest ? { name: lowest.name, salesCount: lowest.unitsSold } : null,
    incomeBreakdown: groupTail(
      rows.map((r) => ({ name: r.name, value: r.revenue }))
    ).map((i) => ({ name: i.name, amount: round2(i.value) })),
    categoryBreakdown: groupTail(
      [...categoryUnits].map(([name, value]) => ({ name, value }))
    ).map((i) => ({
      name: i.name,
      value: productsSold ? Math.round((i.value / productsSold) * 100) : 0,
    })),
  };
}