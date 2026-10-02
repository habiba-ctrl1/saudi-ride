"use client";

import { useLanguage } from "@/lib/context/LanguageContext";
import { motion } from "framer-motion";
import { ShieldCheck, HelpCircle, Percent, RefreshCw } from "lucide-react";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { contactConfig } from "@/lib/config/contact";
import { MessageCircle } from "lucide-react";

const translations = {
  en: {
    badge: "Transparent Pricing",
    title: "Taxi Prices in Saudi Arabia — Clear Fares",
    description: "Pre-booked taxi rides across Saudi Arabia with your price confirmed on WhatsApp. Airport transfers, intercity rides, Umrah transfers, and hourly car hire. No surge pricing, no hidden fees.",
    
    // Get a Quote
    calcTitle: "Get an Instant Quote",
    calcSubtitle: "Select your route — get exact pricing on WhatsApp",
    labelFrom: "Starting City",
    labelTo: "Destination City",
    estPriceTitle: "Your Fare",
    estNotice: "Final pricing depends on your exact route, vehicle, date, passengers, and any waiting time — message us on WhatsApp for a clear, confirmed quote before you book.",
    bookBtn: "Proceed to Booking",

    // Trust Cards
    trustTitle: "The Taxi Saudi Arabia Price Guarantee",
    trustSubtitle: "Uncompromising premium standard commitments",
    trust: [
      { title: "Surge-Free Guarantee", desc: "No surge pricing during conventions, flight delays, sandstorms, or peak holiday travel.", icon: ShieldCheck },
      { title: "Confirmed Before You Book", desc: "Your fare is quoted and agreed on WhatsApp before booking — no meter, no surprise add-ons.", icon: Percent },
      { title: "Fair Cancellation", desc: "Free cancellation up to 24 hours before pickup.", icon: RefreshCw }
    ],

    // Pricing FAQs
    faqTitle: "Pricing Policies & FAQs",
    faqs: [
      { q: "Do you charge extra for airport parking or waiting time?", a: "Waiting time and any airport parking charges are confirmed with you on WhatsApp before booking, along with the rest of your fare — there's no separate hidden fee." },
      { q: "How are multi-city or multi-day journeys priced?", a: "Multi-day journeys are quoted individually on WhatsApp based on your route and schedule." },
      { q: "Are tips required for drivers?", a: "Tips are completely optional. Our drivers are fairly paid — you are never expected to tip, but it is always appreciated if you choose to." }
    ]
  },
  ar: {
    badge: "أسعار شفافة وثابتة",
    title: "تنقل فاخر. أسعار ثابتة ومحددة.",
    description: "خدمات التوصيل الفاخر مسبق الحجز بين المدن، واستقبال المطارات، والسائقين بالساعة بالمملكة. بدون زيادة مفاجئة وبدون رسوم خفية.",
    
    // Get a Quote
    calcTitle: "احصل على عرض سعر فوري",
    calcSubtitle: "حدد مسار رحلتك — السعر النهائي عبر واتساب",
    labelFrom: "مدينة الانطلاق",
    labelTo: "مدينة الوصول",
    estPriceTitle: "أجرتك",
    estNotice: "يعتمد السعر النهائي على مسارك الدقيق والسيارة والتاريخ وعدد الركاب ووقت الانتظار — راسلنا عبر واتساب للحصول على عرض سعر واضح ومؤكد قبل الحجز.",
    bookBtn: "الانتقال إلى صفحة الحجز",

    // Trust Cards
    trustTitle: "ضمان الأسعار من تاكسي السعودية",
    trustSubtitle: "التزامنا التام بالشفافية والرفاهية المطلقة",
    trust: [
      { title: "ضمان عدم الزيادة المفاجئة", desc: "لا توجد أسعار مرنة أو زيادة مفاجئة أثناء المؤتمرات أو تأخر الرحلات الجوية.", icon: ShieldCheck },
      { title: "السعر مؤكد قبل الحجز", desc: "يتم تأكيد أجرتك عبر واتساب قبل الحجز — بدون عداد وبدون إضافات مفاجئة.", icon: Percent },
      { title: "إلغاء عادل", desc: "إلغاء مجاني حتى 24 ساعة قبل موعد الاستقبال.", icon: RefreshCw }
    ],

    // Pricing FAQs
    faqTitle: "الأسئلة الشائعة حول الأسعار والتعرفة",
    faqs: [
      { q: "هل هناك رسوم إضافية على مواقف المطارات أو الانتظار؟", a: "يتم تأكيد وقت الانتظار وأي رسوم مواقف عبر واتساب قبل الحجز مع باقي تفاصيل الأجرة — لا توجد رسوم خفية منفصلة." },
      { q: "كيف يتم حساب أسعار الرحلات لعدة أيام؟", a: "يتم تسعير الرحلات متعددة الأيام بشكل فردي عبر واتساب حسب مسارك وجدولك." }
    ]
  },
  ur: {
    badge: "شفاف ریٹس",
    title: "شاندار سفر۔ فکسڈ ریٹس۔",
    description: "سعودی عرب میں پہلے سے بک شدہ پریمیم انٹرسٹی ٹرانسفر، ہوائی اڈے کی وی آئی پی شٹل اور ڈرائیور سروسز۔ کوئی اضافی چارجز نہیں ہیں۔",
    
    // Get a Quote
    calcTitle: "فوری قیمت حاصل کریں",
    calcSubtitle: "اپنا روٹ منتخب کریں — واٹس ایپ پر حتمی قیمت لیں",
    labelFrom: "روانگی کا شہر",
    labelTo: "منزل کا شہر",
    estPriceTitle: "آپ کا کرایہ",
    estNotice: "حتمی قیمت آپ کے صحیح روٹ، گاڑی، تاریخ، مسافروں اور انتظار کے وقت پر منحصر ہے — بکنگ سے پہلے واضح اور تصدیق شدہ قیمت کے لیے واٹس ایپ پر رابطہ کریں۔",
    bookBtn: "بکنگ کی طرف بڑھیں",

    // Trust Cards
    trustTitle: "ٹیکسی سعودی عرب ریٹس گارنٹی",
    trustSubtitle: "شفافیت اور پریمیم سروس کا ہمارا وعدہ",
    trust: [
      { title: "نو سرج پرائسنگ", desc: "کسی بھی فلائٹ تاخیر، طوفان یا چھٹیوں کے مصروف سیزن میں کرائے تبدیل نہیں ہوں گے۔", icon: ShieldCheck },
      { title: "بکنگ سے پہلے قیمت طے", desc: "آپ کا کرایہ بکنگ سے پہلے واٹس ایپ پر طے کیا جاتا ہے — کوئی میٹر یا اچانک اضافی چارج نہیں۔", icon: Percent },
      { title: "منصفانہ منسوخی", desc: "پک اپ سے 24 گھنٹے پہلے تک مفت منسوخی۔", icon: RefreshCw }
    ],

    // Pricing FAQs
    faqTitle: "ریٹس کے متعلق اکثر پوچھے گئے سوالات",
    faqs: [
      { q: "کیا ایئرپورٹ پارکنگ یا انتظار کا اضافی چارج ہے؟", a: "انتظار کا وقت اور کوئی بھی پارکنگ چارج بکنگ سے پہلے باقی کرائے کے ساتھ واٹس ایپ پر طے کیا جاتا ہے — کوئی علیحدہ پوشیدہ فیس نہیں۔" }
    ]
  }
};

