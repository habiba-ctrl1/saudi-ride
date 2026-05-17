"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/context/LanguageContext";
import { ShieldCheck, Receipt, BadgeCheck, PhoneCall } from "lucide-react";

const translations = {
  en: {
    tagline: "Premium chauffeur and VIP transportation services in the Kingdom of Saudi Arabia. Experience elite travel with unmatched elegance.",
    destinations: "Destinations",
    services: "Services",
    popularRoutes: "Popular Routes",
    company: "Company",
    copyright: "© 2026 Riyadh Luxe Taxi. All rights reserved. Created with absolute elegance.",
    motLicensed: "Ministry of Transport Licensed",
    zatcaCompliant: "ZATCA VAT Compliant",
    tgaCertified: "TGA Certified",
    support247: "24/7 VIP Support",
  },
  ar: {
    tagline: "خدمات النقل الفاخرة وسائقين VIP في المملكة العربية السعودية. جرب السفر الفاخر بأناقة لا مثيل لها.",
    destinations: "الوجهات والشحنات",
    services: "خدماتنا",
    popularRoutes: "أشهر المسارات",
    company: "الشركة",
    copyright: "© 2026 الرياض لوكس تاكسي. جميع الحقوق محفوظة. صُنع بأناقة مطلقة.",
    motLicensed: "مرخص من وزارة النقل",
    zatcaCompliant: "خاضع لهيئة الزكاة والضريبة",
    tgaCertified: "معتمد من الهيئة العامة للنقل",
    support247: "دعم VIP على مدار الساعة",
  },
  ur: {
    tagline: "مملکت سعودی عرب میں پریمیم ڈرائیور اور وی آئی پی ٹرانسپورٹیشن سروسز۔ بے مثال خوبصورتی کے ساتھ ایلیٹ سفر کا تجربہ کریں۔",
    destinations: "منزلیں",
    services: "خدمات",
    popularRoutes: "مشہور روٹس",
    company: "کمپنی",
    copyright: "© 2026 ریاض لوکس ٹیکسی۔ جملہ حقوق محفوظ ہیں۔ بہترین نفاست کے ساتھ تیار کردہ۔",
    motLicensed: "وزارت ٹرانسپورٹ سے لائسنس یافتہ",
    zatcaCompliant: "زکوٰۃ و ٹیکس کمپلائنٹ",
    tgaCertified: "ٹی جی اے تصدیق شدہ",
    support247: "24/7 وی آئی پی سپورٹ",
  },
};

