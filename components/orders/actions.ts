"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { categories, products, orders, orderItems } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";

export async function getOrdersData() {
  const [categoryList, productList] = await Promise.all([
    db.select().from(categories),
    db.select().from(products),
  ]);

  return {
    categories: categoryList,
    products: productList,
  };
}

export interface CreateOrderItemInput {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export async function createOrder(items: CreateOrderItemInput[]) {
  if (!items || items.length === 0) {
    throw new Error("Cannot create an empty order.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [newOrder] = await db
    .insert(orders)
    .values({
      employeeId: user?.id ?? null,
      status: "PENDING",
    })
    .returning({ id: orders.id });

  const itemRows = items.map((item) => ({
    orderId: newOrder.id,
    productId: item.productId,
    quantity: item.quantity,
    unitPrice: item.unitPrice.toFixed(2),
  }));

  await db.insert(orderItems).values(itemRows);

  for (const item of items) {
    await db
      .update(products)
      .set({
        stock: sql`GREATEST(0, ${products.stock} - ${item.quantity})`,
      })
      .where(eq(products.id, item.productId));
  }

  revalidatePath("/orders");
  revalidatePath("/home");
  revalidatePath("/history");

  return { success: true, orderId: newOrder.id };
}