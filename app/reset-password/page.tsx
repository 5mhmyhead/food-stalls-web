import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ResetPasswordForm from "@/components/auth/reset-password-form";
import HeroPanel from "@/components/auth/hero-panel";

export default async function ResetPasswordPage() {
  const recovering = (await cookies()).get("pw_recovery")?.value === "1";
  if (!recovering) redirect("/home");

  return (
    <main className="flex w-dvw h-dvh overflow-hidden p-6 gap-6">
      <HeroPanel />
      <ResetPasswordForm />
    </main>
  );
}
