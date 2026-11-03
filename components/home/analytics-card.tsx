import { ReactNode } from "react";

type AnalyticsCardProps = {
  icon: ReactNode;
  title: string;
  value: string | number;
  iconBgColor?: string;
};

export function AnalyticsCard({
  icon,
  title,
  value,
  iconBgColor = "bg-primary",
}: AnalyticsCardProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-surface p-6">
      <div
        className={`flex size-16 items-center justify-center rounded-full text-onSurface ${iconBgColor}`}
      >
        {icon}
      </div>

      <div className="flex flex-col gap-1 text-left">
        <span className="text-lg font-medium text-muted">{title}</span>
        <span className="max-w-full truncate text-4xl font-bold text-onSurface">
          {value}
        </span>
      </div>
    </div>
  );
}