"use client";

import Image from "next/image";
import TextField from "../text-field";
import { User, Lock, Mail } from "lucide-react";

type SignUpFormProps = {
  onBack: () => void;
};

export default function SignUpForm({ onBack }: SignUpFormProps) {
  return (
    <section className="h-full w-full flex flex-col bg-surface p-12 items-center justify-center rounded-3xl gap-6">
      <div className="flex flex-col justify-center items-center gap-3">
        <Image src="/logo-blue.svg" alt="logo" width={64} height={64} />
        <h1 className="font-serif text-6xl font-black tracking-wide">
          Sign up
        </h1>
      </div>
      <form className="flex flex-col gap-6" action="">
        <TextField
          id="username"
          type="text"
          label="Username"
          required
          icon={<User size={28} />}
          placeholder="e.g. johndoe123"
        />
        <TextField
          id="email"
          type="email"
          label="Email"
          required
          icon={<Mail size={28} />}
          placeholder="e.g. johndoe@email.com"
        />
        <TextField
          id="password"
          type="password"
          label="Password"
          required
          icon={<Lock size={28} />}
          placeholder="enter a strong password"
        />
        <TextField
          id="confirm-password"
          type="password"
          label="Confirm Password"
          required
          icon={<Lock size={28} />}
          placeholder="retype your strong password"
        />
        <button
          type="submit"
          className="w-full btn-primary"
        >
          Create Account
        </button>
      </form>
      <div>
        Already have an account?{" "}
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
