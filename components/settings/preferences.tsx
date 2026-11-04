"use client";

import TextField from "../text-field";
import Select from "../select";

export default function Preferences({
  isManager = false,
}: {
  isManager?: boolean;
}) {
  return (
    <div className="flex flex-col gap-6">
      <form className="flex flex-row items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold">Currency</h2>
          <p className="text-muted">
            Set the currency used when showing prices.
          </p>
        </div>
        <div className="flex flex-row items-center gap-3">
          <Select
            name="currency"
            defaultValue="PHP"
            className="w-64"
            options={[
              { value: "PHP", label: "Philippine Peso (₱)" },
              { value: "USD", label: "US Dollar ($)" },
              { value: "EUR", label: "Euro (€)" },
              { value: "JPY", label: "Japanese Yen (¥)" },
            ]}
          />

          <button type="submit" className="btn-primary">
            Save
          </button>
        </div>
      </form>

      <hr className="border-t-2 border-background" />

      <form className="flex flex-row items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold">Inventory Threshold</h2>
          <p className="text-muted">
            Set when an item should be flagged as low on stock.
          </p>
        </div>
        <div className="flex flex-row items-center gap-3">
          <div className="w-28">
            <TextField
              id="lowStockThreshold"
              name="lowStockThreshold"
              type="number"
              min={0}
              defaultValue={10}
            />
          </div>
          <button type="submit" className="btn-primary">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
