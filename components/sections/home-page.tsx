"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/context/LanguageContext";
import { contactConfig } from "@/lib/config/contact";
import PriceCalculator from "@/components/booking/PriceCalculator";
import { trustStats } from "@/lib/config/stats";
import {
  Calendar,
  Car,
  CheckCircle,
  PhoneCall,
  Compass,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  Globe,
  Star,
  MessageCircle,
  ChevronRight
} from "lucide-react";


const homeTranslations = {
  en: {
    hero: {
      badge: "Saudi Arabia's #1 Taxi & Car Service",
      title: "Taxi & Car Service Across Saudi Arabia",
      subtitle: "Book airport taxis, intercity rides, and Umrah transfers anywhere in Saudi Arabia — fixed prices, no hidden fees, available 24/7.",
      btnBook: "Book a Taxi Now",
      btnFleet: "Get Free Price Quote",
      badges: ["24/7 Available", "Licensed Drivers", "Fixed Prices", "All Saudi Cities"]
    },
    stats: [
      { label: "Completed Trips", value: "5,000+", num: 5000 },
      { label: "Customer Satisfaction", value: "98%", num: 98 },
      { label: "Available Support", value: "24/7", num: null },
      { label: "Saudi Cities Covered", value: "50+", num: 50 }
    ],
    widget: {
      oneWay: "One Way",
      roundTrip: "Round Trip",
      hourly: "Hourly Hire",
      pickupLabel: "Pickup Location",
      dropoffLabel: "Drop-off Location",
      hoursLabel: "Hours Needed",
      dateLabel: "Pickup Date",
      returnDateLabel: "Return Date",
      timeLabel: "Pickup Time",
      passengersLabel: "Passengers",
      vehicleLabel: "Choose Your Car",
      btnCalculate: "Calculate My Price",
      whatsappLabel: "Or book instantly on WhatsApp →",
      popDestinations: "Popular Locations",
      hrs: "hours"
    },
    services: {
      badge: "Our Services",
      title: "Taxi & Transfer Services in Saudi Arabia",
      cards: [
        {
          title: "Airport Taxi Service",
          desc: "Airport pickup and drop-off at Jeddah (JED), Riyadh (RUH), and Madinah (MED). We track your flight — your driver waits 60 minutes free if your flight is delayed.",
          price: "From SAR 199",
          icon: Globe
        },
        {
          title: "Umrah Taxi & Transfer",
          desc: "Dedicated taxi service for Umrah pilgrims. Makkah and Madinah transfers with Meeqat stops, prayer-time awareness, and English, Arabic, and Urdu-speaking drivers.",
          price: "From SAR 249",
          icon: Sparkles
        },
        {
          title: "Intercity Taxi — Saudi Arabia",
          desc: "Long-distance taxi rides between Riyadh, Jeddah, Makkah, Dammam, and Madinah. Clean comfortable cars, fixed prices, and no surprise charges.",
          price: "From SAR 599",
          icon: Compass
        },
        {
          title: "Corporate & Business Car Service",
          desc: "Reliable car service for business meetings, corporate events, and executive travel. Wi-Fi equipped vehicles available for professionals on the go.",
          price: "From SAR 799",
          icon: Award
        },
        {
          title: "GCC Cross-Border Taxi",
          desc: "Cross-border car service from Saudi Arabia to Bahrain, Qatar, UAE, and Kuwait. Experienced drivers, smooth border crossings, fixed fares.",
          price: "From SAR 1,499",
          icon: ShieldCheck
        },
        {
          title: "Saudi Arabia Day Tours",
          desc: "Full-day car hire with a local driver for sightseeing. Explore AlUla, Taif, Diriyah, and NEOM with a knowledgeable local guide-driver.",
          price: "From SAR 999",
          icon: Car
        }
      ]
    },
    whyUs: {
      badge: "Why Choose Us",
      title: "Why Thousands Choose Our Taxi Service in Saudi Arabia",
      desc: "We provide safe, reliable, and affordable taxi and car service across Saudi Arabia — for airport transfers, Umrah trips, business travel, and sightseeing.",
      points: [
        { title: "Government Licensed", desc: "Fully licensed by Saudi Ministry of Transport (MOT) and the General Authority for Transport (TGA)." },
        { title: "Fixed Price — No Surprises", desc: "The price you see is the price you pay. No surge pricing, no hidden fees, ever." },
        { title: "Prayer-Time Friendly", desc: "Our drivers always plan stops for prayer times. We never make you miss your Salah." },
        { title: "Live Flight Tracking", desc: "We track your flight in real time. Your driver waits 60 minutes for free if your flight is delayed." },
        { title: "English, Arabic & Urdu Drivers", desc: "Our drivers speak English, Arabic, and Urdu — so you can communicate easily and comfortably." },
        { title: "Free Cancellation", desc: "Cancel your booking up to 24 hours before your trip for a full refund — no questions asked." },
        { title: "Airport Meet & Greet", desc: "Your driver meets you inside the terminal with a name sign and helps carry your bags to the car." },
        { title: "Company E-Invoice", desc: "Automated VAT-compliant e-invoices via ZATCA for all corporate and business bookings." }
      ]
    },
    routes: {
      badge: "Popular Routes",
      title: "Most Booked Taxi Routes in Saudi Arabia",
      btnBook: "Book This Route"
    },
    fleet: {
      badge: "Our Cars",
      title: "Choose Your Car",
      desc: "Clean, comfortable, air-conditioned, and well-maintained cars for every trip in Saudi Arabia.",
      btnBook: "Book This Car",
      btnMore: "See All Cars",
      "mercedes-sSpec": "Top luxury sedan — perfect for executives, VIPs, and important business arrivals.",
      escaladeSpec: "Large SUV with spacious cabin — great for groups and families with lots of luggage.",
      "mercedes-vSpec": "Spacious minivan — ideal for Umrah groups, large families, and corporate teams.",
      "bmw-7Spec": "Premium executive car — stylish and comfortable for business trips and long-distance rides.",
      yukonSpec: "Full-size American SUV with big boot space — perfect for large groups and airport transfers."
    },
    clientele: "Trusted by Pilgrims & Travelers from 40+ Countries",
    umrah: {
      title: "Umrah Taxi Service — Makkah & Madinah Transfers",
      desc: "We provide dedicated taxi and transfer service for Umrah pilgrims. Our drivers understand the holy journey and make every trip smooth, comfortable, and spiritually respectful.",
      point1: "Trips planned around prayer times and Salah stops",
      point2: "Meeqat stop for Ihram — no extra charge, no rush",
      point3: "Drop-off at the closest permitted point to Masjid Al-Haram and Masjid An-Nabawi",
      point4: "Drivers trained to respect pilgrims and support the full Umrah journey",
      btnWhatsApp: "Book Umrah Taxi on WhatsApp"
    },
    testimonials: {
      badge: "Customer Reviews",
      title: "What Our Customers Say About Our Taxi Service",
      verified: "Google Review — Verified Trip"
    },
    blog: {
      badge: "Travel Tips & Guides",
      title: "Helpful Travel Guides for Saudi Arabia",
      btnRead: "Read Full Guide →"
    },
    cta: {
      title: "Book Your Taxi in Saudi Arabia Today",
      desc: "Fast, safe, and reliable taxi service anywhere in Saudi Arabia. Book in under 2 minutes online or on WhatsApp.",
      btnBook: "Book Taxi Online",
      btnWhatsApp: "Book on WhatsApp",
      trust: "Instant Confirmation • Fixed Prices Guaranteed • 24/7 Customer Support"
    }
  },
  ar: {
    hero: {
      badge: "خدمة النقل الفاخرة النخبوية",
      title: "خدمات التاكسي والسائق الخاص الفاخرة",
      subtitle: "سائق خاص VIP في جميع أنحاء المملكة — المطارات، العمرة، والتنقل الفاخر بين المدن بأقصى درجات الراحة.",
      btnBook: "احجز رحلتك الفاخرة",
      btnFleet: "تصفح أسطول التميز",
      badges: ["دعم VIP على مدار ٢٤ ساعة", "مرخص بالكامل من وزارة النقل", "أسعار ثابتة بدون زيادة مفاجئة"]
    },
    stats: [
      { label: "رحلة مكتملة", value: "+٥,٠٠٠", num: 5000 },
      { label: "رضا العملاء", value: "٩٨٪", num: 98 },
      { label: "دعم متواصل", value: "٢٤/٧", num: null },
      { label: "مدينة سعودية", value: "+٥٠", num: 50 }
    ],
    widget: {
      oneWay: "اتجاه واحد",
      roundTrip: "ذهاب وعودة",
      hourly: "بالساعة",
      pickupLabel: "نقطة الالتقاء",
      dropoffLabel: "وجهة التوصيل",
      hoursLabel: "الساعات المطلوبة",
      dateLabel: "تاريخ الرحلة",
      returnDateLabel: "تاريخ العودة",
      timeLabel: "وقت الرحلة",
      passengersLabel: "عدد الركاب",
      vehicleLabel: "فئة السيارة",
      btnCalculate: "احسب الأجرة التقديرية",
      whatsappLabel: "أو احجز مباشرة عبر واتساب الدعم الفني VIP ←",
      popDestinations: "مواقع شائعة",
      hrs: "ساعات"
    },
    services: {
      badge: "الخدمات التنفيذية الفاخرة",
      title: "مصممة لراحة الملوك والأمراء",
      cards: [
        {
          title: "توصيل المطارات",
          desc: "خدمة استقبال وتوديع وتتبع رحلات الطيران في مطارات جدة والرياض والمدينة المنورة.",
          price: "من ١٩٩ ريال",
          icon: Globe
        },
        {
          title: "العمرة والزيارة",
          desc: "توصيل خاص للمشاعر المقدسة مع سائقين مدربين على معرفة كاملة بالمواقيت والإحرام عند الطلب.",
          price: "من ٢٤٩ ريال",
          icon: Sparkles
        },
        {
          title: "التنقل بين المدن",
          desc: "سفر مريح وسريع بين الرياض، جدة، مكة المكرمة، المدينة المنورة، والدمام بسيارات حديثة.",
          price: "من ٥٩٩ ريال",
          icon: Compass
        },
        {
          title: "رجال الأعمال وكبار الشخصيات",
          desc: "تنقل فاخر لرجال الأعمال والدبلوماسيين بسيارات مجهزة بشبكة واي فاي عالية السرعة ومقاعد جلدية.",
          price: "من ٧٩٩ ريال",
          icon: Award
        },
        {
          title: "عبور الحدود الخليجية",
          desc: "رحلات برية فاخرة وسلسة تربط المملكة بالبحرين، قطر، الإمارات، والكويت.",
          price: "من ١,٤٩٩ ريال",
          icon: ShieldCheck
        },
        {
          title: "باقات السياحة في المملكة",
          desc: "رحلات مخصصة مع سائقين لاستكشاف وجهات السياحة السعودية الفاخرة مثل العلا، الطائف ونيوم.",
          price: "من ٩٩٩ ريال",
          icon: Car
        }
      ]
    },
    whyUs: {
      badge: "معايير النخبة الفاخرة",
      title: "لماذا يختار كبار الشخصيات خدماتنا؟",
      desc: "نحن ندمج دقة الضيافة المعاصرة الراقية مع الكرم العربي الأصيل لنرتقي بكل كيلومتر تقطعه معنا.",
      points: [
        { title: "مرخص من وزارة النقل", desc: "متوافقون ١٠٠٪ مع لوائح وزارة النقل وهيئة العامة للنقل السعودية." },
        { title: "أسعار ثابتة ومضمونة", desc: "لا توجد أسعار مرتفعة بشكل مفاجئ. السعر المعروض هو السعر الفعلي الذي تدفعه." },
        { title: "متوافق مع أوقات الصلاة", desc: "تخطيط الرحلات والوقفات يراعي أوقات الصلوات ومواقيت الإحرام بشكل طبيعي." },
        { title: "تتبع الرحلات الذكي", desc: "نتابع مواعيد الطيران بدقة. السائق ينتظرك حتى ٦٠ دقيقة مجاناً." },
        { title: "سائقين متحدثين بلغات متعددة", desc: "سائقون محترفون يجيدون العربية والإنجليزية والأوردو بطلاقة." },
        { title: "إلغاء مجاني للرحلات", desc: "إلغاء مرن بالكامل قبل الرحلة بـ ٢٤ ساعة دون أي رسوم." },
        { title: "استقبال كبار الشخصيات VIP", desc: "استقبال باللوحات الإرشادية والمساعدة في حمل الأمتعة فور خروجك من الصالة." },
        { title: "فاتورة إلكترونية معتمدة", desc: "متوافقون تماماً مع متطلبات هيئة الزكاة والضريبة والجمارك للشركات." }
      ]
    },
    routes: {
      badge: "المسارات الأكثر طلباً",
      title: "مسارات التنقل الفاخرة الشائعة",
      btnBook: "احجز هذا المسار"
    },
    fleet: {
      badge: "المرآب الملكي الفاخر",
      title: "أسطول سيارات النخبة",
      desc: "مقصورات فاخرة معقمة ومجهزة بأحدث وسائل الراحة والمشروبات الباردة لخدمتكم.",
      btnBook: "احجز هذه الفئة",
      btnMore: "تصفح أسطول السيارات الكامل",
      camrySpec: "مثالية لتنقلات رجال الأعمال السريعة والرحلات العملية بين المدن.",
      yukonSpec: "قمة الفخامة والراحة العائلية. مساحة مقصورة واسعة حضور مهيب لكبار الشخصيات.",
      stariaSpec: "مقاعد VIP من الدرجة الأولى مصممة خصيصاً للمجموعات والعائلات في رحلات العمرة."
    },
    clientele: "موثوقون لدى ضيوف الرحمن والزوار من أكثر من ٤٠ دولة",
    umrah: {
      title: "الرحلة المقدسة تستحق خدمة مقدسة تليق بها",
      desc: "للمعتمرين والزوار، نقدم خدمة مخصصة تجمع الراحة الجسدية مع الطمأنينة الروحية طوال الطريق لمكة والمدينة.",
      point1: "جدولة متوافقة مع أوقات الصلوات والمواقيت",
      point2: "توقف كامل ومريح عند مواقيت الإحرام لتبديل الملابس",
      point3: "توصيل كبار الشخصيات VIP لأقرب نقطة آمنة من الحرمين الشريفين",
      point4: "سائقون مدربون على حُسن التعامل والضيافة اللائقة بضيوف الرحمن",
      btnWhatsApp: "احجز سائق العمرة الخاص عبر الواتساب"
    },
    testimonials: {
      badge: "آراء عملائنا الكرام",
      title: "ماذا يقول كبار زوار ومعتمري المملكة؟",
      verified: "تقييم جوجل • رحلة معتمدة وموثقة"
    },
    blog: {
      badge: "دليل السفر والإرشادات",
      title: "مدونة السفر والكونسيرج الفاخر",
      btnRead: "اقرأ الدليل الكامل ←"
    },
    cta: {
      title: "جاهز لتجربة السفر الفاخرة كبار الشخصيات؟",
      desc: "استمتع بأعلى معايير التنقل والأمان في المملكة العربية السعودية. احجز رحلتك الآن في دقيقتين فقط.",
      btnBook: "احجز رحلتك أونلاين",
      btnWhatsApp: "احجز مباشرة عبر الواتساب",
      trust: "تأكيد فوري • أسعار ثابتة ومضمونة • خدمة عملاء مخصصة على مدار الساعة"
    }
  },
  ar_fallback: {},
  ur: {
    hero: {
      badge: "اشرافیہ ٹرانسپورٹ سروس",
      title: "پریمیم ٹیکسی اور ڈرائیور سروسز",
      subtitle: "سعودی عرب بھر میں وی آئی پی ڈرائیور سروس — ہوائی اڈے، عمرہ اور بین شہر سفر بہترین آرام کے ساتھ۔",
      btnBook: "لگژری سواری بک کریں",
      btnFleet: "پریسٹيج بیڑے کو دیکھیں",
      badges: ["24/7 پریمیم سپورٹ", "وزارت سے 100٪ لائسنس یافتہ", "مقررہ مسابقتی قیمتیں"]
    },
    stats: [
      { label: "مکمل سفر", value: "5,000+", num: 5000 },
      { label: "صارفین کی رضامندی", value: "98%", num: 98 },
      { label: "سپورٹ", value: "24/7", num: null },
      { label: "سعودی شہر", value: "50+", num: 50 }
    ],
    widget: {
      oneWay: "ایک طرف",
      roundTrip: "دونوں طرف",
      hourly: "گھنٹہ وار سروس",
      pickupLabel: "پک اپ مقام",
      dropoffLabel: "ڈراپ آف مقام",
      hoursLabel: "گھنٹے مطلوب ہیں",
      dateLabel: "پک اپ تاریخ",
      returnDateLabel: "واپسی کی تاریخ",
      timeLabel: "پک اپ وقت",
      passengersLabel: "مسافروں کی تعداد",
      vehicleLabel: "گاڑی کی کلاس",
      btnCalculate: "اندازہ کرایہ معلوم کریں",
      whatsappLabel: "یا وی آئی پی واٹس ایپ سپورٹ ڈیسک کے ذریعے بک کریں ←",
      popDestinations: "مقبول مقامات",
      hrs: "گھنٹے"
    },
    services: {
      badge: "ایگزیکٹو پیشکشیں",
      title: "شاہی آرام کے لیے تیار کردہ",
      cards: [
        {
          title: "ایئرپورٹ ٹرانسفر",
          desc: "جدہ (JED)، ریاض (RUH)، اور مدینہ (MED) ہوائی اڈوں پر فلائٹ ٹریکنگ کے ساتھ استقبال۔",
          price: "SAR 199 سے",
          icon: Globe
        },
        {
          title: "عمرہ اور زیارت",
          desc: "مقدس مقامات کے لیے وقف سفر۔ احرام کی حالت میں ڈرائیور کی دستیابی اور میقات کی مکمل معلومات۔",
          price: "SAR 249 سے",
          icon: Sparkles
        },
        {
          title: "بین شہر روٹس",
          desc: "ریاض، جدہ، مکہ، دمام، اور مدینہ کے درمیان شاندار ہائی وے کروزنگ سروس۔",
          price: "SAR 599 سے",
          icon: Compass
        },
        {
          title: "کارپوریٹ اور ایگزیکٹو",
          desc: "کاروباری شخصیات اور وی آئی پی وفود کے لیے پریمیم وائی فائی سے لیس لگژری کیبنز۔",
          price: "SAR 799 سے",
          icon: Award
        },
        {
          title: "جی سی سی بارڈر کراسنگ",
          desc: "بحرین، قطر، متحدہ عرب امارات، اور کویت کو ملانے والی شاہراہوں پر ہموار سفر۔",
          price: "SAR 1,499 سے",
          icon: ShieldCheck
        },
        {
          title: "سعودی سیاحتی پیکجز",
          desc: "العلا، طائف اور نیوم جیسے تاریخی اور خوبصورت مقامات کے لیے اپنی مرضی کا سیاحتی سفر۔",
          price: "SAR 999 سے",
          icon: Car
        }
      ]
    },
    whyUs: {
      badge: "پریسٹيج معیارات",
      title: "وی آئی پی مسافر ریاض لکس کا انتخاب کیوں کرتے ہیں؟",
      desc: "ہم جدید مغربی مہمان نوازی کی درستگی کو لازوال عربی سخاوت کے ساتھ ملا کر آپ کے سفر کو یادگار بناتے ہیں۔",
      points: [
        { title: "حکومت سے منظور شدہ", desc: "سعودی عرب کی وزارت ٹرانسپورٹ اور TGA سے 100٪ لائسنس یافتہ۔" },
        { title: "مقررہ لگژری قیمتیں", desc: "کسی قسم کے اضافی چارجز یا سرج پرائسنگ کے بغیر طے شدہ قیمتیں۔" },
        { title: "نماز کے اوقات کے مطابق", desc: "نماز اور عمرہ کے اوقات کار کے مطابق سفر کی بہترین منصوبہ بندی۔" },
        { title: "سمارٹ فلائٹ ٹریکنگ", desc: "ہم پرواز کی تاخیر کو مانیٹر کرتے ہیں۔ ڈرائیور ہوائی اڈے پر 60 منٹ تک مفت انتظار کرتا ہے۔" },
        { title: "تین زبانیں بولنے والے ڈرائیورز", desc: "عربی، انگریزی اور اردو روانی سے بولنے والے پیشہ ور ڈرائیورز۔" },
        { title: "مفت منسوخی", desc: "سفر سے 24 گھنٹے پہلے تک بکنگ منسوخ کرنے پر مکمل رقم کی واپسی۔" },
        { title: "وی آئی پی استقبالیہ سروس", desc: "ہوائی اڈے پر نام کی تختی کے ساتھ استقبال اور سامان اٹھانے میں مدد۔" },
        { title: "ZATCA الیکٹرانک انوائسنگ", desc: "کارپوریٹ کمپنیوں کے لیے فوری ٹیکس رسید اور انوائسنگ کی سہولت۔" }
      ]
    },
    routes: {
      badge: "مقبول ترین راستے",
      title: "مقبول لگژری روٹس",
      btnBook: "راستہ بک کریں"
    },
    fleet: {
      badge: "شاہی گیراج",
      title: "ہمارا شاندار گاڑیوں کا شوکیس",
      desc: "بہترین سہولیات اور مکمل طور پر سینیٹائزڈ اور صاف ستھری لگژری گاڑیاں۔",
      btnBook: "گاڑی بک کریں",
      btnMore: "تمام گاڑیوں کی تفصیلات دیکھیں",
      camrySpec: "کارپوریٹ دوروں اور تیز رفتار بین شہر سفر کے لیے بہترین۔",
      yukonSpec: "شاندار اور انتہائی آرام دہ۔ وسیع کیبن اور وی آئی پی مسافروں کے لیے بہترین انتخاب۔",
      stariaSpec: "خاندان اور مقدس عمرہ کے زائرین کے لیے فرسٹ کلاس لگژری سیٹنگ۔"
    },
    clientele: "40+ ممالک کے زائرین اور کاروباری شخصیات کا قابل اعتماد انتخاب",
    umrah: {
      title: "مقدس سفر کے لیے مقدس اور شاندار خدمت کا انتخاب کریں",
      desc: "عمرہ کے زائرین کے لیے ہم جسمانی آرام کے ساتھ ساتھ روحانی احترام اور سکون فراہم کرتے ہیں۔",
      point1: "نماز کے اوقات کے مطابق شیڈولنگ",
      point2: "احرام باندھنے کے لیے میقات کے مقامات پر توقف",
      point3: "حرم کے بالکل قریب وی آئی پی ڈراپ آف پوائنٹس",
      point4: "زائرین کی مہمان نوازی کے لیے تربیت یافتہ ڈرائیورز",
      btnWhatsApp: "واٹس ایپ پر عمرہ کا ڈرائیور بک کریں"
    },
    testimonials: {
      badge: "عالمی آراء",
      title: "ہمارے وی آئی پی زائرین کا کیا کہنا ہے؟",
      verified: "گوگل ریویو • تصدیق شدہ سفر"
    },
    blog: {
      badge: "ٹریول گائیڈز",
      title: "دربان نالج بیس اور تجاویز",
      btnRead: "مکمل مضمون پڑھیں ←"
    },
    cta: {
      title: "اپنے وی آئی پی سفر کے لیے تیار ہیں؟",
      desc: "سعودی عرب میں بہترین اور اعلیٰ ترین معیار پر سفر کا تجربہ کریں۔ صرف 2 منٹ میں بکنگ کریں۔",
      btnBook: "آن لائن بک کریں",
      btnWhatsApp: "واٹس ایپ کے ذریعے بک کریں",
      trust: "فوری تصدیق • طے شدہ فکسڈ ریٹس • 24/7 کسٹمر سپورٹ ڈیسک"
    }
  }
};


