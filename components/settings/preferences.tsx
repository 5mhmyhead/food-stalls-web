"use client";

import { ChevronDown } from "lucide-react";
import TextField from "../text-field";

export default function Preferences({ isManager = false }: { isManager?: boolean }) {
  return (
    <div className="flex flex-col gap-6">
      <form className="flex flex-row items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold">Currency</h2>
          <p className="text-muted">Set the currency used when showing prices.</p>
        </div>
        <div className="flex flex-row items-center gap-3">
          <div className="relative flex items-center rounded-xl border-2 border-transparent bg-surface-container px-3 transition-colors focus-within:border-primary">
            <select
              id="currency"
              name="currency"
              defaultValue="PHP"
              className="appearance-none bg-transparent py-3 pr-8 outline-none cursor-pointer"
            >
              <option value="PHP">Philippine Peso (₱)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
              <option value="JPY">Japanese Yen (¥)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 size-5 text-muted/75" />
          </div>

          <button type="submit" className="btn-primary">
            Save
          </button>
        </div>
      </form>

      <hr className="border-t-2 border-background" />

      <form className="flex flex-row items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold">Inventory Threshold</h2>
          <p className="text-muted">Set when an item should be flagged as low on stock.</p>
        </div>
        <div className="flex flex-row items-center gap-3">
          <TextField
            id="lowStockThreshold"
            name="lowStockThreshold"
            type="number"
            min={0}
            defaultValue={10}
          />
          <button type="submit" className="btn-primary">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}