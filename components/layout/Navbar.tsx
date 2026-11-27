"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import {
  Menu, X, ChevronDown, Car, Landmark, Plane, Route as RouteIcon,
  MapPin, Handshake, MessageCircle, ArrowRight, Building2, Heart, Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { contactConfig } from "@/lib/config/contact";
import { trackEvent } from "@/lib/analytics";

// ── Brand colors ──
const GREEN = "#16A34A";

const WHATSAPP_TEXT = "Salam! I'd like to book a private transfer with Taxi Saudi Arabia.\n\n• From: \n• To: \n• Date & time: \n• Passengers & luggage: \n• Vehicle (Sedan / SUV / Van): ";
const whatsappLink = `https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(WHATSAPP_TEXT)}`;

// ── Transportation Services mega-menu ──
// Same destinations as before; presented as a two-column panel instead of
// nested fly-outs (which were hover-fragile and hard to reach by keyboard).
const SERVICE_LINKS: { label: string; desc: string; icon: typeof Car; href: string }[] = [
  { label: "Umrah Taxi Services", desc: "Airport → Makkah → Madinah, private", icon: Landmark, href: "/services/umrah-transport" },
  { label: "Airport Transfers", desc: "Meet & greet at every major airport", icon: Plane, href: "/services/airport-transfers" },
  { label: "Intercity Taxi", desc: "Door-to-door between Saudi cities", icon: RouteIcon, href: "/services/intercity" },
  { label: "Corporate Accounts", desc: "Delegations, invoicing on request", icon: Building2, href: "/services/corporate" },
  { label: "Wedding Car Rental", desc: "Chauffeured cars for the big day", icon: Heart, href: "/services/wedding-car-rental" },
];

const CITY_TAXI_LINKS = [
  { label: "Makkah Taxi Service", href: "/locations/makkah" },
  { label: "Madinah Taxi Service", href: "/locations/madinah" },
  { label: "Jeddah Taxi Service", href: "/locations/jeddah" },
  { label: "Riyadh Taxi Service", href: "/locations/riyadh" },
];

const ZIYARAT_LINKS = [
  { label: "Makkah Ziyarat", href: "/services/makkah-ziyarat" },
  { label: "Madinah Ziyarat", href: "/services/madinah-ziyarat" },
];

const ROUTES_MENU = [
  { from: "Jeddah Airport", to: "Makkah", href: "/routes/jeddah-airport-to-makkah" },
  { from: "Makkah", to: "Madinah", href: "/routes/makkah-to-madinah" },
  { from: "Jeddah", to: "Madinah", href: "/routes/jeddah-to-madinah" },
  { from: "Madinah", to: "Jeddah Airport", href: "/routes/madinah-to-jeddah-airport" },
  { from: "Riyadh", to: "Dammam", href: "/routes/riyadh-to-dammam" },
];

const LOCATIONS_MENU = [
  { label: "Makkah", href: "/locations/makkah" },
  { label: "Madinah", href: "/locations/madinah" },
  { label: "Jeddah", href: "/locations/jeddah" },
  { label: "Riyadh", href: "/locations/riyadh" },
  { label: "Dammam", href: "/locations/dammam" },
  { label: "Al Khobar", href: "/locations/alkhobar" },
  { label: "Taif", href: "/locations/taif" },
  { label: "Yanbu", href: "/locations/yanbu" },
  { label: "AlUla", href: "/locations/alula" },
  { label: "NEOM", href: "/locations/neom" },
  { label: "Abha", href: "/locations/abha" },
  { label: "Tabuk", href: "/locations/tabuk" },
];

const PARTNERS_MENU = [
  { label: "Partner With Us", href: "/partners", icon: Handshake, desc: "Grow your business with us" },
];

const panelCls =
  "invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-200 ease-out absolute top-full pt-2";
const panelBoxCls =
  "rounded-2xl bg-white p-2 shadow-[0_24px_60px_-12px_rgba(15,23,42,0.28)] ring-1 ring-black/5";
const menuItemCls =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#0F172A] transition-colors hover:bg-[#F0FDF4] hover:text-[#15803D]";

