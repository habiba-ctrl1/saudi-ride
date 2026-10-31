"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Car, BarChart3, LogOut, Tag, FileText, Receipt, UserCheck, CalendarClock, CalendarDays,
  Users, DollarSign, Newspaper, BookOpen, Inbox, AlertTriangle, Star,
} from "lucide-react";

type Item = { name: string; href: string; icon: React.ComponentType<{ className?: string }> };

// Grouped by what the operator is doing. Nothing was removed — every old page is still reachable.
const GROUPS: { title: string; items: Item[] }[] = [
  {
    title: "Daily work",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "Lead Inbox", href: "/admin/leads", icon: Inbox },
      { name: "Quotes & Bookings", href: "/admin/quotations", icon: FileText },
      { name: "Calendar", href: "/admin/calendar", icon: CalendarDays },
      { name: "Needs Review", href: "/admin/review", icon: AlertTriangle },
    ],
  },
  {
    title: "People",
    items: [
      { name: "Clients", href: "/admin/clients", icon: Users },
      { name: "Drivers", href: "/admin/drivers", icon: UserCheck },
    ],
  },
  {
    title: "Money & records",
    items: [
      { name: "Receipts", href: "/admin/receipts", icon: Receipt },
      { name: "Ride Register", href: "/admin/ride-register", icon: FileText },
      { name: "Reports", href: "/admin/reports", icon: BarChart3 },
      { name: "Pricing Book", href: "/admin/pricing-book", icon: BookOpen },
      { name: "Reviews", href: "/admin/reviews", icon: Star },
    ],
  },
];

const MORE: Item[] = [
  { name: "Enquiry history", href: "/admin/enquiries", icon: Inbox },
  { name: "Schedule", href: "/admin/schedule", icon: CalendarDays },
  { name: "Corporate Invoice", href: "/admin/corporate-invoice", icon: Receipt },
  { name: "Bookings (legacy)", href: "/admin/bookings", icon: CalendarClock },
  { name: "Customers (legacy)", href: "/admin/customers", icon: Users },
  { name: "Fleet", href: "/admin/vehicles", icon: Car },
  { name: "Promo Codes", href: "/admin/promo-codes", icon: Tag },
  { name: "Revenue (legacy)", href: "/admin/revenue", icon: DollarSign },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Blog CMS", href: "/admin/content/blog", icon: Newspaper },
];

function useActive() {
  const path = usePathname() ?? "";
  return (href: string) => (href === "/admin" ? path === "/admin" : path === href || path.startsWith(`${href}/`));
}

function NavLink({ item, active, badge, small }: { item: Item; active: boolean; badge?: number; small?: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`group flex items-center gap-3 rounded-lg px-3 ${small ? "py-2 text-[0.8rem]" : "py-2.5 text-sm"} font-medium transition-colors ${
        active ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <item.icon className={`${small ? "h-3.5 w-3.5" : "h-4 w-4"} shrink-0 ${active ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-600"}`} />
      <span className="flex-1">{item.name}</span>
      {badge ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">{badge}</span> : null}
    </Link>
  );
}

export function SidebarNav({ reviewCount }: { reviewCount: number }) {
  const isActive = useActive();
  return (
    <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5" aria-label="Admin">
      {GROUPS.map((g) => (
        <div key={g.title}>
          <div className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{g.title}</div>
          <div className="space-y-0.5">
            {g.items.map((i) => <NavLink key={i.href} item={i} active={isActive(i.href)} badge={i.href === "/admin/review" ? reviewCount : undefined} />)}
          </div>
        </div>
      ))}
      <details className="group" open={MORE.some((i) => isActive(i.href))}>
        <summary className="cursor-pointer select-none list-none px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-600">More tools ▾</summary>
        <div className="mt-1 space-y-0.5">
          {MORE.map((i) => <NavLink key={i.href} item={i} active={isActive(i.href)} small />)}
        </div>
      </details>
    </nav>
  );
}

export function MobileNav({ reviewCount }: { reviewCount: number }) {
  const isActive = useActive();
  return (
    <details className="group">
      <summary className="flex h-10 cursor-pointer select-none list-none items-center rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700">Menu</summary>
      <nav className="absolute right-3 top-14 max-h-[75vh] w-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl" aria-label="Admin">
        {[...GROUPS.flatMap((g) => g.items), ...MORE].map((i) => <NavLink key={i.href} item={i} active={isActive(i.href)} badge={i.href === "/admin/review" ? reviewCount : undefined} />)}
        <Link href="/api/auth/signout" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50">
          <LogOut className="h-4 w-4 shrink-0" /> Sign Out
        </Link>
      </nav>
    </details>
  );
}
