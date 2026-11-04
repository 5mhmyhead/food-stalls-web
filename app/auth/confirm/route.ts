import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const code = new URL(request.url).searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const cookieStore = await cookies();
      cookieStore.set("pw_recovery", "1", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 600, // 10 minutes
        path: "/",
      });
      return NextResponse.redirect(new URL("/reset-password", request.url));
    }
  }
  return NextResponse.redirect(new URL("/", request.url));
}
