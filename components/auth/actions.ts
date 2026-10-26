"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import {
  SignInSchema,
  SignUpSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
} from "@/lib/definitions";

export type AuthState =
  | { message?: string; username?: string; email?: string; success?: boolean }
  | undefined;

export async function signIn(
  _prev: AuthState,
  form: FormData,
): Promise<AuthState> {
  const username = String(form.get("username") ?? "");
  const parsed = SignInSchema.safeParse({
    username,
    password: form.get("password"),
  });
  if (!parsed.success) {
    return { message: "Enter your username and password.", username };
  }

  const [row] = await db
    .select({ email: profiles.email })
    .from(profiles)
    .where(eq(profiles.username, parsed.data.username))
    .limit(1);
  if (!row) return { message: "Wrong username or password.", username };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: row.email,
    password: parsed.data.password,
  });
  if (error) return { message: "Wrong username or password.", username };

  redirect("/home"); //redirects to the home page after successful login
}

export async function signUp(
  _prev: AuthState,
  form: FormData,
): Promise<AuthState> {
  const username = String(form.get("username") ?? "");
  const email = String(form.get("email") ?? "");
  const parsed = SignUpSchema.safeParse({
    username,
    email,
    password: form.get("password"),
    confirmPassword: form.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { message: parsed.error.issues[0].message, username, email };
  }

  const [taken] = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.username, parsed.data.username))
    .limit(1);
  if (taken) return { message: "That username is taken.", username, email };

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { username: parsed.data.username } },
  });
  if (error) {
    return {
      message: error.message.toLowerCase().includes("registered")
        ? "That email is already used."
        : "Could not create the account. Try again.",
      username,
      email,
    };
  }

  redirect("/home"); //redirects to home page after successful sign up
}
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
export async function requestPasswordReset(
  _prev: AuthState,
  form: FormData,
): Promise<AuthState> {
  const email = String(form.get("email") ?? "");
  const parsed = ForgotPasswordSchema.safeParse({ email });
  if (!parsed.success)
    return { message: parsed.error.issues[0].message, email };

  const origin = (await headers()).get("origin") ?? "http://localhost:3000";

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/auth/confirm`,
  });

  return {
    message: "If that email has an account, we sent a reset link.",
    email: parsed.data.email,
    success: true,
  };
}
export async function updatePassword(
  _prev: AuthState,
  form: FormData,
): Promise<AuthState> {
  const parsed = ResetPasswordSchema.safeParse({
    password: form.get("password"),
    confirmPassword: form.get("confirmPassword"),
  });
  if (!parsed.success) return { message: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) {
    return {
      message:
        "Could not update your password. The link may have expired, so request a new one.",
    };
  }

  redirect("/home");
}
