import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";

export interface AuthenticatedUser {
  userId: string;
  username: string;
  email: string;
  role: "WORKER" | "ADMIN";
}

export const verifyUser = cache(async (): Promise<AuthenticatedUser> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const [profile] = await db
    .select({
      id: profiles.id,
      username: profiles.username,
      email: profiles.email,
      accountType: profiles.accountType,
    })
    .from(profiles)
    .where(eq(profiles.id, user.id))
    .limit(1);

  if (!profile) redirect("/");

  return {
    userId: profile.id,
    username: profile.username,
    email: profile.email,
    role: profile.accountType,
  };
});

export const verifyAdmin = cache(async (): Promise<AuthenticatedUser> => {
  const user = await verifyUser();
  if (user.role !== "ADMIN") redirect("/home");
  return user;
});

// Aliases for convenience across different route conventions
export const requireUser = verifyUser;
export const requireAdmin = verifyAdmin;