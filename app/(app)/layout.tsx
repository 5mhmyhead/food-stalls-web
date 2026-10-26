import { Sidebar } from "@/components/sidebar";

export default function AppLayout({ 
  children,
}: { 
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh w-dvw overflow-hidden p-6 gap-6">
      <Sidebar />
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}