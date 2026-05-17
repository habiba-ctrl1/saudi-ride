"use client";

import { useLanguage } from "@/lib/context/LanguageContext";
import { motion } from "framer-motion";
import { MapPin, Landmark, Award, Building2 } from "lucide-react";

const translations = {
  en: {
    badge: "Kingdom-Wide Coverage",
    title: "Locations we serve across KSA",
    description: "Providing absolute VIP mobility and private transfers throughout the Kingdom's major metropolitan areas, tourist gems, and key executive gateways.",
    categories: [
      {
        title: "Major Cities & Holy Destinations",
        description: "Primary urban metropolitan areas, spiritual centres, and central corporate districts.",
        icon: Landmark,
        items: ["Makkah Al-Mukarramah", "Madinah Al-Munawwarah", "Riyadh (Capital City)", "Jeddah (Red Sea Gateway)", "Dammam (Eastern Metro)"]
      },
      {
        title: "Tourism & Luxury Resorts",
        description: "Spectacular heritage locations, upcoming giga-projects, and refreshing high-altitude destinations.",
        icon: Award,
        items: ["AlUla Heritage City", "NEOM (Future Giga-Project)", "Taif (High-Altitude City)", "Yanbu Coastal City", "Abha (Asir Province)"]
      },
      {
        title: "Eastern & Industrial Gateways",
        description: "Key industrial clusters, coastal business centres, and neighboring border causeways.",
        icon: Building2,
        items: ["Al Khobar Executive Hub", "Jubail Industrial City", "Dhahran Aramco Area", "King Fahd Causeway (Bahrain Border)"]
      }
    ]
  },
  ar: {
    badge: "نطاق تغطيتنا في المملكة",
    title: "المواقع التي نخدمها في جميع أنحاء المملكة",
    description: "نقدم خدمات النقل الفاخرة للوفود الرسمية والزوار في المدن الكبرى والمناطق السياحية والمنافذ الصناعية الحيوية بالمملكة.",
    categories: [
      {
        title: "المدن الكبرى والمشاعر المقدسة",
        description: "المراكز الحضرية الرئيسية، العاصمة الإدارية، ومراكز السياحة الدينية الشريفة.",
        icon: Landmark,
        items: ["مكة المكرمة", "المدينة المنورة", "الرياض (العاصمة)", "جدة (بوابة البحر الأحمر)", "الدمام (بوابة الشرقية)"]
      },
      {
        title: "الوجهات السياحية والمنتجعات الفاخرة",
        description: "المواقع التراثية والتاريخية المذهلة، المشاريع العملاقة، والمناطق الجبلية الباردة.",
        icon: Award,
        items: ["العلا التاريخية", "نيوم (المستقبلية)", "الطائف (مدينة الورد)", "ينبع البحر", "أبها البهية"]
      },
      {
        title: "المناطق الصناعية والشرقية الحيوية",
        description: "المجمعات الصناعية الكبرى، مراكز الأعمال الساحلية، والمنافذ الحدودية الدولية.",
        icon: Building2,
        items: ["الخبر (حي الأعمال)", "الجبيل الصناعية", "الظهران (منطقة أرامكو)", "جسر الملك فهد (حدود البحرين)"]
      }
    ]
  },
  ur: {
    badge: "مملکت بھر میں کوریج",
    title: "سعودی عرب میں ہمارے کوریج ایریاز",
    description: "مملکت کے بڑے شہروں، سیاحتی مقامات اور اہم کاروباری مراکز میں وی آئی پی سفر اور نجی ٹرانسفر فراہم کرنا۔",
    categories: [
      {
        title: "اہم شہر اور مقدس مقامات",
        description: "بڑے شہر، روحانی مراکز اور مرکزی کاروباری اضلاع۔",
        icon: Landmark,
        items: ["مکہ مکرمہ", "مدینہ منورہ", "ریاض (دارالحکومت)", "جدہ (بحر احمر گیٹ وے)", "دمام (مشرقی میٹرو)"]
      },
      {
        title: "سیاحتی مقامات اور لگژری ریزورٹس",
        description: "شاندار ثقافتی مقامات، مستقبل کے میگا پروجیکٹس اور خوبصورت تفریحی مقامات۔",
        icon: Award,
        items: ["العلا تاریخی شہر", "نیوم (مستقبل کا میگا پروجیکٹ)", "طائف (بلند پہاڑی مقام)", "ینبع ساحلی شہر", "ابہا (عسیر صوبہ)"]
      },
      {
        title: "مشرقی اور صنعتی گیٹ ویز",
        description: "اہم صنعتی کلسٹرز، ساحلی کاروباری مراکز اور پڑوسی سرحدی گزرگاہیں۔",
        icon: Building2,
        items: ["الخبر بزنس ہب", "جبیل صنعتی شہر", "دہران ارامکو ایریا", "شاہ فہد کاز وے (بحرین بارڈر)"]
      }
    ]
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

export default function LocationsPage() {
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

        {/* Categories Grid list */}
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {t.categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-3xl border border-[#C9A84C]/15 bg-[#121212] p-8 shadow-2xl hover:border-[#C9A84C]/45 transition-all duration-300"
              >
                {/* gold accent overlay glow */}
                <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-[#C9A84C]/5 blur-2xl pointer-events-none" />

                <div className="flex flex-col gap-6">
                  {/* Category Header */}
                  <div className="flex items-center gap-3.5 border-b border-[#C9A84C]/10 pb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#C9A84C]/35 bg-black/40 text-[#C9A84C]">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <h2 className="font-heading text-lg font-bold text-[#F5F0E8]">
                      {category.title}
                    </h2>
                  </div>

                  {/* Category Description */}
                  <p className="text-[0.7rem] text-[#A1A1A6] leading-relaxed -mt-3">
                    {category.description}
                  </p>

                  {/* Locations Checklist */}
                  <ul className="space-y-3 pt-2">
                    {category.items.map((location) => (
                      <li key={location} className="flex items-center gap-2.5 text-xs text-[#F5F0E8]">
                        <MapPin className="h-3.5 w-3.5 text-[#C9A84C] shrink-0" />
                        <span>{location}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
