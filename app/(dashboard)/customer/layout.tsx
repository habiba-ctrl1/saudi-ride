import Link from "next/link";
import { 
  CalendarDays, 
  UserCircle, 
  Award, 
  HelpCircle,
  LogOut,
  MapPin
} from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const NAV_ITEMS = [
  { name: "My Bookings", href: "/customer/bookings", icon: CalendarDays },
  { name: "My Profile", href: "/customer/profile", icon: UserCircle },
  { name: "Loyalty Program", href: "/customer/loyalty", icon: Award },
  { name: "Help & Support", href: "/customer/help", icon: HelpCircle },
];

export default async function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-[#F5F0E8] overflow-hidden selection:bg-[#C9A84C] selection:text-[#0A0A0A]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#C9A84C]/10 bg-[#111] flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-[#C9A84C]/10 shrink-0">
          <Link href="/" className="font-heading text-xl font-bold tracking-widest uppercase">
            Taxi Saudi Arabia<span className="text-[#C9A84C]"> VIP</span>
          </Link>
        </div>

        <div className="p-6 pb-2">
          <p className="text-xs font-bold text-[#7C8088] uppercase tracking-wider mb-2">Main Menu</p>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-2">
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
          <div className="pt-4 mt-4 border-t border-[#C9A84C]/10">
            <Link
              href="/book"
              className="flex items-center justify-center gap-2 w-full bg-[#C9A84C] text-[#0A0A0A] px-3 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-[#B8963B] transition-colors"
            >
              <MapPin className="h-4 w-4" /> New Booking
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-[#C9A84C]/10 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 mb-4 bg-[#1A1A1A] rounded-xl border border-[#C9A84C]/20">
            <div className="h-10 w-10 rounded-full bg-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C] font-bold shrink-0 text-lg">
              {session.user?.name?.charAt(0) || "C"}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-bold truncate text-[#F5F0E8]">{session.user?.name || "Valued Client"}</p>
              <p className="text-xs text-[#C9A84C] font-bold flex items-center gap-1">
                <Award className="h-3 w-3" /> {(session.user as { loyaltyPoints?: number })?.loyaltyPoints || 0} pts
              </p>
            </div>
          </div>
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#7C8088] hover:text-red-400 hover:bg-red-400/10 transition-all"
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
          <Link href="/" className="font-heading text-lg font-bold tracking-widest uppercase">
            RT<span className="text-[#C9A84C]"> VIP</span>
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
