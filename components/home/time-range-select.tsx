import { ChevronDown } from "lucide-react";

export type TimeRange = "daily" | "weekly" | "monthly" | "all-time";

type TimeRangeSelectProps = {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
};

export function TimeRangeSelect({ value, onChange }: TimeRangeSelectProps) {
  return (
    <div className="relative inline-block">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as TimeRange)}
        className="w-full cursor-pointer appearance-none rounded-2xl bg-surface px-5 py-3 pr-10 text-sm font-semibold capitalize transition-colors hover:bg-surface/80 focus:outline-none"
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