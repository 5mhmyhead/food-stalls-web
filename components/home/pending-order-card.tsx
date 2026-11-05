"use client";

import { Check, X } from "lucide-react";
import type { OrderHistoryItem } from "@/lib/mock-data";
import { peso } from "@/lib/product-utils";
import HistoryThumbnail from "@/components/history/history-thumbnail";

type PendingOrderCardProps = {
  historyItem: OrderHistoryItem;
  onComplete?: (orderId: number) => void;
  onCancel?: (orderId: number) => void;
};

export default function PendingOrderCard({
  historyItem,
  onComplete,
  onCancel,
}: PendingOrderCardProps) {
  const { order, totalAmount, itemImages } = historyItem;

  const formattedDate = new Date(order.orderedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedId = `#${String(order.id).padStart(5, "0")}`;

  const visibleImages = itemImages ? itemImages.slice(0, 2) : [];
  const remainingCount = itemImages ? itemImages.length - 2 : 0;

  return (
    <article className="group flex flex-col justify-between rounded-2xl border-2 border-transparent bg-surface-container p-4 transition-all duration-300 hover:border-secondary">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-2xl font-semibold leading-tight">
              Order {formattedId}
            </h3>
            <p className="text-sm font-medium text-muted">{formattedDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onCancel?.(order.id)}
            className="flex size-12 items-center justify-center rounded-xl bg-muted/20 text-muted transition-colors hover:bg-muted hover:text-white"
          >
            <X size={24} className="stroke-3" />
          </button>
          <button
            type="button"
            onClick={() => onComplete?.(order.id)}
            className="flex size-12 items-center justify-center rounded-xl bg-secondary/25 text-secondary transition-colors hover:bg-secondary hover:text-white"
          >
            <Check size={24} className="stroke-3" />
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between">
        <div className="flex items-center gap-2">
          {visibleImages.length > 0 ? (
            <>
              {visibleImages.map((imgUrl, index) => (
                <HistoryThumbnail key={index} imgUrl={imgUrl} />
              ))}
              {remainingCount > 0 && (
                <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-secondary/20 text-xl font-bold text-secondary">
                  +{remainingCount}
                </div>
              )}
            </>
          ) : (
            <HistoryThumbnail />
          )}
        </div>

        <p className="text-3xl font-bold">{peso.format(totalAmount)}</p>
      </div>
    </article>
  );
}