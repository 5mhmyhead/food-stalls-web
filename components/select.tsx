"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

type Option = { value: string; label: string };

export default function Select({
  name,
  options,
  defaultValue,
  className = "",
}: {
  name: string;
  options: Option[];
  defaultValue?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue ?? options[0]?.value ?? "");
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const selected = options[selectedIndex];

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  function toggle() {
    setActive(selectedIndex);
    setOpen((o) => !o);
  }

  function choose(i: number) {
    setValue(options[i].value);
    setActive(i);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) toggle();
      else setActive((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) toggle();
      else setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (open) choose(active);
      else toggle();
    }
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <input type="hidden" name={name} value={value} />

      <button
        type="button"
        role="combobox"
        onClick={toggle}
        onKeyDown={onKeyDown}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border-2 bg-surface-container px-4 py-3 text-left transition-colors duration-200 hover:border-primary/50 focus-visible:border-primary focus-visible:outline-none ${
          open ? "border-primary" : "border-transparent"
        }`}
      >
        <span>{selected?.label}</span>
        <ChevronDown
          className={`size-5 shrink-0 text-primary transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute right-0 z-20 mt-2 w-full overflow-hidden rounded-xl border-2 border-primary bg-surface p-1"
        >
          {options.map((o, i) => (
            <li
              key={o.value}
              role="option"
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(i)}
              className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 transition-colors ${
                i === active ? "bg-primary-soft/50" : ""
              } ${o.value === value ? "font-semibold text-primary" : ""}`}
            >
              {o.label}
              {o.value === value && <Check className="size-4" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
