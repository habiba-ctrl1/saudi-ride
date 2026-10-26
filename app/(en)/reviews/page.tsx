import type { Metadata } from "next";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { generateMetadata as seo } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Review = { id: string; customer_name: string; rating: number; comment: string | null; created_at: string };

async function loadApproved(): Promise<Review[]> {
  const sb = getSupabaseServerClient();
  if (!sb) return [];
  const { data } = await sb.from("reviews").select("id,customer_name,rating,comment,created_at").eq("status", "approved").order("created_at", { ascending: false }).limit(60);
  return (data ?? []) as Review[];
}

// Indexable only once there is at least one approved review (an empty page has no value).
export async function generateMetadata(): Promise<Metadata> {
  const rows = await loadApproved();
  return seo({
    title: "Client Reviews",
    description: "Feedback from travellers who completed a trip with Taxi Saudi Arabia. Every review comes from a verified completed ride.",
    path: "/reviews",
    noIndex: rows.length === 0,
  });
}

// Display name: first name + initial of the rest, never the full name.
function displayName(full: string) {
  const parts = full.replace(/^(mr|mrs|dr)\.?\s+/i, "").trim().split(/\s+/);
  return parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : parts[0];
}

export default async function ReviewsPage() {
  const rows = await loadApproved();
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <h1 className="text-3xl font-bold text-gray-900">Client reviews</h1>
      <p className="mt-3 text-gray-600">
        Every review below was left by a traveller through the link sent with their trip receipt, so each one is tied to a completed ride. We publish them after a manual check and do not edit them.
      </p>
      {rows.length === 0 ? (
        <p className="mt-10 text-gray-500">Reviews will appear here as clients complete their trips.</p>
      ) : (
        <ul className="mt-10 space-y-5">
          {rows.map((r) => (
            <li key={r.id} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-gray-900">{displayName(r.customer_name)}</span>
                <span className="text-yellow-400" aria-label={`${r.rating} out of 5`}>
                  {"★".repeat(r.rating)}<span className="text-gray-300">{"★".repeat(5 - r.rating)}</span>
                </span>
              </div>
              {r.comment && <p className="mt-3 text-gray-700">{r.comment}</p>}
              <p className="mt-3 text-xs text-gray-500">Verified trip · {new Date(r.created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
