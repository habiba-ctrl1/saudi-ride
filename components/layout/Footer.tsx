"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/context/LanguageContext";
import { contactConfig } from "@/lib/config/contact";
import { trackEvent } from "@/lib/analytics";
import Image from "next/image";
import { ShieldCheck, Receipt, BadgeCheck, PhoneCall, Phone, Mail, MessageCircle, ArrowRight } from "lucide-react";

const FOOTER_WHATSAPP_TEXT = {
  en: "Salam! I'd like to book a private transfer with Taxi Saudi Arabia.\n\n• From: \n• To: \n• Date & time: \n• Passengers & luggage: \n• Vehicle (Sedan / SUV / Van): ",
  ar: "السلام عليكم، أرغب بحجز تاكسي خاص مع تاكسي السعودية.\n\n• من: \n• إلى: \n• التاريخ والوقت: \n• الركاب والأمتعة: \n• نوع السيارة (سيدان / SUV / فان): ",
  ur: "سلام! میں ٹیکسی سعودی عرب کے ساتھ پرائیویٹ ٹیکسی بک کروانا چاہتا ہوں۔\n\n• سے: \n• تک: \n• تاریخ اور وقت: \n• مسافر اور سامان: \n• گاڑی (سیڈان / SUV / وین): ",
};

const translations = {
  en: {
    tagline: "Trusted taxi and car service in Saudi Arabia. Airport transfers, Umrah trips, intercity rides, and business travel — clear quotes on WhatsApp, professional chauffeurs, available 24/7.",
    destinations: "Destinations",
    services: "Services",
    popularRoutes: "Popular Routes",
    company: "Company",
    copyright: "© 2026 Taxi Saudi Arabia. All rights reserved.",
    motLicensed: "Professional Chauffeurs",
    zatcaCompliant: "Corporate Invoicing",
    tgaCertified: "Clear Quotes",
    support247: "24/7 Customer Support",
    motSub: "Vetted & Experienced",
    zatcaSub: "Available on Request",
    tgaSub: "No Meter, No Surge",
    supportSub: "Private Concierge Desk",
    ctaEyebrow: "Plan your transfer",
    ctaTitle: "Tell us the route — we reply with a clear quote.",
    ctaText: "Share pickup, destination, date and passengers on WhatsApp. Your private vehicle and chauffeur are confirmed in writing before you travel.",
    ctaWhatsApp: "Get a Quote on WhatsApp",
    ctaBook: "Booking Form",
  },
  ar: {
    tagline: "خدمة تاكسي وسيارات موثوقة في المملكة العربية السعودية. توصيل المطارات، رحلات العمرة، التنقل بين المدن وسفر الأعمال — عروض أسعار واضحة عبر واتساب، سائقون محترفون، على مدار الساعة.",
    destinations: "الوجهات والشحنات",
    services: "خدماتنا",
    popularRoutes: "أشهر المسارات",
    company: "الشركة",
    copyright: "© 2026 تاكسي السعودية. جميع الحقوق محفوظة.",
    motLicensed: "سائقون محترفون",
    zatcaCompliant: "فوترة للشركات",
    tgaCertified: "عروض أسعار واضحة",
    support247: "دعم VIP على مدار الساعة",
    motSub: "سائقون ذوو خبرة",
    zatcaSub: "متاحة عند الطلب",
    tgaSub: "بدون عداد أو زيادات",
    supportSub: "مكتب خدمة خاص",
    ctaEyebrow: "خطط لرحلتك",
    ctaTitle: "أخبرنا بالمسار — ونرسل لك عرض سعر واضحًا.",
    ctaText: "أرسل نقطة الانطلاق والوجهة والتاريخ وعدد الركاب عبر واتساب، ويتم تأكيد سيارتك الخاصة وسائقك كتابيًا قبل الرحلة.",
    ctaWhatsApp: "اطلب عرض سعر عبر واتساب",
    ctaBook: "نموذج الحجز",
  },
  ur: {
    tagline: "سعودی عرب میں قابل اعتماد ٹیکسی اور کار سروس۔ ایئرپورٹ ٹرانسفر، عمرہ سفر، بین شہر سواری اور بزنس ٹریول — واٹس ایپ پر واضح قیمت، پیشہ ور ڈرائیورز، 24/7 دستیاب۔",
    destinations: "منزلیں",
    services: "خدمات",
    popularRoutes: "مشہور روٹس",
    company: "کمپنی",
    copyright: "© 2026 ٹیکسی سعودی عرب۔ جملہ حقوق محفوظ ہیں۔",
    motLicensed: "پیشہ ور ڈرائیورز",
    zatcaCompliant: "کارپوریٹ انوائسنگ",
    tgaCertified: "واضح قیمت",
    support247: "24/7 وی آئی پی سپورٹ",
    motSub: "تجربہ کار ڈرائیورز",
    zatcaSub: "درخواست پر دستیاب",
    tgaSub: "نہ میٹر، نہ سرج",
    supportSub: "پرائیویٹ کنسیئرج ڈیسک",
    ctaEyebrow: "اپنا سفر پلان کریں",
    ctaTitle: "روٹ بتائیں — ہم واضح قیمت بھیجیں گے۔",
    ctaText: "واٹس ایپ پر پک اپ، منزل، تاریخ اور مسافر بتائیں۔ آپ کی پرائیویٹ گاڑی اور ڈرائیور سفر سے پہلے تحریری طور پر کنفرم ہوتے ہیں۔",
    ctaWhatsApp: "واٹس ایپ پر قیمت لیں",
    ctaBook: "بکنگ فارم",
  },
};

