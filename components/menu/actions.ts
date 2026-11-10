"use server";

import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

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

export interface CreateProductInput {
  name: string;
  categoryId: number;
  description?: string;
  price: number;
  stock: number;
  discount?: number;
  availability?: boolean;
  imageUrl?: string;
}

export async function createProduct(data: CreateProductInput) {
  await db.insert(products).values({
    name: data.name,
    categoryId: data.categoryId,
    description: data.description || null,
    price: data.price.toFixed(2),
    stock: data.stock,
    discount: data.discount ? data.discount.toFixed(2) : null,
    availability: data.availability ?? true,
    imageUrl: data.imageUrl || null,
  });

  revalidatePath("/menu");
  revalidatePath("/orders");
  revalidatePath("/home");
}

export interface CreateCategoryInput {
  name: string;
  icon: string;
}

export async function createCategory(data: CreateCategoryInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await db.insert(categories).values({
    name: data.name,
    icon: data.icon,
    createdBy: user?.id ?? null,
  });

  revalidatePath("/menu");
  revalidatePath("/orders");
  revalidatePath("/home");
}