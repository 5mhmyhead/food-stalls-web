"use client";

import { useState } from "react";
import { UtensilsCrossed } from "lucide-react";
import MenuToolbar from "@/components/menu-toolbar";
import OrderCard from "@/components/orders/order-card";
import CartDetails, { type CartItem } from "@/components/orders/cart-details";
import { getPricing } from "@/lib/product-utils";
import type { categories, products } from "@/db/schema";

type Category = typeof categories.$inferSelect;
type Product = typeof products.$inferSelect;

interface OrdersClientProps {
  categories: Category[];
  products: Product[];
}

export default function OrdersClient({
  categories,
  products,
}: OrdersClientProps) {
  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  // Derive cart items dynamically from quantities map
  const cartItems: CartItem[] = products
    .filter((product) => (quantities[product.id] ?? 0) > 0)
    .map((product) => {
      const quantity = quantities[product.id];
      const category = categoryById.get(product.categoryId);
      const { price, discount, finalPrice } = getPricing(product);

      return {
        id: product.id,
        name: product.name,
        categoryName: category?.name ?? "General",
        quantity,
        price: finalPrice * quantity,
        originalPrice: price * quantity,
        discount,
      };
    });

  return (
    <section className="flex h-full w-full flex-col gap-6 overflow-hidden">
      <h1 className="shrink-0 font-serif text-6xl font-black pl-2 leading-tight">
        Orders
      </h1>

      <div className="flex flex-1 min-h-0 gap-6">
        <div className="flex flex-1 min-h-0 flex-col gap-6">
          <div className="shrink-0 rounded-3xl bg-surface p-6">
            <MenuToolbar
              categories={categories}
              products={products}
              variant="compact"
            />
          </div>

          {products.length === 0 ? (
            <div className="flex flex-1 min-h-0 w-full flex-col items-center justify-center rounded-3xl bg-surface p-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <h2 className="font-serif text-4xl font-bold">No menu items found.</h2>
                <p className="text-muted">
                  There are no menu products available right now.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 min-h-0 overflow-y-auto rounded-3xl bg-surface p-6">
              <div className="grid grid-cols-2 gap-4">
                {products.map((product) => (
                  <OrderCard
                    key={product.id}
                    product={product}
                    category={categoryById.get(product.categoryId)}
                    quantity={quantities[product.id] ?? 0}
                    onQuantityChange={(next) =>
                      setQuantities((prev) => ({
                        ...prev,
                        [product.id]: next,
                      }))
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-1 min-h-0">
          <CartDetails items={cartItems} />
        </div>
      </div>
    </section>
  );
}