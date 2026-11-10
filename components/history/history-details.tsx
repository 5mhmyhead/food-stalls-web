"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { updateOrderStatus, type OrderStatusType } from "./actions";
import { peso } from "@/lib/product-utils";

export interface OrderHistoryItem {
  order: {
    id: number;
    orderedAt: Date | string;
    status: OrderStatusType;
    orderType: "DINE_IN" | "TAKE_OUT" | "DELIVERY";
    employeeName?: string | null;
  };
  items: {
    id: number;
    name: string;
    categoryName: string;
    quantity: number;
    price: number;
    originalPrice: number;
    discount: number;
  }[];
  totalAmount: number;
  subtotalAmount: number;
  totalDiscount: number;
}

interface HistoryDetailsProps {
  historyItem?: OrderHistoryItem;
}

const STATUS_TEXT_COLOR: Record<OrderStatusType, string> = {
  COMPLETED: "text-primary",
  PENDING: "text-secondary",
  CANCELLED: "text-tertiary",
};

const ORDER_TYPE_LABEL: Record<string, string> = {
  DINE_IN: "Dine In",
  TAKE_OUT: "Take Out",
  DELIVERY: "Delivery",
};

export default function HistoryDetails({ historyItem }: HistoryDetailsProps) {
  const [isPending, startTransition] = useTransition();

  if (!historyItem) {
    return (
      <aside className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-3xl bg-surface p-6 text-center">
        <h2 className="font-serif text-4xl font-bold">No order selected.</h2>
        <p className="max-w-md text-muted">
          Select an order from the list to view its complete receipt and line items.
        </p>
      </aside>
    );
  }

  const { order, items, totalAmount, subtotalAmount, totalDiscount } =
    historyItem;

  const formattedId = `#${String(order.id).padStart(5, "0")}`;
  const formattedDate = new Date(order.orderedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const cashierName = order.employeeName ?? "Staff";
  const statusColor = STATUS_TEXT_COLOR[order.status] ?? "text-muted";
  const formattedOrderType = ORDER_TYPE_LABEL[order.orderType] ?? "Dine In";

  const handleStatusChange = (newStatus: OrderStatusType) => {
    if (order.status === newStatus || isPending) return;

    startTransition(async () => {
      try {
        await updateOrderStatus(order.id, newStatus);
      } catch (err) {
        console.error("Failed to update status:", err);
      }
    });
  };

  return (
    <aside className="flex h-full w-full flex-col gap-4 overflow-hidden rounded-3xl bg-surface p-6">
      <div className="flex flex-col gap-3">
        <div className="flex shrink-0 rounded-2xl bg-surface-container p-1">
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleStatusChange("PENDING")}
            className={`flex-1 rounded-xl py-2.5 text-center font-bold transition-all ${
              order.status === "PENDING"
                ? "bg-secondary text-background"
                : "text-muted hover:text-secondary"
            }`}
          >
            Pending
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleStatusChange("COMPLETED")}
            className={`flex-1 rounded-xl py-2.5 text-center font-bold transition-all ${
              order.status === "COMPLETED"
                ? "bg-primary text-background"
                : "text-muted hover:text-primary"
            }`}
          >
            Completed
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleStatusChange("CANCELLED")}
            className={`flex-1 rounded-xl py-2.5 text-center font-bold transition-all ${
              order.status === "CANCELLED"
                ? "bg-tertiary text-background"
                : "text-muted hover:text-tertiary"
            }`}
          >
            Cancelled
          </button>
        </div>

        <div className="flex shrink-0 items-center justify-between rounded-2xl bg-surface-container p-4">
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

        <div className="flex w-full gap-3">
          <div className="flex w-full flex-col items-center justify-center rounded-2xl bg-surface-container p-4">
            <p className="font-bold text-muted">Status</p>
            <div className="flex items-center gap-2">
              {isPending && <Loader2 className="size-4 animate-spin text-muted" />}
              <p className={`text-xl font-bold capitalize ${statusColor}`}>
                {order.status.toLowerCase()}
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center rounded-2xl bg-surface-container p-4">
            <p className="font-bold text-muted">Order Type</p>
            <p className="text-xl font-bold text-primary">
              {formattedOrderType}
            </p>
          </div>
        </div>
      </div>

      <h2 className="font-serif text-4xl font-bold">Order Details</h2>

      <div className="flex flex-1 min-h-0 flex-col gap-3 overflow-y-auto rounded-2xl">
        {items.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <h2 className="font-serif text-4xl font-bold">No items in order.</h2>
              <p className="text-muted">No items recorded for this receipt.</p>
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