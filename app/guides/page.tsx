"use client";

import { useLanguage } from "@/lib/context/LanguageContext";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

const translations = {
  en: {
    badge: "Traveler Knowledge Base",
    title: "Latest travel guides for pilgrims & visitors",
    description: "Practical insights, local regulation breakdowns, and advice from our concierge team to ensure an absolute smooth and serene travel experience in Saudi Arabia.",
    readTime: "5 min read",
    btnLabel: "Read Guide Article",
    guides: [
      {
        title: "SIM Card buying guide at Jeddah Airport",
        summary: "Exactly where to purchase local 5G eSIMs/SIMs from stc, Mobily, or Zain upon landing at Terminal 1 or North Terminal.",
        date: "May 12, 2026"
      },
      {
        title: "Complete Meeqat locations guide for Umrah",
        summary: "Step-by-step guidance on Meeqat points (including Dhul Hulaifah & Yalamlam) for international pilgrims arriving by air or road.",
        date: "May 08, 2026"
      },
      {
        title: "Saudi Riyal cash & card tips for pilgrims",
        summary: "Everything about card acceptance, local mada payment network, currency exchange outlets, and ATM fee limits in KSA.",
        date: "April 29, 2026"
      }
    ]
  },
  ar: {
    badge: "أدلة السفر والمعرفة",
    title: "أحدث الإرشادات لزوار ومعتمري المملكة",
    description: "معلومات عملية، وشروحات للأنظمة المحلية، ونصائح قيمة من فريق الكونسيرج لضمان رحلة مريحة وهادئة تماماً في المملكة.",
    readTime: "قراءة 5 دقائق",
    btnLabel: "اقرأ الدليل الكامل",
    guides: [
      {
        title: "دليل شراء بطاقات الاتصال SIM في مطار جدة",
        summary: "أين بالضبط تشتري شرائح الاتصال المحلية eSIM/SIM من شركات stc، وموبايلي، وزين فور وصولك لصالة المطار.",
        date: "١٢ مايو ٢٠٢٦"
      },
      {
        title: "دليل مواقيت الإحرام الكامل للمعتمرين",
        summary: "شرح تفصيلي خطوة بخطوة لمواقيت الإحرام (بما في ذلك ذو الحليفة ويلملم) للحجاج والمعتمرين القادمين جواً أو براً.",
        date: "٠٨ مايو ٢٠٢٦"
      },
      {
        title: "نصائح الكاش والبطاقات للمعتمرين في السعودية",
        summary: "كل ما تحتاج لمعرفته حول قبول بطاقات الائتمان، شبكة مدى المحلية، منافذ الصرافة ورسوم السحب من أجهزة الصراف الآلي.",
        date: "٢٩ أبريل ٢٠٢٦"
      }
    ]
  },
  ur: {
    badge: "ٹریول نالج بیس",
    title: "زائرین اور سیاحوں کے لیے تازہ ترین گائیڈز",
    description: "سعودی عرب میں سفر کو انتہائی ہموار اور پرسکون بنانے کے لیے ہماری دربان ٹیم کی طرف سے عملی معلومات اور مشورے۔",
    readTime: "5 منٹ مطالعہ",
    btnLabel: "مکمل گائیڈ پڑھیں",
    guides: [
      {
        title: "جدہ ایئرپورٹ پر سم کارڈ خریدنے کا گائیڈ",
        summary: "ٹرمینل 1 پر لینڈنگ کے بعد stc، Mobily، یا Zain سے مقامی 5G eSIMs/SIMs خریدنے کی درست جگہوں کی معلومات۔",
        date: "12 مئی 2026"
      },
      {
        title: "عمرہ کے لیے میقات کے مقامات کی مکمل گائیڈ",
        summary: "فضائی یا زمینی راستے سے آنے والے بین الاقوامی زائرین کے لیے میقات کے مقامات (بشمول ذوالحلیفہ اور یلملم) پر تفصیلی رہنمائی۔",
        date: "08 مئی 2026"
      },
      {
        title: "زائرین کے لیے سعودی ریال کیش اور کارڈ کی تجاویز",
        summary: "کارڈز کی قبولیت، مقامی mada پیمنٹ نیٹ ورک، کرنسی ایکسچینج اور اے ٹی ایم فیس کی حدود کے بارے میں سب کچھ۔",
        date: "29 اپریل 2026"
      }
    ]
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

export default function GuidesPage() {
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

        {/* Dynamic Guides Grid */}
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {t.guides.map((guide, index) => (
            <motion.article
              key={guide.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative flex flex-col justify-between rounded-3xl border border-[#C9A84C]/15 bg-[#121212] p-8 shadow-2xl hover:border-[#C9A84C]/45 transition-all duration-300"
              whileHover={{ y: -6 }}
            >
              {/* gold accent overlay glow */}
              <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[#C9A84C]/5 blur-2xl pointer-events-none" />

              <div>
                {/* Meta details */}
                <div className="flex items-center justify-between text-[0.65rem] text-[#A1A1A6] font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#C9A84C]" />
                    <span>{guide.date}</span>
                  </div>
                  <span className="rounded-full bg-black/40 px-2.5 py-1 border border-[#C9A84C]/10 text-[#C9A84C]">
                    {t.readTime}
                  </span>
                </div>

                <h2 className="mt-5 font-heading text-xl font-bold text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors leading-snug">
                  {guide.title}
                </h2>
                
                <p className="mt-4 text-xs leading-relaxed text-[#A1A1A6]">
                  {guide.summary}
                </p>
              </div>

              {/* Bottom Action */}
              <div className="mt-8 border-t border-[#C9A84C]/10 pt-5">
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:underline"
                >
                  <span>{t.btnLabel}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
