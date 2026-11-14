import "server-only";
import { cache } from "react";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { shopSettings } from "@/db/schema";

export const DEFAULT_LOW_STOCK = 5;

export const getLowStockThreshold = cache(async (): Promise<number> => {
  const [row] = await db
    .select({ value: shopSettings.lowStockThreshold })
    .from(shopSettings)
    .where(eq(shopSettings.id, 1))
    .limit(1);
  return row?.value ?? DEFAULT_LOW_STOCK;
});
