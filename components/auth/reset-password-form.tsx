"use client";

import Image from "next/image";
import { useActionState } from "react";
import TextField from "../text-field";
import { Lock } from "lucide-react";
import { updatePassword } from "@/components/auth/actions";

export default function ResetPasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, undefined);

  return (
    <section className="w-full max-w-xl flex flex-col bg-surface p-12 items-center rounded-3xl gap-6">
      <div className="flex flex-col items-center gap-3">
        <Image src="/logo-blue.svg" alt="logo" width={64} height={64} />
        <h1 className="font-serif text-5xl font-black tracking-wide">
          New password
        </h1>
        <p>Choose a new password for your account.</p>
      </div>
      <form className="flex flex-col gap-6 w-full" action={action}>
        <TextField
          id="password"
          name="password"
          type="password"
          label="New password"
          required
          icon={<Lock size={28} />}
          placeholder="enter a strong password"
        />
        <TextField
          id="confirm-password"
          name="confirmPassword"
          type="password"
          label="Confirm password"
          required
          icon={<Lock size={28} />}
          placeholder="retype your strong password"
        />
        {state?.message && (
          <p className="text-sm text-red-600" role="alert">
            {state.message}
          </p>
        )}
        <button type="submit" disabled={pending} className="w-full btn-primary">
          {pending ? "Saving..." : "Save new password"}
        </button>
      </form>
    </section>
  );
}
