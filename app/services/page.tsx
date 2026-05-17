"use client";

import { useLanguage } from "@/lib/context/LanguageContext";
import { motion } from "framer-motion";
import { ShieldCheck, Compass, Sparkles, MapPin } from "lucide-react";

const translations = {
  en: {
    badge: "Our Services",
    title: "Premium transfer services across Saudi Arabia",
    description: "Experience the pinnacle of VIP travel. Pre-booked elite chauffeur services designed for business executives, family travelers, and Umrah pilgrims.",
    cards: [
      {
        slug: "umrah-transport",
        title: "Umrah Transport & Pilgrimage",
        description: "Private and respectful transfers between Jeddah, Makkah, and Madinah with prayer-time aware planning and absolute peace of mind.",
        icon: Sparkles,
      },
      {
        slug: "airport-transfers",
        title: "Executive Airport Transfers",
        description: "24/7 airport pick-up and drop-off service with live flight tracking, professional meet-and-greet, and premium luggage assistance.",
        icon: Compass,
      },
      {
        slug: "business-executive",
        title: "Business & VIP Corporate Chauffeur",
        description: "Elegant and luxury fleet with seasoned private drivers for VIP delegations, business summits, and corporate travel.",
        icon: ShieldCheck,
      },
      {
        slug: "intercity-travel",
        title: "GCC & Intercity Elite Transfers",
        description: "Ultra-comfortable long-distance transfers between major cities in Saudi Arabia and neighboring GCC countries with fixed transparent pricing.",
        icon: MapPin,
      },
    ]
  },
  ar: {
    badge: "خدماتنا الفاخرة",
    title: "خدمات نقل فاخرة في جميع أنحاء المملكة",
    description: "اختبر قمة السفر الفاخر. خدمات سائق خاص مسبقة الحجز مصممة لرجال الأعمال والعائلات ومعتمري بيت الله الحرام بأعلى مستويات الرفاهية.",
    cards: [
      {
        slug: "umrah-transport",
        title: "توصيل العمرة والزيارة",
        description: "تنقلات خاصة ومحترمة بين جدة ومكة المكرمة والمدينة المنورة مع مراعاة أوقات الصلوات والراحة المطلقة لضيوف الرحمن.",
        icon: Sparkles,
      },
      {
        slug: "airport-transfers",
        title: "توصيل المطار التنفيذي",
        description: "خدمة استقبال وتوصيل من وإلى المطار على مدار الساعة مع تتبع الرحلات المباشر، والاستقبال اللائق، والمساعدة في الأمتعة.",
        icon: Compass,
      },
      {
        slug: "business-executive",
        title: "سائق خاص لرجال الأعمال وكبار الشخصيات",
        description: "أسطول فخم ومهيب مع سائقين مدربين للوفود الرسمية، والاجتماعات الهامة، ورجال الأعمال في المملكة.",
        icon: ShieldCheck,
      },
      {
        slug: "intercity-travel",
        title: "تنقلات دولية وبين المدن الكبرى",
        description: "رحلات طويلة ومريحة للغاية بين المدن السعودية ودول الخليج المجاورة بأسعار ثابتة ومحددة مسبقاً.",
        icon: MapPin,
      },
    ]
  },
  ur: {
    badge: "ہماری خدمات",
    title: "سعودی عرب میں پریمیم ٹرانسفر سروسز",
    description: "وی آئی پی سفر کے عروج کا تجربہ کریں۔ بزنس ایگزیکٹوز، خاندانوں اور عمرہ زائرین کے لیے پہلے سے بک شدہ اشرافیہ ڈرائیور سروسز۔",
    cards: [
      {
        slug: "umrah-transport",
        title: "عمرہ اور زیارت ٹرانسپورٹ",
        description: "جدہ، مکہ مکرمہ اور مدینہ منورہ کے درمیان نجی اور احترام کے ساتھ ٹرانسفر، نماز کے اوقات کے مطابق منصوبہ بندی اور مکمل ذہنی سکون کے ساتھ۔",
        icon: Sparkles,
      },
      {
        slug: "airport-transfers",
        title: "ایگزیکٹو ایئرپورٹ ٹرانسفرز",
        description: "لائیو فلائٹ ٹریکنگ، پیشہ ورانہ استقبال، اور سامان کی امداد کے ساتھ 24/7 ایئرپورٹ پک اپ اور ڈراپ آف سروس۔",
        icon: Compass,
      },
      {
        slug: "business-executive",
        title: "بزنس اور وی آئی پی کارپوریٹ ڈرائیور",
        description: "وی آئی پی وفود، کاروباری ملاقاتوں اور کارپوریٹ سفر کے لیے تجربہ کار نجی ڈرائیوروں کے ساتھ خوبصورت اور پرتعیش گاڑیاں۔",
        icon: ShieldCheck,
      },
      {
        slug: "intercity-travel",
        title: "انٹرسٹی اور جی سی سی لگژری ٹرانسفرز",
        description: "سعودی عرب کے بڑے شہروں اور پڑوسی جی سی سی ممالک کے درمیان مقررہ شفاف قیمتوں کے ساتھ انتہائی آرام دہ طویل فاصلے کے سفر۔",
        icon: MapPin,
      },
    ]
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

export default function ServicesPage() {
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

        {/* Dynamic Premium Grid Cards */}
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {t.cards.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.slug}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group rounded-3xl border border-[#C9A84C]/15 bg-[#121212] p-8 md:p-10 shadow-2xl hover:border-[#C9A84C]/45 transition-all duration-300 overflow-hidden"
              >
                {/* Floating gold background flare */}
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#C9A84C]/5 blur-2xl group-hover:bg-[#C9A84C]/10 transition-colors pointer-events-none" />

                <div className="flex flex-col gap-6">
                  {/* Luxury Icon Frame */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C9A84C]/30 bg-black/40 text-[#C9A84C]">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="space-y-3">
                    <h2 className="font-heading text-2xl font-bold text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-xs leading-relaxed text-[#A1A1A6]">
                      {service.description}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
