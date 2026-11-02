import {
  CookingPot, Utensils, Soup, Cookie, CupSoda, UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { Category, Product } from "@/lib/mock-data";
import { getStockStatus } from "@/lib/product-utils";

const ICON_MAP: Record<string, LucideIcon> = {
  CookingPot, Utensils, Soup, Cookie, CupSoda,
};

export function getCategoryIcon(category?: Category): LucideIcon {
  return (category?.icon ? ICON_MAP[category.icon] : null) ?? UtensilsCrossed;
}

export function getProductTheme(product: Product) {
  const { unavailable, lowStock } = getStockStatus(product);

  if (unavailable) {
    return { borderHover: "hover:border-tertiary", text: "text-tertiary", badgeBg: "bg-tertiary" };
  }
    
  if (lowStock) {
    return { borderHover: "hover:border-secondary", text: "text-secondary", badgeBg: "bg-secondary" };
  }
    
  return { borderHover: "hover:border-primary", text: "text-primary", badgeBg: "bg-primary" };
}