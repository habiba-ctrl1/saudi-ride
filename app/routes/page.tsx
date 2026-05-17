"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/context/LanguageContext";
import { motion } from "framer-motion";
import { Compass, MessageCircle, CalendarDays } from "lucide-react";
import { contactConfig } from "@/lib/config/contact";

const translations = {
  en: {
    badge: "Popular Corridors",
    title: "High-demand luxury transfer corridors",
    description: "Enjoy pre-booked, flat-rate private chauffeur corridors between cities, airports, and major holy places in Saudi Arabia.",
    customTitle: "Need a bespoke route quote?",
    customText: "Share your specific pick-up, drop-off, and scheduling details directly with our 24/7 private concierge team on WhatsApp.",
    whatsappCTA: "Consult Concierge Desk",
    onlineCTA: "Use Booking System",
    routes: [
      "Jeddah Airport to Makkah Grand Mosque",
      "Makkah Hotels to Madinah Hotels",
      "Madinah Hotels to Jeddah Airport",
      "Riyadh Executive to Dammam City",
      "Riyadh Luxury to Dubai (Cross-Border)",
      "Dammam Executive to Doha (Qatar Border)",
      "Jeddah Airport to King Abdullah Economic City (KAEC)",
      "Riyadh Airport to AlUla Luxury Resorts"
    ]
  },
  ar: {
    badge: "المسارات الأكثر طلباً",
    title: "أشهر مسارات التوصيل الفاخرة بالمملكة",
    description: "استمتع برحلات خاصة مسبقة الحجز بأسعار ثابتة ومحددة بين المدن الكبرى والمطارات والمشاعر المقدسة في المملكة.",
    customTitle: "هل تحتاج إلى مسار مخصص؟",
    customText: "شارك تفاصيل موقع الانطلاق، والوصول، والوقت والتواريخ مباشرة مع مكتب الكونسيرج الخاص بنا عبر الواتساب على مدار الساعة.",
    whatsappCTA: "استشر مكتب الكونسيرج",
    onlineCTA: "احجز عبر الموقع الإلكتروني",
    routes: [
      "مطار جدة إلى الحرم المكي الشريف",
      "من فنادق مكة إلى فنادق المدينة المنورة",
      "من فنادق المدينة المنورة إلى مطار جدة",
      "من الرياض (رجال الأعمال) إلى مدينة الدمام",
      "من الرياض (VIP) إلى دبي (عبر الحدود)",
      "من الدمام إلى الدوحة (الحدود القطرية)",
      "مطار جدة إلى مدينة الملك عبدالله الاقتصادية",
      "مطار الرياض إلى منتجعات العلا الفاخرة"
    ]
  },
  ur: {
    badge: "مشہور کوریڈورز",
    title: "سب سے زیادہ مانگ والے وی آئی پی روٹس",
    description: "سعودی عرب کے بڑے شہروں، ہوائی اڈوں اور مقدس مقامات کے درمیان پہلے سے بک شدہ، فکسڈ ریٹ نجی ڈرائیور کے سفر سے لطف اندوز ہوں۔",
    customTitle: "کیا آپ کو مرضی کا روٹ درکار ہے؟",
    customText: "اپنے پک اپ، ڈراپ آف، اور وقت کی تفصیلات براہ راست واٹس ایپ پر ہماری 24/7 نجی دربان ٹیم کے ساتھ شیئر کریں۔",
    whatsappCTA: "کنسیرج ڈیسک سے رابطہ کریں",
    onlineCTA: "آن لائن بکنگ استعمال کریں",
    routes: [
      "جدہ ایئرپورٹ سے مکہ مکرمہ حرم شریف",
      "مکہ مکرمہ ہوٹلز سے مدینہ منورہ ہوٹلز",
      "مدینہ منورہ ہوٹلز سے جدہ ایئرپورٹ",
      "ریاض ایگزیکٹو سے دمام سٹی",
      "ریاض لگژری سے دبئی (کراس بارڈر)",
      "دمام ایگزیکٹو سے دوحہ (قطر بارڈر)",
      "جدہ ایئرپورٹ سے کنگ عبداللہ اکنامک سٹی (KAEC)",
      "ریاض ایئرپورٹ سے العلا لگژری ریزورٹس"
    ]
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

export default function RoutesPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-28 pb-16">
      <section className="section-container">
        {/* Entrance Hero text */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-semibold">
            {t.badge}
          </span>
          <h1 className="mt-4 font-heading text-4xl font-bold leading-tight md:text-5.5xl text-[#F5F0E8]">
            {t.title}
          </h1>
          <p className="mt-6 text-sm md:text-base leading-relaxed text-[#A1A1A6]">
            {t.description}
          </p>
        </motion.div>

        {/* Routes Grid list */}
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {t.routes.map((route, index) => (
            <motion.div
              key={route}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeUp}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="flex items-center gap-3.5 rounded-2xl border border-[#C9A84C]/15 bg-[#121212]/80 px-6 py-4.5 text-xs font-semibold text-[#F5F0E8] hover:border-[#C9A84C]/45 hover:bg-[#121212] transition-all duration-300"
            >
              <Compass className="h-4 w-4 text-[#C9A84C] shrink-0" />
              <span>{route}</span>
            </motion.div>
          ))}
        </div>

        {/* Custom Custom Quote Box */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-14 relative overflow-hidden rounded-3xl border border-[#C9A84C]/25 bg-[#121212] p-8 md:p-10 shadow-2xl"
        >
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#C9A84C]/5 blur-3xl pointer-events-none" />

          <div className="max-w-2xl space-y-4">
            <h3 className="font-heading text-2xl font-bold text-[#F5F0E8]">
              {t.customTitle}
            </h3>
            <p className="text-xs leading-relaxed text-[#A1A1A6]">
              {t.customText}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wider">
            <a
              href={contactConfig.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-white hover:bg-[#20ba59] transition-all hover:scale-102 shadow-lg shadow-[#25d366]/10"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{t.whatsappCTA}</span>
            </a>
            
            <Link
              href="/#booking"
              className="flex items-center gap-2 rounded-full border border-[#C9A84C] px-6 py-3.5 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all"
            >
              <CalendarDays className="h-4 w-4" />
              <span>{t.onlineCTA}</span>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
