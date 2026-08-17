import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Users, Search } from "lucide-react";
import { SearchBox } from "./SearchBox";

export const metadata: Metadata = { title: "Customers | Admin Dashboard" };
export const dynamic = "force-dynamic";

const LIMIT = 25;

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

  const [total, customers] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: {
        id: true, name: true, email: true, phone: true, nationality: true,
        loyaltyPoints: true, createdAt: true, _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * LIMIT,
      take: LIMIT,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-[#F5F0E8]">Customers</h1>
        <p className="text-[#A1A1A6] mt-1 text-sm">{total} registered customers.</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666]" />
        <SearchBox initial={search ?? ""} />
      </div>

      <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl overflow-hidden">
        {customers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="h-12 w-12 text-[#7C8088] mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold text-[#F5F0E8] mb-2">No Customers Found</h3>
            <p className="text-sm text-[#A1A1A6]">
              Most bookings come in as guests without an account — this list only shows registered customers.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1A1A1A] border-b border-[#C9A84C]/10 text-[0.65rem] uppercase tracking-widest text-[#7C8088]">
                  <th className="p-4 font-bold">Name</th>
                  <th className="p-4 font-bold">Contact</th>
                  <th className="p-4 font-bold">Nationality</th>
                  <th className="p-4 font-bold">Bookings</th>
                  <th className="p-4 font-bold">Loyalty Pts</th>
                  <th className="p-4 font-bold">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C9A84C]/5">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#1A1A1A]/50 transition-colors">
                    <td className="p-4 text-sm font-medium text-[#F5F0E8]">{c.name || "—"}</td>
                    <td className="p-4">
                      {c.phone && (
                        <a href={`https://wa.me/${c.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="block text-xs text-[#C9A84C] hover:underline">
                          {c.phone}
                        </a>
                      )}
                      {c.email && <p className="text-xs text-[#A1A1A6]">{c.email}</p>}
                    </td>
                    <td className="p-4 text-sm text-[#A1A1A6]">{c.nationality || "—"}</td>
                    <td className="p-4 text-sm text-[#F5F0E8]">{c._count.bookings}</td>
                    <td className="p-4 text-sm text-[#A1A1A6]">{c.loyaltyPoints}</td>
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
