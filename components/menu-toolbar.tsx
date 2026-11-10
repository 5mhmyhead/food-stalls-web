"use client";

import { useState } from "react";
import { Search, LayoutGrid, type LucideIcon } from "lucide-react";
import TextField from "./text-field";
import CreateProductModal from "@/components/menu/create-product-modal";
import CreateCategoryModal from "@/components/menu/create-category-modal";
import EditCategoryModal from "@/components/menu/edit-category-modal";
import { getCategoryIcon } from "@/lib/category-icons";
import type { categories, products } from "@/db/schema";

type Category = typeof categories.$inferSelect;
type Product = typeof products.$inferSelect;
type Variant = "default" | "compact";

const VARIANT_STYLES: Record<
  Variant,
  {
    chip: string;
    icon: string;
    label: string;
    searchIcon: number;
    showCount: boolean;
  }
> = {
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
    searchIcon: 28,
    showCount: false,
  },
};

interface MenuToolbarProps {
  categories: Category[];
  products: Product[];
  variant?: Variant;
  isAdmin?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  selectedCategory?: number | null;
  onCategoryChange?: (categoryId: number | null) => void;
}

interface FilterChipProps {
  icon?: LucideIcon;
  label: string;
  count: number;
  active?: boolean;
  variant: Variant;
  onClick?: () => void;
}

function FilterChip({
  icon: Icon,
  label,
  count,
  active = false,
  variant,
  onClick,
}: FilterChipProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <button
      type="button"
      onClick={onClick}
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
  isAdmin = false,
  searchQuery = "",
  onSearchChange,
  selectedCategory = null,
  onCategoryChange,
}: MenuToolbarProps) {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);

  const styles = VARIANT_STYLES[variant];

  const categoryCounts = products.reduce<Record<number, number>>(
    (acc, product) => {
      acc[product.categoryId] = (acc[product.categoryId] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <TextField
              id="search"
              name="search"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search for a menu item..."
              icon={<Search size={styles.searchIcon} />}
            />
          </div>

          {variant === "default" && isAdmin && (
            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setIsProductModalOpen(true)}
                className="btn-primary whitespace-nowrap"
              >
                Create Menu Item
              </button>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(true)}
                className="btn-secondary whitespace-nowrap"
              >
                Create Category
              </button>
              {categories.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsEditCategoryModalOpen(true)}
                  className="btn-tertiary whitespace-nowrap"
                >
                  Edit Categories
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterChip
            icon={LayoutGrid}
            label="All Items"
            count={products.length}
            active={selectedCategory === null}
            onClick={() => onCategoryChange?.(null)}
            variant={variant}
          />

          {categories.map((category) => (
            <FilterChip
              key={category.id}
              icon={getCategoryIcon(category.icon)}
              label={category.name}
              count={categoryCounts[category.id] ?? 0}
              active={selectedCategory === category.id}
              onClick={() => onCategoryChange?.(category.id)}
              variant={variant}
            />
          ))}
        </div>
      </div>

      <CreateProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        categories={categories}
      />

      <CreateCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />

      <EditCategoryModal
        isOpen={isEditCategoryModalOpen}
        onClose={() => setIsEditCategoryModalOpen(false)}
        categories={categories}
        selectedCategoryId={selectedCategory}
      />
    </>
  );
}