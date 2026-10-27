import { Search } from "lucide-react";
import TextField from "../text-field";
import type { Category, Product } from "@/lib/mock-data";

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
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 font-bold text-background"
        >
          <span>All Items</span>
          <span className="rounded-md bg-background/20 px-2 py-0.5 text-xs font-semibold">
            {products.length}
          </span>
        </button>

        {categories.map((category) => {
          const count = categoryCounts[category.id] ?? 0;

          return (
            <button
              key={category.id}
              type="button"
              aria-pressed="false"
              className="flex items-center gap-2 rounded-xl bg-surface-container px-5 py-2 font-bold text-muted transition-colors hover:text-primary"
            >
              <span>{category.icon} {category.name}</span>
              <span className="rounded-md bg-muted/15 px-2 py-0.5 text-xs font-semibold text-muted">
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}