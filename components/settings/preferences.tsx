"use client";

import { useActionState } from "react";
import TextField from "../text-field";
import { updateLowStockThreshold } from "@/components/auth/actions";

export default function Preferences({
  lowStockThreshold = 5,
}: {
  lowStockThreshold?: number;
}) {
  const [state, action, pending] = useActionState(
    updateLowStockThreshold,
    undefined,
  );

  return (
    <div className="flex flex-col gap-6">
      <form action={action} className="flex flex-col gap-3">
        <div className="flex flex-row items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold">
              Inventory Threshold
            </h2>
            <p className="text-muted">
              Set when an item should be flagged as low on stock.
            </p>
          </div>
          <div className="flex flex-row items-center gap-3">
            <div className="w-28">
              <TextField
                key={lowStockThreshold}
                id="lowStockThreshold"
                name="lowStockThreshold"
                type="number"
                min={0}
                max={1000}
                required
                defaultValue={lowStockThreshold}
              />
            </div>
            <button type="submit" disabled={pending} className="btn-primary">
              {pending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {state?.message && (
          <p
            className={`text-sm ${state.success ? "text-green-700" : "text-red-600"}`}
            role="status"
          >
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}
