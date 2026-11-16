import { Sidebar } from "@/components/sidebar";
import { SettingsProvider } from "@/components/settings-provider";
import { verifyUser } from "@/lib/dal";
import { getLowStockThreshold } from "@/lib/settings";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await verifyUser();
  const lowStockThreshold = await getLowStockThreshold();

  return (
    <SettingsProvider lowStockThreshold={lowStockThreshold}>
      <div className="fixed inset-0 flex gap-6 overflow-clip overscroll-none p-6">
        <Sidebar username={user.username} role={user.role} />
        <main className="min-h-0 min-w-0 flex-1 scroll-pt-6 overflow-x-clip overflow-y-auto overscroll-contain">
          {children}
        </main>
      </div>
    </SettingsProvider>
  );
}