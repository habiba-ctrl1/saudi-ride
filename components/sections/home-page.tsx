"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/context/LanguageContext";
import { contactConfig } from "@/lib/config/contact";
import PriceCalculator from "@/components/booking/PriceCalculator";
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
  MessageCircle
} from "lucide-react";


const homeTranslations = {
  en: {
    hero: {
      badge: "Elite Transportation Service",
      title: "Premium Taxi & Chauffeur Services",
      subtitle: "VIP Chauffeur Service across Saudi Arabia — Airports, Umrah & Intercity transfers. Travel in maximum comfort.",
      btnBook: "Book Luxury Ride",
      btnFleet: "View Prestige Fleet",
      badges: ["24/7 Premium Support", "100% Ministry Licensed", "Fixed Competitive Prices"]
    },
    stats: [
      { label: "VIP Trips Completed", value: "50,000+" },
      { label: "Ministry Licensed Drivers", value: "100%" },
      { label: "Years Luxury Experience", value: "10+" },
      { label: "Dedicated Chauffeurs", value: "24/7" },
      { label: "Passenger Rating", value: "4.9★" },
      { label: "Nations Served", value: "40+" }
    ],
    widget: {
      oneWay: "One Way",
      roundTrip: "Round Trip",
      hourly: "Hourly Service",
      pickupLabel: "Pickup Hub",
      dropoffLabel: "Drop-off Destination",
      hoursLabel: "Duration Needed",
      dateLabel: "Pickup Date",
      returnDateLabel: "Return Date",
      timeLabel: "Pickup Time",
      passengersLabel: "Passengers",
      vehicleLabel: "Chauffeur Class",
      btnCalculate: "Calculate Price Range",
      whatsappLabel: "Or book via VIP WhatsApp support desk →",
      popDestinations: "Popular Locations",
      hrs: "hours"
    },
    services: {
      badge: "Executive Offerings",
      title: "Tailored for royal comfort",
      cards: [
        {
          title: "Airport Transfers",
          desc: "Seamless, flight-tracked meet & greet at Jeddah (JED), Riyadh (RUH), and Madinah (MED) airports.",
          price: "From SAR 199",
          icon: Globe
        },
        {
          title: "Umrah & Ziyarat",
          desc: "Dedicated holy transfers. Driver in Ihram status available upon request with complete Meeqat knowledge.",
          price: "From SAR 249",
          icon: Sparkles
        },
        {
          title: "Intercity Corridors",
          desc: "State-of-the-art highway cruising between Riyadh, Jeddah, Makkah, Dammam, and Medina.",
          price: "From SAR 599",
          icon: Compass
        },
        {
          title: "Corporate & Executive",
          desc: "Prestige business travel with premium Wi-Fi cabins for board members, diplomats, and VIP delegations.",
          price: "From SAR 799",
          icon: Award
        },
        {
          title: "GCC Border Crossings",
          desc: "Smooth road luxury connecting major gateways into Bahrain, Qatar, UAE, and Kuwait.",
          price: "From SAR 1,499",
          icon: ShieldCheck
        },
        {
          title: "Kingdom Tourism Packages",
          desc: "Bespoke guided exploration itineraries to heritage zones like historic AlUla, Taif heights, and NEOM.",
          price: "From SAR 999",
          icon: Car
        }
      ]
    },
    whyUs: {
      badge: "Prestige Standards",
      title: "Why VIP travelers choose Riyadh Luxe",
      desc: "We merge contemporary Western hospitality precision with timeless Arabian generosity to elevate every single highway kilometer.",
      points: [
        { title: "Ministry Licensed", desc: "100% compliant with MOT and TGA regulatory structures." },
        { title: "Fixed Luxury Pricing", desc: "No surge multipliers. The quote you reserve is exactly the fare you pay." },
        { title: "Prayer-Time Synchronized", desc: "Itinerary planning adjusts naturally around Salah prayer moments." },
        { title: "Smart Flight Tracking", desc: "We monitor delays live. Your chauffeur waits 60 mins complimentary." },
        { title: "Trilingual Chauffeurs", desc: "Elite drivers fluent in English, Arabic, and Urdu at your service." },
        { title: "Free Cancellations", desc: "Cancel up to 24 hours prior with complete fee reversal." },
        { title: "VIP Meet & Greet", desc: "Baggage assistance and personalized terminal signage on arrival." },
        { title: "ZATCA E-Invoicing", desc: "Fully automated tax receipts for flawless corporate accounting." }
      ]
    },
    routes: {
      badge: "Sought-After Corridors",
      title: "Popular Luxury Corridors",
      btnBook: "Book Route"
    },
    fleet: {
      badge: "The Royal Garage",
      title: "Our Elite Vehicle Showcase",
      desc: "Meticulously detailed and sanitised passenger cabins outfitted with premium amenities.",
      btnBook: "Reserve Class",
      btnMore: "Explore Full Fleet Catalogue",
      camrySpec: "Perfect for corporate transfers and agile intercity runs.",
      yukonSpec: "The ultimate luxury standard. Vast cabin space with unparalleled executive presence.",
      stariaSpec: "First-class VIP seating designed for holy pilgrimages and family convenience."
    },
    clientele: "Trusted by Pilgrims & Executives from 40+ Nations",
    umrah: {
      title: "The Sacred Journey Deserves Sacred Service",
      desc: "For pilgrims undertaking the holy rites, we offer spiritual sensitivity alongside physical convenience.",
      point1: "Prayer-synchronized travel options",
      point2: "Complete Meeqat stopover compliance",
      point3: "Direct VIP drop-off boundaries near the holy Mosques",
      point4: "Spiritual sensitivity and pilgrim hospitality trained drivers",
      btnWhatsApp: "Book Umrah Chauffeur on WhatsApp"
    },
    testimonials: {
      badge: "Global Praise",
      title: "What VIP pilgrims say about us",
      verified: "Google Review • Verified Trip"
    },
    blog: {
      badge: "Travel Insights",
      title: "Concierge Knowledge Base",
      btnRead: "Read Full Article →"
    },
    cta: {
      title: "Ready for Your VIP Ride?",
      desc: "Experience travel at the absolute highest standard in Saudi Arabia. Book in under 2 minutes.",
      btnBook: "Book Online",
      btnWhatsApp: "Reserve via WhatsApp",
      trust: "Instant Confirmation • Guaranteed Fixed Rates • 24/7 Dedicated Concierge Desk"
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
      { label: "رحلة فاخرة مكتملة", value: "+٥٠,٠٠٠" },
      { label: "سائقين مرخصين من الوزارة", value: "١٠٠٪" },
      { label: "سنوات من التميز والخبرة", value: "+١٠" },
      { label: "سائقين خاصين متوفرين", value: "٢٤/٧" },
      { label: "تقييم الركاب الفاخر", value: "٤.٩★" },
      { label: "جنسية تم خدمتها", value: "+٤٠" }
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
      { label: "VIP دورے مکمل", value: "50,000+" },
      { label: "وزارت سے لائسنس یافتہ", value: "100%" },
      { label: "سال کا لگژری تجربہ", value: "10+" },
      { label: "وقف ڈرائیورز", value: "24/7" },
      { label: "مسافروں کی درجہ بندی", value: "4.9★" },
      { label: "ممالک کی خدمت کی", value: "40+" }
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
    id: "camry",
    name: "Toyota Camry Executive",
    type: "Business Sedan",
    capacity: "3 Passengers",
    luggage: "2 Suitcases",
    image: "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "yukon",
    name: "GMC Yukon Denali XL",
    type: "VIP SUV",
    capacity: "6 Passengers",
    luggage: "5 Suitcases",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "staria",
    name: "Hyundai Staria Premium",
    type: "VIP Cabin Van",
    capacity: "7 Passengers",
    luggage: "7 Suitcases",
    image: "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=600&q=80"
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
  { name: "Dr. Farhan Malik", countryFlag: "🇬🇧", stars: 5, text: "Flawless service from Jeddah to Makkah. Chauffeur was waiting in the arrivals hall with a gold tablet. Extremely smooth ride.", vehicle: "GMC Yukon Denali" },
  { name: "Amna Al-Faisal", countryFlag: "🇸🇦", stars: 5, text: "سيارات فاخرة للغاية وخدمة متميزة تليق بكبار الشخصيات. سائق محترف ولديه دراية ممتازة بمواقع مكة والمدينة.", vehicle: "Toyota Camry Executive" },
  { name: "Muhammad Siddique", countryFlag: "🇵🇰", stars: 5, text: "Wonderful pilgrimage booking. The driver was prayer-time aware and stopped for us at Meeqat with absolute respect and patience.", vehicle: "Hyundai Staria Premium" },
  { name: "Hassan Qabbani", countryFlag: "🇦🇪", stars: 5, text: "Highly recommend Riyadh Luxe. Complete luxury, premium Wi-Fi cabin, and fixed rates with zero hidden surge billing.", vehicle: "GMC Yukon Denali" },
  { name: "Evelyn Sterling", countryFlag: "🇺🇸", stars: 5, text: "Exceptional airport meet & greet. Flight was delayed by 2 hours, but the chauffeur tracked it and was right there. Pure class.", vehicle: "GMC Yukon Denali" },
  { name: "Ahmad Bin-Hamid", countryFlag: "🇶🇦", stars: 5, text: "سفر مريح بين الرياض والدمام. مقاعد في آي بي فاخرة وخدمة إنترنت ممتازة طوال الطريق.", vehicle: "Toyota Camry Executive" }
];

const blogList = [
  { categoryEn: "Airport Help", categoryAr: "مساعدة المطار", categoryUr: "ہوائی اڈے کی مدد", titleEn: "SIM Card buying guide at Jeddah Airport", titleAr: "دليل شراء بطاقات الاتصال SIM في مطار جدة", titleUr: "جدہ ایئرپورٹ پر سم کارڈ خریدنے کا گائیڈ", excerptEn: "Exactly where to purchase local 5G eSIMs/SIMs from stc, Mobily, or Zain upon landing at Terminal 1 or North Terminal.", excerptAr: "أين تشتري شرائح الاتصال المحلية eSIM/SIM من شركات stc، وموبايلي، وزين فور وصولك لصالة المطار.", excerptUr: "ٹرمینل 1 پر لینڈنگ کے بعد stc، Mobily، یا Zain سے مقامی 5G eSIMs/SIMs خریدنے کی درست جگہوں کی معلومات۔", author: "Muhammad Ismail", date: "May 12, 2026", timeEn: "5 min read", timeAr: "قراءة ٥ دقائق", timeUr: "5 منٹ مطالعہ" },
  { categoryEn: "Umrah", categoryAr: "العمرة والزيارة", categoryUr: "عمرہ اور زیارت", titleEn: "Complete Meeqat locations guide for Umrah", titleAr: "دليل مواقيت الإحرام الكامل للمعتمرين", titleUr: "عمرہ کے لیے میقات کے مقامات کی مکمل گائیڈ", excerptEn: "Step-by-step guidance on Meeqat points (including Dhul Hulaifah & Yalamlam) for international pilgrims arriving by air or road.", excerptAr: "شرح تفصيلي خطوة بخطوة لمواقيت الإحرام (بما في ذلك ذو الحليفة ويلملم) للحجاج والمعتمرين القادمين جواً أو براً.", excerptUr: "فضائی یا زمینی راستے سے آنے والے بین الاقوامی زائرین کے لیے میقات کے مقامات پر تفصیلی رہنمائی۔", author: "Muhammad Ismail", date: "May 08, 2026", timeEn: "7 min read", timeAr: "قراءة ٧ دقائق", timeUr: "7 منٹ مطالعہ" },
  { categoryEn: "Travel Finance", categoryAr: "المالية والسفر", categoryUr: "ٹریول فنانس", titleEn: "Saudi Riyal cash & card tips for pilgrims", titleAr: "نصائح الكاش والبطاقات للمعتمرين في السعودية", titleUr: "زائرین کے لیے سعودی ریال کیش اور کارڈ کی تجاویز", excerptEn: "Everything about card acceptance, local mada payment network, currency exchange outlets, and ATM fee limits in KSA.", excerptAr: "كل ما تحتاج لمعرفته حول قبول بطاقات الائتمان، شبكة مدى المحلية، منافذ الصرافة ورسوم السحب من أجهزة الصراف الآلي.", excerptUr: "کارڈز کی قبولیت، مقامی mada پیمنٹ نیٹ ورک، کرنسی ایکسچینج اور اے ٹی ایم فیس کی حدود کے بارے میں سب کچھ۔", author: "Muhammad Ismail", date: "April 29, 2026", timeEn: "4 min read", timeAr: "قراءة ٤ دقائق", timeUr: "4 منٹ مطالعہ" }
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

export function HomePage() {
  const { language } = useLanguage();
  const t = homeTranslations[language];

  // Active Direction for RTL Support
  const isRtl = language === "ar";

  // Trust Stats Counter state
  const [tripsCounter, setTripsCounter] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = 50000;
    const duration = 2000;
    const increment = Math.ceil(end / (duration / 50));
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setTripsCounter(end);
        clearInterval(timer);
      } else {
        setTripsCounter(start);
      }
    }, 50);

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

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] overflow-hidden pt-20">
      
      {/* SECTION 1 — HERO */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden border-b border-[#C9A84C]/15 py-24">
        {/* Unsplash Dark Luxury car overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2000&auto=format&fit=crop"
            alt="Makkah Holy Gateway Luxury SUV"
            fill
            className="object-cover brightness-35 grayscale-[20%]"
            priority
          />
          {/* Elegant gold/black radial gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/90 to-[#0A0A0A]" />
          <div className="absolute -inset-x-0 -bottom-1 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
        </div>

        <div className="section-container relative z-10 w-full text-center">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            {/* Custom glowing gold crescent emblem */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/25 bg-black/45 px-4.5 py-1.5 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#C9A84C] animate-pulse" />
              <span className="text-[0.65rem] uppercase tracking-[0.25em] text-[#C9A84C] font-bold">
                {t.hero.badge}
              </span>
            </div>

            <h1 className="font-heading text-5xl font-bold leading-[1.1] md:text-7.5xl text-[#F5F0E8]">
              {language === "ar" ? (
                <>
                  خدمات نقل فاخرة تليق بـ
                  <span className="block text-[#C9A84C] font-heading mt-2">كبار الشخصيات</span>
                </>
              ) : language === "ur" ? (
                <>
                  سعودی عرب کی سب سے بہترین
                  <span className="block text-[#C9A84C] font-heading mt-2">وی آئی پی ٹیکسی سروس</span>
                </>
              ) : (
                <>
                  Premium Chauffeur &<br />
                  <span className="block text-[#C9A84C] font-heading mt-3 tracking-wide">Luxe Taxi Services</span>
                </>
              )}
            </h1>

            <p className="max-w-2xl mx-auto text-sm md:text-base leading-relaxed text-[#A1A1A6]">
              {t.hero.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-5 pt-3">
              <a
                href="#booking-console"
                className="rounded-full bg-[#C9A84C] px-9 py-4 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] shadow-[0_4px_25px_rgba(201,168,76,0.35)] transition-all duration-300 hover:bg-[#B8963B] hover:scale-102 hover:shadow-[0_6px_35px_rgba(201,168,76,0.55)]"
              >
                {t.hero.btnBook}
              </a>
              <a
                href="#fleet-showcase"
                className="rounded-full border border-[#C9A84C]/45 px-9 py-4 text-xs font-bold uppercase tracking-wider text-[#C9A84C] transition-all duration-300 hover:bg-[#C9A84C]/10 hover:border-[#C9A84C]"
              >
                {t.hero.btnFleet}
              </a>
            </div>

            {/* Floating Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 pt-10 text-[0.65rem] uppercase tracking-[0.2em] font-semibold text-[#A1A1A6]">
              {t.hero.badges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle className="h-4.5 w-4.5 text-[#C9A84C] shrink-0" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 — TRUST STATS BAR */}
      <section className="bg-black py-10 border-b border-[#C9A84C]/15 relative z-10">
        <div className="section-container">
          <div className="grid grid-cols-2 gap-y-8 md:grid-cols-6 md:gap-x-4 text-center">
            {t.stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <p className="font-heading text-2.5xl md:text-3.5xl font-bold text-[#C9A84C]">
                  {idx === 0 ? `${tripsCounter.toLocaleString()}+` : stat.value}
                </p>
                <p className="text-[0.6rem] uppercase tracking-wider text-[#7C8088] font-medium px-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — BOOKING WIDGET */}
      <section id="booking-console" className="section-container py-24 relative z-10">
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-1.5 text-[#C9A84C] text-[0.65rem] uppercase tracking-widest font-bold">
            <Calendar className="h-4.5 w-4.5" />
            <span>Secure Dispatch System</span>
          </div>
          <h2 className="font-heading text-3xl font-bold text-[#F5F0E8] md:text-4.5xl">
            {language === "ar" ? "احجز سائقك الخاص الفاخر بلحظات" : language === "ur" ? "اپنی لگژری سواری فوری بک کریں" : "Reserve Your VIP Chauffeur"}
          </h2>
          <p className="max-w-2xl mx-auto text-xs text-[#A1A1A6]">
            Calculate accurate point-to-point fares based on true highway mileage with 100% fixed-quote pricing transparency.
          </p>
        </div>

        {/* Console Container */}
        <PriceCalculator />
      </section>

      {/* SECTION 4 — SERVICES */}
      <section className="section-container py-24 border-t border-[#C9A84C]/10 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-semibold">
            {t.services.badge}
          </span>
          <h2 className="font-heading text-3xl font-bold leading-tight md:text-4.5xl text-[#F5F0E8]">
            {t.services.title}
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {t.services.cards.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative flex flex-col justify-between rounded-3xl border border-[#C9A84C]/15 bg-[#121212] p-8 shadow-2xl hover:border-[#C9A84C]/45 transition-all duration-300"
                whileHover={{ y: -6 }}
              >
                {/* Glow Backdrop Vector */}
                <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[#C9A84C]/5 blur-3xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between border-b border-[#C9A84C]/10 pb-5">
                    <div className="rounded-2xl bg-[#C9A84C]/10 p-3 text-[#C9A84C] group-hover:scale-105 transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[0.65rem] uppercase tracking-widest text-[#C9A84C] font-bold">
                      {service.price}
                    </span>
                  </div>

                  <h3 className="mt-6 font-heading text-xl font-bold text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors duration-300">
                    {service.title}
                  </h3>

                  <p className="mt-4 text-xs leading-relaxed text-[#A1A1A6]">
                    {service.desc}
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-[#C9A84C]/10">
                  <a
                    href="#booking-console"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9A84C]"
                  >
                    <span>Reserve Service</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* SECTION 5 — WHY CHOOSE US */}
      <section className="section-container py-24 border-t border-[#C9A84C]/10 relative z-10">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] items-center">
          
          {/* Left Column Description */}
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A84C] font-semibold">
              {t.whyUs.badge}
            </span>
            <h2 className="font-heading text-3xl font-bold leading-tight md:text-4.5xl text-[#F5F0E8]">
              {t.whyUs.title}
            </h2>
            <p className="text-sm leading-relaxed text-[#A1A1A6]">
              {t.whyUs.desc}
            </p>

            <div className="pt-4">
              <a
                href={contactConfig.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/35 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:bg-[#C9A84C]/10"
              >
                <PhoneCall className="h-4 w-4" />
                <span>Contact 24/7 Dispatch Office</span>
              </a>
            </div>
          </div>

          {/* Right Column Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {t.whyUs.points.map((pt, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#C9A84C]/10 bg-[#121212]/50 p-6 space-y-3 hover:border-[#C9A84C]/25 transition-all"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4.5 w-4.5 text-[#C9A84C] shrink-0" />
                  <h4 className="font-heading text-base font-bold text-[#F5F0E8]">
                    {pt.title}
                  </h4>
                </div>
                <p className="text-[0.7rem] leading-relaxed text-[#A1A1A6]">
                  {pt.desc}
                </p>
              </div>
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
            <h2 className="font-heading text-3xl font-bold text-[#F5F0E8] md:text-4.5xl">
              {t.routes.title}
            </h2>
          </div>
          <Link
            href="/routes"
            className="text-xs uppercase font-bold tracking-widest text-[#C9A84C] hover:underline"
          >
            View all Saudi routes →
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
                  {route[`name${language === 'ar' ? 'Ar' : language === 'ur' ? 'Ur' : 'En'}` as const]}
                </h3>

                <div className="mt-4 flex items-center justify-between text-[0.65rem] text-[#7C8088] font-bold">
                  <span>{route.dist}</span>
                  <span>{route.dur}</span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-[#C9A84C]/10 flex items-center justify-between">
                <div>
                  <p className="text-[0.55rem] uppercase tracking-wider text-[#7C8088]">
                    {language === "ar" ? "من" : language === "ur" ? "سے" : "From"}
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
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A84C] font-semibold">
            {t.fleet.badge}
          </span>
          <h2 className="font-heading text-3xl font-bold leading-tight md:text-4.5xl text-[#F5F0E8]">
            {t.fleet.title}
          </h2>
          <p className="max-w-2xl mx-auto text-xs text-[#A1A1A6]">
            {t.fleet.desc}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {vehicleList.map((veh, index) => (
            <motion.article
              key={veh.id}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-[#C9A84C]/15 bg-[#121212] shadow-2xl hover:border-[#C9A84C]/35 transition-all duration-300"
            >
              {/* Image Box */}
              <div className="relative h-60 w-full overflow-hidden">
                <Image
                  src={veh.image}
                  alt={veh.name}
                  fill
                  className="object-cover brightness-90 transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-black/75 px-3 py-1 text-[0.6rem] uppercase tracking-wider font-bold text-[#C9A84C] border border-[#C9A84C]/25">
                  {veh.type}
                </span>
              </div>

              {/* Spec Details */}
              <div className="p-6 space-y-4">
                <h3 className="font-heading text-xl font-bold text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors">
                  {veh.name}
                </h3>
                
                <p className="text-[0.7rem] text-[#A1A1A6]">
                  {veh.id === "camry" ? t.fleet.camrySpec : veh.id === "yukon" ? t.fleet.yukonSpec : t.fleet.stariaSpec}
                </p>

                <div className="flex items-center gap-4 text-[0.65rem] text-[#7C8088] font-bold border-y border-[#C9A84C]/10 py-3">
                  <span>{veh.capacity}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C9A84C]" />
                  <span>{veh.luggage}</span>
                </div>

                <button
                  onClick={handleSelectVehicle}
                  className="w-full rounded-full bg-[#C9A84C]/10 group-hover:bg-[#C9A84C] py-3 text-xs font-bold uppercase tracking-wider text-[#C9A84C] group-hover:text-[#0A0A0A] transition-all"
                >
                  {t.fleet.btnBook}
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/fleet"
            className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/35 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:bg-[#C9A84C]/10"
          >
            <span>{t.fleet.btnMore}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* SECTION 8 — INTERNATIONAL CLIENTELE */}
      <section className="bg-black/80 py-16 border-y border-[#C9A84C]/15 relative z-10 overflow-hidden">
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
      <section className="relative py-32 border-b border-[#C9A84C]/15 overflow-hidden">
        {/* Background holy image with dark overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=2000&auto=format&fit=crop"
            alt="Makkah Holy Kaaba Pilgrims"
            fill
            className="object-cover brightness-20 blur-xs"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-transparent" />
        </div>

        <div className="section-container relative z-10 grid gap-16 md:grid-cols-2 items-center">
          
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A84C] font-semibold flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-[#C9A84C]" />
              <span>Dedicated Holy Service</span>
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
                href={`https://wa.me/${contactConfig.whatsappLink.split("=")[1]}?text=Salam,%20I%20would%20like%20to%20book%20a%20spiritually-compliant%20VIP%20Umrah%20transfer.`}
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
              Pilgrim Corridors
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
                      {route[`r${language === 'ar' ? 'Ar' : language === 'ur' ? 'Ur' : 'En'}` as const]}
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
      <section className="section-container py-24 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-semibold">
            {t.testimonials.badge}
          </span>
          <h2 className="font-heading text-3xl font-bold leading-tight md:text-4.5xl text-[#F5F0E8]">
            {t.testimonials.title}
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {customerReviews.map((review, index) => (
            <div
              key={index}
              className="rounded-3xl border border-[#C9A84C]/15 bg-[#121212] p-8 space-y-5 hover:border-[#C9A84C]/35 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{review.countryFlag}</span>
                  <div>
                    <h4 className="font-heading text-sm font-bold text-[#F5F0E8]">
                      {review.name}
                    </h4>
                    <span className="text-[0.55rem] text-[#7C8088] font-medium">
                      {t.testimonials.verified}
                    </span>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(review.stars)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[#C9A84C] text-[#C9A84C]" />
                  ))}
                </div>
              </div>

              <p className="text-[0.7rem] leading-relaxed text-[#A1A1A6] italic">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="flex items-center gap-2 text-[0.6rem] text-[#C9A84C] font-bold uppercase tracking-wider border-t border-[#C9A84C]/10 pt-4">
                <Car className="h-3.5 w-3.5" />
                <span>Reserved: {review.vehicle}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 11 — BLOG PREVIEW */}
      <section className="section-container py-24 border-t border-[#C9A84C]/10 relative z-10">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-semibold">
              {t.blog.badge}
            </span>
            <h2 className="font-heading text-3xl font-bold text-[#F5F0E8] md:text-4.5xl">
              {t.blog.title}
            </h2>
          </div>
          <Link
            href="/guides"
            className="text-xs uppercase font-bold tracking-widest text-[#C9A84C] hover:underline"
          >
            See all articles →
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
                  <span className="text-[#C9A84C]">{blog[`category${language === 'ar' ? 'Ar' : language === 'ur' ? 'Ur' : 'En'}` as const]}</span>
                  <span>{blog[`time${language === 'ar' ? 'Ar' : language === 'ur' ? 'Ur' : 'En'}` as const]}</span>
                </div>

                <h3 className="font-heading text-lg font-bold text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors leading-snug">
                  {blog[`title${language === 'ar' ? 'Ar' : language === 'ur' ? 'Ur' : 'En'}` as const]}
                </h3>

                <p className="mt-4 text-[0.7rem] leading-relaxed text-[#A1A1A6]">
                  {blog[`excerpt${language === 'ar' ? 'Ar' : language === 'ur' ? 'Ur' : 'En'}` as const]}
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-[#C9A84C]/10 flex items-center justify-between text-[0.6rem] text-[#7C8088] font-bold">
                <span>By {blog.author}</span>
                <Link
                  href="/guides"
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

          <h3 className="font-heading text-4xl font-bold text-[#F5F0E8] md:text-5.5xl leading-tight">
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
