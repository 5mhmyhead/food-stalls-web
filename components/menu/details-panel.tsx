"use client";

import { X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const PanelContext = createContext<{ close: () => void } | null>(null);

export default function DetailsPanel({
  itemId,
  children,
}: {
  itemId: number;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ref = useRef<HTMLDivElement>(null);

  const [closingId, setClosingId] = useState<number | null>(null);
  const closing = closingId === itemId;

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [itemId]);

  function navigateAway() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("item");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function close() {
    if (closing) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      navigateAway();
      return;
    }
    setClosingId(itemId);
  }

  function handleAnimationEnd(e: React.AnimationEvent<HTMLDivElement>) {
    if (closing && e.target === e.currentTarget) navigateAway();
  }

  return (
    <PanelContext.Provider value={{ close }}>
      <div
        ref={ref}
        onAnimationEnd={handleAnimationEnd}
        className={`-mb-6 grid scroll-mt-4 grid-rows-[1fr] motion-reduce:animate-none ${
          closing ? "animate-panel-out" : "animate-panel-in"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pb-6">{children}</div>
        </div>
      </div>
    </PanelContext.Provider>
  );
}

export function CloseButton() {
  const panel = useContext(PanelContext);

  return (
    <button
      type="button"
      onClick={panel?.close}
      aria-label="Close details"
      className="rounded-full p-2 text-muted transition-colors hover:text-primary"
    >
      <X size={20} />
    </button>
  );
}