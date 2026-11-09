"use client";

import { useState } from "react";
import MenuToolbar from "@/components/menu-toolbar";
import { mockCategories, mockProducts } from "@/lib/mock-data";
import OrderCard from "@/components/orders/order-card";
import CartDetails from "@/components/orders/cart-details";

export default function OrdersPage() {
  const categoryById = new Map(mockCategories.map((c) => [c.id, c]));
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  return (
    <section className="flex h-full w-full flex-col gap-6 overflow-hidden">
      <h1 className="shrink-0 font-serif text-6xl font-black pl-2">Orders</h1>

      <div className="flex min-h-0 gap-6">
        <div className="flex flex-1 min-h-0 flex-col gap-6">
          <div className="shrink-0 rounded-3xl bg-surface p-6">
            <MenuToolbar
              categories={mockCategories}
              products={mockProducts}
              variant="compact"
            />
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto rounded-3xl bg-surface p-6">
            <div className="grid grid-cols-2 gap-4">
              {mockProducts.map((product) => (
                <OrderCard
                  key={product.id}
                  product={product}
                  category={categoryById.get(product.categoryId)}
                  quantity={quantities[product.id] ?? 0}
                  onQuantityChange={(next) =>
                    setQuantities((prev) => ({ ...prev, [product.id]: next }))
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          <CartDetails />
        </div>
      </div>
    </section>
  );
}