"use client";

import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { getPricing, getStockStatus, peso } from "@/lib/product-utils";
import { getProductTheme } from "@/lib/product-ui";
import type { categories, products } from "@/db/schema";
import { getCategoryIcon } from "@/lib/category-icons";

type Category = typeof categories.$inferSelect;
type Product = typeof products.$inferSelect;

export default function OrderCard({
  product,
  category,
  quantity,
  onQuantityChange,
}: {
  product: Product;
  category?: Category;
  quantity: number;
  onQuantityChange: (next: number) => void;
}) {
  const { price, discount, finalPrice } = getPricing(product);
  const { soldOut, unavailable } = getStockStatus(product);

  const theme = getProductTheme(product);
  const CategoryIcon = getCategoryIcon(category?.icon);

  const canAdd = !unavailable && quantity < product.stock;
  const canSubtract = quantity > 0;

  return (
    <article
      className={`group flex h-full w-full flex-col overflow-hidden rounded-2xl border-2 border-transparent bg-surface-container transition-all duration-300 ${
        theme.borderHover
      } ${unavailable ? "opacity-70" : ""}`}
    >
      <div className="relative flex h-40 shrink-0 items-center justify-center bg-background">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <CategoryIcon className="size-16 text-muted/50 transition-colors duration-300 group-hover:text-muted" />
        )}

        {discount > 0 && (
          <span
            className={`absolute left-3 top-3 rounded-xl px-3 py-2 font-semibold text-background ${theme.badgeBg}`}
          >
            -{discount}%
          </span>
        )}
        {unavailable && (
          <span className="absolute right-3 top-3 rounded-xl bg-tertiary px-3 py-2 font-semibold text-background">
            {soldOut ? "Sold out" : "Unavailable"}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <p className="text-sm font-medium text-muted">
            {category?.name ?? "\u00A0"}
          </p>
          <div className="mt-1 flex h-14 items-start">
            <h3 className="font-serif text-2xl font-bold leading-tight line-clamp-2">
              {product.name}
            </h3>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-end gap-2">
            <p className={`text-xl font-bold ${theme.text}`}>
              {peso.format(finalPrice)}
            </p>
            {discount > 0 && (
              <p className="text-sm text-muted line-through">
                {peso.format(price)}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-background p-1.5">
            <button
              type="button"
              disabled={!canSubtract}
              onClick={() => onQuantityChange(quantity - 1)}
              className="flex size-10 items-center justify-center rounded-xl bg-surface-container text-muted transition-colors hover:text-primary disabled:opacity-30 disabled:hover:text-muted"
            >
              <Minus size={18} />
            </button>

            <output className="flex-1 text-center font-sans text-xl font-bold">
              {quantity}
            </output>

            <button
              type="button"
              disabled={!canAdd}
              onClick={() => onQuantityChange(quantity + 1)}
              className="flex size-10 items-center justify-center rounded-xl bg-primary text-background transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}