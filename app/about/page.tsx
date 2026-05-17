"use client";

import { useLanguage } from "@/lib/context/LanguageContext";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, CheckCircle2, History } from "lucide-react";

const translations = {
  en: {
    badge: "Who We Are",
    title: "Your passage to VIP mobility",
    description: "Riyadh Luxe Taxi stands at the intersection of Saudi hospitality and world-class luxury transportation. We provide pre-booked, flat-rate chauffeur services engineered for executive summits, spiritual pilgrimages, and family travels across the Kingdom.",
    stats: [
      { label: "Ministry Licensed", value: "100%" },
      { label: "VIP Trips Completed", value: "50k+" },
      { label: "Support Desk Available", value: "24/7" },
      { label: "Elite Driving Force", value: "10+" }
    ],
    pillars: [
      {
        title: "Absolute Reliability",
        description: "Zero delay commitment. Flight-tracking and prayer-aware planners assure chauffeurs await your arrival.",
        icon: ShieldCheck
      },
      {
        title: "Curated Chauffeur Circle",
        description: "Highly trained local experts, certified by public authority standards, speaking multiple languages.",
        icon: Sparkles
      },
      {
        title: "ZATCA & MOT Certified",
        description: "Completely licensed under the Ministry of Transport and ZATCA electronic invoicing protocols.",
        icon: CheckCircle2
      },
      {
        title: "Elite Fleet Maintenance",
        description: "Only modern, spotless vehicles with premium interior configurations and individual temperature settings.",
        icon: History
      }
    ]
  },
  ar: {
    badge: "من نحن",
    title: "بوابتك الآمنة للتنقل الفاخر بالمملكة",
    description: "يقف الرياض لوكس تاكسي عند نقطة التقاء الضيافة السعودية والرفاهية العالمية في النقل. نحن نقدم خدمات السائقين مسبقة الحجز بأسعار ثابتة ومحددة مصممة خصيصاً للمؤتمرات التنفيذية، والعمرة، والرحلات العائلية الفاخرة.",
    stats: [
      { label: "ترخيص رسمي", value: "100%" },
      { label: "رحلات VIP ناجحة", value: "50k+" },
      { label: "دعم كونسيرج", value: "24/7" },
      { label: "سنوات من الخدمة", value: "10+" }
    ],
    pillars: [
      {
        title: "الالتزام المطلق بالوقت",
        description: "نلتزم بدقة المواعيد التامة مع تتبع فوري للرحلات والتنسيق مع أوقات الصلوات لراحتك.",
        icon: ShieldCheck
      },
      {
        title: "نخبة من السائقين المحترفين",
        description: "سائقون محليون مدربون ومعتمدون من الهيئة العامة للنقل ويتحدثون لغات متعددة.",
        icon: Sparkles
      },
      {
        title: "ترخيص رسمي وتوافق تام",
        description: "مرخص بالكامل من وزارة النقل ومتوافق مع الفواتير الإلكترونية لهيئة الزكاة والضريبة.",
        icon: CheckCircle2
      },
      {
        title: "عناية وصيانة فائقة للأسطول",
        description: "أسطول حديث ومعقم بالكامل مع أفضل الإضافات ووسائل الراحة لتجربة VIP متميزة.",
        icon: History
      }
    ]
  },
  ur: {
    badge: "ہمارے بارے میں",
    title: "وی آئی پی سفر کے لیے آپ کی پہلی پسند",
    description: "ریاض لوکس ٹیکسی سعودی مہمان نوازی اور عالمی معیار کے لگژری ٹرانسپورٹیشن کا بہترین امتزاج ہے۔ ہم سعودی عرب میں عمرہ زائرین، بزنس ایگزیکٹوز اور خاندانی مسافروں کے لیے پہلے سے بک شدہ پریمیم ڈرائیور سروسز فراہم کرتے ہیں۔",
    stats: [
      { label: "لائسنس یافتہ ڈرائیور", value: "100%" },
      { label: "وی آئی پی سفر مکمل", value: "50k+" },
      { label: "سپورٹ دستک", value: "24/7" },
      { label: "بہترین سروس سال", value: "10+" }
    ],
    pillars: [
      {
        title: "مکمل اعتماد",
        description: "وقت کی سو فیصد پابندی۔ فلائٹ ٹریکنگ اور نماز کے اوقات سے ہم آہنگ سفر کی منصوبہ بندی۔",
        icon: ShieldCheck
      },
      {
        title: "منتخب ڈرائیورز کا دائرہ",
        description: "انتہائی تربیت یافتہ مقامی ماہرین، جو پبلک اتھارٹی کے معیارات سے تصدیق شدہ ہیں اور متعدد زبانیں بولتے ہیں۔",
        icon: Sparkles
      },
      {
        title: "زکوٰۃ و ٹیکس سے منظور شدہ",
        description: "وزارت ٹرانسپورٹ اور ZATCA کے الیکٹرانک انوائسنگ پروٹوکول کے تحت مکمل طور پر لائسنس یافتہ۔",
        icon: CheckCircle2
      },
      {
        title: "گاڑیوں کی بہترین دیکھ بھال",
        description: "صرف جدید، بے داغ گاڑیاں جو پریمیم انٹیریئر اور انفرادی درجہ حرارت کی ترتیبات سے لیس ہیں۔",
        icon: History
      }
    ]
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

export default function AboutPage() {
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

        {/* Stats Row */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {t.stats.map((item, idx) => (
            <motion.div
              key={item.label}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              className="rounded-2xl border border-[#C9A84C]/15 bg-[#121212]/50 p-6 text-center"
            >
              <p className="font-heading text-3xl font-bold text-[#C9A84C]">{item.value}</p>
              <p className="mt-2 text-xs uppercase tracking-widest text-[#A1A1A6] font-medium">{item.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Core Pillars Section */}
        <div className="mt-20">
          <div className="grid gap-8 md:grid-cols-2">
            {t.pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <motion.article
                  key={pillar.title}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeUp}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative group rounded-3xl border border-[#C9A84C]/15 bg-[#121212] p-8 shadow-2xl hover:border-[#C9A84C]/45 transition-all duration-300"
                >
                  <div className="flex gap-5">
                    {/* Icon */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C9A84C]/30 bg-black/40 text-[#C9A84C] shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="font-heading text-xl font-bold text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors">
                        {pillar.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-[#A1A1A6]">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
