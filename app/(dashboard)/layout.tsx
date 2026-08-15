import Link from "next/link";
import {
  LayoutDashboard,
  Car,
  BarChart3,
  LogOut,
  Tag,
  FileText,
  UserCheck,
  CalendarClock,
} from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const NAV_ITEMS = [
  { name: "Overview",   href: "/admin",           icon: LayoutDashboard },
  { name: "Quotations", href: "/admin/quotations", icon: FileText },
  { name: "Bookings",   href: "/admin/bookings",  icon: CalendarClock },
  { name: "Drivers",    href: "/admin/driver-applications", icon: UserCheck },
  { name: "Fleet",      href: "/admin/vehicles",  icon: Car },
  { name: "Promo Codes",href: "/admin/promo-codes",icon: Tag },
  { name: "Analytics",  href: "/admin/analytics", icon: BarChart3 },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const adminName  = session.user?.name  || "Admin";
  const adminEmail = session.user?.email || "";
  const initials   = adminName.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className="hidden md:flex w-60 flex-col bg-[#0D1B2A] text-white shrink-0 border-r border-gray-200">

        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200 shrink-0">
          <Link href="/admin" className="text-sm font-extrabold tracking-widest uppercase">
            Saudi<span className="text-[#C9A84C]">Ride</span>
            <span className="ml-2 text-[10px] bg-[#C9A84C]/20 text-[#C9A84C] px-1.5 py-0.5 rounded font-bold tracking-wider">
              ADMIN
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:text-[#0D1B2A] hover:bg-gray-100 transition-all group"
            >
              <item.icon className="h-4 w-4 shrink-0 group-hover:text-[#C9A84C] transition-colors" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* User + Sign out */}
        <div className="p-4 border-t border-gray-200 shrink-0 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-[#C9A84C] flex items-center justify-center text-[#0D1B2A] font-bold text-sm shrink-0">
              {initials}
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-sm font-semibold text-white truncate">{adminName}</p>
              <p className="text-xs text-gray-500 truncate">{adminEmail}</p>
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
        <header className="md:hidden h-14 bg-[#0D1B2A] flex items-center justify-between px-4 shrink-0">
          <span className="text-sm font-extrabold tracking-widest text-white uppercase">
            Saudi<span className="text-[#C9A84C]">Ride</span>
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
