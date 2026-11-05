import { ReactNode } from "react";

export type AnalyticsCardVariant = "default" | "featured";

type AnalyticsCardProps = {
  icon: ReactNode;
  title: string;
  value: string | number;
  subtext?: string;
  variant?: AnalyticsCardVariant;
  iconBgColor?: string;
  bgColor?: string;
};

const VARIANT_STYLES: Record<
  AnalyticsCardVariant,
  {
    container: string;
    iconWrapper: string;
    textWrapper: string;
    title: string;
    value: string;
    subtext: string;
    showCircleOverlay: boolean;
  }
> = {
  default: {
    container: "flex-col items-start justify-between gap-6 p-6 text-left",
    iconWrapper: "flex size-16 items-center justify-center rounded-full text-onSurface",
    textWrapper: "flex flex-col items-start gap-1 text-left w-full",
    title: "text-lg font-medium text-muted",
    value: "max-w-full truncate text-4xl font-bold text-onSurface",
    subtext: "text-sm font-medium text-muted",
    showCircleOverlay: false,
  },
  featured: {
    container: "relative flex-col items-center justify-center gap-2 overflow-hidden p-8 text-center text-background",
    iconWrapper: "relative z-10 flex items-center justify-center text-background mb-1",
    textWrapper: "flex flex-col items-center gap-1 text-center w-full",
    title: "relative z-10 text-2xl font-semibold tracking-tight text-background pb-2",
    value: "relative z-10 max-w-full truncate text-5xl font-bold text-background pb-2",
    subtext: "relative z-10 text-lg font-semibold text-background/75",
    showCircleOverlay: true,
  },
};

export function AnalyticsCard({
  icon,
  title,
  value,
  subtext,
  variant = "default",
  iconBgColor = "bg-primary",
  bgColor,
}: AnalyticsCardProps) {
  const styles = VARIANT_STYLES[variant];
  const isFeatured = variant === "featured";

  const backgroundClass = bgColor ?? (isFeatured ? "bg-primary" : "bg-surface");

  return (
    <div
      className={`flex rounded-3xl ${styles.container} ${backgroundClass}`}
    >
      {styles.showCircleOverlay && (
        <>
          <div className="pointer-events-none absolute -top-10 left-25 size-64 rounded-full bg-linear-to-b from-background/30 to-transparent" />
          <div className="pointer-events-none absolute top-30 right-30 size-36 rounded-full bg-linear-to-b from-transparent to-background/30" />
        </>
      )}

      <div
        className={`${styles.iconWrapper} ${
          !isFeatured ? iconBgColor : ""
        }`}
      >
        {icon}
      </div>

      <div className={styles.textWrapper}>
        <span className={styles.title}>{title}</span>
        <span className={styles.value}>{value}</span>
        {subtext && <span className={styles.subtext}>{subtext}</span>}
      </div>
    </div>
  );
}