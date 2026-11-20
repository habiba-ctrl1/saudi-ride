import Link from "next/link";
import { LogOut } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { openReviewCount } from "@/lib/ops/review";
import { SidebarNav, MobileNav } from "@/components/admin/AdminNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const reviewCount = await openReviewCount();
  const adminName  = session.user?.name  || "Admin";
  const adminEmail = session.user?.email || "";
  const initials   = adminName.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className="hidden md:flex w-64 flex-col bg-white text-slate-900 shrink-0 border-r border-slate-200">

        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
          <Link href="/admin" className="text-sm font-extrabold tracking-widest uppercase text-slate-900">
            Taxi<span className="text-emerald-600">Saudi</span>
            <span className="ml-2 text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold tracking-wider">ADMIN</span>
          </Link>
        </div>

        <SidebarNav reviewCount={reviewCount} />

        {/* User + Sign out */}
        <div className="p-4 border-t border-slate-100 shrink-0 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-9 w-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {initials}
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{adminName}</p>
              <p className="text-xs text-slate-500 truncate">{adminEmail}</p>
            </div>
          </div>
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Mobile top bar */}
        <header className="md:hidden bg-white border-b border-slate-200 shrink-0 relative z-30">
          <div className="h-14 flex items-center justify-between px-4">
            <span className="text-sm font-extrabold tracking-widest text-slate-900 uppercase">
              Taxi<span className="text-emerald-600">Saudi</span>
              <span className="ml-2 text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold tracking-wider">ADMIN</span>
            </span>
            <MobileNav reviewCount={reviewCount} />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
