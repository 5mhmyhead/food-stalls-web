import ResetPasswordForm from "@/components/auth/reset-password-form";
import HeroPanel from "@/components/auth/hero-panel";

export default function ResetPasswordPage() {
  return (
    <main className="flex w-dvw h-dvh overflow-hidden p-6 gap-6">
      <HeroPanel />
      <ResetPasswordForm />
    </main>
  );
}
