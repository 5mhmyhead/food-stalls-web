"use client";

import Image from "next/image";
import TextField from "../text-field";
import { User } from "lucide-react";

type ForgotPasswordFormProps = {
  onBack: () => void;
};

export default function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  return (
    <section className="h-full w-full flex flex-col bg-surface p-12 items-center justify-center rounded-3xl gap-6">
      <div className="flex flex-col justify-center items-center gap-3">
        <Image
          src="/logo-blue.svg"
          alt="logo"
          width={64}
          height={64}
        />
        <h1  className="font-serif text-6xl font-black tracking-wide">
          Reset Account
        </h1>
        <p>Forgot your password? Don't worry!</p>
      </div>
      <form className="flex flex-col gap-6" action="">
        <TextField
          id="identifier"
          type="text"
          label="Username or Email"
          required
          icon={<User size={28} />}
          placeholder="enter your username or email"
        />
        <button
          type="submit"
          className="w-full px-6 py-2.5 rounded-xl bg-primary text-background cursor-pointer justify-center transition-opacity duration-300 hover:opacity-90"
        >
          Send a reset link
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