const topRoutesList = [
  { from: "jeddah-airport", to: "makkah-haram", nameEn: "Jeddah Airport ➔ Makkah", nameAr: "مطار جدة ➔ مكة المكرمة", nameUr: "جدہ ایئرپورٹ ➔ مکہ مکرمہ", dist: "85 km", dur: "1h 15m", price: "249" },
  { from: "makkah-haram", to: "madinah-mosque", nameEn: "Makkah ➔ Madinah", nameAr: "مكة المكرمة ➔ المدينة المنورة", nameUr: "مکہ مکرمہ ➔ مدینہ منورہ", dist: "450 km", dur: "4h 30m", price: "799" },
  { from: "madinah-mosque", to: "jeddah-airport", nameEn: "Madinah ➔ Jeddah Airport", nameAr: "المدينة المنورة ➔ مطار جدة", nameUr: "مدینہ منورہ ➔ جدہ ایئرپورٹ", dist: "410 km", dur: "4h 10m", price: "749" },
  { from: "riyadh-downtown", to: "dammam", nameEn: "Riyadh ➔ Dammam", nameAr: "الرياض ➔ الدمام", nameUr: "ریاض ➔ دمام", dist: "400 km", dur: "4h 00m", price: "699" },
  { from: "riyadh-downtown", to: "dubai", nameEn: "Riyadh ➔ Dubai (GCC)", nameAr: "الرياض ➔ دبي (الخليج)", nameUr: "ریاض ➔ دبئی", dist: "1,000 km", dur: "9h 30m", price: "1,999" },
  { from: "dammam", to: "doha", nameEn: "Dammam ➔ Doha (GCC)", nameAr: "الدمام ➔ الدوحة", nameUr: "دمام ➔ دوحہ", dist: "380 km", dur: "3h 45m", price: "899" },
  { from: "jeddah-airport", to: "taif", nameEn: "Jeddah ➔ Taif Heights", nameAr: "جدة ➔ مرتفعات الطائف", nameUr: "جدہ ➔ طائف", dist: "140 km", dur: "1h 45m", price: "349" },
  { from: "jeddah-airport", to: "madinah-mosque", nameEn: "Jeddah Airport ➔ Madinah", nameAr: "مطار جدة ➔ المدينة المنورة", nameUr: "جدہ ایئرپورٹ ➔ مدینہ منورہ", dist: "420 km", dur: "4h 15m", price: "749" }
];

