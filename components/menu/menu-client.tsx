"use client";

import { useState, useMemo } from "react";
import MenuToolbar from "@/components/menu-toolbar";
import ProductCard from "@/components/menu/product-card";
import ProductDetails from "@/components/menu/product-details";
import DetailsPanel from "@/components/menu/details-panel";
import type { categories, products } from "@/db/schema";

type Category = typeof categories.$inferSelect;
type Product = typeof products.$inferSelect;

interface MenuClientProps {
  categories: Category[];
  products: Product[];
  isAdmin: boolean;
  selectedItemId?: number | null;
}

export default function MenuClient({
  categories,
  products,
  isAdmin,
  selectedItemId,
}: MenuClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  const selectedProduct = useMemo(
    () => (selectedItemId ? products.find((p) => p.id === selectedItemId) : null),
    [products, selectedItemId]
  );

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.description?.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === null || product.categoryId === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <section className="flex h-full w-full flex-col gap-6 rounded-3xl overflow-y-auto">
      <h1 className="shrink-0 font-serif text-6xl font-black pl-2 leading-tight">
        Menu
      </h1>

      <div className="flex flex-1 w-full flex-col gap-6">
        <div className="w-full shrink-0 rounded-3xl bg-surface p-6">
          <MenuToolbar
            categories={categories}
            products={products}
            isAdmin={isAdmin}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {selectedProduct && (
          <DetailsPanel itemId={selectedProduct.id}>
            <ProductDetails
              product={selectedProduct}
              category={categoryById.get(selectedProduct.categoryId)}
              categories={categories}
              isAdmin={isAdmin}
            />
          </DetailsPanel>
        )}

        {filteredProducts.length === 0 ? (
          <div className="flex flex-1 w-full flex-col items-center justify-center rounded-3xl bg-surface p-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <h2 className="font-serif text-4xl font-bold">No menu items found.</h2>
              <p className="text-muted">
                {searchQuery || selectedCategory !== null
                  ? "No products match your search or category filter."
                  : "There are no menu products available right now."}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 w-full rounded-3xl bg-surface p-6 overflow-hidden">
            <div className="grid grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  category={categoryById.get(product.categoryId)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}