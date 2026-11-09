"use server";

import { db } from "@/db";
import { categories, products } from "@/db/schema";

export async function getMenuCategories() {
  return await db.select().from(categories);
}

export async function getMenuProducts() {
  return await db.select().from(products);
}

export async function getMenuData() {
  const [categoryList, productList] = await Promise.all([
    getMenuCategories(),
    getMenuProducts(),
  ]);

  return {
    categories: categoryList,
    products: productList,
  };
}