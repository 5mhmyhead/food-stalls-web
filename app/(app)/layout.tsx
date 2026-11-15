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
<<<<<<< HEAD
      <div className="fixed inset-0 flex overflow-hidden p-6 gap-6">
        <Sidebar username={user.username} />
=======
      <div className="flex h-dvh w-dvw overflow-hidden p-6 gap-6">
        <Sidebar username={user.username} role={user.role}/>
>>>>>>> 98c6ffcdf913180d6ed63e1edcee0e4a85a5fb8d
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </SettingsProvider>
  );
}