const CITIES = [
  { key: "riyadh", labelEn: "Riyadh", labelAr: "الرياض", labelUr: "ریاض", lat: 24.7136, lng: 46.6753 },
  { key: "jeddah", labelEn: "Jeddah", labelAr: "جدة", labelUr: "جدہ", lat: 21.5433, lng: 39.1728 },
  { key: "makkah", labelEn: "Makkah", labelAr: "مكة المكرمة", labelUr: "مکہ", lat: 21.3891, lng: 39.8579 },
  { key: "madinah", labelEn: "Madinah", labelAr: "المدينة المنورة", labelUr: "مدینہ", lat: 24.5247, lng: 39.5692 },
  { key: "dammam", labelEn: "Dammam/Khobar", labelAr: "الدمام والخبر", labelUr: "دمام/خوبار", lat: 26.4207, lng: 50.0888 }
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

export default function PricingPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const [fromCity, setFromCity] = useState("riyadh");
  const [toCity, setToCity] = useState("jeddah");
  const [vehicleClass, setVehicleClass] = useState("sedan");

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pt-28 pb-16">
      
      {/* Entrance Hero text */}
      <section className="section-container">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="max-w-3xl text-center md:text-left"
        >
          <span className="t-eyebrow">
            {t.badge}
          </span>
          <h1 className="mt-4 font-heading text-4xl font-bold leading-tight md:text-5.5xl text-[#1C1C1C]">
            {t.title}
          </h1>
          <p className="mt-6 text-sm md:text-base leading-relaxed text-[#6B7280]">
            {t.description}
          </p>
        </motion.div>
      </section>

      {/* Dynamic pricing estimator widget */}
      <section className="section-container mt-14">
        <div className="rounded-3xl border border-[#16A34A]/15 bg-white p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-[#C9A84C]/5 blur-3xl pointer-events-none" />
          
          <div className="mb-8">
            <h2 className="font-heading text-2xl font-bold text-[#1C1C1C]">{t.calcTitle}</h2>
            <p className="text-xs text-[#C9A84C] font-semibold mt-1.5">{t.calcSubtitle}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            
            {/* From */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">{t.labelFrom}</label>
              <select
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full rounded-xl border border-[#16A34A]/12 bg-[#F0FDF4] px-4 py-3.5 text-xs text-[#1C1C1C] focus:border-[#C9A84C] focus:outline-none transition-colors"
              >
                {CITIES.map((c) => (
                  <option key={c.key} value={c.key} className="bg-white">
                    {language === "ar" ? c.labelAr : c.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* To */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">{t.labelTo}</label>
              <select
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full rounded-xl border border-[#16A34A]/12 bg-[#F0FDF4] px-4 py-3.5 text-xs text-[#1C1C1C] focus:border-[#C9A84C] focus:outline-none transition-colors"
              >
                {CITIES.map((c) => (
                  <option key={c.key} value={c.key} className="bg-white">
                    {language === "ar" ? c.labelAr : c.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle Class */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">Select Vehicle Class</label>
              <select
                value={vehicleClass}
                onChange={(e) => {
                  const val = e.target.value;
                  setVehicleClass(val);
                  trackEvent("vehicle_selected", {
                    vehicleClass: val,
                    sourceContext: "pricing_calculator"
                  });
                }}
                className="w-full rounded-xl border border-[#16A34A]/12 bg-[#F0FDF4] px-4 py-3.5 text-xs text-[#1C1C1C] focus:border-[#C9A84C] focus:outline-none transition-colors"
              >
                <option value="sedan" className="bg-white">Executive Sedan (Camry)</option>
                <option value="suv" className="bg-white">Premium SUV (Yukon XL)</option>
                <option value="luxury" className="bg-white">Luxury VIP Sedan (S-Class)</option>
                <option value="van" className="bg-white">VIP Family Van (Staria)</option>
              </select>
            </div>

          </div>

          {/* Calculator Output Display */}
          <div className="mt-8 border-t border-[#C9A84C]/10 pt-8 grid gap-6 md:grid-cols-[1fr_auto] items-center">
            <div className="space-y-4">
              <p className="text-[10px] text-[#6B7280] leading-relaxed max-w-xl">{t.estNotice}</p>
            </div>

            <div className="text-center md:text-right space-y-4 shrink-0">
              <div>
                <span className="text-[0.6rem] uppercase tracking-widest text-[#C9A84C] font-bold block mb-1">{t.estPriceTitle}</span>
                <span className="font-heading text-xl font-extrabold text-[#C9A84C]">
                  {language === "ar" ? "يُؤكَّد عبر واتساب" : "Confirmed on WhatsApp"}
                </span>
              </div>
              <a
                href={`${contactConfig.whatsappLink}?text=${encodeURIComponent(
                  (language === "ar"
                    ? `السلام عليكم، أرغب بعرض سعر:\n\n• من: ${CITIES.find((c) => c.key === fromCity)?.labelAr}\n• إلى: ${CITIES.find((c) => c.key === toCity)?.labelAr}\n• نوع السيارة: ${vehicleClass}\n• التاريخ والوقت: `
                    : `Salam! I'd like a quote:\n\n• From: ${CITIES.find((c) => c.key === fromCity)?.labelEn}\n• To: ${CITIES.find((c) => c.key === toCity)?.labelEn}\n• Vehicle: ${vehicleClass}\n• Date & time: `)
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent("lead_captured", {
                    source: "pricing_page",
                    fromCity,
                    toCity,
                    vehicleClass,
                    locale: language,
                  });
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-[#16A34A] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#15803D] transition-colors shadow-lg"
              >
                <MessageCircle className="h-3.5 w-3.5 fill-current" />
                <span>{language === "ar" ? "احصل على السعر عبر واتساب" : "Get Price on WhatsApp"}</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Price Guarantee Trust badges */}
      <section className="section-container mt-24">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="t-eyebrow">{t.trustSubtitle}</span>
          <h2 className="mt-2 font-heading text-3xl md:text-4xl font-bold text-[#1C1C1C]">{t.trustTitle}</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {t.trust.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-3xl border border-[#C9A84C]/10 bg-white p-8 text-center space-y-4 hover:border-[#C9A84C]/30 transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] mx-auto">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-lg font-bold text-[#1C1C1C]">{card.title}</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">{card.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Pricing specific FAQs */}
      <section className="section-container mt-24 mb-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-heading text-3xl font-bold text-[#1C1C1C]">{t.faqTitle}</h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {t.faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group rounded-2xl border border-[#16A34A]/12 bg-white p-5 transition-all hover:border-[#C9A84C]/30"
            >
              <summary className="cursor-pointer font-heading text-sm md:text-base font-semibold text-[#1C1C1C] group-open:text-[#C9A84C] list-none flex items-center justify-between focus:outline-none select-none">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-4.5 w-4.5 text-[#C9A84C] shrink-0" />
                  <span>{faq.q}</span>
                </div>
                <span className="text-xs text-[#C9A84C] transition-transform duration-300 group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-4 text-xs md:text-sm leading-relaxed text-[#6B7280] border-t border-[#C9A84C]/8 pt-4 font-sans">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

    </div>
  );
}
