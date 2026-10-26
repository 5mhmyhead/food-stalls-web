import { Sidebar } from "@/components/sidebar";
import { verifyUser } from "@/lib/dal";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await verifyUser();

  return (
    <div className="flex h-dvh w-dvw overflow-hidden p-6 gap-6">
      <Sidebar username={user.username} />
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
