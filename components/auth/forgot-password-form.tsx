"use client";

import Image from "next/image";
import { useActionState } from "react";
import TextField from "../text-field";
import { Mail } from "lucide-react";
import { requestPasswordReset } from "@/components/auth/actions";

type ForgotPasswordFormProps = {
  onBack: () => void;
};

export default function ForgotPasswordForm({
  onBack,
}: ForgotPasswordFormProps) {
  const [state, action, pending] = useActionState(
    requestPasswordReset,
    undefined,
  );

  return (
    <section className="h-full w-full flex flex-col bg-surface p-12 items-center justify-center rounded-3xl gap-6">
      <div className="flex flex-col justify-center items-center gap-3">
        <Image src="/logo-blue.svg" alt="logo" width={64} height={64} />
        <h1 className="font-serif text-6xl font-black tracking-wide">
          Reset Account
        </h1>
        <p>Forgot your password? Don&apos;t worry!</p>
      </div>
      <form className="flex flex-col gap-6" action={action}>
        <TextField
          id="email"
          name="email"
          defaultValue={state?.email}
          type="email"
          label="Email"
          required
          icon={<Mail size={28} />}
          placeholder="enter your email"
        />
        {state?.message && (
          <p
            className={`text-sm ${state.success ? "text-green-700" : "text-red-600"}`}
            role="status"
          >
            {state.message}
          </p>
        )}
        <button type="submit" disabled={pending} className="w-full btn-primary">
          {pending ? "Sending..." : "Send a reset link"}
        </button>
      </form>
      <div>
        Just remembered your credentials?{" "}
        <button
          type="button"
          onClick={onBack}
          className="text-primary underline underline-offset-2 decoration-transparent transition-colors duration-300 hover:decoration-primary"
        >
          Sign in here
        </button>
      </div>
    </section>
  );
}
