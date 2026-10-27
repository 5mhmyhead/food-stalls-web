import type { Category, Product } from "@/lib/mock-data";

const LOW_STOCK = 5;

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

export default function ProductCard({
  product,
  category,
}: {
  product: Product;
  category?: Category;
}) {
  const price = Number(product.price);
  const discount = Number(product.discount ?? 0);
  const finalPrice = price * (1 - discount / 100);

  const soldOut = product.stock === 0;
  const unavailable = !product.availability || soldOut;
  const lowStock = !soldOut && product.stock <= LOW_STOCK;

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-3xl bg-surface-container ${
        unavailable ? "opacity-60" : ""
      }`}
    >
      {/* IMAGE (falls back to the category icon when imageUrl is null) */}
      <div className="relative flex h-40 items-center justify-center bg-background text-6xl">
        {category?.icon ?? "🍽️"}

        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-sm font-bold text-background">
            -{discount}%
          </span>
        )}
        {unavailable && (
          <span className="absolute right-3 top-3 rounded-full bg-muted px-3 py-1 text-sm font-bold text-background">
            {soldOut ? "Sold out" : "Unavailable"}
          </span>
        )}
      </div>

      {/* DETAILS */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          {category && <p className="text-sm text-muted">{category.name}</p>}
          <h3 className="font-serif text-2xl font-bold leading-tight">
            {product.name}
          </h3>
          {product.description && (
            <p className="mt-1 line-clamp-2 text-muted">{product.description}</p>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between">
          <div>
            <p className="text-xl font-bold text-primary">{peso.format(finalPrice)}</p>
            {discount > 0 && (
              <p className="text-sm text-muted line-through">{peso.format(price)}</p>
            )}
          </div>
          <p className={`text-sm ${lowStock ? "font-bold text-primary" : "text-muted"}`}>
            {soldOut ? "No stock" : lowStock ? `Only ${product.stock} left` : `${product.stock} in stock`}
          </p>
        </div>
      </div>
    </article>
  );
}