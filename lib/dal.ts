import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export const verifyUser = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, account_type")
    .eq("id", data.claims.sub)
    .single();
  if (!profile) redirect("/");

  return {
    userId: data.claims.sub,
    username: profile.username as string,
    role: profile.account_type as "WORKER" | "ADMIN",
  };
});

export const verifyAdmin = cache(async () => {
  const user = await verifyUser();
  if (user.role !== "ADMIN") redirect("/home"); //will change this later
  return user;
});
