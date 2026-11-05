"use client";

import Link from "next/link";
import { PlusCircle, History } from "lucide-react";

interface WelcomeCardProps {
  username?: string;
}

export default function WelcomeCard({ username = "User" }: WelcomeCardProps) {
  return (
    <div className="col-span-2 flex flex-col justify-between rounded-3xl bg-surface p-6">
      <div className="relative z-10 flex flex-col gap-3">
        <h2 className="font-serif text-5xl font-bold">Welcome back, {username}!</h2>
        <p className="text-lg font-medium text-muted">
          Everything is fresh and in order today! What would you like to get started with?
        </p>
      </div>

      <div className="flex flex-row items-center gap-4">
        <Link
          href="/orders"
          className="w-full btn-primary text-center"
        >
          <span>Make an Order</span>
        </Link>

        <Link
          href="/menu"
          className="w-full btn-secondary text-center"
        >
          <span>View Restaurant Menu</span>
        </Link>

        <Link
          href="/history"
          className="w-full btn-muted text-center"
        >
          <span>Check Order History</span>
        </Link>
      </div>
    </div>
  );
}