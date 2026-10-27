"use client";

import Image from "next/image";
import { useActionState } from "react";
import TextField from "../text-field";
import { Lock } from "lucide-react";
import { updatePassword } from "@/components/auth/actions";

export default function ResetPasswordForm({
  onSignIn,
}: {
  onSignIn?: () => void;
}) {
  const [state, action, pending] = useActionState(updatePassword, undefined);

  return (
    <div className="relative flex-4 overflow-hidden rounded-2xl">
      <section className="h-full w-full flex flex-col bg-surface p-12 items-center justify-center rounded-3xl gap-6">
        <div className="flex flex-col justify-center items-center gap-3">
          <Image src="/logo-blue.svg" alt="logo" width={64} height={64} />
          <h1 className="font-serif text-6xl font-black tracking-wide">
            Reset Password
          </h1>
          <p>Choose a new password for your account.</p>
        </div>

        <form className="flex flex-col gap-6" action={action}>
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
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm password"
            required
            icon={<Lock size={28} />}
            placeholder="retype your strong password"
          />
          {state?.message && (
            <p className="text-primary" role="alert">
              {state.message}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full btn-primary disabled:opacity-75"
          >
            {pending ? "Saving..." : "Save new password"}
          </button>
        </form>

        {onSignIn && (
          <div>
            Remember your password?{" "}
            <button
              type="button"
              onClick={onSignIn}
              className="text-primary underline underline-offset-2 decoration-transparent transition-colors duration-300 hover:decoration-primary"
            >
              Sign in here
            </button>
          </div>
        )}
      </section>
    </div>
  );
}