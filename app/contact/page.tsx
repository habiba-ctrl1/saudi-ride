"use client";

import { useLanguage } from "@/lib/context/LanguageContext";
import { motion } from "framer-motion";
import { Phone, Mail, MessageSquare } from "lucide-react";
import { contactConfig } from "@/lib/config/contact";

const translations = {
  en: {
    badge: "Contact Concierge Desk",
    title: "Speak with our private booking desk",
    description: "Available 24/7 for airport, Umrah, and custom intercity reservations across the Kingdom and neighboring GCC corridors.",
    cards: [
      {
        title: "Primary Phone Desk",
        value: contactConfig.primaryPhoneDisplay,
        link: contactConfig.primaryPhoneLink,
        badge: "Call 24/7 Support",
        icon: Phone
      },
      {
        title: "Official Email Inquiry",
        value: contactConfig.email,
        link: contactConfig.emailLink,
        badge: "Send RFP / Proposal",
        icon: Mail
      },
      {
        title: "VIP WhatsApp Chat",
        value: "Start Booking Chat",
        link: contactConfig.whatsappLink,
        badge: "Fast Instant Booking",
        icon: MessageSquare
      }
    ]
  },
  ar: {
    badge: "مكتب الحجز الفاخر",
    title: "تحدث مع مكتب الحجوزات المباشر",
    description: "متاحون على مدار الساعة لخدمتكم وتلبية طلبات الحجز للمطارات، والعمرة، والتنقل الفاخر والسريع بين المدن ودول الخليج.",
    cards: [
      {
        title: "هاتف الحجز المباشر",
        value: contactConfig.primaryPhoneDisplay,
        link: contactConfig.primaryPhoneLink,
        badge: "اتصال مباشر 24/7",
        icon: Phone
      },
      {
        title: "البريد الإلكتروني الرسمي",
        value: contactConfig.email,
        link: contactConfig.emailLink,
        badge: "إرسال طلبات وعروض",
        icon: Mail
      },
      {
        title: "دردشة واتساب VIP",
        value: "ابدأ محادثة الحجز",
        link: contactConfig.whatsappLink,
        badge: "حجز فوري سريع",
        icon: MessageSquare
      }
    ]
  },
  ur: {
    badge: "بکنگ کنسیرج ڈیسک",
    title: "ہمارے نجی بکنگ ڈیسک سے رابطہ کریں",
    description: "ہوائی اڈے، عمرہ اور انٹرسٹی سفر کی بکنگ کے لیے مملکت اور جی سی سی کوریڈورز میں 24/7 دستیاب ہیں۔",
    cards: [
      {
        title: "بنیادی فون ڈیسک",
        value: contactConfig.primaryPhoneDisplay,
        link: contactConfig.primaryPhoneLink,
        badge: "کال کریں 24/7 سپورٹ",
        icon: Phone
      },
      {
        title: "آفیشل ای میل انکوائری",
        value: contactConfig.email,
        link: contactConfig.emailLink,
        badge: "تجاویز بھیجیں",
        icon: Mail
      },
      {
        title: "وی آئی پی واٹس ایپ چیٹ",
        value: "فوری بکنگ چیٹ",
        link: contactConfig.whatsappLink,
        badge: "فوری اور تیز بکنگ",
        icon: MessageSquare
      }
    ]
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

export default function ContactPage() {
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

        {/* Dynamic Contact Grid Cards */}
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {t.cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.a
                key={card.title}
                href={card.link}
                target={card.title.includes("WhatsApp") || card.title.includes("واتساب") ? "_blank" : undefined}
                rel={card.title.includes("WhatsApp") || card.title.includes("واتساب") ? "noopener noreferrer" : undefined}
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

                <div className="space-y-6">
                  {/* Category Icon */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C9A84C]/35 bg-black/40 text-[#C9A84C] shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-[0.6rem] uppercase tracking-[0.18em] text-[#C9A84C] font-bold">
                      {card.badge}
                    </span>
                    <h2 className="font-heading text-xl font-bold text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors">
                      {card.title}
                    </h2>
                  </div>
                </div>

                <div className="mt-8 border-t border-[#C9A84C]/10 pt-5 text-sm font-semibold tracking-wide text-[#F5F0E8]">
                  {card.value}
                </div>
              </motion.a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
