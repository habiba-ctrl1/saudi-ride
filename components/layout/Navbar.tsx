"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/context/LanguageContext";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const translations = {
  en: {
    services: "Services",
    fleet: "Fleet",
    routes: "Routes",
    locations: "Locations",
    blog: "Blog",
    contact: "Contact",
    bookNow: "Book Now",
    callUs: "Call 24/7",
    whatsappBook: "Book on WhatsApp",
  },
  ar: {
    services: "الخدمات",
    fleet: "الأسطول",
    routes: "المسارات",
    locations: "المواقع",
    blog: "المدونة",
    contact: "اتصل بنا",
    bookNow: "احجز الآن",
    callUs: "اتصل بنا 24/7",
    whatsappBook: "احجز عبر واتساب",
  },
  ur: {
    services: "خدمات",
    fleet: "گاڑیاں",
    routes: "روٹس",
    locations: "مقامات",
    blog: "بلاگ",
    contact: "رابطہ کریں",
    bookNow: "ابھی بک کریں",
    callUs: "کال کریں 24/7",
    whatsappBook: "واٹس ایپ بکنگ",
  },
};

export function Navbar() {
  const { language } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/services", label: t.services },
    { href: "/fleet", label: t.fleet },
    { href: "/routes", label: t.routes },
    { href: "/locations", label: t.locations },
    { href: "/blog", label: t.blog },
    { href: "/contact", label: t.contact },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-40 transition-all duration-500",
          isScrolled
            ? "bg-[#0A0A0A]/95 border-b border-[#C9A84C]/15 py-4 shadow-2xl backdrop-blur-md"
            : "bg-transparent py-6"
        )}
      >
        <div className="section-container flex items-center justify-between">
          {/* Logo with gold crescent */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-[#C9A84C] bg-[#0A0A0A] shadow-[0_0_10px_rgba(201,168,76,0.3)] transition-transform duration-500 group-hover:rotate-12">
              <span className="text-sm font-semibold text-[#C9A84C] font-heading">🌙</span>
            </span>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-bold tracking-[0.18em] text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors">
                RIYADH LUXE
              </span>
              <span className="text-[0.55rem] uppercase tracking-[0.4em] text-[#C9A84C] -mt-1 font-sans">
                Chauffeur Service
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-semibold uppercase tracking-widest text-[#F5F0E8] transition-colors duration-300 hover:text-[#C9A84C]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="hidden lg:flex items-center gap-5">
            <LanguageSwitcher />
            
            <Link
              href="#booking"
              className="relative inline-flex items-center justify-center overflow-hidden rounded-full border border-[#C9A84C] bg-transparent px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-[#C9A84C] shadow-[0_0_15px_rgba(201,168,76,0.1)] transition-all duration-300 hover:bg-[#C9A84C] hover:text-[#0A0A0A] hover:shadow-[0_0_25px_rgba(201,168,76,0.4)]"
            >
              {t.bookNow}
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex lg:hidden items-center justify-center p-2 rounded-full border border-[#C9A84C]/35 bg-black/20 text-[#F5F0E8] hover:text-[#C9A84C] hover:border-[#C9A84C] transition-all"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile full-screen menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col bg-[#0A0A0A]/98 backdrop-blur-lg"
          >
            {/* Header in overlay */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-[#C9A84C]/10">
              <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="text-sm font-semibold text-[#C9A84C] font-heading">🌙</span>
                <span className="font-heading text-base font-bold tracking-widest text-[#F5F0E8]">
                  RIYADH LUXE
                </span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full border border-[#C9A84C]/30 text-[#F5F0E8] hover:text-[#C9A84C] hover:border-[#C9A84C]"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Menu Links */}
            <div className="flex-1 flex flex-col justify-center px-8 space-y-6">
              {navLinks.map((link, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={link.href}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-2xl font-bold uppercase tracking-widest text-[#F5F0E8] hover:text-[#C9A84C] transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
                className="pt-6 flex items-center justify-between border-t border-[#C9A84C]/10"
              >
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Select Language</span>
                <LanguageSwitcher />
              </motion.div>
            </div>

            {/* Overlay Contact Footer */}
            <div className="p-8 border-t border-[#C9A84C]/10 space-y-4 bg-black/40">
              {/* Phone connection */}
              <a
                href="tel:+966500123456"
                className="flex items-center justify-center gap-3 w-full rounded-full border border-[#C9A84C]/40 py-3.5 text-sm font-semibold tracking-wider text-[#F5F0E8] hover:border-[#C9A84C] transition-all"
              >
                <Phone className="h-4 w-4 text-[#C9A84C]" />
                <span>+966 50 012 3456</span>
              </a>

              {/* WhatsApp VIP booking button */}
              <a
                href={`https://wa.me/966500123456?text=${encodeURIComponent("Hello, I would like to book a VIP transfer")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full rounded-full bg-[#25D366] py-3.5 text-sm font-bold tracking-wider text-white shadow-lg shadow-[#25d366]/20"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.528 2.008 14.056.979 11.44.979c-5.437 0-9.863 4.374-9.869 9.803-.002 1.718.455 3.393 1.324 4.882l-.99 3.619 3.71-.973c1.45.79 3.09 1.205 4.673 1.205l.004-.002zm11.238-7.798c-.3-.15-1.772-.875-2.046-.975-.276-.1-.476-.15-.677.15-.202.3-.777.975-.952 1.175-.177.2-.352.225-.652.075-.3-.15-1.265-.467-2.41-1.485-.89-.794-1.49-1.775-1.665-2.075-.175-.3-.019-.463.13-.612.135-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.63-.927-2.235-.245-.589-.49-.509-.677-.509-.175-.001-.375-.001-.575-.001-.2 0-.525.075-.8.375-.276.3-1.052 1.025-1.052 2.5s1.077 2.9 1.227 3.1c.15.2 2.12 3.235 5.136 4.536.717.31 1.277.495 1.711.633.721.23 1.377.198 1.896.121.578-.088 1.773-.725 2.022-1.425.249-.7 2.49-3.5 2.49-3.5-.175-.075-.35-.15-.65-.3zm0 0" />
                </svg>
                <span>{t.whatsappBook}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
