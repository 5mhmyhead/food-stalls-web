import { peso } from "@/lib/product-utils";
import { mockCartItems, type CartItem } from "@/lib/mock-data";

interface PendingDetailsProps {
  items?: CartItem[];
}

export default function PendingDetailsCard({
  items = mockCartItems,
}: PendingDetailsProps) {
  const subtotal = items.reduce(
    (acc, item) => acc + (item.originalPrice ?? item.price),
    0
  );
  const finalTotal = items.reduce((acc, item) => acc + item.price, 0);
  const totalDiscount = subtotal - finalTotal;

  return (
    <aside className="flex h-full w-full flex-col gap-6 overflow-hidden rounded-3xl bg-surface p-6">
      <h2 className="font-serif text-4xl font-bold">Order Details</h2>

      <div className="flex flex-1 min-h-0 flex-col gap-3 overflow-y-auto rounded-2xl">
        {items.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted">
            No items in order
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl bg-surface-container p-4 shrink-0"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-full bg-primary/25 font-bold text-primary">
                  {item.quantity}x
                </span>
                <div>
                  <h3 className="font-serif text-xl font-bold leading-tight">{item.name}</h3>
                  <p className="text-sm text-muted">{item.categoryName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-primary text-xl font-bold">
                  {peso.format(item.price)}
                </p>
                {item.originalPrice && item.originalPrice > item.price && (
                  <p className="text-sm text-muted line-through">
                    {peso.format(item.originalPrice)}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-auto shrink-0 flex flex-col gap-4 rounded-2xl bg-surface-container p-4">
        <div className="flex flex-col gap-1 font-semibold">
          <div className="flex justify-between">
            <span className="text-muted">Price</span>
            <span className="font-bold">{peso.format(subtotal)}</span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex justify-between text-primary">
              <span>Discount applied</span>
              <span className="font-bold">-{peso.format(totalDiscount)}</span>
            </div>
          )}
        </div>

        <hr className="border-t-2 border-background" />

        <div className="flex items-baseline justify-between">
          <span className="font-serif text-3xl font-bold leading-tight">Total</span>
          <span className="font-serif text-3xl font-bold leading-tight">
            {peso.format(finalTotal)}
          </span>
        </div>

        <div className="flex flex-row gap-4">
          <button
            type="button"
            className="w-full btn-muted"
          >
            Cancel Order
          </button>
          <button
            type="button"
            className="w-full btn-primary"
          >
            Complete Order
          </button>
        </div>
      </div>
    </aside>
  );
}