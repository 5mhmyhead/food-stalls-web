import {
  Search,
  CookingPot,
  Utensils,
  Soup,
  Cookie,
  CupSoda,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import TextField from "./text-field";
import type { Category, Product } from "@/lib/mock-data";

const ICON_MAP: Record<string, LucideIcon> = {
  CookingPot,
  Utensils,
  Soup,
  Cookie,
  CupSoda,
};

type Variant = "default" | "compact";

const VARIANT_STYLES: Record<Variant, { chip: string; icon: string; label: string; searchIcon: number; showCount: boolean }> = {
  default: {
    chip: "flex-col items-start gap-2 px-5 py-3",
    icon: "size-7",
    label: "font-serif text-2xl",
    searchIcon: 28,
    showCount: true,
  },
  compact: {
    chip: "flex-row items-center gap-2 px-5 py-2",
    icon: "size-5",
    label: "",
    searchIcon: 20,
    showCount: false,
  },
};

interface MenuToolbarProps {
  categories: Category[];
  products: Product[];
  variant?: Variant;
}

interface FilterChipProps {
  icon?: LucideIcon;
  label: string;
  count: number;
  active?: boolean;
  variant: Variant;
}

function FilterChip({ icon: Icon, label, count, active = false, variant }: FilterChipProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <button
      type="button"
      className={`flex rounded-xl font-bold transition-colors ${styles.chip} ${
        active
          ? "bg-primary text-background"
          : "bg-surface-container text-muted hover:text-primary"
      }`}
    >
      {Icon && <Icon className={`shrink-0 ${styles.icon}`} />}
      <div className="flex items-center gap-3">
        <span className={styles.label}>{label}</span>
        {styles.showCount && (
          <span
            className={`rounded-md px-2 py-0.5 font-medium ${
              active ? "bg-background/20" : "bg-muted/10 text-muted"
            }`}
          >
            {count}
          </span>
        )}
      </div>
    </button>
  );
}

export default function MenuToolbar({
  categories,
  products,
  variant = "default",
}: MenuToolbarProps) {
  const styles = VARIANT_STYLES[variant];

  const categoryCounts = products.reduce<Record<number, number>>((acc, product) => {
    acc[product.categoryId] = (acc[product.categoryId] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-4">
      <TextField
        id="search"
        name="search"
        placeholder="Search for a menu item..."
        icon={<Search size={styles.searchIcon} />}
      />

      <div className="flex flex-wrap items-center gap-2">
        <FilterChip
          icon={LayoutGrid}
          label="All Items"
          count={products.length}
          active
          variant={variant}
        />

        {categories.map((category) => (
          <FilterChip
            key={category.id}
            icon={ICON_MAP[category.icon]}
            label={category.name}
            count={categoryCounts[category.id] ?? 0}
            variant={variant}
          />
        ))}
      </div>
    </div>
  );
}