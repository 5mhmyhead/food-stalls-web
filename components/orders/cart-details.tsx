"use client";

import { useState } from "react";
import { peso } from "@/lib/product-utils";

export interface CartItem {
  id: number;
  name: string;
  categoryName: string;
  quantity: number;
  price: number;
  originalPrice?: number;
  discount?: number;
}

interface CartDetailsProps {
  items?: CartItem[];
  orderId?: string;
  orderDate?: string;
  cashier?: string;
}

export default function CartDetails({
  items = [],
  orderId = "#83923",
  orderDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }),
  cashier = "Staff",
}: CartDetailsProps) {
  const [orderType, setOrderType] = useState<"Dine In" | "Take Out" | "Delivery">(
    "Dine In"
  );

  const subtotal = items.reduce(
    (acc, item) => acc + (item.originalPrice ?? item.price),
    0
  );
  const finalTotal = items.reduce((acc, item) => acc + item.price, 0);
  const totalDiscount = subtotal - finalTotal;

  return (
    <aside className="flex h-full w-full flex-col gap-4 overflow-hidden rounded-3xl bg-surface p-6">
      <div className="flex flex-col gap-3">
        <div className="shrink-0 flex rounded-2xl bg-surface-container p-1">
          {(["Dine In", "Take Out", "Delivery"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setOrderType(type)}
              className={`flex-1 rounded-xl py-2.5 text-center font-bold transition-all ${
                orderType === type
                  ? "bg-primary text-background shadow-sm"
                  : "text-muted hover:text-primary"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="shrink-0 flex items-center justify-between rounded-2xl bg-surface-container p-4">
          <div className="flex flex-col justify-center text-start">
            <p className="font-bold text-muted">Order ID</p>
            <p className="font-bold text-onSurface">{orderId}</p>
          </div>
          <div className="flex flex-col justify-center text-center">
            <p className="font-bold text-muted">Order Date</p>
            <p className="font-bold text-onSurface">{orderDate}</p>
          </div>
          <div className="flex flex-col justify-center text-end">
            <p className="font-bold text-muted">Cashier</p>
            <p className="font-bold text-onSurface">{cashier}</p>
          </div>
        </div>
      </div>

      <h2 className="font-serif text-4xl font-bold">Order Details</h2>

      <div className="flex flex-1 min-h-0 flex-col gap-3 overflow-y-auto rounded-2xl">
        {items.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <h2 className="font-serif text-4xl font-bold">No items in order.</h2>
              <p className="text-muted">
                Add menu items using the menu panel.
              </p>
            </div>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl bg-surface-container p-4 shrink-0"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-full bg-primary/25 font-bold text-primary">
                  {item.quantity}x
                </span>
                <div>
                  <h3 className="font-serif text-xl font-bold leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted">{item.categoryName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-primary text-xl font-bold">
                  {peso.format(item.price)}
                </p>
                {item.originalPrice && item.originalPrice > item.price && (
                  <p className="text-sm text-muted line-through">
                    {peso.format(item.originalPrice)}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-auto shrink-0 flex flex-col gap-4 rounded-2xl bg-surface-container p-4">
        <div className="flex flex-col gap-1 font-semibold">
          <div className="flex justify-between">
            <span className="text-muted">Price</span>
            <span className="font-bold">{peso.format(subtotal)}</span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex justify-between text-primary">
              <span>Discount applied</span>
              <span className="font-bold">-{peso.format(totalDiscount)}</span>
            </div>
          )}
        </div>

        <hr className="border-t-2 border-background" />

        <div className="flex items-baseline justify-between">
          <span className="font-serif text-3xl font-bold leading-tight">
            Total
          </span>
          <span className="font-serif text-3xl font-bold leading-tight">
            {peso.format(finalTotal)}
          </span>
        </div>

        <button
          type="button"
          disabled={items.length === 0}
          className="w-full btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Complete Order
        </button>
      </div>
    </aside>
  );
}