const vehicleList = [
  {
    id: "mercedes-s",
    name: "Mercedes-Benz S-Class",
    type: "Ultra Luxury Sedan",
    capacity: "3 Passengers",
    luggage: "3 Suitcases",
    image: "/fleet/mercedes-s-class.webp"
  },
  {
    id: "escalade",
    name: "Cadillac Escalade",
    type: "VIP Full-Size SUV",
    capacity: "6 Passengers",
    luggage: "5 Suitcases",
    image: "/fleet/cadillac-escalade.webp"
  },
  {
    id: "mercedes-v",
    name: "Mercedes-Benz V-Class",
    type: "Executive MPV",
    capacity: "7 Passengers",
    luggage: "7 Suitcases",
    image: "/fleet/mercedes-vito.webp"
  },
  {
    id: "bmw-7",
    name: "BMW 7 Series",
    type: "Executive Sedan",
    capacity: "3 Passengers",
    luggage: "3 Suitcases",
    image: "/fleet/bmw-7-series.webp"
  },
  {
    id: "yukon",
    name: "GMC Yukon Denali XL",
    type: "Premium SUV",
    capacity: "6 Passengers",
    luggage: "5 Suitcases",
    image: "/fleet/gmc-yukon-xl.webp"
  }
];

const internationalNations = [
  { name: "Saudi Arabia", flag: "🇸🇦" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "United States", flag: "🇺🇸" },
  { name: "Pakistan", flag: "🇵🇰" },
  { name: "Indonesia", flag: "🇮🇩" },
  { name: "India", flag: "🇮🇳" },
  { name: "Malaysia", flag: "🇲🇾" },
  { name: "Turkey", flag: "🇹🇷" },
  { name: "Egypt", flag: "🇪🇬" },
  { name: "United Arab Emirates", flag: "🇦🇪" },
  { name: "Kuwait", flag: "🇰🇼" },
  { name: "Qatar", flag: "🇶🇦" },
  { name: "Oman", flag: "🇴🇲" },
  { name: "Bahrain", flag: "🇧🇭" },
  { name: "Jordan", flag: "🇯🇴" },
  { name: "Iraq", flag: "🇮🇶" },
  { name: "Bangladesh", flag: "🇧🇩" },
  { name: "Algeria", flag: "🇩🇿" },
  { name: "Morocco", flag: "🇲🇦" },
  { name: "France", flag: "🇫🇷" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "Nigeria", flag: "🇳🇬" }
];

