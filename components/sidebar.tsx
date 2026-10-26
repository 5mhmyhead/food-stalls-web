"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, type Transition } from "motion/react";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/components/nav-items";
import { signOut } from "@/components/auth/actions";

export function Sidebar({ username }: { username: string }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const transition: Transition = reduce
    ? { duration: 0 }
    : { duration: 0.4, ease: [0.22, 1, 0.36, 1] };

  // Sign Out is an action, not a page, so it is handled separately
  const signOutItem = NAV_ITEMS.find((item) => item.label === "Sign Out");
  const pageItems = NAV_ITEMS.filter((item) => item.label !== "Sign Out");

  const activeHref = pageItems
    .filter(({ href }) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <nav className="w-80 shrink-0 text-background">
      <div className="w-full h-full bg-primary rounded-3xl p-6">
        <div className="flex flex-col items-center justify-center gap-1 pb-10">
          <Image src="/logo-white.svg" alt="logo" width={36} height={36} />
          <h1 className="font-serif text-3xl font-black tracking-wide">
            Kawaii Count
          </h1>
          <p className="text-sm">Welcome back, {username}!</p>
        </div>

        <div className="flex flex-col gap-3">
          {pageItems.map((item) => {
            const Icon = item.icon;
            const active = item.href === activeHref;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex w-full items-center rounded-xl px-4 py-3 font-semibold transition-colors duration-300 gap-3 ${
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

          {signOutItem && (
            <form action={signOut}>
              <button
                type="submit"
                className="relative flex w-full items-center rounded-xl px-4 py-3 font-semibold transition-colors duration-300 gap-3 hover:bg-primary-soft/50"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <signOutItem.icon className="block size-6 shrink-0" />
                  {signOutItem.label}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
}
