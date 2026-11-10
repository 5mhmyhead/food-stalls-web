"use client";

import ProductCard from "../menu/product-card";
import type { categories, products } from "@/db/schema";

type Category = typeof categories.$inferSelect;
type Product = typeof products.$inferSelect;

interface LowStockProps {
  categories?: Category[];
  products?: Product[];
  threshold?: number;
}

export default function LowStock({
  categories = [],
  products = [],
  threshold = 5,
}: LowStockProps) {
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  const lowStockProducts = products
    .filter((product) => product.stock <= threshold || !product.availability)
    .sort((a, b) => a.stock - b.stock);

  return (
    <div className="flex w-full flex-col rounded-3xl bg-surface overflow-hidden">
      <div className="flex shrink-0 items-center justify-between p-6 pb-4">
        <h2 className="font-serif text-4xl font-bold">Menu Items to Restock</h2>
        <span className="rounded-xl bg-tertiary/20 px-3 py-2 font-medium text-tertiary">
          {lowStockProducts.length}{" "}
          {lowStockProducts.length === 1 ? "item" : "items"} need restock
        </span>
      </div>

      {lowStockProducts.length > 0 ? (
        <div className="flex w-full items-stretch gap-4 overflow-x-auto scrollbar-thin px-6 pb-6">
          {lowStockProducts.map((product) => (
            <div
              key={product.id}
              className="flex w-[calc((100%-3*1rem)/4)] min-w-[220px] shrink-0 flex-col [&>*]:h-full"
            >
              <ProductCard
                product={product}
                category={categoryById.get(product.categoryId)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col h-50 w-full items-center justify-center gap-3 p-6 pb-6">
          <h2 className="font-serif text-4xl font-bold">All good here!</h2>
          <p className="text-muted">
            All items with healthy stock.
          </p>
        </div>
      )}
    </div>
  );
}