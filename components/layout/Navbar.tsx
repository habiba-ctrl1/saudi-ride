"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import {
  Menu, X, ChevronDown, ChevronRight, Car, Landmark, Plane, Route as RouteIcon,
  MapPin, Handshake, UserPlus, MessageCircle, ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { contactConfig } from "@/lib/config/contact";

// ── Brand colors ──
const GREEN = "#16A34A";
const YELLOW = "#FACC15";

const whatsappLink = `https://wa.me/${contactConfig.whatsappNumber}`;

// ── Transportation Services mega-menu ──
const TRANSPORT_MENU: {
  label: string;
  icon: typeof Car;
  href?: string;
  children?: { label: string; href: string }[];
}[] = [
  {
    label: "Taxi Services",
    icon: Car,
    children: [
      { label: "Makkah Taxi Service", href: "/locations/makkah" },
      { label: "Madinah Taxi Service", href: "/locations/madinah" },
      { label: "Jeddah Taxi Service", href: "/locations/jeddah" },
      { label: "Riyadh Taxi Service", href: "/locations/riyadh" },
    ],
  },
  {
    label: "Ziyarat Taxi",
    icon: Landmark,
    children: [
      { label: "Makkah Ziyarat", href: "/services/makkah-ziyarat" },
      { label: "Madinah Ziyarat", href: "/services/madinah-ziyarat" },
    ],
  },
  { label: "Umrah Taxi Services", icon: Landmark, href: "/services/umrah-transport" },
  { label: "Airport Transfers", icon: Plane, href: "/services/airport-transfers" },
  { label: "Intercity Taxi", icon: MapPin, href: "/services/intercity" },
];

const ROUTES_MENU = [
  { label: "Jeddah Airport → Makkah", href: "/routes/jeddah-airport-to-makkah" },
  { label: "Makkah → Madinah", href: "/routes/makkah-to-madinah" },
  { label: "Jeddah → Madinah", href: "/routes/jeddah-to-madinah" },
  { label: "Madinah → Jeddah Airport", href: "/routes/madinah-to-jeddah" },
  { label: "Riyadh → Dammam", href: "/routes/riyadh-to-dammam" },
];

