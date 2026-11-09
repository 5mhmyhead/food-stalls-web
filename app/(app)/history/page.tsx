import HistoryCard from "@/components/history/history-card";
import HistoryDetails from "@/components/history/history-details";
import { mockOrderHistory } from "@/lib/mock-data";

export default function HistoryPage() {
  return (
    <section className="flex h-full w-full flex-col gap-6 overflow-hidden">
      <h1 className="shrink-0 font-serif text-6xl font-black pl-2">History</h1>

      <div className="flex flex-1 min-h-0 gap-6">
        <div className="flex flex-1 min-h-0 rounded-3xl bg-surface">
          <div className="flex flex-1 min-h-0 flex-col gap-4 overflow-y-auto p-6">
            {mockOrderHistory.map((historyItem) => (
              <HistoryCard 
                key={historyItem.id}
                historyItem={historyItem}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-1 min-h-0 rounded-3xl bg-surface">
          <HistoryDetails />
        </div>
      </div>
    </section>
  );
}