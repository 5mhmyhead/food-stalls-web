"use client";

import type { OrderHistoryItem } from "@/lib/mock-data";
import PendingOrderCard from "@/components/home/pending-order-card";

interface PendingOrdersProps {
  pendingOrders: OrderHistoryItem[];
  onComplete: (orderId: number) => void;
  onCancel: (orderId: number) => void;
}

export default function PendingOrders({
  pendingOrders,
  onComplete,
  onCancel,
}: PendingOrdersProps) {
  return (
    <div className="flex flex-1 flex-col rounded-3xl bg-surface">
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-4xl font-bold">Pending Orders</h2>
          <span className="rounded-xl bg-muted/10 px-3 py-2 font-medium text-muted">
            {pendingOrders.length} pending
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
          {pendingOrders.length > 0 ? (
            pendingOrders.map((historyItem) => (
              <PendingOrderCard
                key={historyItem.id}
                historyItem={historyItem}
                onComplete={onComplete}
                onCancel={onCancel}
              />
            ))
          ) : (
            <div className="flex h-full items-center justify-center text-muted">
              No pending orders!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}