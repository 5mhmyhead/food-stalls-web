"use server";

import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { requireAdmin } from "@/lib/dal";
import { eq } from "drizzle-orm";

export async function getMenuCategories() {
  return await db.select().from(categories);
}

export async function getMenuProducts() {
  return await db.select().from(products).where(eq(products.isArchived, false));
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

export interface UpdateProductPayload {
  name: string;
  categoryId: number;
  description?: string | null;
  price: number;
  stock: number;
  discount?: number | null;
  availability: boolean;
  imageUrl?: string | null;
}

export interface UpdateCategoryPayload {
  name: string;
  icon: string;
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

export async function updateProduct(
  id: number,
  payload: UpdateProductPayload
) {
  await requireAdmin();

  await db
    .update(products)
    .set({
      name: payload.name,
      categoryId: payload.categoryId,
      description: payload.description ?? null,
      price: payload.price.toString(),
      stock: payload.stock,
      discount: payload.discount ? payload.discount.toString() : "0",
      availability: payload.availability,
      imageUrl: payload.imageUrl ?? null,
    })
    .where(eq(products.id, id));

  revalidatePath("/home");
  revalidatePath("/menu");
  revalidatePath("/orders");
}

export async function deleteProduct(id: number) {
  await requireAdmin();

  await db
    .update(products)
    .set({
      isArchived: true,
      availability: false,
    })
    .where(eq(products.id, id));

  revalidatePath("/menu");
  revalidatePath("/orders");
}

export async function updateCategory(
  id: number,
  payload: UpdateCategoryPayload
) {
  await requireAdmin();

  await db
    .update(categories)
    .set({
      name: payload.name,
      icon: payload.icon,
    })
    .where(eq(categories.id, id));

  revalidatePath("/menu");
  revalidatePath("/orders");
}

export async function deleteCategory(id: number) {
  await requireAdmin();

  await db.delete(categories).where(eq(categories.id, id));

  revalidatePath("/menu");
  revalidatePath("/orders");
}