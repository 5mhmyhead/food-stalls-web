import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import HomeClient from "@/components/home/home-client";
import { getHomeData } from "@/components/home/actions";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { profile, categories, products, pendingOrders } = await getHomeData(
    user.id
  );

  return (
    <HomeClient
      username={profile?.username ?? "User"}
      categories={categories}
      products={products}
      initialPendingOrders={pendingOrders}
    />
  );
}