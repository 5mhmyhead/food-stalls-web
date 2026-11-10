"use client";

import type { OrderHistoryItem } from "@/components/home/actions";
import PendingOrderCard from "@/components/home/pending-order-card";

interface PendingOrdersProps {
  pendingOrders: OrderHistoryItem[];
  selectedId?: number | null;
  onSelectOrder?: (orderId: number) => void;
  onComplete: (orderId: number) => void;
  onCancel: (orderId: number) => void;
}

export default function PendingOrders({
  pendingOrders,
  selectedId,
  onSelectOrder,
  onComplete,
  onCancel,
}: PendingOrdersProps) {
  return (
    <div className="flex flex-1 min-h-0 flex-col rounded-3xl bg-surface overflow-hidden">
      <div className="flex shrink-0 items-center justify-between p-6 pb-4">
        <h2 className="font-serif text-4xl font-bold">Pending Orders</h2>
        <span className="rounded-xl bg-muted/10 px-3 py-2 font-medium text-muted">
          {pendingOrders.length} pending
        </span>
      </div>

      {pendingOrders.length > 0 ? (
        <div className="flex flex-1 min-h-0 flex-col gap-4 overflow-y-auto px-6 pb-6">
          {pendingOrders.map((historyItem) => (
            <PendingOrderCard
              key={historyItem.id}
              historyItem={historyItem}
              isSelected={historyItem.id === selectedId}
              onSelect={() => onSelectOrder?.(historyItem.id)}
              onComplete={onComplete}
              onCancel={onCancel}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-1 min-h-0 w-full flex-col items-center justify-center gap-2 p-6 text-center">
          <h2 className="font-serif text-4xl font-bold">No pending orders.</h2>
          <p className="text-muted">
            All pending orders will appear here.
          </p>
        </div>
      )}
    </div>
  );
}