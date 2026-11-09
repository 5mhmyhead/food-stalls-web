"use server";

import { db } from "@/db";
import { categories, products } from "@/db/schema";

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