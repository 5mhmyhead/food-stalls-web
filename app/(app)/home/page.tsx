"use client";

import { useState } from "react";
import { mockOrderHistory } from "@/lib/mock-data";
import PendingDetailsCard from "@/components/home/pending-details-card";
import Calendar from "@/components/home/calendar";
import WelcomeCard from "@/components/home/welcome-card";
import LowStock from "@/components/home/low-stock";
import PendingOrders from "@/components/home/pending-orders";

export default function HomePage() {
  const [orders, setOrders] = useState(mockOrderHistory);

  const pendingOrders = orders.filter(
    (item) => item.order.status.toUpperCase() === "PENDING"
  );

  const handleComplete = (orderId: number) => {
    setOrders((prev) =>
      prev.map((item) =>
        item.id === orderId
          ? { ...item, order: { ...item.order, status: "COMPLETED" } }
          : item
      )
    );
  };

  const handleCancel = (orderId: number) => {
    setOrders((prev) =>
      prev.map((item) =>
        item.id === orderId
          ? { ...item, order: { ...item.order, status: "CANCELLED" } }
          : item
      )
    );
  };

  return (
    <section className="flex h-full w-full flex-col gap-6 overflow-y-auto rounded-3xl">
      <div className="flex shrink-0 items-end justify-between">
        <h1 className="font-serif text-6xl font-black pl-2">Home</h1>
      </div>

      <div className="grid w-full grid-cols-3 gap-6">
        <WelcomeCard username="username" />
        <Calendar />
      </div>

      <div className="flex min-h-175 w-full gap-6">
        <PendingOrders
          pendingOrders={pendingOrders}
          onComplete={handleComplete}
          onCancel={handleCancel}
        />

        <div className="flex flex-1 flex-col">
          <PendingDetailsCard />
        </div>
      </div>

      <div className="grid w-full gap-6">
        <LowStock />
      </div>
    </section>
  );
}