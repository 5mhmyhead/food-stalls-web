"use client";

import { peso } from "@/lib/product-utils";
import type { OrderHistoryItem } from "@/components/home/actions";

interface PendingDetailsProps {
  historyItem?: OrderHistoryItem;
  onComplete?: (orderId: number) => void;
  onCancel?: (orderId: number) => void;
}

export default function PendingDetailsCard({
  historyItem,
  onComplete,
  onCancel,
}: PendingDetailsProps) {
  if (!historyItem) {
    return (
      <aside className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-3xl bg-surface p-6 text-center">
        <h2 className="font-serif text-4xl font-bold">No order selected.</h2>
        <p className="text-muted max-w-md">
          Select an order from the list to view its complete receipt and line items.
        </p>
      </aside>
    );
  }

  const { order, items, totalAmount, subtotalAmount, totalDiscount } =
    historyItem;

  return (
    <aside className="flex h-full w-full flex-col gap-4 overflow-hidden rounded-3xl bg-surface p-6">
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
              className="flex shrink-0 items-center justify-between rounded-2xl bg-surface-container p-4"
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
                <p className="text-xl font-bold text-primary">
                  {peso.format(item.price)}
                </p>
                {item.discount > 0 && (
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
            <span className="font-bold">{peso.format(subtotalAmount)}</span>
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
            {peso.format(totalAmount)}
          </span>
        </div>

        <div className="flex flex-row gap-4">
          <button
            type="button"
            onClick={() => onCancel?.(order.id)}
            className="w-full btn-muted"
          >
            Cancel Order
          </button>
          <button
            type="button"
            onClick={() => onComplete?.(order.id)}
            className="w-full btn-primary"
          >
            Complete Order
          </button>
        </div>
      </div>
    </aside>
  );
}