const customerReviews = [
  { name: "Dr. Farhan Malik", countryFlag: "🇬🇧", stars: 5, text: "Excellent taxi service from Jeddah to Makkah. The driver was waiting in the arrivals hall with a name sign. Smooth, comfortable ride with no issues at all.", vehicle: "GMC Yukon Denali" },
  { name: "Amna Al-Faisal", countryFlag: "🇸🇦", stars: 5, text: "سيارات فاخرة للغاية وخدمة متميزة. سائق محترف ولديه دراية ممتازة بمواقع مكة والمدينة. أفضل خدمة نقل في المملكة.", vehicle: "Toyota Camry Executive" },
  { name: "Muhammad Siddique", countryFlag: "🇵🇰", stars: 5, text: "Wonderful Umrah transfer booking. The driver was prayer-time aware and stopped for us at Meeqat with complete respect and patience. Highly recommended.", vehicle: "Hyundai Staria Premium" },
  { name: "Hassan Qabbani", countryFlag: "🇦🇪", stars: 5, text: "Highly recommend Taxi Saudi Arabia for anyone in Saudi Arabia. Clean car, Wi-Fi included, fixed price — zero hidden charges or surge fees.", vehicle: "GMC Yukon Denali" },
  { name: "Evelyn Sterling", countryFlag: "🇺🇸", stars: 5, text: "Amazing airport taxi service. My flight was delayed 2 hours but the driver tracked it and was right there when I landed. Very professional and reliable.", vehicle: "GMC Yukon Denali" },
  { name: "Ahmad Bin-Hamid", countryFlag: "🇶🇦", stars: 5, text: "سفر مريح جداً بين الرياض والدمام. سيارة نظيفة وواسعة وخدمة إنترنت ممتازة طوال الطريق. سأحجز مجدداً بالتأكيد.", vehicle: "Toyota Camry Executive" }
];

