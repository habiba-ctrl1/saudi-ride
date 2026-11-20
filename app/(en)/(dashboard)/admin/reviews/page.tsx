import { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Reviews | Admin Dashboard" };
export const dynamic = "force-dynamic";

async function setStatus(formData: FormData) {
  "use server";
  const auth = await requireAdmin();
  if (!auth.ok) return;
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["approved", "hidden", "pending"].includes(status)) return;
  await getSupabaseServerClient()?.from("reviews").update({ status }).eq("id", id);
  revalidatePath("/admin/reviews");
}

type Review = { id: string; quote_reference: string; customer_name: string; rating: number; comment: string | null; status: string; created_at: string };

export default async function AdminReviewsPage() {
  const { data } = (await getSupabaseServerClient()?.from("reviews").select("*").order("created_at", { ascending: false })) ?? { data: [] };
  const rows = (data ?? []) as Review[];
  const btn = "rounded-lg border px-3 py-1.5 text-xs font-bold";

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-[#F5F0E8]">Reviews</h1>
        <p className="text-xs text-[#7C8088]">Verified ride reviews from the receipt link. New ones start as pending; nothing is public until you approve it.</p>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-[#333] bg-[#111]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1A1A1A] text-[0.6rem] uppercase tracking-widest text-[#7C8088]">
            <tr><th className="p-3">Date</th><th className="p-3">Client / Ref</th><th className="p-3">Rating</th><th className="p-3">Comment</th><th className="p-3">Status</th><th className="p-3" /></tr>
          </thead>
          <tbody className="divide-y divide-[#222] text-[#A1A1A6]">
            {rows.length === 0 && <tr><td colSpan={6} className="p-8 text-center">No reviews yet.</td></tr>}
            {rows.map((r) => (
              <tr key={r.id} className="align-top">
                <td className="whitespace-nowrap p-3">{r.created_at.slice(0, 10)}</td>
                <td className="p-3"><div className="font-bold text-[#F5F0E8]">{r.customer_name}</div><div>{r.quote_reference}</div></td>
                <td className="whitespace-nowrap p-3 text-[#FACC15]">{"★".repeat(r.rating)}<span className="text-[#444]">{"★".repeat(5 - r.rating)}</span></td>
                <td className="max-w-md p-3">{r.comment ?? "—"}</td>
                <td className="p-3">{r.status}</td>
                <td className="whitespace-nowrap p-3 text-right">
                  <form action={setStatus} className="inline-flex gap-2">
                    <input type="hidden" name="id" value={r.id} />
                    {r.status !== "approved" && <button name="status" value="approved" className={`${btn} border-green-500/40 text-green-500`}>Approve</button>}
                    {r.status !== "hidden" && <button name="status" value="hidden" className={`${btn} border-red-500/40 text-red-400`}>Hide</button>}
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
