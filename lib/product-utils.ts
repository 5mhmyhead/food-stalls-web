import type { Product } from "@/lib/mock-data";

export const LOW_STOCK = 5;

export const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

// to convert string properties to numbers safely
// make sure to convert since in the schema it is string
export function getPricing(product: Product) {
  const price = Number(product.price);
  const discount = Number(product.discount ?? 0);
  const finalPrice = price * (1 - discount / 100);
  return { price, discount, finalPrice, savings: price - finalPrice };
}

export function getStockStatus(
  product: Product,
  lowStockThreshold: number = LOW_STOCK,
) {
  const soldOut = product.stock === 0;
  return {
    soldOut,
    unavailable: !product.availability || soldOut,
    lowStock: !soldOut && product.stock <= lowStockThreshold,
  };
}
