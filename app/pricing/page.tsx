"use client";

import { useLanguage } from "@/lib/context/LanguageContext";
import { motion } from "framer-motion";
import { ShieldCheck, HelpCircle, ArrowRight, Percent, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

const translations = {
  en: {
    badge: "Transparent Rates",
    title: "Executive Luxury. Fixed Pricing.",
    description: "Premium pre-booked intercity transfers, airport VIP shuttles, and hourly charters across Saudi Arabia. Zero surge. Zero hidden fees.",
    
    // Dynamic Calculator
    calcTitle: "Dynamic Fare Estimator",
    calcSubtitle: "Select your route to estimate luxury fares",
    labelFrom: "Starting City",
    labelTo: "Destination City",
    labelDistance: "Estimated Route Distance",
    labelDuration: "Approximate Transit Duration",
    estPriceTitle: "All-Inclusive Fixed Fare",
    estNotice: "Rates include professional chauffeur, fuel, toll gates, airport parking fees, and VAT. No additional charge.",
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
    trustTitle: "The Riyadh Luxe Price Guarantee",
    trustSubtitle: "Uncompromising premium standard commitments",
    trust: [
      { title: "Surge-Free Guarantee", desc: "No surge pricing during conventions, flight delays, sandstorms, or peak holiday travel.", icon: ShieldCheck },
      { title: "100% All-Inclusive", desc: "VAT, municipality tax, toll gates (DARB/Salik equivalent), parking, and driver refreshments are included.", icon: Percent },
      { title: "Fair Cancellation", desc: "Free cancellations or modifications up to 24 hours prior to travel. Immediate full refund.", icon: RefreshCw }
    ],

    // Pricing FAQs
    faqTitle: "Pricing Policies & FAQs",
    faqs: [
      { q: "Do you charge extra for airport parking or waiting time?", a: "No. All airport transfers include up to 90 minutes of complimentary waiting time and include all airport terminal parking fees." },
      { q: "How are multi-city or multi-day journeys priced?", a: "Multi-day travel packages are custom-quoted by our VIP desk. Standard long distance intercity transfers follow our flat rates." },
      { q: "Are tips or gratuities required for chauffeurs?", a: "Tips are entirely at your discretion. Chauffeurs are fully compensated under our premium employee circle protocols." }
    ]
  },
  ar: {
    badge: "أسعار شفافة وثابتة",
    title: "تنقل فاخر. أسعار ثابتة ومحددة.",
    description: "خدمات التوصيل الفاخر مسبق الحجز بين المدن، واستقبال المطارات، والسائقين بالساعة بالمملكة. بدون زيادة مفاجئة وبدون رسوم خفية.",
    
    // Dynamic Calculator
    calcTitle: "حاسبة الأسعار التقديرية المباشرة",
    calcSubtitle: "حدد مسار رحلتك للحصول على السعر الفوري",
    labelFrom: "مدينة الانطلاق",
    labelTo: "مدينة الوصول",
    labelDistance: "المسافة التقريبية للرحلة",
    labelDuration: "الزمن التقريبي للرحلة",
    estPriceTitle: "السعر النهائي الثابت والشامل",
    estNotice: "الأسعار تشمل السائق المحترف، والوقود، ورسوم الطرق، ومواقف السيارات بالمطار، وضريبة القيمة المضافة.",
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
      { q: "هل هناك رسوم إضافية على مواقف المطارات أو الانتظار؟", a: "لا. تشمل جميع حجوزات المطارات وقت انتظار مجاني يصل إلى 90 دقيقة وتغطي كافة رسوم مواقف سيارات الصالة." },
      { q: "كيف يتم حساب أسعار الرحلات لعدة أيام؟", a: "يتم تسعير الرحلات متعددة الأيام بشكل خاص عبر مكتب كونسيرج الخدمة لتوفير أفضل تعرفة اقتصادية فاخرة." }
    ]
  },
  ur: {
    badge: "شفاف ریٹس",
    title: "شاندار سفر۔ فکسڈ ریٹس۔",
    description: "سعودی عرب میں پہلے سے بک شدہ پریمیم انٹرسٹی ٹرانسفر، ہوائی اڈے کی وی آئی پی شٹل اور ڈرائیور سروسز۔ کوئی اضافی چارجز نہیں ہیں۔",
    
    // Dynamic Calculator
    calcTitle: "لائیو کرایہ کیلکولیٹر",
    calcSubtitle: "فوری اور درست کرایہ جاننے کے لیے شہر منتخب کریں",
    labelFrom: "روانگی کا شہر",
    labelTo: "منزل کا شہر",
    labelDistance: "تقریبا فاصلہ",
    labelDuration: "تقریبا وقت",
    estPriceTitle: "کل فکسڈ کرایہ (شامل تمام ٹیکس)",
    estNotice: "ریٹس میں ڈرائیور، ایندھن، ٹولز، ایئرپورٹ پارکنگ اور وی اے ٹی شامل ہیں۔ کوئی پوشیدہ چارجز نہیں ہیں۔",
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
      { q: "کیا ایئرپورٹ پارکنگ یا انتظار کا اضافی چارج ہے؟", a: "جی نہیں، ایئرپورٹ بکنگ میں 90 منٹ تک مفت انتظار اور پارکنگ فیس مکمل شامل ہے۔" }
    ]
  }
};

