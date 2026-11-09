"use client";

import type { OrderHistoryItem } from "@/components/history/actions";
import { peso } from "@/lib/product-utils";

interface HistoryDetailsProps {
  historyItem?: OrderHistoryItem;
}

const STATUS_TEXT_COLOR = {
  COMPLETED: "text-primary",
  PENDING: "text-secondary",
  CANCELLED: "text-tertiary",
};

export default function HistoryDetails({ historyItem }: HistoryDetailsProps) {
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

  const { order, items, totalAmount, subtotalAmount, totalDiscount } = historyItem;

  const formattedId = `#${String(order.id).padStart(5, "0")}`;
  const formattedDate = new Date(order.orderedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const cashierName = order.employeeName ?? "Staff";
  const statusColor = STATUS_TEXT_COLOR[order.status] ?? "text-muted";

  return (
    <aside className="flex h-full w-full flex-col gap-4 overflow-hidden rounded-3xl bg-surface p-6">
      <div className="flex flex-col gap-3">
        {/* Header Metadata */}
        <div className="shrink-0 flex items-center justify-between rounded-2xl bg-surface-container p-4">
          <div className="flex flex-col justify-center text-start">
            <p className="font-bold text-muted">Order ID</p>
            <p className="font-bold text-onSurface">{formattedId}</p>
          </div>
          <div className="flex flex-col justify-center text-center">
            <p className="font-bold text-muted">Order Date</p>
            <p className="font-bold text-onSurface">{formattedDate}</p>
          </div>
          <div className="flex flex-col justify-center text-end">
            <p className="font-bold text-muted">Cashier</p>
            <p className="font-bold text-onSurface">{cashierName}</p>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex w-full gap-3">
          <div className="flex w-full flex-col items-center justify-center rounded-2xl bg-surface-container p-4">
            <p className="font-bold text-muted">Status</p>
            <p className={`text-xl font-bold capitalize ${statusColor}`}>
              {order.status.toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      <h2 className="font-serif text-4xl font-bold">Order Details</h2>

      {/* Line Items List */}
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

      {/* Pricing Summary */}
      <div className="mt-auto shrink-0 flex flex-col gap-4 rounded-2xl bg-surface-container p-4">
        <div className="flex flex-col gap-1 font-semibold">
          <div className="flex justify-between">
            <span className="text-muted">Subtotal</span>
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
          <span className="font-serif text-3xl font-bold leading-tight">Total</span>
          <span className="font-serif text-3xl font-bold leading-tight">
            {peso.format(totalAmount)}
          </span>
        </div>
      </div>
    </aside>
  );
}