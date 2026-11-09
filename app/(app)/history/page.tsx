import { getHistoryData } from "@/components/history/actions";
import HistoryClient from "@/components/history/history-client";

export default async function HistoryPage() {
  const historyItems = await getHistoryData();

  return <HistoryClient historyItems={historyItems} />;
}