function isActive(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => (p === "/" ? pathname === "/" : pathname === p || pathname.startsWith(p + "/")));
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const isHomepage = pathname === "/" || pathname === "/ar";
  // Drawer slides in from the inline-end edge (right in LTR, left in RTL).
  const drawerFrom = typeof document !== "undefined" && document.documentElement.dir === "rtl" ? "-100%" : "100%";
  const bookHref = isHomepage ? "#booking-console" : "/book";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer on route change.
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Drawer: lock page scroll, close on Escape, move focus inside.
  useEffect(() => {
    if (!isMobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsMobileOpen(false);
    window.addEventListener("keydown", onKey);
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isMobileOpen]);

  const navLinkCls = (active: boolean) =>
    cn(
      "relative flex items-center gap-1 whitespace-nowrap rounded-full px-2 2xl:px-3 py-2 text-[0.84rem] font-semibold transition-colors duration-200",
      "after:absolute after:inset-x-2 after:-bottom-0.5 after:h-[2px] after:rounded-full after:bg-[#FACC15] after:transition-transform after:duration-300 after:origin-center",
      active
        ? "text-[#FEF08A] after:scale-x-100"
        : "text-white/90 hover:text-white hover:bg-white/10 after:scale-x-0",
    );

  const trackWa = (sourceLocation: string) =>
    trackEvent("whatsapp_click", {
      sourceLocation,
      phoneUsed: contactConfig.whatsappNumber,
      locale: "en",
      path: pathname,
    });

  return (
    <>
      <header
        style={{ backgroundColor: GREEN }}
        className={cn(
          "tsa-header on-dark fixed top-0 inset-x-0 z-50 transition-[box-shadow,padding] duration-300",
          isScrolled
            ? "py-2 shadow-[0_8px_30px_-8px_rgba(5,46,22,0.45)]"
            : "py-3 shadow-[0_1px_0_rgba(255,255,255,0.1)]",
        )}
      >
        <div className="mx-auto flex w-full max-w-[1640px] items-center gap-4 px-4 sm:px-6 2xl:gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group" aria-label="Taxi Saudi Arabia — home">
            <Image
              src="/logo-tsa-white.png"
              alt="Taxi Saudi Arabia — Premium Chauffeur & Transportation"
              width={948}
              height={650}
              className={cn(
                "w-auto object-contain transition-all duration-300 group-hover:scale-105",
                isScrolled ? "h-10 sm:h-12" : "h-11 sm:h-14",
              )}
              priority
            />
            <div className="hidden sm:flex xl:hidden min-[1440px]:flex flex-col leading-none gap-1.5">
              <span
                style={{ fontFamily: "var(--font-display)" }}
                className="text-[1.35rem] font-bold text-[#FDE68A] tracking-wide whitespace-nowrap"
              >
                Taxi Saudi Arabia
              </span>
              <span className="text-[0.55rem] uppercase tracking-[0.22em] font-bold text-white/80 leading-[1.4]">
                Premium Chauffeur<br />&amp; Transportation
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Main" className="hidden xl:flex items-center gap-0.5 2xl:gap-1.5 ms-2 2xl:ms-6">
            <Link href="/" className={navLinkCls(pathname === "/")}>Home</Link>

            {/* Transportation Services — mega panel */}
            <div className="relative group">
              <button type="button" aria-haspopup="true" className={navLinkCls(isActive(pathname, ["/services"]))}>
                Transportation Services
                <ChevronDown className="h-3.5 w-3.5 opacity-80 transition-transform duration-300 group-hover:rotate-180" />
              </button>
              <div className={cn(panelCls, "start-0")}>
                <div className={cn(panelBoxCls, "grid w-[40rem] grid-cols-[1.25fr_1fr] gap-1 p-3")}>
                  <ul className="space-y-0.5">
                    {SERVICE_LINKS.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} className="group/item flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-[#F0FDF4]">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F0FDF4] text-[#16A34A] ring-1 ring-[#16A34A]/15 transition-colors group-hover/item:bg-[#16A34A] group-hover/item:text-[#FFFFFF]">
                            <item.icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-[#0F172A] group-hover/item:text-[#15803D]">{item.label}</span>
                            <span className="block text-xs leading-snug text-[#64748B]">{item.desc}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-xl bg-[#F6F8F6] p-3">
                    <p className="px-2 pb-1.5 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#64748B]">Taxi Services</p>
                    <ul>
                      {CITY_TAXI_LINKS.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-[#1E293B] transition-colors hover:bg-white hover:text-[#15803D]">
                            <Car className="h-3.5 w-3.5 text-[#16A34A]" /> {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 px-2 pb-1.5 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#64748B]">Ziyarat Taxi</p>
                    <ul>
                      {ZIYARAT_LINKS.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-[#1E293B] transition-colors hover:bg-white hover:text-[#15803D]">
                            <Landmark className="h-3.5 w-3.5 text-[#16A34A]" /> {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link href="/services" className="col-span-2 mt-1 flex items-center justify-between rounded-xl border-t border-black/5 px-3 py-2.5 text-sm font-semibold text-[#15803D] hover:bg-[#F0FDF4]">
                    View All Services <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Taxi Routes */}
            <div className="relative group">
              <button type="button" aria-haspopup="true" className={navLinkCls(isActive(pathname, ["/routes", "/distance"]))}>
                Taxi Routes
                <ChevronDown className="h-3.5 w-3.5 opacity-80 transition-transform duration-300 group-hover:rotate-180" />
              </button>
              <div className={cn(panelCls, "start-0")}>
                <ul className={cn(panelBoxCls, "w-80")}>
                  {ROUTES_MENU.map((r) => (
                    <li key={r.href}>
                      <Link href={r.href} className={cn(menuItemCls, "justify-between")}>
                        <span className="flex min-w-0 items-center gap-2.5">
                          <span className="flex flex-col items-center gap-0.5" aria-hidden>
                            <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
                            <span className="h-2 w-px bg-[#16A34A]/40" />
                            <span className="h-1.5 w-1.5 rounded-full border border-[#16A34A]" />
                          </span>
                          <span className="truncate">
                            {r.from} <span className="text-[#94A3B8]">→</span> {r.to}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                  <li className="mt-1 border-t border-black/5 pt-1">
                    <Link href="/routes" className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-[#15803D] hover:bg-[#F0FDF4]">
                      View All Routes <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Locations */}
            <div className="relative group">
              <button type="button" aria-haspopup="true" className={navLinkCls(isActive(pathname, ["/locations", "/airports"]))}>
                Locations
                <ChevronDown className="h-3.5 w-3.5 opacity-80 transition-transform duration-300 group-hover:rotate-180" />
              </button>
              <div className={cn(panelCls, "start-0")}>
                <div className={cn(panelBoxCls, "w-[28rem] p-3")}>
                  <ul className="grid grid-cols-3 gap-0.5">
                    {LOCATIONS_MENU.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className={cn(menuItemCls, "gap-2 px-2.5")}>
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#16A34A]" />
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 border-t border-black/5 pt-1">
                    <Link href="/locations" className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-[#15803D] hover:bg-[#F0FDF4]">
                      View All Locations <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Partners */}
            <div className="relative group">
              <button type="button" aria-haspopup="true" className={navLinkCls(isActive(pathname, ["/partners"]))}>
                Partners
                <ChevronDown className="h-3.5 w-3.5 opacity-80 transition-transform duration-300 group-hover:rotate-180" />
              </button>
              <div className={cn(panelCls, "start-0")}>
                <ul className={cn(panelBoxCls, "w-64")}>
                  {PARTNERS_MENU.map((p) => (
                    <li key={p.href}>
                      <Link href={p.href} className="flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-[#F0FDF4] transition-colors group/p">
                        <p.icon className="h-4 w-4 text-[#16A34A] mt-0.5" />
                        <span>
                          <span className="block text-sm font-semibold text-[#0F172A] group-hover/p:text-[#15803D]">{p.label}</span>
                          <span className="block text-xs text-[#64748B]">{p.desc}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Link href="/blog" className={navLinkCls(isActive(pathname, ["/blog", "/guides"]))}>Blog</Link>
            <Link href="/contact" className={navLinkCls(isActive(pathname, ["/contact"]))}>Contact Us</Link>
          </nav>

          {/* Right: actions */}
          <div className="hidden xl:flex items-center gap-2 flex-shrink-0 ms-auto">
            <LanguageSwitcher />
            <Link href={bookHref} className="btn btn-accent btn-sm">
              Book Now <ArrowRight className="rtl:rotate-180" />
            </Link>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWa("navbar_desktop")}
              className="btn btn-white btn-sm"
            >
              <MessageCircle /> WhatsApp
            </a>
          </div>

          {/* Mobile: quick WhatsApp + hamburger */}
          <div className="flex xl:hidden items-center gap-2 ms-auto">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWa("navbar_mobile_bar")}
              aria-label="WhatsApp us"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#16A34A] shadow-sm transition-transform active:scale-95"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 transition-colors hover:bg-white/25"
              aria-label="Open menu"
              aria-expanded={isMobileOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-[60] xl:hidden" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Site menu">
            <motion.button
              type="button"
              aria-label="Close menu"
              tabIndex={-1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileOpen(false)}
              className="absolute inset-0 bg-[#052E16]/55 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ x: drawerFrom }}
              animate={{ x: 0 }}
              exit={{ x: drawerFrom }}
              transition={{ type: "tween", duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="tsa-header absolute inset-y-0 end-0 flex w-full max-w-[26rem] flex-col bg-white shadow-2xl"
            >
              <div className="on-dark flex items-center justify-between px-5 py-4" style={{ backgroundColor: GREEN }}>
                <Link href="/" className="flex items-center gap-2.5" onClick={() => setIsMobileOpen(false)}>
                  <Image src="/logo-tsa-white.png" alt="" width={948} height={650} className="h-9 w-auto" />
                  <span className="font-heading text-base font-extrabold text-white">Taxi Saudi Arabia</span>
                </Link>
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={() => setIsMobileOpen(false)}
                  className="h-11 w-11 rounded-full bg-white/15 text-white ring-1 ring-white/25 flex items-center justify-center"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav aria-label="Mobile" className="flex-1 overflow-y-auto overscroll-contain px-3 py-3">
                <Link href="/" className="flex min-h-12 items-center rounded-xl px-3 text-[0.95rem] font-bold text-[#0F172A] hover:bg-[#F0FDF4]">
                  Home
                </Link>

                <MobileGroup title="Transportation Services" icon={Car} defaultOpen={isActive(pathname, ["/services"])}>
                  {SERVICE_LINKS.map((s) => (
                    <MobileLink key={s.href} href={s.href}>{s.label}</MobileLink>
                  ))}
                  {CITY_TAXI_LINKS.map((s) => (
                    <MobileLink key={s.href} href={s.href}>{s.label}</MobileLink>
                  ))}
                  {ZIYARAT_LINKS.map((s) => (
                    <MobileLink key={s.href} href={s.href}>{s.label}</MobileLink>
                  ))}
                  <MobileLink href="/services" strong>View All Services</MobileLink>
                </MobileGroup>

                <MobileGroup title="Taxi Routes" icon={RouteIcon} defaultOpen={isActive(pathname, ["/routes"])}>
                  {ROUTES_MENU.map((r) => (
                    <MobileLink key={r.href} href={r.href}>{r.from} → {r.to}</MobileLink>
                  ))}
                  <MobileLink href="/routes" strong>View All Routes</MobileLink>
                </MobileGroup>

                <MobileGroup title="Locations" icon={MapPin} defaultOpen={isActive(pathname, ["/locations"])}>
                  <div className="grid grid-cols-2">
                    {LOCATIONS_MENU.map((l) => (
                      <MobileLink key={l.href} href={l.href}>{l.label}</MobileLink>
                    ))}
                  </div>
                  <MobileLink href="/locations" strong>View All Locations</MobileLink>
                </MobileGroup>

                <MobileGroup title="Partners" icon={Handshake}>
                  {PARTNERS_MENU.map((p) => (
                    <MobileLink key={p.href} href={p.href}>{p.label}</MobileLink>
                  ))}
                </MobileGroup>

                <Link href="/blog" className="flex min-h-12 items-center rounded-xl px-3 text-[0.95rem] font-bold text-[#0F172A] hover:bg-[#F0FDF4]">
                  Blog
                </Link>
                <Link href="/contact" className="flex min-h-12 items-center rounded-xl px-3 text-[0.95rem] font-bold text-[#0F172A] hover:bg-[#F0FDF4]">
                  Contact Us
                </Link>
                <div className="px-3 pt-3"><LanguageSwitcher /></div>
              </nav>

              <div className="grid grid-cols-2 gap-2 border-t border-black/5 bg-[#FAFAF7] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <Link href={bookHref} onClick={() => setIsMobileOpen(false)} className="btn btn-accent">
                  Book Now <ArrowRight className="rtl:rotate-180" />
                </Link>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWa("navbar_mobile")}
                  className="btn btn-whatsapp"
                >
                  <MessageCircle /> WhatsApp
                </a>
                <a href={contactConfig.primaryPhoneLink} className="col-span-2 flex items-center justify-center gap-2 pt-1 text-sm font-semibold text-[#475569] hover:text-[#15803D]">
                  <Phone className="h-4 w-4" /> Prefer to call? {contactConfig.primaryPhoneDisplay}
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function MobileGroup({
  title,
  icon: Icon,
  defaultOpen = false,
  children,
}: {
  title: string;
  icon: typeof Car;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={defaultOpen} className="group/acc rounded-xl open:bg-[#F6F8F6]">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-3 text-[0.95rem] font-bold text-[#0F172A] [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2.5">
          <Icon className="h-4 w-4 text-[#16A34A]" />
          {title}
        </span>
        <ChevronDown className="h-4 w-4 text-[#64748B] transition-transform duration-300 group-open/acc:rotate-180" />
      </summary>
      <div className="px-2 pb-2">{children}</div>
    </details>
  );
}

function MobileLink({ href, strong, children }: { href: string; strong?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex min-h-11 items-center rounded-lg px-3 text-sm transition-colors hover:bg-white",
        strong ? "font-semibold text-[#15803D]" : "font-medium text-[#334155]",
      )}
    >
      {children}
    </Link>
  );
}
