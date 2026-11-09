"use client";

import { useState } from "react";
import HistoryCard from "@/components/history/history-card";
import HistoryDetails from "@/components/history/history-details";
import type { OrderHistoryItem } from "@/components/history/actions";

interface HistoryClientProps {
  historyItems: OrderHistoryItem[];
}

export default function HistoryClient({ historyItems }: HistoryClientProps) {
  const [selectedId, setSelectedId] = useState<number | null>(
    historyItems[0]?.id ?? null
  );

  const selectedItem = historyItems.find((item) => item.id === selectedId);

  return (
    <section className="flex h-full w-full flex-col gap-6 overflow-hidden">
      <h1 className="shrink-0 font-serif text-6xl font-black pl-2 leading-tight">
        History
      </h1>

      <div className="flex flex-1 min-h-0 gap-6">
        <div className="flex flex-1 min-h-0 rounded-3xl bg-surface">
          {historyItems.length === 0 ? (
            <div className="flex flex-1 min-h-0 w-full flex-col items-center justify-center p-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <h2 className="font-serif text-4xl font-bold">No order history.</h2>
                <p className="text-muted">
                  Completed and processed orders will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 min-h-0 flex-col gap-4 overflow-y-auto p-6">
              {historyItems.map((historyItem) => (
                <div
                  key={historyItem.id}
                  onClick={() => setSelectedId(historyItem.id)}
                  className="cursor-pointer"
                >
                  <HistoryCard
                    historyItem={historyItem}
                    isSelected={historyItem.id === selectedId}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-1 min-h-0 rounded-3xl bg-surface">
          <HistoryDetails historyItem={selectedItem} />
        </div>
      </div>
    </section>
  );
}