const blogList = [
  { id: "jeddah-sim-guide", categoryEn: "Airport Help", categoryAr: "مساعدة المطار", categoryUr: "ہوائی اڈے کی مدد", titleEn: "SIM Card buying guide at Jeddah Airport", titleAr: "دليل شراء بطاقات الاتصال SIM في مطار جدة", titleUr: "جدہ ایئرپورٹ پر سم کارڈ خریدنے کا گائیڈ", excerptEn: "Exactly where to purchase local 5G eSIMs/SIMs from stc, Mobily, or Zain upon landing at Terminal 1 or North Terminal.", excerptAr: "أين تشتري شرائح الاتصال المحلية eSIM/SIM من شركات stc، وموبايلي، وزين فور وصولك لصالة المطار.", excerptUr: "ٹرمینل 1 پر لینڈنگ کے بعد stc، Mobily، یا Zain سے مقامی 5G eSIMs/SIMs خریدنے کی درست جگہوں کی معلومات۔", author: "Taxi Saudi Arabia Editorial", date: "May 12, 2026", timeEn: "5 min read", timeAr: "قراءة ٥ دقائق", timeUr: "5 منٹ مطالعہ" },
  { id: "meeqat-guide", categoryEn: "Umrah", categoryAr: "العمرة والزيارة", categoryUr: "عمرہ اور زیارت", titleEn: "Complete Meeqat locations guide for Umrah", titleAr: "دليل مواقيت الإحرام الكامل للمعتمرين", titleUr: "عمرہ کے لیے میقات کے مقامات کی مکمل گائیڈ", excerptEn: "Step-by-step guidance on Meeqat points (including Dhul Hulaifah & Yalamlam) for international pilgrims arriving by air or road.", excerptAr: "شرح تفصيلي خطوة بخطوة لمواقيت الإحرام (بما في ذلك ذو الحليفة ويلملم) للحجاج والمعتمرين القادمين جواً أو براً.", excerptUr: "فضائی یا زمینی راستے سے آنے والے بین الاقوامی زائرین کے لیے میقات کے مقامات پر تفصیلی رہنمائی۔", author: "Taxi Saudi Arabia Editorial", date: "May 08, 2026", timeEn: "7 min read", timeAr: "قراءة ٧ دقائق", timeUr: "7 منٹ مطالعہ" },
  { id: "riyal-cash-guide", categoryEn: "Travel Finance", categoryAr: "المالية والسفر", categoryUr: "ٹریول فنانس", titleEn: "Saudi Riyal cash & card tips for pilgrims", titleAr: "نصائح الكاش والبطاقات للمعتمرين في السعودية", titleUr: "زائرین کے لیے سعودی ریال کیش اور کارڈ کی تجاویز", excerptEn: "Everything about card acceptance, local mada payment network, currency exchange outlets, and ATM fee limits in KSA.", excerptAr: "كل ما تحتاج لمعرفته حول قبول بطاقات الائتمان، شبكة مدى المحلية، منافذ الصرافة ورسوم السحب من أجهزة الصراف الآلي.", excerptUr: "کارڈز کی قبولیت، مقامی mada پیمنٹ نیٹ ورک، کرنسی ایکسچینج اور اے ٹی ایم فیس کی حدود کے بارے میں سب کچھ۔", author: "Taxi Saudi Arabia Editorial", date: "April 29, 2026", timeEn: "4 min read", timeAr: "قراءة ٤ دقائق", timeUr: "4 منٹ مطالعہ" }
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

type VehicleItem = {
  id: string;
  name: string;
  type: string;
  capacity: string;
  luggage: string;
  image: string;
};

function FleetCard({ veh, index, onBook, btnLabel }: {
  veh: VehicleItem;
  index: number;
  onBook: () => void;
  btnLabel: string;
}) {
  return (
    <motion.article
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={fadeUp}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-2xl border border-[#C9A84C]/15 bg-[#121212] shadow-lg hover:shadow-2xl hover:border-[#C8A45D]/40 transition-all duration-400"
    >
      {/* Image with zoom */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={veh.image}
          alt={veh.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover brightness-85 transition-transform duration-700 group-hover:scale-108"
          loading="lazy"
        />
        {/* Gold accent overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <span
          className="absolute left-3 top-3 rounded-full px-3 py-1 text-[0.58rem] uppercase tracking-wider font-bold"
          style={{
            backgroundColor: "rgba(0,0,0,0.7)",
            border: "1px solid rgba(200,164,93,0.4)",
            color: "#C8A45D",
            backdropFilter: "blur(8px)",
          }}
        >
          {veh.type}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Gold accent line */}
        <div className="h-[2px] w-10 rounded-full bg-gradient-to-r from-[#C8A45D] to-[#F4E4BC] group-hover:w-16 transition-all duration-400" />

        <h3 className="font-heading text-lg font-bold text-[#F5F0E8] group-hover:text-[#C8A45D] transition-colors leading-snug">
          {veh.name}
        </h3>

        <div
          className="flex items-center gap-3 text-[0.62rem] font-bold uppercase tracking-wider py-2 border-y"
          style={{ borderColor: "rgba(200,164,93,0.12)", color: "#9CA3AF" }}
        >
          <span>{veh.capacity}</span>
          <span className="h-1 w-1 rounded-full" style={{ backgroundColor: "#C8A45D" }} />
          <span>{veh.luggage}</span>
        </div>

        <button
          onClick={onBook}
          className="w-full rounded-full py-2.5 text-[0.72rem] font-bold uppercase tracking-wider transition-all duration-300"
          style={{
            border: "1.5px solid rgba(200,164,93,0.4)",
            color: "#C8A45D",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#C8A45D";
            (e.currentTarget as HTMLButtonElement).style.color = "#0F172A";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "#C8A45D";
          }}
        >
          {btnLabel}
        </button>
      </div>
    </motion.article>
  );
}

export function HomePage() {
  const { language } = useLanguage();
  const t = homeTranslations[language];

  // Active Direction for RTL Support
  const isRtl = language === "ar";

  // Trust Stats Counter state
  const [tripsCounter, setTripsCounter] = useState(trustStats.tripsCount);

  useEffect(() => {
    // Smooth count-up animation on client-side mount
    let start = 0;
    const end = trustStats.tripsCount;
    const duration = 1500;
    const increment = Math.ceil(end / (duration / 30));
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setTripsCounter(end);
        clearInterval(timer);
      } else {
        setTripsCounter(start);
      }
    }, 30);

    return () => clearInterval(timer);
  }, []);

  const handleSelectRoute = () => {
    const element = document.getElementById("booking-console");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectVehicle = () => {
    const element = document.getElementById("booking-console");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Hero car slideshow — image changes every 2 seconds
  const heroCars = [
    { image: "/fleet/cadillac-escalade.webp", name: "Cadillac Escalade", nameAr: "كاديلاك إسكاليد" },
    { image: "/fleet/mercedes-s-class.webp", name: "Mercedes S-Class", nameAr: "مرسيدس الفئة S" },
    { image: "/fleet/gmc-yukon-xl.webp", name: "GMC Yukon XL", nameAr: "جي إم سي يوكن" },
    { image: "/fleet/bmw-7-series.webp", name: "BMW 7 Series", nameAr: "بي إم دبليو الفئة 7" },
    { image: "/fleet/hyundai-staria.webp", name: "Hyundai Staria", nameAr: "هيونداي ستاريا" },
  ];
  const [heroCar, setHeroCar] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setHeroCar((i) => (i + 1) % heroCars.length), 5000);
    return () => clearInterval(id);
  }, [heroCars.length]);
  const currentCar = heroCars[heroCar];

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] overflow-hidden pt-20">
      
      {/* SECTION 1 — HERO (light, two-column: car image + green panel) */}
      <section className="relative pt-8 md:pt-10 pb-16" style={{ backgroundColor: "#FAFAF7" }}>
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

            {/* LEFT — Car image card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="premium-dark-section relative rounded-3xl overflow-hidden min-h-[320px] md:min-h-[460px] shadow-[0_18px_50px_rgba(0,0,0,0.12)]"
            >
              <Image
                key={currentCar.image}
                src={currentCar.image}
                alt={`${currentCar.name} — Taxi Saudi Arabia`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={90}
                className="object-cover animate-fade-in"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/45" />

              {/* Top overlay heading */}
              <div className="absolute top-0 inset-x-0 p-6 text-center">
                <p className="font-heading text-lg md:text-2xl font-extrabold text-white uppercase tracking-tight leading-tight drop-shadow-md">
                  {language === "ar" ? "سافر براحة مع تاكسي السعودية" : "Travel in Comfort with Taxi Saudi Arabia"}
                </p>
                <p key={currentCar.name} className="mt-2 text-xs md:text-sm font-bold text-[#C8A45D] uppercase tracking-widest animate-fade-in">
                  {language === "ar" ? currentCar.nameAr : currentCar.name}
                </p>
              </div>

              {/* Bottom car badge */}
              <div className="absolute bottom-5 left-5">
                <span key={currentCar.name} className="inline-block rounded-full bg-[#16A34A] px-4 py-1.5 text-xs font-bold text-white shadow-md animate-fade-in">
                  {language === "ar" ? currentCar.nameAr : currentCar.name}
                </span>
              </div>

              {/* Slideshow dots */}
              <div className="absolute bottom-5 right-5 flex gap-1.5">
                {heroCars.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === heroCar ? "w-5 bg-[#FACC15]" : "w-1.5 bg-white/50"}`}
                  />
                ))}
              </div>
            </motion.div>

            {/* RIGHT — Green panel */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="premium-dark-section rounded-3xl p-8 md:p-12 flex flex-col justify-center shadow-[0_18px_50px_rgba(22,163,74,0.18)]"
              style={{ backgroundColor: "#16A34A" }}
            >
              <h1
                className="font-heading font-extrabold text-white leading-tight"
                style={{ fontSize: "clamp(1.9rem, 3.6vw, 3.1rem)", letterSpacing: "-0.02em" }}
              >
                {language === "ar"
                  ? "احصل على أفضل خدمة تاكسي في المملكة العربية السعودية"
                  : "Get the Best Online Taxi Service in Saudi Arabia"}
              </h1>

              <p className="mt-5 max-w-xl text-sm md:text-base leading-relaxed text-white/90">
                {t.hero.subtitle}
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#booking-console"
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: "#FACC15", color: "#1C1C1C", boxShadow: "0 8px 24px rgba(250,204,21,0.4)" }}
                >
                  {t.hero.btnBook}
                  <ChevronRight className="h-4 w-4" />
                </a>
                <a
                  href={contactConfig.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold transition-all duration-300 hover:scale-105"
                  style={{ color: "#16A34A" }}
                >
                  <MessageCircle className="h-4 w-4" />
                  {language === "ar" ? "تواصل عبر واتساب" : "WhatsApp Us"}
                </a>
              </div>

              {/* Trust badges */}
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                {t.hero.badges.map((badge, idx) => (
                  <span key={idx} className="flex items-center gap-2 text-xs font-semibold text-white/90">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    {badge}
                  </span>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SECTION 2 — PREMIUM STATS BAR */}
      <section className="relative z-10 border-b" style={{ backgroundColor: "#0F172A", borderColor: "rgba(200,164,93,0.15)" }}>
        <div className="section-container py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            {t.stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="space-y-2"
              >
                <p
                  className="font-heading font-extrabold"
                  style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#C8A45D", letterSpacing: "-0.02em" }}
                >
                  {idx === 0 ? `${tripsCounter.toLocaleString()}+` : stat.value}
                </p>
                <div className="w-8 h-[2px] mx-auto rounded-full" style={{ backgroundColor: "rgba(200,164,93,0.4)" }} />
                <p className="text-[0.65rem] uppercase tracking-[0.2em] font-semibold" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — BOOKING WIDGET */}
      <section id="booking-console" className="section-container py-24 relative z-10">
        <div className="text-center space-y-4 mb-12">
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[0.65rem] uppercase tracking-widest font-bold"
            style={{ backgroundColor: "rgba(200,164,93,0.1)", border: "1px solid rgba(200,164,93,0.25)", color: "#B8963B" }}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Instant Price Calculator</span>
          </span>
          <h2
            className="font-heading font-bold"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", letterSpacing: "-0.02em", color: "#0F172A" }}
          >
            {language === "ar"
              ? "احجز تاكسيك الآن — احسب السعر فوراً"
              : "Get an Instant Taxi Price Quote"}
          </h2>
          <p className="max-w-xl mx-auto text-sm" style={{ color: "#6B7280" }}>
            {language === "ar"
              ? "احسب سعر رحلتك بدقة لأي مسار في المملكة — بدون رسوم مخفية أو زيادة مفاجئة"
              : "Get an exact price for your taxi ride anywhere in Saudi Arabia — fixed fare, no hidden charges, no surge pricing."}
          </p>
        </div>
        <PriceCalculator />
      </section>

      {/* SECTION 4 — SERVICES */}
      <section className="py-24 border-t border-[#C9A84C]/10 relative z-10" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="section-container">
          <div className="text-center space-y-3 mb-14">
            <span className="text-[0.65rem] uppercase tracking-[0.25em] text-[#C9A84C] font-bold">
              {t.services.badge}
            </span>
            <h2
              className="font-heading font-bold"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", letterSpacing: "-0.02em", color: "#0F172A" }}
            >
              {t.services.title}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {t.services.cards.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.article
                  key={service.title}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.15 }}
                  variants={fadeUp}
                  transition={{ duration: 0.45, delay: index * 0.07 }}
                  whileHover={{ y: -6, boxShadow: "0 20px 56px rgba(200,164,93,0.13)" }}
                  className="group relative flex flex-col justify-between rounded-2xl p-7 bg-[#121212] transition-all duration-350"
                  style={{
                    border: "1.5px solid rgba(200,164,93,0.15)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Gold accent line — grows on hover */}
                  <span
                    className="block h-[3px] rounded-full mb-6 transition-all duration-400"
                    style={{
                      width: "40px",
                      background: "linear-gradient(90deg, #C8A45D, #F4E4BC)",
                    }}
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-5">
                      <div
                        className="rounded-xl p-3 transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: "rgba(200,164,93,0.1)" }}
                      >
                        <Icon className="h-6 w-6 text-[#C9A84C]" />
                      </div>
                      <span
                        className="text-[0.62rem] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full"
                        style={{ color: "#C8A45D", backgroundColor: "rgba(200,164,93,0.08)", border: "1px solid rgba(200,164,93,0.2)" }}
                      >
                        {service.price}
                      </span>
                    </div>

                    <h3
                      className="font-heading font-bold text-[#F5F0E8] group-hover:text-[#C8A45D] transition-colors duration-300 mb-3"
                      style={{ fontSize: "1.2rem", letterSpacing: "-0.01em" }}
                    >
                      {service.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-[#A1A1A6]">
                      {service.desc}
                    </p>
                  </div>

                  <div
                    className="mt-6 pt-5 flex items-center justify-between"
                    style={{ borderTop: "1px solid rgba(200,164,93,0.1)" }}
                  >
                    <a
                      href="#booking-console"
                      className="inline-flex items-center gap-1.5 text-[0.72rem] font-bold uppercase tracking-wider text-[#C9A84C] hover:gap-3 transition-all"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5 — WHY CHOOSE US */}
      <section className="section-container py-24 border-t border-[#C9A84C]/10 relative z-10">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] items-start">

          {/* Left: title + description */}
          <div className="space-y-5 lg:sticky lg:top-28">
            <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold" style={{ color: "#C8A45D" }}>
              {t.whyUs.badge}
            </span>
            <h2
              className="font-heading font-bold"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", letterSpacing: "-0.02em", color: "#0F172A" }}
            >
              {t.whyUs.title}
            </h2>
            <p className="text-sm leading-relaxed text-[#A1A1A6]">
              {t.whyUs.desc}
            </p>
            <a
              href={contactConfig.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all"
              style={{ border: "1.5px solid rgba(200,164,93,0.35)" }}
            >
              <PhoneCall className="h-4 w-4" />
              <span>Call or WhatsApp 24/7</span>
            </a>
          </div>

          {/* Right: feature grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {t.whyUs.points.map((pt, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="rounded-xl p-5 space-y-2.5 transition-all duration-300 hover:shadow-md group"
                style={{
                  border: "1.5px solid rgba(200,164,93,0.12)",
                  backgroundColor: "#FFFFFF",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(200,164,93,0.35)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(200,164,93,0.12)")}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full shrink-0"
                    style={{ backgroundColor: "rgba(200,164,93,0.12)" }}
                  >
                    <CheckCircle className="h-3.5 w-3.5" style={{ color: "#C8A45D" }} />
                  </span>
                  <h4 className="font-heading font-bold text-[0.9rem]" style={{ color: "#0F172A" }}>
                    {pt.title}
                  </h4>
                </div>
                <p className="text-[0.72rem] leading-relaxed text-[#A1A1A6] pl-8">
                  {pt.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — POPULAR ROUTES */}
      <section className="section-container py-24 border-t border-[#C9A84C]/10 relative z-10">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-semibold">
              {t.routes.badge}
            </span>
            <h2 className="font-heading text-3xl font-bold md:text-4.5xl" style={{ color: "#0F172A" }}>
              {t.routes.title}
            </h2>
          </div>
          <Link
            href="/routes"
            className="text-xs uppercase font-bold tracking-widest text-[#C9A84C] hover:underline"
          >
            View All Taxi Routes in Saudi Arabia →
          </Link>
        </div>

        {/* Scrollable / Responsive Route Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {topRoutesList.map((route, index) => (
            <div
              key={index}
              className="group rounded-3xl border border-[#C9A84C]/15 bg-[#121212] p-6 flex flex-col justify-between hover:border-[#C9A84C]/35 transition-all duration-300"
            >
              <div>
                <h3 className="font-heading text-base font-bold text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors leading-tight">
                  {route[`name${language === 'ar' ? 'Ar' : 'En'}` as const]}
                </h3>

                <div className="mt-4 flex items-center justify-between text-[0.65rem] text-[#7C8088] font-bold">
                  <span>{route.dist}</span>
                  <span>{route.dur}</span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-[#C9A84C]/10 flex items-center justify-between">
                <div>
                  <p className="text-[0.55rem] uppercase tracking-wider text-[#7C8088]">
                    {language === "ar" ? "من" : "From"}
                  </p>
                  <p className="font-heading text-lg font-bold text-[#F5F0E8]">
                    SAR {route.price}
                  </p>
                </div>

                <button
                  onClick={handleSelectRoute}
                  className="rounded-full bg-[#C9A84C]/10 group-hover:bg-[#C9A84C] p-2 text-[#C9A84C] group-hover:text-[#0A0A0A] transition-all"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7 — FLEET PREVIEW */}
      <section id="fleet-showcase" className="section-container py-24 border-t border-[#C9A84C]/10 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C9A84C] font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C8A45D]" />
            {t.fleet.badge}
          </span>
          <h2 className="font-heading font-bold leading-tight"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", letterSpacing: "-0.02em", color: "#0F172A" }}
          >
            {t.fleet.title}
          </h2>
          <p className="max-w-xl mx-auto text-sm text-[#A1A1A6]">
            {t.fleet.desc}
          </p>
        </div>

        {/* 3-col grid for first 3, then 2-col for last 2 */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicleList.slice(0, 3).map((veh, index) => (
            <FleetCard key={veh.id} veh={veh} index={index} onBook={handleSelectVehicle} btnLabel={t.fleet.btnBook} />
          ))}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 mt-6">
          {vehicleList.slice(3).map((veh, index) => (
            <FleetCard key={veh.id} veh={veh} index={index + 3} onBook={handleSelectVehicle} btnLabel={t.fleet.btnBook} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/fleet"
            className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/35 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all hover:border-[#C8A45D]"
          >
            <span>{t.fleet.btnMore}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* SECTION 8 — INTERNATIONAL CLIENTELE */}
      <section className="py-16 border-y border-[#C9A84C]/15 relative z-10 overflow-hidden premium-dark-section" style={{ backgroundColor: "#0F172A" }}>
        <div className="section-container text-center mb-10">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-[#F5F0E8] tracking-wide">
            {t.clientele}
          </h2>
        </div>

        {/* Double-width seamless marquee container */}
        <div className="relative flex w-full overflow-x-hidden pointer-events-none">
          <div className={`${isRtl ? 'animate-marquee-rtl' : 'animate-marquee'} flex gap-8 whitespace-nowrap`}>
            {/* First stack */}
            {internationalNations.map((nation, index) => (
              <div
                key={`n1-${index}`}
                className="flex items-center gap-3 rounded-full border border-[#C9A84C]/10 bg-[#121212] px-6 py-2.5 text-xs font-semibold text-[#F5F0E8]"
              >
                <span className="text-lg">{nation.flag}</span>
                <span>{nation.name}</span>
              </div>
            ))}
            {/* Double stack for seamless loop */}
            {internationalNations.map((nation, index) => (
              <div
                key={`n2-${index}`}
                className="flex items-center gap-3 rounded-full border border-[#C9A84C]/10 bg-[#121212] px-6 py-2.5 text-xs font-semibold text-[#F5F0E8]"
              >
                <span className="text-lg">{nation.flag}</span>
                <span>{nation.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9 — UMRAH SPECIAL SECTION */}
      <section className="relative py-32 border-b border-[#C9A84C]/15 overflow-hidden premium-dark-section">
        {/* Background holy image with dark overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/umrah-section.webp"
            alt="Grand mosque at sunset — Umrah & Ziyarat transport in Saudi Arabia"
            fill
            className="object-cover brightness-20 blur-xs"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-transparent" />
        </div>

        <div className="section-container relative z-10 grid gap-16 md:grid-cols-2 items-center">
          
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A84C] font-semibold flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-[#C9A84C]" />
              <span>Umrah & Hajj Taxi Service</span>
            </span>
            <h2 className="font-heading text-3.5xl font-bold leading-tight md:text-5xl text-[#F5F0E8]">
              {t.umrah.title}
            </h2>
            <p className="text-sm leading-relaxed text-[#A1A1A6]">
              {t.umrah.desc}
            </p>

            <ul className="grid gap-3.5 text-xs text-[#F5F0E8] font-semibold">
              {[t.umrah.point1, t.umrah.point2, t.umrah.point3, t.umrah.point4].map((point, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-[#C9A84C] shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <a
                href={`https://wa.me/${contactConfig.whatsappNumber}?text=Salam,%20I%20would%20like%20to%20book%20a%20spiritually-compliant%20VIP%20Umrah%20transfer.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full bg-[#C9A84C] px-8 py-4 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] shadow-[0_4px_20px_rgba(201,168,76,0.3)] transition-all hover:bg-[#B8963B] hover:scale-102"
              >
                <MessageCircle className="h-5 w-5 fill-[#0A0A0A]" />
                <span>{t.umrah.btnWhatsApp}</span>
              </a>
            </div>
          </div>

          {/* Highlight Routes side card */}
          <div className="rounded-3xl border border-[#C9A84C]/20 bg-black/40 backdrop-blur-md p-8 space-y-6">
            <h3 className="font-heading text-xl font-bold text-[#F5F0E8] border-b border-[#C9A84C]/10 pb-4">
              Popular Umrah Taxi Routes
            </h3>

            <div className="space-y-4">
              {[
                { rEn: "Jeddah Airport ➔ Makkah Haram", rAr: "مطار جدة ➔ الحرم المكي الشريف", rUr: "جدہ ایئرپورٹ ➔ مکہ مکرمہ", time: "1h 15m", price: "249" },
                { rEn: "Makkah Haram ➔ Madinah Nabawi", rAr: "الحرم المكي ➔ المسجد النبوي بالمدينة", rUr: "مکہ مکرمہ ➔ مدینہ منورہ", time: "4h 30m", price: "799" },
                { rEn: "Madinah Nabawi ➔ Jeddah Airport", rAr: "المسجد النبوي ➔ مطار جدة الدولي", rUr: "مدینہ منورہ ➔ جدہ ایئرپورٹ", time: "4h 10m", price: "749" }
              ].map((route, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-[#F5F0E8]">
                      {route[`r${language === 'ar' ? 'Ar' : 'En'}` as const]}
                    </p>
                    <p className="text-[0.6rem] text-[#7C8088] font-medium mt-1">
                      {route.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[0.55rem] text-[#7C8088] uppercase">From</p>
                    <p className="font-bold text-[#C9A84C] mt-0.5">SAR {route.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 10 — TESTIMONIALS */}
      <section className="py-24 border-t border-[#C9A84C]/10 relative z-10" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="section-container">
          <div className="text-center space-y-3 mb-14">
            <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold" style={{ color: "#C8A45D" }}>
              {t.testimonials.badge}
            </span>
            <h2
              className="font-heading font-bold"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", letterSpacing: "-0.02em", color: "#0F172A" }}
            >
              {t.testimonials.title}
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {customerReviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                className="rounded-2xl p-6 space-y-4 flex flex-col transition-all duration-300"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1.5px solid rgba(200,164,93,0.12)",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(200,164,93,0.35)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(200,164,93,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(200,164,93,0.12)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.04)";
                }}
              >
                {/* Stars */}
                <div className="flex gap-0.5">
                  {[...Array(review.stars)].map((_, i) => (
                    <Star key={i} className="h-4 w-4" style={{ color: "#C8A45D", fill: "#C8A45D" }} />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm leading-relaxed flex-1" style={{ color: "#374151", fontStyle: "italic" }}>
                  &ldquo;{review.text}&rdquo;
                </p>

                {/* Reviewer */}
                <div
                  className="flex items-center justify-between pt-4"
                  style={{ borderTop: "1px solid rgba(200,164,93,0.12)" }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{review.countryFlag}</span>
                    <div>
                      <p className="font-heading font-bold text-[0.85rem]" style={{ color: "#0F172A" }}>
                        {review.name}
                      </p>
                      <p className="text-[0.58rem] font-medium" style={{ color: "#9CA3AF" }}>
                        {t.testimonials.verified}
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-[0.58rem] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full flex items-center gap-1"
                    style={{ color: "#C8A45D", backgroundColor: "rgba(200,164,93,0.08)", border: "1px solid rgba(200,164,93,0.2)" }}
                  >
                    <Car className="h-3 w-3" />
                    {review.vehicle.split(" ")[0]}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 11 — BLOG PREVIEW */}
      <section className="section-container py-24 border-t border-[#C9A84C]/10 relative z-10">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-semibold">
              {t.blog.badge}
            </span>
            <h2 className="font-heading text-3xl font-bold md:text-4.5xl" style={{ color: "#0F172A" }}>
              {t.blog.title}
            </h2>
          </div>
          <Link
            href="/guides"
            className="text-xs uppercase font-bold tracking-widest text-[#C9A84C] hover:underline"
          >
            See All Travel Guides →
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {blogList.map((blog, idx) => (
            <article
              key={idx}
              className="group relative flex flex-col justify-between rounded-3xl border border-[#C9A84C]/15 bg-[#121212] p-8 shadow-2xl hover:border-[#C9A84C]/35 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between text-[0.6rem] text-[#7C8088] font-bold uppercase tracking-wider mb-5">
                  <span className="text-[#C9A84C]">{blog[`category${language === 'ar' ? 'Ar' : 'En'}` as const]}</span>
                  <span>{blog[`time${language === 'ar' ? 'Ar' : 'En'}` as const]}</span>
                </div>

                <h3 className="font-heading text-lg font-bold text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors leading-snug">
                  {blog[`title${language === 'ar' ? 'Ar' : 'En'}` as const]}
                </h3>

                <p className="mt-4 text-[0.7rem] leading-relaxed text-[#A1A1A6]">
                  {blog[`excerpt${language === 'ar' ? 'Ar' : 'En'}` as const]}
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-[#C9A84C]/10 flex items-center justify-between text-[0.6rem] text-[#7C8088] font-bold">
                <span>By {blog.author}</span>
                <Link
                  href={`/guides?id=${blog.id}`}
                  className="text-[#C9A84C] uppercase tracking-wider flex items-center gap-1 hover:underline"
                >
                  <span>{t.blog.btnRead}</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SECTION 12 — FINAL CTA */}
      <section className="section-container pb-28 pt-10 relative z-10">
        <div className="relative overflow-hidden rounded-3xl border border-[#C9A84C]/25 bg-[#121212] p-10 md:p-14 text-center">
          {/* Subtle gold overlay lines */}
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#C9A84C]/5 blur-3xl pointer-events-none" />

          <h3 className="font-heading text-4xl font-bold md:text-5.5xl leading-tight" style={{ color: "#0F172A" }}>
            {t.cta.title}
          </h3>
          
          <p className="mt-4 max-w-xl mx-auto text-xs md:text-sm leading-relaxed text-[#A1A1A6]">
            {t.cta.desc}
          </p>
          
          <div className="mt-10 flex flex-wrap justify-center gap-4 text-xs font-semibold uppercase tracking-wider">
            <a
              className="rounded-full bg-[#C9A84C] px-8 py-4 text-[#0A0A0A] hover:bg-[#B8963B] transition-all duration-300 hover:scale-102 font-bold shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
              href="#booking-console"
            >
              {t.cta.btnBook}
            </a>
            <a
              className="rounded-full border border-[#C9A84C]/45 px-8 py-4 text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all flex items-center gap-2 font-bold"
              href={contactConfig.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4.5 w-4.5 fill-[#C9A84C]/10 text-[#C9A84C]" />
              <span>{t.cta.btnWhatsApp}</span>
            </a>
          </div>

          <div className="mt-10 border-t border-[#C9A84C]/10 pt-8 text-[0.55rem] md:text-[0.6rem] uppercase tracking-[0.2em] font-bold text-[#7C8088] flex items-center justify-center gap-2">
            <ShieldCheck className="h-4.5 w-4.5 text-[#C9A84C] shrink-0" />
            <span>{t.cta.trust}</span>
          </div>
        </div>
      </section>

    </main>
  );
}
