import MenuToolbar from "@/components/menu/menu-toolbar";
import ProductCard from "@/components/menu/product-card";
import ProductDetails from "@/components/menu/product-details";
import DetailsPanel from "@/components/menu/details-panel";
import { mockCategories, mockProducts } from "@/lib/mock-data";

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ item?: string }>;
}) {
  const { item } = await searchParams;
  const categoryById = new Map(mockCategories.map((c) => [c.id, c]));
  const selected = mockProducts.find((p) => p.id === Number(item));

  return (
    <section className="h-full w-full rounded-3xl overflow-auto">
      <h1 className="font-serif font-black text-6xl">Menu</h1>

      <div className="flex flex-col gap-6 pt-6">
        <div className="w-full rounded-3xl bg-surface p-6">
          <MenuToolbar categories={mockCategories} products={mockProducts} />
        </div>

        {selected && (
          <DetailsPanel itemId={selected.id}>
            <ProductDetails
              product={selected}
              category={categoryById.get(selected.categoryId)}
            />
          </DetailsPanel>
        )}
   
        <div className="w-full rounded-3xl bg-surface p-6">

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {mockProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                category={categoryById.get(product.categoryId)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}