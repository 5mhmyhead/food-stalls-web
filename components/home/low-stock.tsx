"use client";

import { mockCategories, mockProducts, type Product } from "@/lib/mock-data";
import ProductCard from "../menu/product-card";

interface LowStockProps {
  products?: Product[];
  threshold?: number;
}

export default function LowStock({
  products = mockProducts,
  threshold = 5,
}: LowStockProps) {
  const categoryById = new Map(mockCategories.map((c) => [c.id, c]));

  const lowStockProducts = products
    .filter((product) => product.stock <= threshold || !product.availability)
    .sort((a, b) => a.stock - b.stock);

  return (
    <div className="flex w-full flex-col gap-4 rounded-3xl bg-surface p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-4xl font-bold">Menu Items to Restock</h2>
        <span className="rounded-xl bg-tertiary/20 px-3 py-2 font-medium text-tertiary">
          {lowStockProducts.length} {lowStockProducts.length === 1 ? "item" : "items"} need restock
        </span>
      </div>

      <div className="flex w-full items-stretch gap-4 overflow-x-auto scrollbar-thin">
        {lowStockProducts.length > 0 ? (
          lowStockProducts.map((product) => (
            <div
              key={product.id}
              className="flex w-[calc((100%-3*1rem)/4)] min-w-[220px] shrink-0 flex-col [&>*]:h-full"
            >
              <ProductCard
                product={product}
                category={categoryById.get(product.categoryId)}
              />
            </div>
          ))
        ) : (
          <div className="flex h-32 w-full items-center justify-center text-muted">
            All items with healthy stock.
          </div>
        )}
      </div>
    </div>
  );
}