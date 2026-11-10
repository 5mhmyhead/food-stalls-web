"use client";

import { ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import type { TimeRange } from "@/lib/analytics-types";

export function TimeRangeSelect({ value }: { value: TimeRange }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleChange(next: TimeRange) {
    startTransition(() => {
      router.replace(`${pathname}?range=${next}`, { scroll: false });
    });
  }

  return (
    <div className="relative inline-block">
      <select
        value={value}
        onChange={(e) => handleChange(e.target.value as TimeRange)}
        aria-label="Time range"
        aria-busy={isPending}
        className={`cursor-pointer appearance-none rounded-2xl bg-surface px-5 py-3 pr-10 text-sm font-semibold capitalize transition-opacity hover:bg-surface/80 focus:outline-none ${
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