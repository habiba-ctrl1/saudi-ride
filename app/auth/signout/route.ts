import { NextResponse } from "next/server";
import { getSupabaseAuthServerClient } from "@/lib/supabase/auth-server";

export async function POST(request: Request) {
  const supabase = await getSupabaseAuthServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }

  const origin = new URL(request.url).origin;
  return NextResponse.redirect(`${origin}/admin/login`);
}