const PARTNERS_MENU = [
  { label: "Partner With Us", href: "/partners", icon: Handshake, desc: "Grow your business with us" },
  { label: "Driver Registration", href: "/partners/driver-registration", icon: UserPlus, desc: "Join our driver network" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const isHomepage = pathname === "/" || pathname === "/ar";
  const bookHref = isHomepage ? "#booking-console" : "/book";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinkCls =
    "relative flex items-center gap-1 text-[0.82rem] font-semibold text-white/95 hover:text-[#FACC15] transition-colors duration-200";

  return (
    <>
      <header
        style={{
          backgroundColor: GREEN,
          boxShadow: isScrolled ? "0 4px 20px rgba(0,0,0,0.18)" : "0 1px 0 rgba(255,255,255,0.08)",
        }}
        className={cn("fixed top-0 inset-x-0 z-50 transition-all duration-300", isScrolled ? "py-2.5" : "py-3.5")}
      >
        <div className="section-container flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <span className="flex items-center justify-center rounded-2xl bg-white p-1.5 shadow-md ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/logo-transparent.png"
                alt="Taxi Saudi Arabia Logo"
                width={220}
                height={72}
                className="h-14 w-auto object-contain"
                priority
              />
            </span>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-heading text-[1.15rem] font-extrabold text-white tracking-tight whitespace-nowrap">
                Taxi Saudi Arabia
              </span>
              <span className="text-[0.6rem] uppercase tracking-[0.3em] font-semibold text-[#FDE68A] whitespace-nowrap">
                Taxi &amp; Car Service
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-5 2xl:gap-6">
            <Link href="/" className={navLinkCls}>Home</Link>

            {/* Transportation Services (mega dropdown) */}
            <div className="relative group">
              <button className={cn(navLinkCls, "py-4")}>
                Transportation Services
                <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
              </button>
              <div className="invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 absolute left-0 top-full pt-1">
                <ul className="w-64 rounded-2xl bg-white shadow-2xl border border-black/5 p-2">
                  {TRANSPORT_MENU.map((item) => (
                    <li key={item.label} className="relative group/sub">
                      {item.children ? (
                        <>
                          <button className="w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#0F172A] hover:bg-[#F0FDF4] hover:text-[#16A34A] transition-colors">
                            <span className="flex items-center gap-3">
                              <item.icon className="h-4 w-4 text-[#16A34A]" />
                              {item.label}
                            </span>
                            <ChevronRight className="h-4 w-4 text-[#16A34A]" />
                          </button>
                          {/* nested flyout */}
                          <div className="invisible opacity-0 group-hover/sub:visible group-hover/sub:opacity-100 transition-all duration-150 absolute left-full top-0 pl-2">
                            <ul className="w-60 rounded-2xl bg-white shadow-2xl border border-black/5 p-2">
                              {item.children.map((c) => (
                                <li key={c.href}>
                                  <Link href={c.href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#0F172A] hover:bg-[#F0FDF4] hover:text-[#16A34A] transition-colors">
                                    <Landmark className="h-4 w-4 text-[#16A34A]" />
                                    {c.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      ) : (
                        <Link href={item.href!} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#0F172A] hover:bg-[#F0FDF4] hover:text-[#16A34A] transition-colors">
                          <item.icon className="h-4 w-4 text-[#16A34A]" />
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                  <li className="mt-1 border-t border-black/5 pt-1">
                    <Link href="/services" className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-[#16A34A] hover:bg-[#F0FDF4]">
                      View All Services <ArrowRight className="h-4 w-4" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Taxi Routes dropdown */}
            <div className="relative group">
              <button className={cn(navLinkCls, "py-4")}>
                Taxi Routes
                <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
              </button>
              <div className="invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 absolute left-0 top-full pt-1">
                <ul className="w-64 rounded-2xl bg-white shadow-2xl border border-black/5 p-2">
                  {ROUTES_MENU.map((r) => (
                    <li key={r.href}>
                      <Link href={r.href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#0F172A] hover:bg-[#F0FDF4] hover:text-[#16A34A] transition-colors">
                        <RouteIcon className="h-4 w-4 text-[#16A34A]" />
                        {r.label}
                      </Link>
                    </li>
                  ))}
                  <li className="mt-1 border-t border-black/5 pt-1">
                    <Link href="/routes" className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-[#16A34A] hover:bg-[#F0FDF4]">
                      View All Routes <ArrowRight className="h-4 w-4" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Partners dropdown */}
            <div className="relative group">
              <button className={cn(navLinkCls, "py-4")}>
                Partners
                <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
              </button>
              <div className="invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 absolute left-0 top-full pt-1">
                <ul className="w-64 rounded-2xl bg-white shadow-2xl border border-black/5 p-2">
                  {PARTNERS_MENU.map((p) => (
                    <li key={p.href}>
                      <Link href={p.href} className="flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-[#F0FDF4] transition-colors group/p">
                        <p.icon className="h-4 w-4 text-[#16A34A] mt-0.5" />
                        <span>
                          <span className="block text-sm font-semibold text-[#0F172A] group-hover/p:text-[#16A34A]">{p.label}</span>
                          <span className="block text-[0.7rem] text-gray-500">{p.desc}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Link href="/blog" className={navLinkCls}>Blog</Link>
            <Link href="/about" className={navLinkCls}>About Us</Link>
            <Link href="/contact" className={navLinkCls}>Contact Us</Link>
          </nav>

          {/* Right: actions */}
          <div className="hidden xl:flex items-center gap-2.5 flex-shrink-0">
            <LanguageSwitcher />
            <Link
              href={bookHref}
              style={{ backgroundColor: YELLOW, color: "#0F172A" }}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[0.74rem] font-bold whitespace-nowrap transition-transform hover:scale-105"
            >
              Book Now <ArrowRight className="h-4 w-4 flex-shrink-0" />
            </Link>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-[0.74rem] font-bold text-[#16A34A] whitespace-nowrap transition-transform hover:scale-105"
            >
              <MessageCircle className="h-4 w-4 flex-shrink-0" /> WhatsApp
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="flex xl:hidden items-center justify-center h-10 w-10 rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] xl:hidden overflow-y-auto"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: GREEN }}>
              <span className="font-heading text-lg font-extrabold text-white">Taxi Saudi Arabia</span>
              <button onClick={() => setIsMobileOpen(false)} className="h-10 w-10 rounded-full bg-white/15 text-white flex items-center justify-center" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 py-6 space-y-6" onClick={() => setIsMobileOpen(false)}>
              <Link href="/" className="block text-base font-bold text-[#0F172A]">Home</Link>

              <div>
                <p className="text-[0.7rem] uppercase tracking-wider font-bold text-[#16A34A] mb-2">Transportation Services</p>
                <div className="space-y-1.5 pl-1">
                  {TRANSPORT_MENU.flatMap((item) =>
                    item.children
                      ? item.children.map((c) => (
                          <Link key={c.href} href={c.href} className="block text-sm text-[#334155] py-1">{c.label}</Link>
                        ))
                      : [<Link key={item.href} href={item.href!} className="block text-sm text-[#334155] py-1">{item.label}</Link>]
                  )}
                  <Link href="/services" className="block text-sm font-semibold text-[#16A34A] py-1">View All Services →</Link>
                </div>
              </div>

              <div>
                <p className="text-[0.7rem] uppercase tracking-wider font-bold text-[#16A34A] mb-2">Taxi Routes</p>
                <div className="space-y-1.5 pl-1">
                  {ROUTES_MENU.map((r) => (
                    <Link key={r.href} href={r.href} className="block text-sm text-[#334155] py-1">{r.label}</Link>
                  ))}
                  <Link href="/routes" className="block text-sm font-semibold text-[#16A34A] py-1">View All Routes →</Link>
                </div>
              </div>

              <div>
                <p className="text-[0.7rem] uppercase tracking-wider font-bold text-[#16A34A] mb-2">Partners</p>
                <div className="space-y-1.5 pl-1">
                  {PARTNERS_MENU.map((p) => (
                    <Link key={p.href} href={p.href} className="block text-sm text-[#334155] py-1">{p.label}</Link>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Link href="/blog" className="block text-base font-bold text-[#0F172A]">Blog</Link>
                <Link href="/about" className="block text-base font-bold text-[#0F172A]">About Us</Link>
                <Link href="/contact" className="block text-base font-bold text-[#0F172A]">Contact Us</Link>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <Link href={bookHref} style={{ backgroundColor: YELLOW }} className="flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-[#0F172A]">
                  Book Your Ride Now <ArrowRight className="h-4 w-4" />
                </Link>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: GREEN }} className="flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white">
                  <MessageCircle className="h-4 w-4" /> WhatsApp Us
                </a>
                <div className="pt-2"><LanguageSwitcher /></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
