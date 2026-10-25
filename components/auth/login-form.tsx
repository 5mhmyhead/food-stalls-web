"use client";

import Image from "next/image";
import TextField from "../text-field";
import { User, Lock } from "lucide-react";

export default function LoginForm({
  onSignUp,
  onForgot,
}: {
  onSignUp: () => void;
  onForgot: () => void;
}) { 
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
          Sign in
        </h1>
        <p>Welcome back to your favorite food stalls app!</p>
      </div>
      <form className="flex flex-col gap-6" action="">
        <TextField
          id="username"
          type="text"
          label="Username"
          required
          icon={<User size={28} />}
          placeholder="enter your username"
        />
        <TextField
          id="password"
          type="password"
          label="Password"
          required
          icon={<Lock size={28} />}
          placeholder="enter your password"
        />
        <button
          type="button"
          onClick={onForgot}
          className="self-end text-muted underline underline-offset-2 decoration-transparent transitions-color duration-300 hover:decoration-muted"
        >
          forgot password?
        </button>
        <button
          type="submit"
          className="w-full px-6 py-2.5 rounded-xl bg-primary text-background cursor-pointer justify-center transition-opacity duration-300 hover:opacity-90"
        >
          Sign in
        </button>
      </form>
      <div>
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onSignUp}
          className="text-primary underline underline-offset-2 decoration-transparent transition-colors duration-300 hover:decoration-primary"
        >
          Create one here
        </button>
      </div>
    </section>
  );
}