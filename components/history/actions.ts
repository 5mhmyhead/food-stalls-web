"use server";

import { db } from "@/db";
import { orders, orderItems, products, categories, profiles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export interface DetailedOrderItem {
  id: number;
  productId: number;
  name: string;
  categoryName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  price: number;
  originalPrice: number;
}

export interface OrderHistoryItem {
  id: number;
  order: typeof orders.$inferSelect & {
    employeeName?: string | null;
  };
  totalAmount: number;
  subtotalAmount: number;
  totalDiscount: number;
  itemCount: number;
  itemImages: string[];
  items: DetailedOrderItem[];
}

export async function getHistoryData(): Promise<OrderHistoryItem[]> {
  const allOrders = await db
    .select({
      order: orders,
      employeeName: profiles.username,
    })
    .from(orders)
    .leftJoin(profiles, eq(orders.employeeId, profiles.id))
    .orderBy(desc(orders.orderedAt));

  if (allOrders.length === 0) {
    return [];
  }

  const rawItems = await db
    .select({
      orderId: orderItems.orderId,
      itemId: orderItems.id,
      productId: products.id,
      name: products.name,
      categoryName: categories.name,
      quantity: orderItems.quantity,
      unitPrice: orderItems.unitPrice,
      productDiscount: products.discount,
      imageUrl: products.imageUrl,
    })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .leftJoin(categories, eq(products.categoryId, categories.id));

  const itemsByOrderId = new Map<number, typeof rawItems>();
  for (const item of rawItems) {
    const list = itemsByOrderId.get(item.orderId) ?? [];
    list.push(item);
    itemsByOrderId.set(item.orderId, list);
  }

  return allOrders.map(({ order, employeeName }) => {
    const itemsRaw = itemsByOrderId.get(order.id) ?? [];

    const detailedItems: DetailedOrderItem[] = itemsRaw.map((item) => {
      const unitPrice = Number(item.unitPrice);
      const discountPct = Number(item.productDiscount ?? 0);
      const originalPrice = unitPrice * item.quantity;
      const finalPrice = originalPrice * (1 - discountPct / 100);

      return {
        id: item.itemId,
        productId: item.productId,
        name: item.name,
        categoryName: item.categoryName ?? "General",
        quantity: item.quantity,
        unitPrice,
        discount: discountPct,
        price: finalPrice,
        originalPrice,
      };
    });

    const subtotalAmount = detailedItems.reduce((sum, i) => sum + i.originalPrice, 0);
    const totalAmount = detailedItems.reduce((sum, i) => sum + i.price, 0);
    const totalDiscount = subtotalAmount - totalAmount;
    const itemCount = detailedItems.reduce((sum, i) => sum + i.quantity, 0);
    const itemImages = itemsRaw
      .map((item) => item.imageUrl)
      .filter((url): url is string => Boolean(url));

    return {
      id: order.id,
      order: {
        ...order,
        employeeName,
      },
      totalAmount,
      subtotalAmount,
      totalDiscount,
      itemCount,
      itemImages,
      items: detailedItems,
    };
  });
}