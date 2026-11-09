import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import MenuToolbar from "@/components/menu-toolbar";
import ProductCard from "@/components/menu/product-card";
import ProductDetails from "@/components/menu/product-details";
import DetailsPanel from "@/components/menu/details-panel";
import { getMenuData } from "@/components/menu/actions";

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ item?: string }>;
}) {
  const { item } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const [profile, { categories, products }] = await Promise.all([
    db
      .select()
      .from(profiles)
      .where(eq(profiles.id, user.id))
      .then((res) => res[0]),
    getMenuData(),
  ]);

  const isAdmin = profile?.accountType === "ADMIN";
  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const selected = products.find((p) => p.id === Number(item));

  return (
    <section className="flex h-full w-full flex-col gap-6 overflow-hidden rounded-3xl">
      <h1 className="shrink-0 font-serif text-6xl font-black pl-2 leading-tight">
        Menu
      </h1>

      <div className="flex flex-1 min-h-0 flex-col gap-6">
        <div className="shrink-0 w-full rounded-3xl bg-surface p-6">
          <MenuToolbar
            categories={categories}
            products={products}
            isAdmin={isAdmin}
          />
        </div>

        {selected && (
          <DetailsPanel itemId={selected.id}>
            <ProductDetails
              product={selected}
              category={categoryById.get(selected.categoryId)}
            />
          </DetailsPanel>
        )}

        {products.length === 0 ? (
          <div className="flex flex-1 min-h-0 w-full flex-col items-center justify-center rounded-3xl bg-surface p-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <h2 className="font-serif text-4xl font-bold">No menu items found.</h2>
              <p className="text-muted">
                There are no menu products available right now.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto rounded-3xl bg-surface p-6">
            <div className="grid grid-cols-4 gap-4">
              {products.map((product) => (
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