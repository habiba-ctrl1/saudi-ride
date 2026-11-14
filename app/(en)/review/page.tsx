import { getSupabaseServerClient } from "@/lib/supabase/server";
import { verifyReviewToken, googleReviewUrl } from "@/lib/reviews";
import ReviewForm from "./ReviewForm";

export const dynamic = "force-dynamic";

export default async function ReviewPage({ searchParams }: { searchParams: Promise<{ ref?: string; k?: string }> }) {
  const { ref = "", k = "" } = await searchParams;
  let name: string | null = null;
  let route = "";
  let already = false;

  if (verifyReviewToken(ref, k)) {
    const sb = getSupabaseServerClient();
    const { data: q } = sb
      ? await sb.from("quotations").select("id,customer_name,pickup_location,drop_location,status,is_test").eq("quote_reference", ref).maybeSingle()
      : { data: null };
    if (sb && q && !q.is_test && q.status === "completed") {
      name = q.customer_name;
      route = `${q.pickup_location} → ${q.drop_location}`;
      const { data: r } = await sb.from("reviews").select("id").eq("quotation_id", q.id).maybeSingle();
      already = !!r;
    }
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-16 sm:py-24">
      {name ? (
        <ReviewForm refCode={ref} token={k} name={name} route={route} already={already} googleUrl={googleReviewUrl} />
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">This review link is not valid</h1>
          <p className="mt-3 text-gray-600">
            Review links are sent with your trip receipt. If you travelled with us and did not receive one, message us on WhatsApp and we will send it again.
          </p>
        </div>
      )}
    </main>
  );
}
