import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { verifyReviewToken } from "@/lib/reviews";
import { rateLimit, BOOKING_LIMIT } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit({ key: `review:${ip}`, ...BOOKING_LIMIT });
  if (!rl.success) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });

  const body = await request.json().catch(() => null);
  const ref = String(body?.ref ?? "").trim();
  const token = String(body?.k ?? "").trim();
  const rating = Number(body?.rating);
  const comment = String(body?.comment ?? "").trim().slice(0, 2000);

  if (!verifyReviewToken(ref, token)) return NextResponse.json({ error: "This review link is not valid." }, { status: 403 });
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return NextResponse.json({ error: "Please choose a rating from 1 to 5." }, { status: 400 });

  const sb = getSupabaseServerClient();
  if (!sb) return NextResponse.json({ error: "Service unavailable." }, { status: 503 });

  const { data: q } = await sb.from("quotations").select("id,customer_name,status,is_test").eq("quote_reference", ref).maybeSingle();
  if (!q || q.is_test || q.status !== "completed") return NextResponse.json({ error: "This review link is not valid." }, { status: 403 });

  const { error } = await sb.from("reviews").insert({
    quotation_id: q.id, quote_reference: ref, customer_name: q.customer_name, rating, comment: comment || null,
  });
  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "You have already reviewed this trip. Thank you!" }, { status: 409 });
    console.error("review insert failed", error);
    return NextResponse.json({ error: "Could not save your review. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
