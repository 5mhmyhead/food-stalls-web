import {
  CookingPot,
  Utensils,
  Soup,
  Cookie,
  CupSoda,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { Category, Product } from "@/lib/mock-data";

const ICON_MAP: Record<string, LucideIcon> = {
  CookingPot,
  Utensils,
  Soup,
  Cookie,
  CupSoda,
};

const LOW_STOCK = 5;

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

export default function ProductCard({
  product,
  category,
}: {
  product: Product;
  category?: Category;
}) {
  const price = Number(product.price);
  const discount = Number(product.discount ?? 0);
  const finalPrice = price * (1 - discount / 100);

  const soldOut = product.stock === 0;
  const unavailable = !product.availability || soldOut;
  const lowStock = !soldOut && product.stock <= LOW_STOCK;

  const theme = unavailable
    ? {
        borderHover: "hover:border-tertiary",
        text: "text-tertiary",
        badgeBg: "bg-tertiary",
      }
    : lowStock
    ? {
        borderHover: "hover:border-secondary",
        text: "text-secondary",
        badgeBg: "bg-secondary",
      }
    : {
        borderHover: "hover:border-primary",
        text: "text-primary",
        badgeBg: "bg-primary",
      };

  const CategoryIcon = (category?.icon ? ICON_MAP[category.icon] : null) ?? UtensilsCrossed;

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-3xl bg-surface-container border-2 border-transparent transition-all duration-300 ${theme.borderHover} ${
        unavailable ? "opacity-70" : ""
      }`}
    >
      <div className="relative flex h-40 items-center justify-center bg-background">
        <CategoryIcon className="size-16 text-muted/50 transition-colors duration-300 group-hover:text-muted" />

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
            <p className="mt-1 line-clamp-2 text-muted">{product.description}</p>
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
  );
}