import "server-only";
import { and, eq, gte, inArray, lt, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  categories,
  orderItems,
  orders,
  products,
  shopSettings,
} from "@/db/schema";
import type {
  AnalyticsMetric,
  DayOfWeekMetric,
  PeriodComparison,
  PeriodMetricDelta,
  ProductPerformanceItem,
  SevenDayInsights,
  StockForecastItem,
  TimeRange,
} from "@/lib/analytics-types";

type OrderStatus = (typeof orders.$inferSelect)["status"];

const COUNTED_STATUSES: OrderStatus[] = ["COMPLETED"];

const MANILA_OFFSET_MS = 8 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

const DAYS_MON_FIRST = [
  { utcDay: 1, day: "Mon", fullDay: "Monday" },
  { utcDay: 2, day: "Tue", fullDay: "Tuesday" },
  { utcDay: 3, day: "Wed", fullDay: "Wednesday" },
  { utcDay: 4, day: "Thu", fullDay: "Thursday" },
  { utcDay: 5, day: "Fri", fullDay: "Friday" },
  { utcDay: 6, day: "Sat", fullDay: "Saturday" },
  { utcDay: 0, day: "Sun", fullDay: "Sunday" },
] as const;

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

function getSevenDayStart(): Date {
  const local = new Date(Date.now() + MANILA_OFFSET_MS);
  const startLocal = Date.UTC(
    local.getUTCFullYear(),
    local.getUTCMonth(),
    local.getUTCDate() - 6
  );
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
const round1 = (n: number) => Math.round(n * 10) / 10;

function computeDelta(current: number, previous: number): PeriodMetricDelta {
  if (previous === 0) {
    return {
      current,
      previous,
      percentageChange: current === 0 ? 0 : null,
    };
  }

  const pct = ((current - previous) / previous) * 100;
  return {
    current,
    previous,
    percentageChange: round1(pct),
  };
}

async function getWindowTotals(start: Date, end?: Date) {
  const filter = and(
    inArray(orders.status, COUNTED_STATUSES),
    gte(orders.orderedAt, start),
    end ? lt(orders.orderedAt, end) : undefined,
    eq(products.isArchived, false)
  );

  const [totals] = await db
    .select({
      revenue:
        sql<number>`coalesce(sum(${orderItems.quantity} * ${orderItems.unitPrice}), 0)`.mapWith(
          Number
        ),
      productsSold:
        sql<number>`coalesce(sum(${orderItems.quantity}), 0)`.mapWith(Number),
      customers: sql<number>`count(distinct ${orders.id})`.mapWith(Number),
    })
    .from(orders)
    .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(filter);

  const revenue = round2(totals?.revenue ?? 0);
  const productsSold = totals?.productsSold ?? 0;
  const customers = totals?.customers ?? 0;
  const avgOrderValue = customers > 0 ? round2(revenue / customers) : 0;

  return { revenue, productsSold, customers, avgOrderValue };
}

export async function getAnalytics(range: TimeRange): Promise<AnalyticsMetric> {
  const start = getRangeStart(range);

  const orderFilter = and(
    inArray(orders.status, COUNTED_STATUSES),
    start ? gte(orders.orderedAt, start) : undefined
  );

  const filteredSales = db
    .select({
      productId: orderItems.productId,
      quantity: orderItems.quantity,
      lineTotal: sql<number>`${orderItems.quantity} * ${orderItems.unitPrice}`.as(
        "line_total"
      ),
    })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(orderFilter)
    .as("filtered_sales");

  const [rows, [orderCount]] = await Promise.all([
    db
      .select({
        name: products.name,
        categoryName: categories.name,
        unitsSold: sql<number>`coalesce(sum(${filteredSales.quantity}), 0)`.mapWith(
          Number
        ),
        revenue: sql<number>`coalesce(sum(${filteredSales.lineTotal}), 0)`.mapWith(
          Number
        ),
      })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(filteredSales, eq(filteredSales.productId, products.id))
      .where(eq(products.isArchived, false))
      .groupBy(products.id, products.name, categories.name),

    db
      .select({
        customers: sql<number>`count(distinct ${orders.id})`.mapWith(Number),
      })
      .from(orders)
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(and(orderFilter, eq(products.isArchived, false))),
  ]);

  const productsSold = rows.reduce((sum, r) => sum + r.unitsSold, 0);
  const revenue = rows.reduce((sum, r) => sum + r.revenue, 0);

  const byUnits = [...rows].sort((a, b) => b.unitsSold - a.unitsSold);
  const top = byUnits[0] && byUnits[0].unitsSold > 0 ? byUnits[0] : null;
  const lowest = byUnits.length > 1 ? byUnits[byUnits.length - 1] : null;

  const categoryUnits = new Map<string, number>();
  for (const r of rows) {
    if (r.unitsSold <= 0) continue;
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
    lowestProduct: lowest
      ? { name: lowest.name, salesCount: lowest.unitsSold }
      : null,
    incomeBreakdown: groupTail(
      rows
        .filter((r) => r.revenue > 0)
        .map((r) => ({ name: r.name, value: r.revenue }))
    ).map((i) => ({ name: i.name, amount: round2(i.value) })),
    categoryBreakdown: groupTail(
      [...categoryUnits].map(([name, value]) => ({ name, value }))
    ).map((i) => ({
      name: i.name,
      value: productsSold ? Math.round((i.value / productsSold) * 100) : 0,
    })),
  };
}

export async function getSevenDayInsights(): Promise<SevenDayInsights> {
  const sevenDayStart = getSevenDayStart();
  const priorSevenDayStart = new Date(sevenDayStart.getTime() - 7 * DAY_MS);

  const sales7d = db
    .select({
      productId: orderItems.productId,
      unitsSold: sql<number>`coalesce(sum(${orderItems.quantity}), 0)`
        .mapWith(Number)
        .as("units_sold"),
      revenue:
        sql<number>`coalesce(sum(${orderItems.quantity} * ${orderItems.unitPrice}), 0)`
          .mapWith(Number)
          .as("revenue"),
    })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(
      and(
        inArray(orders.status, COUNTED_STATUSES),
        gte(orders.orderedAt, sevenDayStart)
      )
    )
    .groupBy(orderItems.productId)
    .as("sales_7d");

  const [
    recentOrders,
    productRows,
    [settings],
    current7dTotals,
    previous7dTotals,
  ] = await Promise.all([
    db
      .select({
        orderId: orders.id,
        orderedAt: orders.orderedAt,
        unitsSold: sql<number>`coalesce(sum(${orderItems.quantity}), 0)`.mapWith(
          Number
        ),
        revenue:
          sql<number>`coalesce(sum(${orderItems.quantity} * ${orderItems.unitPrice}), 0)`.mapWith(
            Number
          ),
      })
      .from(orders)
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(
        and(
          inArray(orders.status, COUNTED_STATUSES),
          gte(orders.orderedAt, sevenDayStart),
          eq(products.isArchived, false)
        )
      )
      .groupBy(orders.id, orders.orderedAt),

    db
      .select({
        id: products.id,
        name: products.name,
        categoryName: categories.name,
        categoryIcon: categories.icon,
        imageUrl: products.imageUrl,
        stock: products.stock,
        unitsSold7d: sql<number>`coalesce(${sales7d.unitsSold}, 0)`.mapWith(
          Number
        ),
        revenue7d: sql<number>`coalesce(${sales7d.revenue}, 0)`.mapWith(Number),
      })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(sales7d, eq(sales7d.productId, products.id))
      .where(eq(products.isArchived, false)),

    db
      .select({ lowStockThreshold: shopSettings.lowStockThreshold })
      .from(shopSettings)
      .where(eq(shopSettings.id, 1))
      .limit(1),

    getWindowTotals(sevenDayStart),
    getWindowTotals(priorSevenDayStart, sevenDayStart),
  ]);

  const lowStockThreshold = settings?.lowStockThreshold ?? 5;

  const dayMap = new Map<
    number,
    { orders: number; revenue: number; unitsSold: number }
  >();
  for (const d of DAYS_MON_FIRST) {
    dayMap.set(d.utcDay, { orders: 0, revenue: 0, unitsSold: 0 });
  }

  for (const order of recentOrders) {
    const localDate = new Date(order.orderedAt.getTime() + MANILA_OFFSET_MS);
    const utcDay = localDate.getUTCDay();
    const bucket = dayMap.get(utcDay);
    if (!bucket) continue;
    bucket.orders += 1;
    bucket.revenue += order.revenue;
    bucket.unitsSold += order.unitsSold;
  }

  const busiestDays: DayOfWeekMetric[] = DAYS_MON_FIRST.map((d) => {
    const bucket = dayMap.get(d.utcDay)!;
    return {
      day: d.day,
      fullDay: d.fullDay,
      orders: bucket.orders,
      revenue: round2(bucket.revenue),
      unitsSold: bucket.unitsSold,
    };
  });

  const sortedDays = [...busiestDays].sort(
    (a, b) => b.orders - a.orders || b.revenue - a.revenue
  );
  const peakDay =
    sortedDays[0] && sortedDays[0].orders > 0 ? sortedDays[0] : null;

  const stockForecast: StockForecastItem[] = productRows
    .map((p) => {
      const rawVelocity = p.unitsSold7d / 7;
      const dailyVelocity = round1(rawVelocity);
      const daysLeft =
        p.stock <= 0
          ? 0
          : rawVelocity > 0
            ? round1(p.stock / rawVelocity)
            : null;

      return {
        id: p.id,
        name: p.name,
        categoryName: p.categoryName,
        categoryIcon: p.categoryIcon,
        imageUrl: p.imageUrl,
        stock: p.stock,
        unitsSold7d: p.unitsSold7d,
        dailyVelocity,
        daysLeft,
        isLowStock: p.stock <= lowStockThreshold,
      };
    })
    .filter((item) => item.unitsSold7d > 0 || item.isLowStock)
    .sort((a, b) => {
      if (a.daysLeft !== null && b.daysLeft !== null) {
        return a.daysLeft - b.daysLeft || a.stock - b.stock;
      }
      if (a.daysLeft !== null) return -1;
      if (b.daysLeft !== null) return 1;
      return a.stock - b.stock;
    });

  const byUnits7dDesc = [...productRows].sort(
    (a, b) => b.unitsSold7d - a.unitsSold7d || b.revenue7d - a.revenue7d
  );

  const topSellers: ProductPerformanceItem[] = byUnits7dDesc
    .filter((r) => r.unitsSold7d > 0)
    .slice(0, 5)
    .map((r) => ({
      id: r.id,
      name: r.name,
      categoryName: r.categoryName,
      categoryIcon: r.categoryIcon,
      imageUrl: r.imageUrl,
      unitsSold: r.unitsSold7d,
      revenue: round2(r.revenue7d),
      stock: r.stock,
    }));

  const topSellerIds = new Set(topSellers.map((item) => item.id));

  const slowMovers: ProductPerformanceItem[] = [...productRows]
    .filter((r) => !topSellerIds.has(r.id))
    .sort(
      (a, b) =>
        a.unitsSold7d - b.unitsSold7d ||
        b.stock - a.stock ||
        a.name.localeCompare(b.name)
    )
    .slice(0, 5)
    .map((r) => ({
      id: r.id,
      name: r.name,
      categoryName: r.categoryName,
      categoryIcon: r.categoryIcon,
      imageUrl: r.imageUrl,
      unitsSold: r.unitsSold7d,
      revenue: round2(r.revenue7d),
      stock: r.stock,
    }));

  const periodComparison: PeriodComparison = {
    comparisonLabel: "vs. Prior 7 Days",
    currentLabel: "Last 7d",
    previousLabel: "Prior 7d",
    revenue: computeDelta(current7dTotals.revenue, previous7dTotals.revenue),
    productsSold: computeDelta(
      current7dTotals.productsSold,
      previous7dTotals.productsSold
    ),
    customers: computeDelta(
      current7dTotals.customers,
      previous7dTotals.customers
    ),
    avgOrderValue: computeDelta(
      current7dTotals.avgOrderValue,
      previous7dTotals.avgOrderValue
    ),
  };

  return {
    busiestDays,
    peakDay,
    stockForecast,
    lowStockThreshold,
    topSellers,
    slowMovers,
    periodComparison,
  };
}