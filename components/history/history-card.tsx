"use client";

import { Hourglass, Ban, ShoppingBag } from "lucide-react";
import type { OrderHistoryItem } from "@/lib/mock-data";
import { peso } from "@/lib/product-utils";
import HistoryThumbnail from "./history-thumbnail";

const STATUS_CONFIG = {
  COMPLETED: {
    label: "Completed",
    textColor: "text-primary",
    badgeBg: "bg-primary/20 text-primary",
    borderHover: "hover:border-primary",
    Icon: ShoppingBag,
  },
  PENDING: {
    label: "Pending",
    textColor: "text-secondary",
    badgeBg: "bg-secondary/20 text-secondary",
    borderHover: "hover:border-secondary",
    Icon: Hourglass,
  },
  CANCELLED: {
    label: "Cancelled",
    textColor: "text-tertiary",
    badgeBg: "bg-tertiary/20 text-tertiary",
    borderHover: "hover:border-tertiary",
    Icon: Ban,
  },
};

export default function HistoryCard({
  historyItem,
}: {
  historyItem: OrderHistoryItem;
}) {
  const { order, totalAmount, itemImages } = historyItem;
  const statusConfig = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING;
  const StatusIcon = statusConfig.Icon;

  const formattedDate = new Date(order.orderedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedId = `#${String(order.id).padStart(5, "0")}`;

  const visibleImages = itemImages ? itemImages.slice(0, 2) : [];
  const remainingCount = itemImages ? itemImages.length - 2 : 0;

  return (
    <article
      className={`group flex flex-col justify-between rounded-2xl bg-surface-container p-4 border-2 border-transparent transition-all duration-300 ${statusConfig.borderHover}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`flex size-14 shrink-0 items-center justify-center rounded-full ${statusConfig.badgeBg}`}>
            <StatusIcon size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-semibold leading-tight">
              Order {formattedId}
            </h3>
            <p className="text-sm font-medium text-muted">{formattedDate}</p>
          </div>
        </div>

        <div className="text-right">
          <p className={`text-2xl font-semibold leading-tight ${statusConfig.textColor}`}>
            {statusConfig.label}
          </p>
          <p className="text-sm font-medium text-muted">Status</p>
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
                <div className={`flex size-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold ${statusConfig.badgeBg}`}>
                  +{remainingCount}
                </div>
              )}
            </>
          ) : (
            <HistoryThumbnail />
          )}
        </div>

        <p className="text-3xl font-bold">
          {peso.format(totalAmount)}
        </p>
      </div>
    </article>
  );
}