const MATRIX_DATA = [
  { class: "Executive Sedan (Camry)", airport: "150 SAR", km: "2.5 SAR", hourly: "70 SAR", umrah: "450 SAR" },
  { class: "Premium SUV (Yukon XL)", airport: "250 SAR", km: "3.5 SAR", hourly: "120 SAR", umrah: "700 SAR" },
  { class: "Luxury VIP Sedan (S-Class)", airport: "600 SAR", km: "7.0 SAR", hourly: "250 SAR", umrah: "1800 SAR" },
  { class: "VIP Family Van (Staria)", airport: "300 SAR", km: "4.0 SAR", hourly: "140 SAR", umrah: "800 SAR" }
];

const FIXED_ROUTES = [
  { route: "Riyadh Airport ⇄ Olaya (City Center)", sedan: "150 SAR", suv: "250 SAR", luxury: "600 SAR" },
  { route: "Jeddah Airport ⇄ Makkah Hotels", sedan: "450 SAR", suv: "700 SAR", luxury: "1800 SAR" },
  { route: "Makkah Hotels ⇄ Madinah Hotels", sedan: "850 SAR", suv: "1300 SAR", luxury: "3200 SAR" },
  { route: "Riyadh ⇄ Eastern Province (Dammam/Khobar)", sedan: "950 SAR", suv: "1500 SAR", luxury: "3800 SAR" },
  { route: "Madinah Airport ⇄ Madinah Haram Hotels", sedan: "180 SAR", suv: "280 SAR", luxury: "750 SAR" }
];

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

  // Dynamic distance calculation mock
  const cityCoords: Record<string, { lat: number; lng: number }> = {
    riyadh: { lat: 24.7136, lng: 46.6753 },
    jeddah: { lat: 21.5433, lng: 39.1728 },
    makkah: { lat: 21.3891, lng: 39.8579 },
    madinah: { lat: 24.5247, lng: 39.5692 },
    dammam: { lat: 26.4207, lng: 50.0888 }
  };

  const getDistance = (c1: string, c2: string) => {
    if (c1 === c2) return 25; // City local driving mock
    const coords1 = cityCoords[c1];
    const coords2 = cityCoords[c2];
    
    // Haversine formula calculation
    const R = 6371; // km
    const dLat = ((coords2.lat - coords1.lat) * Math.PI) / 180;
    const dLon = ((coords2.lng - coords1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coords1.lat * Math.PI) / 180) *
        Math.cos((coords2.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const distance = getDistance(fromCity, toCity);
  const duration = Math.round(distance / 90 * 60); // approx minutes based on 90km/h average

  const getPrice = () => {
    let perKm = 2.5;
    let base = 150;
    if (vehicleClass === "suv") { perKm = 3.5; base = 250; }
    if (vehicleClass === "luxury") { perKm = 7.0; base = 600; }
    if (vehicleClass === "van") { perKm = 4.0; base = 300; }

    const isLocal = fromCity === toCity;
    const rawPrice = isLocal ? base : distance * perKm + base;
    return Math.round(rawPrice);
  };

  const calculatedPrice = getPrice();

  useEffect(() => {
    trackEvent("price_calculated", {
      fromCity,
      toCity,
      distanceKm: distance,
      estimatedPriceSar: calculatedPrice,
      vehicleClass
    });
  }, [fromCity, toCity, distance, calculatedPrice, vehicleClass]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-28 pb-16">
      
      {/* Entrance Hero text */}
      <section className="section-container">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="max-w-3xl text-center md:text-left"
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
      </section>

      {/* Dynamic pricing estimator widget */}
      <section className="section-container mt-14">
        <div className="rounded-3xl border border-[#C9A84C]/20 bg-[#121212] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-[#C9A84C]/5 blur-3xl pointer-events-none" />
          
          <div className="mb-8">
            <h2 className="font-heading text-2xl font-bold text-[#F5F0E8]">{t.calcTitle}</h2>
            <p className="text-xs text-[#C9A84C] font-semibold mt-1.5">{t.calcSubtitle}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            
            {/* From */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[#A1A1A6] font-semibold">{t.labelFrom}</label>
              <select
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full rounded-xl border border-[#C9A84C]/15 bg-black/40 px-4 py-3.5 text-xs text-[#F5F0E8] focus:border-[#C9A84C] focus:outline-none transition-colors"
              >
                {CITIES.map((c) => (
                  <option key={c.key} value={c.key} className="bg-[#121212]">
                    {language === "ar" ? c.labelAr : language === "ur" ? c.labelUr : c.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* To */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[#A1A1A6] font-semibold">{t.labelTo}</label>
              <select
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full rounded-xl border border-[#C9A84C]/15 bg-black/40 px-4 py-3.5 text-xs text-[#F5F0E8] focus:border-[#C9A84C] focus:outline-none transition-colors"
              >
                {CITIES.map((c) => (
                  <option key={c.key} value={c.key} className="bg-[#121212]">
                    {language === "ar" ? c.labelAr : language === "ur" ? c.labelUr : c.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle Class */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[#A1A1A6] font-semibold">Select Vehicle Class</label>
              <select
                value={vehicleClass}
                onChange={(e) => {
                  const val = e.target.value;
                  setVehicleClass(val);
                  trackEvent("vehicle_selected", {
                    vehicleClass: val,
                    priceSar: calculatedPrice,
                    sourceContext: "pricing_calculator"
                  });
                }}
                className="w-full rounded-xl border border-[#C9A84C]/15 bg-black/40 px-4 py-3.5 text-xs text-[#F5F0E8] focus:border-[#C9A84C] focus:outline-none transition-colors"
              >
                <option value="sedan" className="bg-[#121212]">Executive Sedan (Camry)</option>
                <option value="suv" className="bg-[#121212]">Premium SUV (Yukon XL)</option>
                <option value="luxury" className="bg-[#121212]">Luxury VIP Sedan (S-Class)</option>
                <option value="van" className="bg-[#121212]">VIP Family Van (Staria)</option>
              </select>
            </div>

          </div>

          {/* Calculator Output Display */}
          <div className="mt-8 border-t border-[#C9A84C]/10 pt-8 grid gap-6 md:grid-cols-[1fr_auto] items-center">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-6 text-xs text-[#A1A1A6] font-medium">
                <div>{t.labelDistance}: <span className="text-[#F5F0E8] font-bold">{distance} KM</span></div>
                <div>{t.labelDuration}: <span className="text-[#F5F0E8] font-bold">{Math.floor(duration / 60)}h {duration % 60}m</span></div>
              </div>
              <p className="text-[10px] text-[#7C8088] leading-relaxed max-w-xl">{t.estNotice}</p>
            </div>

            <div className="text-center md:text-right space-y-4 shrink-0">
              <div>
                <span className="text-[0.6rem] uppercase tracking-widest text-[#C9A84C] font-bold block mb-1">{t.estPriceTitle}</span>
                <span className="font-heading text-4xl font-extrabold text-[#C9A84C]">{calculatedPrice} <span className="text-lg">SAR</span></span>
              </div>
              <Link
                href={`/book?from=${fromCity}&to=${toCity}&class=${vehicleClass}`}
                onClick={() => {
                  trackEvent("booking_started", {
                    fromCity,
                    toCity,
                    vehicleClass,
                    locale: language
                  });
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-[#C9A84C] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] hover:bg-[#B8963B] transition-colors shadow-lg"
              >
                <span>{t.bookBtn}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Service category pricing comparisons Matrix */}
      <section className="section-container mt-24">
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-semibold">{t.matrixSubtitle}</span>
          <h2 className="mt-2 font-heading text-3xl font-bold text-[#F5F0E8]">{t.matrixTitle}</h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#C9A84C]/15 bg-[#111111]">
          <table className="w-full text-left border-collapse min-w-[700px] text-xs">
            <thead>
              <tr className="border-b border-[#C9A84C]/25 bg-black/40 text-[#C9A84C] font-bold">
                {t.cols.map((col, idx) => (
                  <th key={idx} className="p-5">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C9A84C]/8 font-medium">
              {MATRIX_DATA.map((row, index) => (
                <tr key={index} className="hover:bg-white/2 transition-colors">
                  <td className="p-5 font-bold text-[#F5F0E8]">{row.class}</td>
                  <td className="p-5 text-[#A1A1A6]">{row.airport}</td>
                  <td className="p-5 text-[#A1A1A6]">{row.km}</td>
                  <td className="p-5 text-[#A1A1A6]">{row.hourly}</td>
                  <td className="p-5 text-[#C9A84C] font-semibold">{row.umrah}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Fixed intercity route tables */}
      <section className="section-container mt-24">
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-semibold">{t.fixedSubtitle}</span>
          <h2 className="mt-2 font-heading text-3xl font-bold text-[#F5F0E8]">{t.fixedTitle}</h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#C9A84C]/15 bg-[#111111]">
          <table className="w-full text-left border-collapse min-w-[700px] text-xs">
            <thead>
              <tr className="border-b border-[#C9A84C]/25 bg-black/40 text-[#C9A84C] font-bold">
                <th className="p-5">{t.routeCol}</th>
                <th className="p-5">{t.sedanCol}</th>
                <th className="p-5">{t.suvCol}</th>
                <th className="p-5">{t.luxuryCol}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C9A84C]/8 font-medium text-[#A1A1A6]">
              {FIXED_ROUTES.map((route, index) => (
                <tr key={index} className="hover:bg-white/2 transition-colors">
                  <td className="p-5 font-bold text-[#F5F0E8]">{route.route}</td>
                  <td className="p-5">{route.sedan}</td>
                  <td className="p-5">{route.suv}</td>
                  <td className="p-5 text-[#C9A84C] font-bold">{route.luxury}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Price Guarantee Trust badges */}
      <section className="section-container mt-24">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-semibold">{t.trustSubtitle}</span>
          <h2 className="mt-2 font-heading text-3xl md:text-4xl font-bold text-[#F5F0E8]">{t.trustTitle}</h2>
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
                className="rounded-3xl border border-[#C9A84C]/10 bg-[#111111] p-8 text-center space-y-4 hover:border-[#C9A84C]/30 transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] mx-auto">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-lg font-bold text-[#F5F0E8]">{card.title}</h3>
                <p className="text-xs text-[#A1A1A6] leading-relaxed">{card.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Pricing specific FAQs */}
      <section className="section-container mt-24 mb-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-heading text-3xl font-bold text-[#F5F0E8]">{t.faqTitle}</h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {t.faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group rounded-2xl border border-[#C9A84C]/15 bg-[#121212] p-5 transition-all hover:border-[#C9A84C]/30"
            >
              <summary className="cursor-pointer font-heading text-sm md:text-base font-semibold text-[#F5F0E8] group-open:text-[#C9A84C] list-none flex items-center justify-between focus:outline-none select-none">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-4.5 w-4.5 text-[#C9A84C] shrink-0" />
                  <span>{faq.q}</span>
                </div>
                <span className="text-xs text-[#C9A84C] transition-transform duration-300 group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-4 text-xs md:text-sm leading-relaxed text-[#A1A1A6] border-t border-[#C9A84C]/8 pt-4 font-sans">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

    </div>
  );
}
