import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Users, Search, FileText } from "lucide-react";
import { SearchBox } from "./SearchBox";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Customers | Admin Dashboard" };
export const dynamic = "force-dynamic";

const LIMIT = 25;

type CustomerRow = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  nationality: string | null;
  source: "account" | "quotation";
  bookingsCount: number;
  quotationRef: string | null;
  quotationStatus: string | null;
  tripDate: string | null;
  createdAt: string;
};

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const page = sp.page ? Math.max(1, Number(sp.page) || 1) : 1;
  const search = sp.search || undefined;

  const where: Prisma.UserWhereInput = {
    role: "CUSTOMER",
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as Prisma.QueryMode } },
            { email: { contains: search, mode: "insensitive" as Prisma.QueryMode } },
            { phone: { contains: search, mode: "insensitive" as Prisma.QueryMode } },
          ],
        }
      : {}),
  };

  const [accountUsers, quotationRows] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true, name: true, email: true, phone: true, nationality: true,
        createdAt: true, _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    (async () => {
      const supabase = getSupabaseServerClient();
      if (!supabase) return [];
      let q = supabase
        .from("quotations")
        .select("id, quote_reference, customer_name, customer_phone, customer_email, status, trip_date, created_at")
        .order("created_at", { ascending: false });
      if (search) {
        const s = search.replace(/[%,()]/g, "");
        q = q.or(`customer_name.ilike.%${s}%,customer_phone.ilike.%${s}%,customer_email.ilike.%${s}%`);
      }
      const { data } = await q;
      return data ?? [];
    })(),
  ]);

  // Every registered-account customer with a real phone number is also
  // matched against quotations by phone, so we don't show the same person
  // twice as both "Registered" and "Quotation" rows.
  const accountPhones = new Set(accountUsers.map((u) => u.phone).filter(Boolean));

  const merged: CustomerRow[] = [
    ...accountUsers.map((u) => ({
      id: u.id,
      name: u.name || "—",
      phone: u.phone,
      email: u.email,
      nationality: u.nationality,
      source: "account" as const,
      bookingsCount: u._count.bookings,
      quotationRef: null,
      quotationStatus: null,
      tripDate: null,
      createdAt: u.createdAt.toISOString(),
    })),
    ...quotationRows
      .filter((q) => !accountPhones.has(q.customer_phone))
      .map((q) => ({
        id: q.id,
        name: q.customer_name || "—",
        phone: q.customer_phone,
        email: q.customer_email,
        nationality: null,
        source: "quotation" as const,
        bookingsCount: 0,
        quotationRef: q.quote_reference,
        quotationStatus: q.status,
        tripDate: q.trip_date,
        createdAt: q.created_at,
      })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const total = merged.length;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const pageRows = merged.slice((page - 1) * LIMIT, page * LIMIT);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-[#F5F0E8]">Customers</h1>
        <p className="text-[#A1A1A6] mt-1 text-sm">
          {total} total — {accountUsers.length} registered accounts, {merged.length - accountUsers.length} from quotations/leads only.
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666]" />
        <SearchBox initial={search ?? ""} />
      </div>

      <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl overflow-hidden">
        {pageRows.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="h-12 w-12 text-[#7C8088] mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold text-[#F5F0E8] mb-2">No Customers Found</h3>
            <p className="text-sm text-[#A1A1A6]">No registered accounts or quotations match this search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1A1A1A] border-b border-[#C9A84C]/10 text-[0.65rem] uppercase tracking-widest text-[#7C8088]">
                  <th className="p-4 font-bold">Name</th>
                  <th className="p-4 font-bold">Contact</th>
                  <th className="p-4 font-bold">Source</th>
                  <th className="p-4 font-bold">Trip / Bookings</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C9A84C]/5">
                {pageRows.map((c) => (
                  <tr key={`${c.source}-${c.id}`} className="hover:bg-[#1A1A1A]/50 transition-colors">
                    <td className="p-4 text-sm font-medium text-[#F5F0E8]">{c.name}</td>
                    <td className="p-4">
                      {c.phone && (
                        <a href={`https://wa.me/${c.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="block text-xs text-[#C9A84C] hover:underline">
                          {c.phone}
                        </a>
                      )}
                      {c.email && <p className="text-xs text-[#A1A1A6]">{c.email}</p>}
                    </td>
                    <td className="p-4">
                      {c.source === "account" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[0.55rem] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          <Users className="h-3 w-3" /> Registered
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[0.55rem] font-bold uppercase tracking-wider bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20">
                          <FileText className="h-3 w-3" /> {c.quotationRef}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-[#A1A1A6]">
                      {c.source === "account" ? `${c.bookingsCount} booking${c.bookingsCount === 1 ? "" : "s"}` : c.tripDate ?? "—"}
                    </td>
                    <td className="p-4 text-sm">
                      {c.source === "quotation" && c.quotationStatus ? (
                        <span className="capitalize text-[#A1A1A6]">{c.quotationStatus}</span>
                      ) : (
                        <span className="text-[#7C8088]">—</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-[#A1A1A6]">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <p className="text-xs text-[#A1A1A6] text-center">Page {page} of {totalPages}</p>
      )}
    </div>
  );
}