export function Footer() {
  const { language } = useLanguage();
  const t = translations[language];
  const pathname = usePathname();

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
        { label: "Tabuk", href: "/locations/tabuk" },
        { label: "Dhahran", href: "/locations/dhahran" },
        { label: "Jubail", href: "/locations/jubail" },
        { label: "Al Khobar", href: "/locations/alkhobar" },
        { label: "Yanbu", href: "/locations/yanbu" },
        { label: "Abha", href: "/locations/abha" },
        { label: "Abu Dhabi", href: "/locations/abudhabi" },
        { label: "Jeddah Airport (JED)", href: "/airports/king-abdulaziz-jeddah" },
        { label: "Riyadh Airport (RUH)", href: "/airports/king-khalid-riyadh" },
        { label: "Madinah Airport (MED)", href: "/airports/prince-mohammad-madinah" },
        { label: "Dammam Airport (DMM)", href: "/airports/king-fahd-dammam" },
        { label: "Taif Airport (TIF)", href: "/airports/taif-regional" },
        { label: "Tabuk Airport (TUU)", href: "/airports/tabuk-regional" },
        { label: "AlUla Airport (ULH)", href: "/airports/alula" },
        { label: "Red Sea Airport (RSI)", href: "/airports/red-sea" },
        { label: "Abha Airport (AHB)", href: "/airports/abha-regional" },
      ],
      services: [
        { label: "Airport Transfers", href: "/services/airport-transfers" },
        { label: "Umrah Transport", href: "/services/umrah-transport" },
        { label: "Makkah Ziyarat", href: "/services/makkah-ziyarat" },
        { label: "Madinah Ziyarat", href: "/services/madinah-ziyarat" },
        { label: "Intercity Rides", href: "/services/intercity" },
        { label: "Corporate Car Service", href: "/services/corporate" },
        { label: "Wedding Car Rental", href: "/services/wedding-car-rental" },
        { label: "Event Transportation", href: "/events" },
        { label: "Border Crossings", href: "/services/border-crossings" },
        { label: "Corporate Bahrain Transport", href: "/services/corporate-bahrain-transport" },
        { label: "Hajj Transport", href: "/services/hajj-transport" },
        { label: "Heritage Tours", href: "/services/heritage-tours" },
        { label: "Car Recovery (Satha)", href: "/services/car-recovery" },
      ],
      routes: [
        { label: "Jeddah Airport → Makkah", href: "/routes/jeddah-airport-to-makkah" },
        { label: "Makkah → Madinah", href: "/routes/makkah-to-madinah" },
        { label: "Riyadh → Dubai", href: "/routes/riyadh-to-dubai" },
        { label: "Riyadh → Abu Dhabi", href: "/routes/riyadh-to-abudhabi" },
        { label: "Tabuk → Amman, Jordan", href: "/routes/tabuk-to-amman" },
        { label: "Dammam → Doha", href: "/routes/dammam-to-doha" },
        { label: "Riyadh → Makkah", href: "/routes/riyadh-to-makkah" },
        { label: "Madinah → Jeddah Airport", href: "/routes/madinah-to-jeddah-airport" },
        { label: "Riyadh → Dammam", href: "/routes/riyadh-to-dammam" },
      ],
      company: [
        { label: "About Us", href: "/about" },
        { label: "Vehicle Categories", href: "/fleet" },
        { label: "Pricing", href: "/pricing" },
        { label: "FAQ", href: "/faq" },
        { label: "Contact Us", href: "/contact" },
        { label: "Blog", href: "/blog" },
        { label: "City Distances", href: "/distance" },
        { label: "Luxury Gallery", href: "/gallery" },
        { label: "Track Booking", href: "/track-booking" },
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms of Service", href: "/terms-conditions" },
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
        { label: "تبوك", href: "/locations/tabuk" },
        { label: "الظهران", href: "/locations/dhahran" },
        { label: "الجبيل", href: "/locations/jubail" },
        { label: "الخبر", href: "/locations/alkhobar" },
        { label: "ينبع", href: "/locations/yanbu" },
        { label: "أبها", href: "/locations/abha" },
        { label: "أبوظبي", href: "/locations/abudhabi" },
      ],
      services: [
        { label: "توصيل المطار", href: "/services/airport-transfers" },
        { label: "توصيل العمرة", href: "/services/umrah-transport" },
        { label: "زيارات مكة", href: "/services/makkah-ziyarat" },
        { label: "زيارات المدينة", href: "/services/madinah-ziyarat" },
        { label: "سفر بين المدن", href: "/services/intercity" },
        { label: "سائق خاص للشركات", href: "/services/corporate" },
        { label: "خدمات نقل الحدود", href: "/services/border-crossings" },
        { label: "نقل الحج", href: "/services/hajj-transport" },
        { label: "جولات التراث", href: "/services/heritage-tours" },
        { label: "سطحة وسحب سيارات", href: "/services/car-recovery" },
      ],
      routes: [
        { label: "مطار جدة ← مكة المكرمة", href: "/routes/jeddah-airport-to-makkah" },
        { label: "مكة المكرمة ← المدينة المنورة", href: "/routes/makkah-to-madinah" },
        { label: "الرياض ← دبي", href: "/routes/riyadh-to-dubai" },
        { label: "الرياض ← أبوظبي", href: "/routes/riyadh-to-abudhabi" },
        { label: "الدمام ← الدوحة", href: "/routes/dammam-to-doha" },
        { label: "الرياض ← مكة المكرمة", href: "/routes/riyadh-to-makkah" },
        { label: "المدينة المنورة ← مطار جدة", href: "/routes/madinah-to-jeddah-airport" },
        { label: "الرياض ← الدمام", href: "/routes/riyadh-to-dammam" },
      ],
      company: [
        { label: "من نحن", href: "/about" },
        { label: "فئات السيارات", href: "/fleet" },
        { label: "الأسعار", href: "/pricing" },
        { label: "الأسئلة الشائعة", href: "/faq" },
        { label: "اتصل بنا", href: "/contact" },
        { label: "المدونة", href: "/blog" },
        { label: "معرض الصور الفاخرة", href: "/gallery" },
        { label: "تتبع الحجز", href: "/track-booking" },
        { label: "سياسة الخصوصية", href: "/privacy-policy" },
        { label: "شروط الخدمة", href: "/terms-conditions" },
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
        { label: "تبوک", href: "/locations/tabuk" },
        { label: "الظہران", href: "/locations/dhahran" },
        { label: "الجبیل", href: "/locations/jubail" },
        { label: "الخبر", href: "/locations/alkhobar" },
        { label: "ینبع", href: "/locations/yanbu" },
        { label: "ابھا", href: "/locations/abha" },
        { label: "ابوظہبی", href: "/locations/abudhabi" },
      ],
      services: [
        { label: "ایئرپورٹ ٹرانسفر", href: "/services/airport-transfers" },
        { label: "عمرہ ٹرانسپورٹ", href: "/services/umrah-transport" },
        { label: "مکہ زیارات", href: "/services/makkah-ziyarat" },
        { label: "مدینہ زیارات", href: "/services/madinah-ziyarat" },
        { label: "انٹرسٹی سفر", href: "/services/intercity" },
        { label: "کارپوریٹ ڈرائیور", href: "/services/corporate" },
        { label: "بارڈر کراسنگز", href: "/services/border-crossings" },
        { label: "حج ٹرانسپورٹ", href: "/services/hajj-transport" },
        { label: "ہیریٹیج ٹورز", href: "/services/heritage-tours" },
        { label: "کار ریکوری (سطحہ)", href: "/services/car-recovery" },
      ],
      routes: [
        { label: "جدہ ایئرپورٹ ← مکہ مکرمہ", href: "/routes/jeddah-airport-to-makkah" },
        { label: "مکہ مکرمہ ← مدینہ منورہ", href: "/routes/makkah-to-madinah" },
        { label: "ریاض ← دبئی", href: "/routes/riyadh-to-dubai" },
        { label: "ریاض ← ابوظہبی", href: "/routes/riyadh-to-abudhabi" },
        { label: "دمام ← دوحہ", href: "/routes/dammam-to-doha" },
        { label: "ریاض ← مکہ مکرمہ", href: "/routes/riyadh-to-makkah" },
        { label: "مدینہ منورہ ← جدہ ایئرپورٹ", href: "/routes/madinah-to-jeddah-airport" },
        { label: "ریاض ← دمام", href: "/routes/riyadh-to-dammam" },
      ],
      company: [
        { label: "ہمارے بارے میں", href: "/about" },
        { label: "گاڑیوں کی اقسام", href: "/fleet" },
        { label: "قیمتیں", href: "/pricing" },
        { label: "عمومی سوالات", href: "/faq" },
        { label: "رابطہ کریں", href: "/contact" },
        { label: "بلاگ", href: "/blog" },
        { label: "لگزری گیلری", href: "/gallery" },
        { label: "بکنگ ٹریک کریں", href: "/track-booking" },
        { label: "رازداری کی پالیسی", href: "/privacy-policy" },
        { label: "شرائط و ضوابط", href: "/terms-conditions" },
      ],
    },
  };

  const activeContent = content[language];
  const waHref = `${contactConfig.whatsappLink}?text=${encodeURIComponent(FOOTER_WHATSAPP_TEXT[language])}`;
  const trackFooterWa = (sourceLocation: string) =>
    trackEvent("whatsapp_click", {
      sourceLocation,
      phoneUsed: contactConfig.whatsappNumber,
      locale: language,
      path: pathname,
    });

  const columns = [
    { title: t.services, links: activeContent.services },
    { title: t.popularRoutes, links: activeContent.routes },
    { title: t.company, links: activeContent.company },
  ];

  const contacts = [
    { key: "wa", href: waHref, icon: MessageCircle, label: contactConfig.primaryPhoneDisplay, sub: "WhatsApp", external: true },
    { key: "call", href: contactConfig.primaryPhoneLink, icon: Phone, label: language === "ar" ? "اتصل بنا" : "Call us", sub: "24/7", external: false },
    { key: "mail", href: contactConfig.emailLink, icon: Mail, label: contactConfig.email, sub: language === "ar" ? "البريد الإلكتروني" : "Email", external: false },
  ];

  return (
    <footer className="tsa-footer premium-dark-section on-dark relative overflow-hidden font-sans text-white" style={{ backgroundColor: "#16A34A" }}>
      {/* Depth: soft light pools, no new colours. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(60% 50% at 85% 0%, rgba(250,204,21,0.14) 0%, transparent 60%), radial-gradient(50% 60% at 0% 100%, rgba(5,46,22,0.35) 0%, transparent 70%)" }}
      />

      <div className="relative wrap wrap-wide">
        {/* ── Closing CTA band ── */}
        <div className="grid gap-6 border-b border-white/15 py-12 md:grid-cols-[1.4fr_1fr] md:items-center md:py-14">
          <div>
            <p className="t-eyebrow on-dark">{t.ctaEyebrow}</p>
            <p className="mt-3 font-heading text-[clamp(1.6rem,3vw,2.3rem)] font-extrabold leading-tight tracking-tight text-white">
              {t.ctaTitle}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80">{t.ctaText}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
            <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={() => trackFooterWa("footer_cta")} className="btn btn-accent btn-lg">
              <MessageCircle /> {t.ctaWhatsApp}
            </a>
            <Link href="/book" className="btn btn-glass btn-lg">
              {t.ctaBook} <ArrowRight className="rtl:rotate-180" />
            </Link>
          </div>
        </div>

        {/* ── Navigation grid ── */}
        <div className="grid gap-x-8 gap-y-10 py-12 md:grid-cols-2 lg:grid-cols-[1.35fr_1.6fr_1fr_1fr_0.9fr] lg:py-16">
          {/* Brand + direct contact */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Taxi Saudi Arabia — home">
              <Image src="/logo-tsa-white.png" alt="" width={948} height={650} className="h-14 w-auto" />
              <span className="flex flex-col leading-none">
                <span className="font-heading text-lg font-extrabold tracking-tight text-white">Taxi Saudi Arabia</span>
                <span className="mt-1.5 text-[0.6rem] font-bold uppercase tracking-[0.24em] text-[#FACC15]">Taxi &amp; Car Service</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/80">{t.tagline}</p>

            <ul className="mt-6 space-y-1">
              {contacts.map(({ key, href, icon: Icon, label, sub, external }) => (
                <li key={key}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer", onClick: () => trackFooterWa("footer_contact") } : {})}
                    className="group flex items-center gap-3 rounded-xl py-1.5 text-sm font-semibold text-white transition-colors hover:text-[#FACC15]"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 transition-colors group-hover:bg-[#FACC15] group-hover:text-[#14532D]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate">{label}</span>
                      <span className="block text-[0.68rem] font-medium uppercase tracking-[0.14em] text-white/60">{sub}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations — longest list, two compact columns */}
          <nav aria-label={t.destinations} className="md:col-span-2 lg:col-span-1">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#FACC15]">{t.destinations}</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 text-[0.84rem]">
              {activeContent.destinations.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="inline-block py-1.5 text-white/75 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#FACC15]">{col.title}</p>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 text-[0.84rem] md:grid-cols-1">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="inline-block py-1.5 text-white/75 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* ── Assurances strip ── */}
        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/15 ring-1 ring-white/15 min-[420px]:grid-cols-2 md:grid-cols-4">
          {[
            { icon: BadgeCheck, label: t.motLicensed, sub: t.motSub },
            { icon: Receipt, label: t.zatcaCompliant, sub: t.zatcaSub },
            { icon: ShieldCheck, label: t.tgaCertified, sub: t.tgaSub },
            { icon: PhoneCall, label: t.support247, sub: t.supportSub },
          ].map(({ icon: Icon, label, sub }) => (
            <li key={label} className="flex items-center gap-3 bg-[#15803D] p-4 sm:p-5">
              <Icon className="h-5 w-5 shrink-0 text-[#FACC15]" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="mt-0.5 text-xs text-white/70">{sub}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col-reverse items-center justify-between gap-5 py-8 pb-24 text-xs md:flex-row md:pb-8">
          <p className="text-center text-white/75 md:text-start">{t.copyright}</p>
          <div className="flex items-center gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.label === "WhatsApp" ? waHref : s.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={s.label === "WhatsApp" ? () => trackFooterWa("footer") : undefined}
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/85 ring-1 ring-white/20 transition-all hover:-translate-y-0.5 hover:bg-[#FACC15] hover:text-[#14532D] hover:ring-[#FACC15]"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden>
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

const SOCIALS = [
  { label: "WhatsApp", href: "", path: "M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.528 2.008 14.056.979 11.44.979c-5.437 0-9.863 4.374-9.869 9.803-.002 1.718.455 3.393 1.324 4.882l-.99 3.619 3.71-.973c1.45.79 3.09 1.205 4.673 1.205l.004-.002zm11.238-7.798c-.3-.15-1.772-.875-2.046-.975-.276-.1-.476-.15-.677.15-.202.3-.777.975-.952 1.175-.177.2-.352.225-.652.075-.3-.15-1.265-.467-2.41-1.485-.89-.794-1.49-1.775-1.665-2.075-.175-.3-.019-.463.13-.612.135-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.63-.927-2.235-.245-.589-.49-.509-.677-.509-.175-.001-.375-.001-.575-.001-.2 0-.525.075-.8.375-.276.3-1.052 1.025-1.052 2.5s1.077 2.9 1.227 3.1c.15.2 2.12 3.235 5.136 4.536.717.31 1.277.495 1.711.633.721.23 1.377.198 1.896.121.578-.088 1.773-.725 2.022-1.425.249-.7 2.49-3.5 2.49-3.5-.175-.075-.35-.15-.65-.3zm0 0" },
  { label: "Facebook", href: "https://facebook.com/taxisaudiarabia", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
  { label: "Instagram", href: "https://instagram.com/taxisaudiarabia", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
  { label: "YouTube", href: "https://youtube.com/@taxisaudiarabia", path: "M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11C4.483 20.455 12 20.455 12 20.455s7.518 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
];
