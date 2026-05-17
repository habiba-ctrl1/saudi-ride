"use client";

import { useLanguage } from "@/lib/context/LanguageContext";
import { motion } from "framer-motion";
import { Users, Briefcase, ChevronRight } from "lucide-react";
import Link from "next/link";

const translations = {
  en: {
    badge: "Our Luxury Fleet",
    title: "Elegant fleet for every travel profile",
    description: "Experience the height of comfort and status with our highly maintained vehicles. Guided by professional, certified local chauffeurs.",
    passengers: "passengers",
    luggage: "luggage",
    bookNow: "Book Selected Vehicle",
    cars: [
      {
        name: "Toyota Camry Executive",
        type: "Standard VIP",
        passengers: 4,
        luggage: 2,
        features: ["Fully Air Conditioned", "Professional English/Arabic Speaking Chauffeur", "Smooth Executive City Ride"],
      },
      {
        name: "GMC Yukon Denali XL",
        type: "Luxury SUV",
        passengers: 7,
        luggage: 5,
        features: ["AC with Individual Climate Control", "Premium Leather VIP Cabin", "Extra Legroom & Reclining Seats"],
      },
      {
        name: "Hyundai Staria Premium",
        type: "Executive Van",
        passengers: 7,
        luggage: 4,
        features: ["Multi-zone Air Conditioning", "Family Friendly & Spacious Interior", "Panoramic Views & Luxury Trim"],
      },
    ]
  },
  ar: {
    badge: "أسطولنا الفاخر",
    title: "أسطول فاخر يناسب جميع متطلبات السفر",
    description: "استمتع بأعلى مستويات الراحة والهيبة مع مركباتنا المصانة بعناية فائقة. برفقة نخبة من السائقين المحليين المعتمدين.",
    passengers: "ركاب",
    luggage: "حقائب",
    bookNow: "احجز هذه السيارة",
    cars: [
      {
        name: "تويوتا كامري التنفيذية",
        type: "في آي بي القياسية",
        passengers: 4,
        luggage: 2,
        features: ["تكييف هواء كامل وممتاز", "سائق محترف يتحدث العربية والإنجليزية", "رحلة ناعمة ومريحة داخل المدينة"],
      },
      {
        name: "جي ام سي يوكون دينالي XL",
        type: "سيارة دفع رباعي فاخرة",
        passengers: 7,
        luggage: 5,
        features: ["تحكم فردي في المناخ وتكييف قوي", "مقصورة VIP من الجلد الفاخر", "مساحة إضافية للأرجل ومقاعد قابلة للإمالة"],
      },
      {
        name: "هيونداي ستاريا بريميوم",
        type: "فان تنفيذي فاخر",
        passengers: 7,
        luggage: 4,
        features: ["تكييف هواء متعدد المناطق", "مناسب للعائلات ومقصورة واسعة جداً", "إطلالات بانورامية وتشطيبات فاخرة"],
      },
    ]
  },
  ur: {
    badge: "ہماری گاڑیاں",
    title: "ہر قسم کے سفر کے لیے بہترین گاڑیاں",
    description: "ہماری بہترین دیکھ بھال والی گاڑیوں کے ساتھ انتہائی آرام دہ اور پروقار سفر کا تجربہ کریں۔ پیشہ ورانہ، مصدقہ مقامی ڈرائیوروں کی رہنمائی میں۔",
    passengers: "مسافر",
    luggage: "سامان",
    bookNow: "گاڑی منتخب کریں اور بک کریں",
    cars: [
      {
        name: "ٹویوٹا کیمری ایگزیکٹو",
        type: "اسٹینڈرڈ وی آئی پی",
        passengers: 4,
        luggage: 2,
        features: ["مکمل ایئر کنڈیشنڈ", "پیشہ ور انگریزی/عربی بولنے والا ڈرائیور", "ہموار ایگزیکٹو سٹی رائیڈ"],
      },
      {
        name: "جی ایم سی یوکون ڈینالی XL",
        type: "لگزری ایس یو وی",
        passengers: 7,
        luggage: 5,
        features: ["انفرادی کلائمیٹ کنٹرول کے ساتھ اے سی", "پریمیم لیدر وی آئی پی کیبن", "اضافی لیگ روم اور ٹیک لگانے والی سیٹیں"],
      },
      {
        name: "ہونڈائی اسٹاریا پریمیم",
        type: "ایگزیکٹو وین",
        passengers: 7,
        luggage: 4,
        features: ["ملٹی زون ایئر کنڈیشننگ", "فیملی فرینڈلی اور کشادہ انٹیریئر", "پینورامک مناظر اور لگژری ٹرم"],
      },
    ]
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

export default function FleetPage() {
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

        {/* Fleet dynamic list showcase */}
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {t.cars.map((car, index) => (
            <motion.article
              key={car.name}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative flex flex-col justify-between rounded-3xl border border-[#C9A84C]/15 bg-[#121212] p-8 shadow-2xl hover:border-[#C9A84C]/45 transition-all duration-300 overflow-hidden"
              whileHover={{ y: -6 }}
            >
              {/* Dynamic light gold aura */}
              <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[#C9A84C]/5 blur-2xl group-hover:bg-[#C9A84C]/10 transition-colors pointer-events-none" />

              <div>
                {/* Car Header */}
                <div className="flex items-center justify-between">
                  <span className="text-[0.65rem] uppercase tracking-[0.18em] text-[#C9A84C] font-bold">
                    {car.type}
                  </span>
                </div>

                <h2 className="mt-3 font-heading text-2xl font-bold text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors">
                  {car.name}
                </h2>

                {/* Capacity Badges */}
                <div className="mt-4 flex items-center gap-4 border-b border-[#C9A84C]/10 pb-4 text-xs text-[#A1A1A6] font-medium">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-[#C9A84C]/80" />
                    <span>
                      {car.passengers} {t.passengers}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-[#C9A84C]/80" />
                    <span>
                      {car.luggage} {t.luggage}
                    </span>
                  </div>
                </div>

                {/* Features Checklist */}
                <ul className="mt-6 space-y-3 text-xs text-[#A1A1A6]">
                  {car.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <span className="text-[#C9A84C] shrink-0 font-bold">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Booking Action button at the bottom */}
              <div className="mt-8 pt-4">
                <Link
                  href="/#booking"
                  className="flex items-center justify-center gap-2 w-full rounded-full border border-[#C9A84C]/35 bg-black/20 py-3 text-xs font-bold uppercase tracking-wider text-[#C9A84C] transition-all hover:bg-[#C9A84C] hover:text-[#0A0A0A]"
                >
                  <span>{t.bookNow}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
