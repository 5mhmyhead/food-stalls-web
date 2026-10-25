import AuthPanel from "@/components/auth/auth-panel";
import HeroPanel from "@/components/auth/hero-panel";

export default function Home() {
  return (
    <main className="flex w-dvw h-dvh overflow-hidden p-6 gap-6">
      <HeroPanel />
      <AuthPanel />
    </main>
  );
}
