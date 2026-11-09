"use client";

import { useState } from "react";
import PendingDetailsCard from "@/components/home/pending-details-card";
import Calendar from "@/components/home/calendar";
import WelcomeCard from "@/components/home/welcome-card";
import LowStock from "@/components/home/low-stock";
import PendingOrders from "@/components/home/pending-orders";
import { updateOrderStatus, type OrderHistoryItem } from "@/components/home/actions";
import type { categories, products } from "@/db/schema";

type Category = typeof categories.$inferSelect;
type Product = typeof products.$inferSelect;

interface HomeClientProps {
  username: string;
  categories: Category[];
  products: Product[];
  initialPendingOrders: OrderHistoryItem[];
}

export default function HomeClient({
  username,
  categories,
  products,
  initialPendingOrders,
}: HomeClientProps) {
  const [pendingOrders, setPendingOrders] =
    useState<OrderHistoryItem[]>(initialPendingOrders);
  const [selectedId, setSelectedId] = useState<number | null>(
    initialPendingOrders[0]?.id ?? null
  );

  const selectedOrder =
    pendingOrders.find((item) => item.id === selectedId) ?? pendingOrders[0];

  const handleComplete = async (orderId: number) => {
    setPendingOrders((prev) => prev.filter((item) => item.id !== orderId));
    if (selectedId === orderId) {
      const remaining = pendingOrders.filter((item) => item.id !== orderId);
      setSelectedId(remaining[0]?.id ?? null);
    }
    await updateOrderStatus(orderId, "COMPLETED");
  };

  const handleCancel = async (orderId: number) => {
    setPendingOrders((prev) => prev.filter((item) => item.id !== orderId));
    if (selectedId === orderId) {
      const remaining = pendingOrders.filter((item) => item.id !== orderId);
      setSelectedId(remaining[0]?.id ?? null);
    }
    await updateOrderStatus(orderId, "CANCELLED");
  };

  return (
    <section className="flex h-full w-full flex-col gap-6 overflow-y-auto rounded-3xl">
      <div className="flex shrink-0 items-end justify-between">
        <h1 className="font-serif text-6xl font-black pl-2">Home</h1>
      </div>

      <div className="grid w-full grid-cols-3 gap-6">
        <WelcomeCard username={username} />
        <Calendar />
      </div>

      <div className="flex min-h-175 w-full gap-6">
        <PendingOrders
          pendingOrders={pendingOrders}
          selectedId={selectedOrder?.id ?? null}
          onSelectOrder={(id) => setSelectedId(id)}
          onComplete={handleComplete}
          onCancel={handleCancel}
        />

        <div className="flex flex-1 flex-col">
          <PendingDetailsCard
            historyItem={selectedOrder}
            onComplete={handleComplete}
            onCancel={handleCancel}
          />
        </div>
      </div>

      <div className="grid w-full gap-6">
        <LowStock categories={categories} products={products} />
      </div>
    </section>
  );
}