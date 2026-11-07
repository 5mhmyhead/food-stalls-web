"use client";

import Link from "next/link";
import Image from "next/image";
import { PlusCircle, UtensilsCrossed, History, Sparkles } from "lucide-react";

interface WelcomeCardProps {
  username?: string;
  bgColor?: string;
}

export default function WelcomeCard({
  username = "User",
}: WelcomeCardProps) {
  return (
    <div className={`relative col-span-2 flex flex-col justify-between overflow-hidden rounded-3xl p-6 text-background bg-primary`}>
      <div className="pointer-events-none absolute -top-30 -left-7 size-124 rounded-full bg-linear-to-b from-background/30 to-transparent" />
      <div className="pointer-events-none absolute -top-10 right-40 size-48 rounded-full bg-linear-to-b from-background/30 to-transparent" />
      <div className="pointer-events-none absolute -bottom-20 -right-10 size-72 rounded-full bg-linear-to-b from-transparent to-background/30" />

      <div className="relative z-10 flex flex-col gap-3">
        <Image src="/logo-white.svg" alt="logo" width={64} height={64} />
        <h2 className="font-serif text-5xl font-bold text-background">
          Welcome back, {username}!
        </h2>
        <p className="text-lg font-semibold text-background/75">
          Everything is fresh and in order today! What would you like to get started with?
        </p>
      </div>

      <div className="relative z-10 mt-8 flex flex-row items-center gap-4">
        <Link
          href="/orders"
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-background px-5 py-5 font-bold text-primary transition-all hover:bg-background/90 active:scale-95 text-center"
        >
          <PlusCircle className="size-5 stroke-[2.5]" />
          <span>Make an Order</span>
        </Link>

        <Link
          href="/menu"
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-background/20 px-5 py-5 font-bold text-background backdrop-blur-sm transition-all hover:bg-background/30 active:scale-95 text-center"
        >
          <UtensilsCrossed className="size-5 stroke-[2.5]" />
          <span>View Menu</span>
        </Link>

        <Link
          href="/history"
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-background/20 px-5 py-5  font-bold text-background backdrop-blur-sm transition-all hover:bg-background/30 active:scale-95 text-center"
        >
          <History className="size-5 stroke-[2.5]" />
          <span>Order History</span>
        </Link>
      </div>
    </div>
  );
}