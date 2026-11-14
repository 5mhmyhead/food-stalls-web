import type { Product } from "@/lib/mock-data";
import { getStockStatus } from "@/lib/product-utils";

export function getProductTheme(product: Product, lowStockThreshold?: number) {
  const { unavailable, lowStock } = getStockStatus(product, lowStockThreshold);

  if (unavailable) {
    return {
      borderHover: "hover:border-tertiary",
      text: "text-tertiary",
      badgeBg: "bg-tertiary",
    };
  }

  if (lowStock) {
    return {
      borderHover: "hover:border-secondary",
      text: "text-secondary",
      badgeBg: "bg-secondary",
    };
  }

  return {
    borderHover: "hover:border-primary",
    text: "text-primary",
    badgeBg: "bg-primary",
  };
}
