"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { SignInSchema, SignUpSchema } from "@/lib/definitions";

export type AuthState =
  | { message?: string; username?: string; email?: string }
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
