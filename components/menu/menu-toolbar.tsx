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
import TextField from "../text-field";
import type { Category, Product } from "@/lib/mock-data";

const ICON_MAP: Record<string, LucideIcon> = {
  CookingPot,
  Utensils,
  Soup,
  Cookie,
  CupSoda,
};

interface MenuToolbarProps {
  categories: Category[];
  products: Product[];
}

export default function MenuToolbar({ categories, products }: MenuToolbarProps) {
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
        icon={<Search size={28} />}
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="flex flex-col items-start gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-background"
        >
          <LayoutGrid className="size-7 shrink-0" />
          <div className="flex gap-3 items-center">
            <span className="font-serif text-2xl">All Items</span>
            <span className="rounded-md bg-background/20 px-2 py-0.5 font-medium">
              {products.length}
            </span>
          </div>
        </button>

        {categories.map((category) => {
          const count = categoryCounts[category.id] ?? 0;
          const CategoryIcon = ICON_MAP[category.icon];

          return (
            <button
              key={category.id}
              type="button"
              className="flex flex-col items-start gap-2 rounded-xl bg-surface-container px-5 py-3 font-bold text-muted transition-colors hover:text-primary"
            >
              {CategoryIcon && <CategoryIcon className="size-7 shrink-0" />}
              <div className="flex gap-3 items-center">
                <span className="font-serif text-2xl">{category.name}</span>
                <span className="rounded-md bg-muted/10 px-2 py-0.5 font-medium text-muted">
                  {count}
                </span>
              </div>  
            </button>
          );
        })}
      </div>
    </div>
  );
}