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

    // Matrices
    matrixTitle: "Service Matrix vs Vehicle Tier",
    matrixSubtitle: "Standard flat rates starting values in SAR",
    cols: ["Vehicle Class", "Airport Transfer", "Intercity (per KM)", "Hourly (Min 4 hrs)", "Umrah Pilgrim Transit"],

    // Fixed Rates
    fixedTitle: "Popular Intercity Fixed Rates",
    fixedSubtitle: "Pre-calculated executive flat rates",
    routeCol: "Travel Route Corridor",
    sedanCol: "Executive Sedan (Camry)",
    suvCol: "Premium SUV (Yukon)",
    luxuryCol: "VIP Sedan (S-Class)",

    // Trust Cards
    trustTitle: "The Taxi Saudi Arabia Price Guarantee",
    trustSubtitle: "Uncompromising premium standard commitments",
    trust: [
      { title: "Surge-Free Guarantee", desc: "No surge pricing during conventions, flight delays, sandstorms, or peak holiday travel.", icon: ShieldCheck },
      { title: "100% All-Inclusive", desc: "VAT, municipality tax, toll gates (DARB/Salik equivalent), parking, and driver refreshments are included.", icon: Percent },
      { title: "Fair Cancellation", desc: "Free cancellations or modifications up to 24 hours prior to travel. Immediate full refund.", icon: RefreshCw }
    ],

    // Pricing FAQs
    faqTitle: "Pricing Policies & FAQs",
    faqs: [
      { q: "Do you charge extra for airport parking or waiting time?", a: "No. All airport transfers include up to 60 minutes of complimentary waiting time and include all airport terminal parking fees." },
      { q: "How are multi-city or multi-day journeys priced?", a: "Multi-day travel packages are custom-quoted by our VIP desk. Standard long distance intercity transfers follow our flat rates." },
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

    // Matrices
    matrixTitle: "مصفوفة الخدمات مقابل فئة السيارة",
    matrixSubtitle: "الحد الأدنى لأسعار الخدمات بالريال السعودي (SAR)",
    cols: ["فئة السيارة", "توصيل المطار", "بين المدن (لكل كم)", "بالساعة (حد أدنى 4 س)", "تنقلات العمرة والزيارة"],

    // Fixed Rates
    fixedTitle: "أسعار ثابتة للمسارات الشهيرة",
    fixedSubtitle: "تعرفة ثابتة ومحددة مسبقاً لأكثر الوجهات طلباً",
    routeCol: "خط سير الرحلة",
    sedanCol: "سيدان تنفيذي (كامري)",
    suvCol: "عائلية فاخرة (يوكن XL)",
    luxuryCol: "VIP سيدان (S-Class)",

    // Trust Cards
    trustTitle: "ضمان الأسعار من رياض لوكس",
    trustSubtitle: "التزامنا التام بالشفافية والرفاهية المطلقة",
    trust: [
      { title: "ضمان عدم الزيادة المفاجئة", desc: "لا توجد أسعار مرنة أو زيادة مفاجئة أثناء المؤتمرات أو تأخر الرحلات الجوية.", icon: ShieldCheck },
      { title: "أسعار شاملة بنسبة 100%", desc: "تشمل ضريبة القيمة المضافة، ورسوم الطرق، ومواقف المطارات، ومرطبات الركاب.", icon: Percent },
      { title: "إلغاء مرن وعادل", desc: "إلغاء مجاني بالكامل وتعديل غير محدود حتى 24 ساعة قبل الرحلة مع استرداد فوري.", icon: RefreshCw }
    ],

    // Pricing FAQs
    faqTitle: "الأسئلة الشائعة حول الأسعار والتعرفة",
    faqs: [
      { q: "هل هناك رسوم إضافية على مواقف المطارات أو الانتظار؟", a: "لا. تشمل جميع حجوزات المطارات وقت انتظار مجاني يصل إلى 60 دقيقة وتغطي كافة رسوم مواقف سيارات الصالة." },
      { q: "كيف يتم حساب أسعار الرحلات لعدة أيام؟", a: "يتم تسعير الرحلات متعددة الأيام بشكل خاص عبر مكتب كونسيرج الخدمة لتوفير أفضل تعرفة اقتصادية فاخرة." }
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

    // Matrices
    matrixTitle: "گاڑی کی کیٹیگری بمقابلہ سروس ریٹ",
    matrixSubtitle: "سعودی ریال (SAR) میں شروعاتی ریٹس",
    cols: ["گاڑی کی فئة", "ایئرپورٹ ٹرانسفر", "انٹرسٹی (فی کلومیٹر)", "فی گھنٹہ (کم از کم 4 گھنٹے)", "عمرہ ٹرانزٹ"],

    // Fixed Rates
    fixedTitle: "مقبول ترین شہروں کے فکسڈ ریٹس",
    fixedSubtitle: "پہلے سے طے شدہ پریمیم فلیٹ ریٹس",
    routeCol: "سفری روٹ",
    sedanCol: "ایگزیکٹو سیڈان (Camry)",
    suvCol: "پریمیم ایس یو وی (Yukon)",
    luxuryCol: "وی آئی پی سیڈان (S-Class)",

    // Trust Cards
    trustTitle: "ریاض لوکس ریٹس گارنٹی",
    trustSubtitle: "شفافیت اور پریمیم سروس کا ہمارا وعدہ",
    trust: [
      { title: "نو سرج پرائسنگ", desc: "کسی بھی فلائٹ تاخیر، طوفان یا چھٹیوں کے مصروف سیزن میں کرائے تبدیل نہیں ہوں گے۔", icon: ShieldCheck },
      { title: "100٪ ہر چیز شامل ہے", desc: "ٹول گیٹس، پارکنگ، ڈرائیور ریفریشمنٹس اور تمام ٹیکس ریٹس میں شامل ہیں۔", icon: Percent },
      { title: "آسان منسوخی", desc: "سفر شروع ہونے سے 24 گھنٹے پہلے تک منسوخی پر فوری اور مکمل رقم کی واپسی۔", icon: RefreshCw }
    ],

    // Pricing FAQs
    faqTitle: "ریٹس کے متعلق اکثر پوچھے گئے سوالات",
    faqs: [
      { q: "کیا ایئرپورٹ پارکنگ یا انتظار کا اضافی چارج ہے؟", a: "جی نہیں، ایئرپورٹ بکنگ میں 60 منٹ تک مفت انتظار اور پارکنگ فیس مکمل شامل ہے۔" }
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
          <span className="text-xs uppercase tracking-[0.2em] text-[#B8963B] font-semibold">
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
          <span className="text-xs uppercase tracking-[0.2em] text-[#B8963B] font-semibold">{t.trustSubtitle}</span>
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