export function Footer() {
  const { language } = useLanguage();
  const t = translations[language];

  // Raw contents in EN, AR, UR
  const content = {
    en: {
      destinations: [
        { label: "Makkah", href: "/locations/makkah" },
        { label: "Madinah", href: "/locations/madinah" },
        { label: "Jeddah", href: "/locations/jeddah" },
        { label: "Riyadh", href: "/locations/riyadh" },
        { label: "Dammam", href: "/locations/dammam" },
        { label: "AlUla", href: "/locations/alula" },
        { label: "NEOM", href: "/locations/neom" },
        { label: "Taif", href: "/locations/taif" },
      ],
      services: [
        { label: "Airport Transfers", href: "/services#airport" },
        { label: "Umrah Transport", href: "/services#umrah" },
        { label: "Intercity Rides", href: "/services#intercity" },
        { label: "Corporate Chauffeur", href: "/services#corporate" },
        { label: "Border Crossings", href: "/services#border" },
      ],
      routes: [
        { label: "Jeddah Airport → Makkah", href: "/routes/jeddah-to-makkah" },
        { label: "Makkah → Madinah Hotels", href: "/routes/makkah-to-madinah" },
        { label: "Riyadh VIP → Dubai", href: "/routes/riyadh-to-dubai" },
        { label: "Dammam → Doha Cross-Border", href: "/routes/dammam-to-doha" },
        { label: "Riyadh Executive → Makkah", href: "/routes/riyadh-to-makkah" },
        { label: "Madinah → Jeddah Airport", href: "/routes/madinah-to-jeddah" },
        { label: "Riyadh → Dammam Business", href: "/routes/riyadh-to-dammam" },
      ],
      company: [
        { label: "About Us", href: "/about" },
        { label: "Luxury Gallery", href: "/gallery" },
        { label: "Driver Registration", href: "/driver-registration" },
        { label: "Track Booking", href: "/track-booking" },
        { label: "Luxury Blog", href: "/blog" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
    ar: {
      destinations: [
        { label: "مكة المكرمة", href: "/locations/makkah" },
        { label: "المدينة المنورة", href: "/locations/madinah" },
        { label: "جدة", href: "/locations/jeddah" },
        { label: "الرياض", href: "/locations/riyadh" },
        { label: "الدمام", href: "/locations/dammam" },
        { label: "العلا", href: "/locations/alula" },
        { label: "نيوم", href: "/locations/neom" },
        { label: "الطائف", href: "/locations/taif" },
      ],
      services: [
        { label: "توصيل المطار", href: "/services#airport" },
        { label: "توصيل العمرة", href: "/services#umrah" },
        { label: "سفر بين المدن", href: "/services#intercity" },
        { label: "سائق خاص للشركات", href: "/services#corporate" },
        { label: "خدمات نقل الحدود", href: "/services#border" },
      ],
      routes: [
        { label: "مطار جدة ← مكة المكرمة", href: "/routes/jeddah-to-makkah" },
        { label: "مكة المكرمة ← فنادق المدينة", href: "/routes/makkah-to-madinah" },
        { label: "الرياض ← دبي VIP", href: "/routes/riyadh-to-dubai" },
        { label: "الدمام ← الدوحة الدولية", href: "/routes/dammam-to-doha" },
        { label: "الرياض ← مكة المكرمة", href: "/routes/riyadh-to-makkah" },
        { label: "المدينة ← مطار جدة", href: "/routes/madinah-to-jeddah" },
        { label: "الرياض ← الدمام للأعمال", href: "/routes/riyadh-to-dammam" },
      ],
      company: [
        { label: "من نحن", href: "/about" },
        { label: "معرض الصور الفاخرة", href: "/gallery" },
        { label: "تسجيل السائقين", href: "/driver-registration" },
        { label: "تتبع الحجز", href: "/track-booking" },
        { label: "المدونة الفاخرة", href: "/blog" },
        { label: "سياسة الخصوصية", href: "/privacy" },
        { label: "شروط الخدمة", href: "/terms" },
      ],
    },
    ur: {
      destinations: [
        { label: "مکہ مکرمہ", href: "/locations/makkah" },
        { label: "مدینہ منورہ", href: "/locations/madinah" },
        { label: "جدہ", href: "/locations/jeddah" },
        { label: "ریاض", href: "/locations/riyadh" },
        { label: "دمام", href: "/locations/dammam" },
        { label: "العلا", href: "/locations/alula" },
        { label: "نیوم", href: "/locations/neom" },
        { label: "طائف", href: "/locations/taif" },
      ],
      services: [
        { label: "ایئرپورٹ ٹرانسفر", href: "/services#airport" },
        { label: "عمرہ ٹرانسپورٹ", href: "/services#umrah" },
        { label: "انٹرسٹی سفر", href: "/services#intercity" },
        { label: "کارپوریٹ ڈرائیور", href: "/services#corporate" },
        { label: "بارڈر کراسنگز", href: "/services#border" },
      ],
      routes: [
        { label: "جدہ ایئرپورٹ ← مکہ مکرمہ", href: "/routes/jeddah-to-makkah" },
        { label: "مکہ مکرمہ ← مدینہ ہوٹل", href: "/routes/makkah-to-madinah" },
        { label: "ریاض وی آئی پی ← دبئی", href: "/routes/riyadh-to-dubai" },
        { label: "دمام ← دوحہ کراس بارڈر", href: "/routes/dammam-to-doha" },
        { label: "ریاض ایگزیکٹو ← مکہ مکرمہ", href: "/routes/riyadh-to-makkah" },
        { label: "مدینہ منورہ ← جدہ ایئرپورٹ", href: "/routes/madinah-to-jeddah" },
        { label: "ریاض ← دمام بزنس", href: "/routes/riyadh-to-dammam" },
      ],
      company: [
        { label: "ہمارے بارے میں", href: "/about" },
        { label: "لگزری گیلری", href: "/gallery" },
        { label: "ڈرائیور رجسٹریشن", href: "/driver-registration" },
        { label: "بکنگ ٹریک کریں", href: "/track-booking" },
        { label: "لگزری بلاگ", href: "/blog" },
        { label: "رازداری کی پالیسی", href: "/privacy" },
        { label: "شرائط و ضوابط", href: "/terms" },
      ],
    },
  };

  const activeContent = content[language];

  return (
    <footer className="relative border-t border-[#C9A84C]/15 bg-[#0A0A0A] text-[#F5F0E8] pt-20 pb-10 overflow-hidden font-sans">
      {/* Background soft gold aura */}
      <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-[#C9A84C]/5 blur-[120px] pointer-events-none" />

      <div className="section-container">
        {/* Top brand grid */}
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr_1fr] pb-16 border-b border-[#C9A84C]/10 text-sm">
          {/* Brand Tagline */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-[#C9A84C] bg-[#0A0A0A] shadow-[0_0_10px_rgba(201,168,76,0.3)]">
                <span className="text-sm font-semibold text-[#C9A84C] font-heading">🌙</span>
              </span>
              <div className="flex flex-col">
                <span className="font-heading text-lg font-bold tracking-[0.18em] text-[#F5F0E8]">
                  RIYADH LUXE
                </span>
                <span className="text-[0.55rem] uppercase tracking-[0.4em] text-[#C9A84C] -mt-1">
                  Chauffeur Service
                </span>
              </div>
            </Link>
            <p className="text-xs leading-relaxed text-[#A1A1A6] max-w-sm">
              {t.tagline}
            </p>
          </div>

          {/* Destinations Column */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-[0.2em] text-[#C9A84C]">
              {t.destinations}
            </h4>
            <ul className="space-y-2 text-xs">
              {activeContent.destinations.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[#A1A1A6] hover:text-[#C9A84C] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-[0.2em] text-[#C9A84C]">
              {t.services}
            </h4>
            <ul className="space-y-2 text-xs">
              {activeContent.services.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[#A1A1A6] hover:text-[#C9A84C] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Routes Column */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-[0.2em] text-[#C9A84C]">
              {t.popularRoutes}
            </h4>
            <ul className="space-y-2 text-xs">
              {activeContent.routes.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[#A1A1A6] hover:text-[#C9A84C] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-[0.2em] text-[#C9A84C]">
              {t.company}
            </h4>
            <ul className="space-y-2 text-xs">
              {activeContent.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[#A1A1A6] hover:text-[#C9A84C] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Badges Row */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4 py-12 border-b border-[#C9A84C]/10 text-xs">
          <div className="flex items-center gap-3 bg-black/40 rounded-xl p-4 border border-[#C9A84C]/5">
            <BadgeCheck className="h-5 w-5 text-[#C9A84C] shrink-0" />
            <div>
              <p className="font-semibold text-[#F5F0E8]">{t.motLicensed}</p>
              <p className="text-[0.65rem] text-[#A1A1A6]">KSA MOT Compliant</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-black/40 rounded-xl p-4 border border-[#C9A84C]/5">
            <Receipt className="h-5 w-5 text-[#C9A84C] shrink-0" />
            <div>
              <p className="font-semibold text-[#F5F0E8]">{t.zatcaCompliant}</p>
              <p className="text-[0.65rem] text-[#A1A1A6]">Electronic Invoicing Ready</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-black/40 rounded-xl p-4 border border-[#C9A84C]/5">
            <ShieldCheck className="h-5 w-5 text-[#C9A84C] shrink-0" />
            <div>
              <p className="font-semibold text-[#F5F0E8]">{t.tgaCertified}</p>
              <p className="text-[0.65rem] text-[#A1A1A6]">Transport General Authority</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-black/40 rounded-xl p-4 border border-[#C9A84C]/5">
            <PhoneCall className="h-5 w-5 text-[#C9A84C] shrink-0" />
            <div>
              <p className="font-semibold text-[#F5F0E8]">{t.support247}</p>
              <p className="text-[0.65rem] text-[#A1A1A6]">Private Concierge Desk</p>
            </div>
          </div>
        </div>

        {/* Bottom copyright & socials */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 text-xs">
          <p className="text-[#A1A1A6] text-center md:text-left leading-relaxed">
            {t.copyright}
          </p>
          
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/966500123456"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C9A84C]/20 bg-black/30 text-[#A1A1A6] hover:text-[#C9A84C] hover:border-[#C9A84C] hover:shadow-[0_0_10px_rgba(201,168,76,0.2)] transition-all"
              aria-label="WhatsApp"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.528 2.008 14.056.979 11.44.979c-5.437 0-9.863 4.374-9.869 9.803-.002 1.718.455 3.393 1.324 4.882l-.99 3.619 3.71-.973c1.45.79 3.09 1.205 4.673 1.205l.004-.002zm11.238-7.798c-.3-.15-1.772-.875-2.046-.975-.276-.1-.476-.15-.677.15-.202.3-.777.975-.952 1.175-.177.2-.352.225-.652.075-.3-.15-1.265-.467-2.41-1.485-.89-.794-1.49-1.775-1.665-2.075-.175-.3-.019-.463.13-.612.135-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.63-.927-2.235-.245-.589-.49-.509-.677-.509-.175-.001-.375-.001-.575-.001-.2 0-.525.075-.8.375-.276.3-1.052 1.025-1.052 2.5s1.077 2.9 1.227 3.1c.15.2 2.12 3.235 5.136 4.536.717.31 1.277.495 1.711.633.721.23 1.377.198 1.896.121.578-.088 1.773-.725 2.022-1.425.249-.7 2.49-3.5 2.49-3.5-.175-.075-.35-.15-.65-.3zm0 0" />
              </svg>
            </a>
            <a
              href="https://facebook.com/riyadh.luxe.taxi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C9A84C]/20 bg-black/30 text-[#A1A1A6] hover:text-[#C9A84C] hover:border-[#C9A84C] hover:shadow-[0_0_10px_rgba(201,168,76,0.2)] transition-all"
              aria-label="Facebook"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href="https://instagram.com/riyadh.luxe.taxi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C9A84C]/20 bg-black/30 text-[#A1A1A6] hover:text-[#C9A84C] hover:border-[#C9A84C] hover:shadow-[0_0_10px_rgba(201,168,76,0.2)] transition-all"
              aria-label="Instagram"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a
              href="https://youtube.com/riyadh.luxe.taxi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C9A84C]/20 bg-black/30 text-[#A1A1A6] hover:text-[#C9A84C] hover:border-[#C9A84C] hover:shadow-[0_0_10px_rgba(201,168,76,0.2)] transition-all"
              aria-label="YouTube"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11C4.483 20.455 12 20.455 12 20.455s7.518 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
