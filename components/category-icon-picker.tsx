"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { CATEGORY_ICONS } from "@/lib/category-icons";
import TextField from "./text-field";

export default function CategoryIconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORY_ICONS;
    return CATEGORY_ICONS.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.keywords.some((k) => k.includes(q))
    );
  }, [query]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <TextField
          id="search-category-icons"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search icons (e.g. coffee, dessert)..."
          icon={<Search size={28} />}
        />
      </div>

      <div className="h-56 overflow-y-auto rounded-2xl border-2 border-muted/10 bg-surface-container/30 p-4">
        {results.length > 0 ? (
          <div className="grid grid-cols-4 gap-2">
            {results.map(({ id, label, Icon }) => {
              const selected = value === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onChange(id)}
                  title={label}
                  className={`group flex flex-col items-center justify-center gap-1.5 rounded-xl p-2.5 transition-all duration-200 ${
                    selected
                      ? "bg-primary text-background"
                      : "bg-surface-container text-muted hover:bg-surface-container/80 hover:text-primary"
                  }`}
                >
                  <Icon
                    size={22}
                    className="shrink-0 transition-transform duration-200"
                  />
                  <span className="w-full truncate text-center text-[11px] font-bold leading-tight">
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center py-8 text-center text-muted">
            <p className="text-md font-medium">No icons match “{query}”</p>
            <p className="mt-1 text-xs text-muted/70">
              Try searching for terms like "drink", "meat", or "sweet"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}