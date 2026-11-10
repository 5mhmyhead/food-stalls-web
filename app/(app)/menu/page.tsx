import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import MenuClient from "@/components/menu/menu-client";
import { getMenuData } from "@/components/menu/actions";

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ item?: string }>;
}) {
  const { item } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const [profile, { categories, products }] = await Promise.all([
    db
      .select()
      .from(profiles)
      .where(eq(profiles.id, user.id))
      .then((res) => res[0]),
    getMenuData(),
  ]);

  const isAdmin = profile?.accountType === "ADMIN";
  const selectedItemId = item ? Number(item) : null;

  return (
    <MenuClient
      categories={categories}
      products={products}
      isAdmin={isAdmin}
      selectedItemId={selectedItemId}
    />
  );
}