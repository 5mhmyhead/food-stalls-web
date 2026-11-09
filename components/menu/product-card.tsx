import {
  CookingPot,
  Utensils,
  Soup,
  Cookie,
  CupSoda,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

import Image from "next/image";
import type { Category, Product } from "@/lib/mock-data";
import { getPricing, getStockStatus, peso } from "@/lib/product-utils";
import { getProductTheme, getCategoryIcon } from "@/lib/product-ui";

import Link from "next/link";

const ICON_MAP: Record<string, LucideIcon> = {
  CookingPot,
  Utensils,
  Soup,
  Cookie,
  CupSoda,
};

export default function ProductCard({
  product,
  category,
  selected = false,
}: {
  product: Product;
  category?: Category;
  selected?: boolean;
}) {
  const { price, discount, finalPrice } = getPricing(product);
  const { soldOut, unavailable, lowStock } = getStockStatus(product);

  const theme = getProductTheme(product);
  const CategoryIcon = getCategoryIcon(category);

  return (
    <Link href={`/menu?item=${product.id}`} className="flex">
      <article
        className={`w-full group flex flex-col overflow-hidden rounded-2xl bg-surface-container border-2 border-transparent transition-all duration-300 ${
          theme.borderHover
        } ${unavailable ? "opacity-70" : ""}`}
      >
        <div className="relative flex h-40 items-center justify-center bg-background">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover transition-transform duration-300"
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

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div>
            {category && <p className="text-sm text-muted">{category.name}</p>}
            <h3 className="mt-4 font-serif text-2xl font-bold leading-tight">
              {product.name}
            </h3>
            {product.description && (
              <p className="mt-1 line-clamp-2 text-muted">
                {product.description}
              </p>
            )}
          </div>

          <div className="mt-auto flex items-end justify-between">
            <div>
              <p className={`text-xl font-bold ${theme.text}`}>
                {peso.format(finalPrice)}
              </p>
              {discount > 0 && (
                <p className="text-sm text-muted line-through">
                  {peso.format(price)}
                </p>
              )}
            </div>
            <p className={`text-sm font-semibold ${theme.text}`}>
              {soldOut
                ? "No stock"
                : lowStock
                  ? `Only ${product.stock} left`
                  : `${product.stock} in stock`}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
