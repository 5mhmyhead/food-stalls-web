import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ResetPasswordForm from "@/components/auth/reset-password-form";

export default async function ResetPasswordPage() {
  const recovering = (await cookies()).get("pw_recovery")?.value === "1";
  if (!recovering) redirect("/home");

  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <ResetPasswordForm />
    </main>
  );
}
