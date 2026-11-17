"use client";

import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import type { TimeRange } from "@/lib/analytics-types";

export function TimeRangeSelect({ value }: { value: TimeRange }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleChange(next: TimeRange) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", next);

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="relative inline-block">
      <select
        value={value}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.value as TimeRange)}
        aria-label="Time range"
        aria-busy={isPending}
        className={`cursor-pointer appearance-none rounded-2xl border-2 border-transparent bg-surface px-5 py-3 pr-10 text-sm font-semibold capitalize text-onSurface transition-all hover:bg-surface/80 focus:border-primary focus:outline-none disabled:cursor-wait ${
          isPending ? "opacity-60" : ""
        }`}
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="all-time">All Time</option>
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
    </div>
  );
}