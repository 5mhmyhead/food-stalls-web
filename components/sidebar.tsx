"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, type Transition } from "motion/react";
import { usePathname } from "next/navigation";
import {
  TOP_NAV_ITEMS,
  BOTTOM_NAV_ITEMS,
  type NavItem,
} from "@/components/nav-items";
import { signOut } from "@/components/auth/actions";

interface SidebarProps {
  username: string;
  role?: "WORKER" | "ADMIN";
}

export function Sidebar({ username, role = "WORKER" }: SidebarProps) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const transition: Transition = reduce
    ? { duration: 0 }
    : { duration: 0.4, ease: [0.22, 1, 0.36, 1] };

  // Filter top nav items based on accountType (only ADMIN sees Analytics)
  const filteredTopNavItems = TOP_NAV_ITEMS.filter((item) => {
    if (item.href === "/analytics") {
      return role === "ADMIN";
    }
    return true;
  });

  const allLinks = [...filteredTopNavItems, ...BOTTOM_NAV_ITEMS];
  const activeHref = allLinks
    .filter(({ href }) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  const renderNavLinks = (items: NavItem[]) => (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.href === activeHref;

        if (item.label === "Sign Out") {
          return (
            <form action={signOut} key={item.label}>
              <button
                type="submit"
                className="relative flex w-full items-center gap-3 rounded-xl px-4 py-3 font-semibold transition-colors duration-300 hover:bg-primary-soft/50"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Icon className="block size-6 shrink-0" />
                  {item.label}
                </span>
              </button>
            </form>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex w-full items-center gap-3 rounded-xl px-4 py-3 font-semibold transition-colors duration-300 ${
              active ? "text-primary" : "hover:bg-primary-soft/50"
            }`}
          >
            {active && (
              <motion.span
                layoutId="sidebar-active"
                transition={transition}
                className="absolute inset-0 rounded-xl bg-surface-container"
              />
            )}
            <span className="relative z-10 flex items-center gap-3">
              <Icon className="block size-6 shrink-0" />
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <nav className="h-full w-80 shrink-0 text-background">
      <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-primary p-6">
        <div className="pointer-events-none absolute -top-20 -right-12 size-72 rounded-full bg-linear-to-b from-background/30 to-transparent" />
        <div className="pointer-events-none absolute -bottom-16 -left-12 size-64 rounded-full bg-linear-to-t from-background/30 to-transparent" />
        <div className="pointer-events-none absolute bottom-36 left-48 size-36 rounded-full bg-linear-to-t from-background/30 to-transparent" />

        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center justify-center gap-1 pb-4">
              <Image src="/logo-white.svg" alt="logo" width={36} height={36} />
              <h1 className="font-serif text-3xl font-black tracking-wide">
                Kawaii Count
              </h1>
              <p className="text-sm">Welcome back, {username}!</p>
            </div>
            {renderNavLinks(filteredTopNavItems)}
          </div>
          {renderNavLinks(BOTTOM_NAV_ITEMS)}
        </div>
      </div>
    </nav>
  );
}