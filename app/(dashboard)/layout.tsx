import Link from "next/link";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  Car, 
  FileText, 
  BarChart3,
  LogOut
} from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const NAV_ITEMS = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Bookings", href: "/admin/bookings", icon: CalendarDays },
  { name: "Drivers", href: "/admin/drivers", icon: Users },
  { name: "Fleet", href: "/admin/vehicles", icon: Car },
  { name: "Blog CMS", href: "/admin/content/blog", icon: FileText },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
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

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-[#F5F0E8] overflow-hidden selection:bg-[#C9A84C] selection:text-[#0A0A0A]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#C9A84C]/10 bg-[#111] flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-[#C9A84C]/10 shrink-0">
          <Link href="/admin" className="font-heading text-xl font-bold tracking-widest uppercase">
            Riyadh Luxe<span className="text-[#C9A84C]"> Admin</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#A1A1A6] hover:text-[#F5F0E8] hover:bg-[#C9A84C]/10 transition-all group"
            >
              <item.icon className="h-5 w-5 group-hover:text-[#C9A84C] transition-colors" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#C9A84C]/10 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 mb-4">
            <div className="h-8 w-8 rounded-full bg-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C] font-bold shrink-0">
              {session.user?.name?.charAt(0) || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{session.user?.name}</p>
              <p className="text-xs text-[#A1A1A6] truncate">{session.user?.email}</p>
            </div>
          </div>
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 border-b border-[#C9A84C]/10 bg-[#111] flex items-center justify-between px-4 md:hidden shrink-0">
          <Link href="/admin" className="font-heading text-lg font-bold tracking-widest uppercase">
            RLT<span className="text-[#C9A84C]"> Admin</span>
          </Link>
          {/* Mobile menu toggle would go here */}
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
