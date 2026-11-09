"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, count, eq, gt } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";
import { db } from "@/db";
import { accessCodeAttempts, profiles } from "@/db/schema";
import { verifyUser, verifyAdmin } from "@/lib/dal";
import {
  SignInSchema,
  SignUpSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  ChangePasswordSchema,
  UpdateProfileSchema,
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

  redirect("/home");
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

  redirect("/home");
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

  if (!parsed.success) {
    return { message: parsed.error.issues[0].message, email };
  }

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
  const cookieStore = await cookies();
  if (cookieStore.get("pw_recovery")?.value !== "1") {
    return {
      message: "This reset link is no longer valid. Request a new one.",
    };
  }

  const parsed = ResetPasswordSchema.safeParse({
    password: form.get("password"),
    confirmPassword: form.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { message: parsed.error.issues[0].message };
  }

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

  cookieStore.delete("pw_recovery");
  redirect("/home");
}
export async function changePassword(
  _prev: AuthState,
  form: FormData,
): Promise<AuthState> {
  const { email } = await verifyUser();

  const parsed = ChangePasswordSchema.safeParse({
    currentPassword: form.get("currentPassword"),
    newPassword: form.get("newPassword"),
  });
  if (!parsed.success) return { message: parsed.error.issues[0].message };

  const supabase = await createClient();

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email,
    password: parsed.data.currentPassword,
  });
  if (verifyError) return { message: "Current password is incorrect." };

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.newPassword,
  });
  if (error) return { message: "Could not change your password. Try again." };

  return { message: "Password changed.", success: true };
}

export async function signOutOtherDevices(
  _prev: AuthState,
  _form: FormData,
): Promise<AuthState> {
  await verifyUser();

  const supabase = await createClient();
  const { error } = await supabase.auth.signOut({ scope: "others" });
  if (error) return { message: "Could not sign out other devices. Try again." };

  return { message: "Signed out of all other devices.", success: true };
}

export async function updateProfile(
  _prev: AuthState,
  form: FormData,
): Promise<AuthState> {
  const user = await verifyUser();

  const username = String(form.get("username") ?? "");
  const email = String(form.get("email") ?? "");
  const parsed = UpdateProfileSchema.safeParse({ username, email });
  if (!parsed.success) {
    return { message: parsed.error.issues[0].message, username, email };
  }

  const notes: string[] = [];

  if (parsed.data.username !== user.username) {
    const [taken] = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.username, parsed.data.username))
      .limit(1);
    if (taken) return { message: "That username is taken.", username, email };

    try {
      await db
        .update(profiles)
        .set({ username: parsed.data.username })
        .where(eq(profiles.id, user.userId));
    } catch {
      return {
        message: "Could not update your username. Try again.",
        username,
        email,
      };
    }
    notes.push("Username updated.");
  }

  if (parsed.data.email !== user.email.toLowerCase()) {
    const origin = (await headers()).get("origin") ?? "http://localhost:3000";
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser(
      { email: parsed.data.email },
      { emailRedirectTo: `${origin}/settings` },
    );
    if (error) {
      return {
        message: error.message.toLowerCase().includes("already")
          ? "That email is already used."
          : "Could not update your email. Try again.",
        username,
        email,
      };
    }
    notes.push(
      "Check both your old and new inbox to confirm the email change.",
    );
  }

  if (notes.length === 0) {
    return { message: "No changes to save.", username, email };
  }

  revalidatePath("/", "layout");
  return {
    message: notes.join(" "),
    username: parsed.data.username,
    email: user.email,
    success: true,
  };
}

export async function deleteAccount(
  _prev: AuthState,
  form: FormData,
): Promise<AuthState> {
  const { email } = await verifyUser();

  const password = String(form.get("password") ?? "");
  if (!password) return { message: "Enter your password to confirm." };

  const supabase = await createClient();

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (verifyError) return { message: "Incorrect password." };

  const { error } = await supabase.rpc("delete_own_account");
  if (error) {
    return {
      message: error.message.includes("last_admin")
        ? "You are the only manager. Make another account a manager before deleting this one."
        : "Could not delete your account. Try again.",
    };
  }

  await supabase.auth.signOut({ scope: "local" });
  redirect("/");
}

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

function codesMatch(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export async function verifyAccessCode(
  _prev: AuthState,
  form: FormData,
): Promise<AuthState> {
  const user = await verifyUser();
  if (user.role === "ADMIN") {
    return { message: "Your account is already an admin." };
  }

  const code = String(form.get("accessCode") ?? "").trim();
  if (!code) return { message: "Enter the access code." };

  const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);
  const [{ failures }] = await db
    .select({ failures: count() })
    .from(accessCodeAttempts)
    .where(
      and(
        eq(accessCodeAttempts.userId, user.userId),
        gt(accessCodeAttempts.attemptedAt, since),
      ),
    );
  if (failures >= MAX_ATTEMPTS) {
    return { message: "Too many attempts. Try again in 15 minutes." };
  }

  const expected = process.env.STAFF_ACCESS_CODE;
  if (!expected) {
    console.error("STAFF_ACCESS_CODE is not set");
    return { message: "Access codes aren't set up yet. Ask the shop owner." };
  }

  if (!codesMatch(code, expected)) {
    await db.insert(accessCodeAttempts).values({ userId: user.userId });
    return { message: "Invalid access code." };
  }

  await db
    .update(profiles)
    .set({ accountType: "ADMIN" })
    .where(eq(profiles.id, user.userId));

  revalidatePath("/", "layout");
  return { message: "Your account is now an admin.", success: true };
}

export async function revertToWorker(
  _prev: AuthState,
  form: FormData,
): Promise<AuthState> {
  const user = await verifyAdmin();

  const password = String(form.get("password") ?? "");
  if (!password) return { message: "Enter your password to confirm." };

  const supabase = await createClient();

  // re-check the password so a signed-in device can't be downgraded by someone else
  const { error: pwError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password,
  });
  if (pwError) return { message: "Incorrect password." };

  const { error } = await supabase.rpc("revert_own_admin");
  if (error) {
    return {
      message: error.message.includes("last_admin")
        ? "You are the only admin. Make another account an admin before reverting yours."
        : "Could not revert your account. Try again.",
    };
  }

  revalidatePath("/", "layout");
  return { message: "Your account is now a worker.", success: true };
}
