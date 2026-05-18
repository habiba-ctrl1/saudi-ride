"use client";

import { useLanguage } from "@/lib/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Search, MessageSquare, BookOpen, CreditCard, Plane, Compass, Car, Building2 } from "lucide-react";
import { useState } from "react";
import { contactConfig } from "@/lib/config/contact";
import { trackEvent } from "@/lib/analytics";

interface FAQItem {
  question: string;
  answer: string;
}

interface CategoryGroup {
  key: string;
  label: string;
  icon: React.ElementType;
  faqs: FAQItem[];
}

const translations: Record<string, {
  badge: string;
  title: string;
  description: string;
  searchPlaceholder: string;
  allCategories: string;
  noResults: string;
  ctaTitle: string;
  ctaDesc: string;
  ctaBtn: string;
  categories: CategoryGroup[];
}> = {
  en: {
    badge: "Information Desk",
    title: "Frequently Asked Questions",
    description: "Everything you need to know about reserving private VIP chauffeur services for spiritual, business, or family travel in Saudi Arabia.",
    searchPlaceholder: "Search questions or keywords...",
    allCategories: "All Categories",
    noResults: "No questions match your search query. Try typing another keyword or speak directly with our booking desk.",
    ctaTitle: "Still Have Questions?",
    ctaDesc: "Our 24/7 executive concierge desk is available to assist you with custom quotes, itineraries, and booking requests.",
    ctaBtn: "Chat with Concierge Desk",
    categories: [
      {
        key: "booking",
        label: "Booking & Reservations",
        icon: BookOpen,
        faqs: [
          {
            question: "How far in advance should I book my VIP transfer?",
            answer: "We recommend booking at least 24 hours in advance to guarantee your preferred vehicle class. For peak travel seasons (such as Ramadan or Hajj), booking 1-2 weeks in advance is highly recommended."
          },
          {
            question: "Can I modify or cancel my reservation?",
            answer: "Yes, reservations can be fully modified or cancelled free of charge up to 24 hours before your scheduled pickup. Cancellations within 24 hours may incur a partial processing fee."
          },
          {
            question: "Do you offer hourly booking options?",
            answer: "Yes, we offer flexible hourly charter services starting from a minimum of 4 hours, perfect for business summits, retail shopping, or local sightseeing tours."
          }
        ]
      },
      {
        key: "pricing",
        label: "Pricing & Payments",
        icon: CreditCard,
        faqs: [
          {
            question: "Are your pricing structures fully fixed?",
            answer: "Absolutely. All intercity and airport rates are 100% fixed, all-inclusive, and cover VAT, toll charges, airport parking fees, and fuel. There are zero hidden surcharges."
          },
          {
            question: "What payment methods do you accept?",
            answer: "We accept all major international credit/debit cards (Visa, Mastercard, American Express), Apple Pay, local Mada cards, and direct corporate bank transfers."
          },
          {
            question: "Do you require a deposit for luxury fleet charters?",
            answer: "For premium daily/hourly charters and high-end wedding fleets (like the Mercedes S-Class or Cadillac Escalade), a partial booking deposit is securely processed online to guarantee logistics."
          }
        ]
      },
      {
        key: "airport",
        label: "Airport Transfers",
        icon: Plane,
        faqs: [
          {
            question: "How do you coordinate airport arrivals?",
            answer: "We track all flights in real-time. Your assigned chauffeur will wait at the designated arrivals terminal with a personalized digital or physical name board precisely as your flight lands."
          },
          {
            question: "What happens if my flight is delayed?",
            answer: "There is no need to worry. We offer up to 90 minutes of complimentary waiting time at all Saudi airports for international flights and adjust driver dispatches automatically."
          },
          {
            question: "Is luggage assistance included in airport services?",
            answer: "Yes, absolute VIP luggage handling is fully included from the arrivals gate directly to your vehicle's trunk."
          }
        ]
      },
      {
        key: "umrah",
        label: "Umrah & Pilgrimage",
        icon: Compass,
        faqs: [
          {
            question: "Do you offer private Jeddah to Makkah transfers for pilgrims?",
            answer: "Yes, we specialize in high-demand, pre-booked airport transfers between Jeddah Airport (JED) and all Makkah hotels with luxury sedans, SUVs, and multi-passenger vans."
          },
          {
            question: "Can I book a multi-day Makkah to Madinah transit package?",
            answer: "Yes, we offer fully comprehensive Umrah packages covering Jeddah - Makkah - Madinah - Airport routes with customized intermediate stops."
          },
          {
            question: "Are drivers trained in pilgrim route protocols?",
            answer: "Our professional chauffeurs are highly experienced local experts who are intimately familiar with pilgrim logistics, Haram access points, and prayer schedules."
          }
        ]
      },
      {
        key: "fleet",
        label: "Fleet & Vehicles",
        icon: Car,
        faqs: [
          {
            question: "What luxury vehicle categories do you offer?",
            answer: "Our meticulously maintained fleet includes Executive Sedans (Toyota Camry), Premium SUVs (GMC Yukon XL), Luxury VIP Sedans (Mercedes S-Class), Luxury SUVs (Cadillac Escalade), VIP Multi-Passenger Vans (Hyundai Staria), and Prestige Coaches."
          },
          {
            question: "Do all vehicles have air conditioning and modern amenities?",
            answer: "Yes, 100% of our fleet features multi-zone climate control, high-speed onboard WiFi connectivity, complimentary bottled mineral water, and mobile charging docks."
          },
          {
            question: "Can I request child safety seats?",
            answer: "Yes, infant carriers, child safety seats, and toddler booster seats are available upon request and will be professionally fitted before pickup."
          }
        ]
      },
      {
        key: "corporate",
        label: "Corporate Accounts",
        icon: Building2,
        faqs: [
          {
            question: "Do you offer corporate travel accounts?",
            answer: "Yes, we offer specialized corporate accounts for companies, diplomatic missions, and hotels, featuring monthly itemized invoicing and dedicated dispatch priority."
          },
          {
            question: "Can you manage transport logistics for large summits?",
            answer: "Absolutely. Our operations team regularly coordinates luxury convoys for executive forums, state visits, and global conferences in Riyadh and Jeddah."
          }
        ]
      }
    ]
  },
  ar: {
    badge: "الأسئلة الشائعة",
    title: "أجوبة سريعة قبل إتمام الحجز",
    description: "كل ما تحتاج إلى معرفته حول حجز خدمات السائقين الخاصة وكبار الشخصيات للعمرة والأعمال والرحلات العائلية بالمملكة.",
    searchPlaceholder: "ابحث عن سؤال أو كلمة مفتاحية...",
    allCategories: "جميع الأقسام",
    noResults: "لم يتم العثور على نتائج تطابق بحثك. يرجى تجربة كلمات أخرى أو التحدث مباشرة مع خدمة العملاء.",
    ctaTitle: "هل لديك أسئلة أخرى؟",
    ctaDesc: "مكتب الكونسيرج وخدمة العملاء متاح على مدار الساعة لمساعدتكم في تخطيط مسارات رحلاتكم وتأكيد الحجوزات الخاصة.",
    ctaBtn: "تحدث مع مكتب الكونسيرج",
    categories: [
      {
        key: "booking",
        label: "الحجوزات والطلبات",
        icon: BookOpen,
        faqs: [
          {
            question: "كم من الوقت يجب أن أحجز مسبقاً؟",
            answer: "نوصي بالحجز قبل 24 ساعة على الأقل لضمان توافر فئة السيارة المفضلة لديك. في مواسم الذروة (مثل رمضان أو الحج)، يفضل الحجز قبل أسبوع أو أسبوعين."
          },
          {
            question: "هل يمكنني تعديل أو إلغاء حجزي؟",
            answer: "نعم، يمكنك تعديل أو إلغاء حجزك مجاناً بالكامل حتى 24 ساعة قبل موعد الرحلة المجدول."
          },
          {
            question: "هل توفرون خدمة الحجز بالساعة؟",
            answer: "نعم، نقدم خيارات حجز مرنة بالساعة تبدأ من 4 ساعات كحد أدنى، وهي مثالية لرحلات الأعمال، والتسوق، والجولات السياحية."
          }
        ]
      },
      {
        key: "pricing",
        label: "الأسعار والدفع",
        icon: CreditCard,
        faqs: [
          {
            question: "هل أسعاركم ثابتة ومحددة؟",
            answer: "بكل تأكيد. جميع أسعارنا بين المدن والمطارات ثابتة بنسبة 100%، وتشمل ضريبة القيمة المضافة، ورسوم الطرق، ورسوم مواقف السيارات بالمطار، والوقود."
          },
          {
            question: "ما هي طرق الدفع المقبولة لديكم؟",
            answer: "نقبل جميع بطاقات الائتمان والخصم الدولية الرئيسية (فيزا، ماستركارد، أمريكان إكسبريس)، وApple Pay، وبطاقات مدى المحلية، والتحويلات البنكية للشركات."
          }
        ]
      },
      {
        key: "airport",
        label: "توصيل المطارات",
        icon: Plane,
        faqs: [
          {
            question: "كيف يتم تنسيق الاستقبال في المطار؟",
            answer: "نقوم بتتبع جميع الرحلات الجوية لحظة بلحظة. سينتظر السائق الخاص بك في صالة الوصول حاملاً لوحة رقمية أو ورقية باسمك عند هبوط الطائرة."
          },
          {
            question: "ماذا يحدث إذا تأخرت رحلتي الجوية؟",
            answer: "لا داعي للقلق أبداً. نحن نقدم ما يصل إلى 90 دقيقة من وقت الانتظار المجاني في جميع مطارات المملكة للرحلات الدولية."
          }
        ]
      },
      {
        key: "umrah",
        label: "العمرة والزيارة",
        icon: Compass,
        faqs: [
          {
            question: "هل توفرون التوصيل من مطار جدة إلى مكة المكرمة للمعتمرين؟",
            answer: "نعم، نحن متخصصون في تقديم خدمات التوصيل الفاخرة ومسبقة الحجز بين مطار جدة (JED) وفنادق مكة المكرمة بأسعار ثابتة وشاملة."
          },
          {
            question: "هل يمكنني حجز باقة تنقل كاملة بين مكة والمدينة؟",
            answer: "نعم، نحن نوفر باقات تنقل متكاملة تغطي خطوط (جدة - مكة - المدينة - المطار) مع خيارات التوقف السياحي المخصصة."
          }
        ]
      },
      {
        key: "fleet",
        label: "الأسطول والسيارات",
        icon: Car,
        faqs: [
          {
            question: "ما هي فئات السيارات الفاخرة التي توفرونها؟",
            answer: "يضم أسطولنا سيارات سيدان تنفيذية (كامري)، سيارات عائلية فاخرة (GMC Yukon)، سيارات VIP فاخرة (Mercedes S-Class)، وسيارات دفع رباعي فاخرة (Cadillac Escalade)، وفانات VIP (Staria)."
          },
          {
            question: "هل تتوفر مقاعد للأطفال بالسيارات؟",
            answer: "نعم، تتوفر مقاعد الأطفال بمختلف الأعمار مجاناً عند الطلب، ويتم تثبيتها باحترافية قبل موعد الرحلة."
          }
        ]
      },
      {
        key: "corporate",
        label: "حسابات الشركات والأعمال",
        icon: Building2,
        faqs: [
          {
            question: "هل توفرون حسابات مخصصة للشركات؟",
            answer: "نعم، نقدم حسابات مخصصة للشركات والبعثات الدبلوماسية والفنادق، تتميز بفوترة شهرية مفصلة وأولوية قصوى للحجوزات."
          }
        ]
      }
    ]
  },
  ur: {
    badge: "اکثر پوچھے گئے سوالات",
    title: "بکنگ سے پہلے فوری جوابات",
    description: "سعودی عرب میں روحانی، کاروباری یا خاندانی سفر کے لیے نجی VIP ڈرائیور سروسز بک کرنے کے بارے میں وہ سب کچھ جو آپ کو جاننے کی ضرورت ہے۔",
    searchPlaceholder: "سوال یا کلیدی لفظ تلاش کریں...",
    allCategories: "تمام اقسام",
    noResults: "آپ کی تلاش کے مطابق کوئی سوال نہیں ملا۔ براہ کرم کوئی دوسرا لفظ تلاش کریں یا براہ راست کسٹمر سروس سے رابطہ کریں۔",
    ctaTitle: "اب بھی کوئی سوال ہے؟",
    ctaDesc: "ہمارا 24/7 کنسیرج ڈیسک آپ کے کسٹم کوٹس، سفری منصوبوں اور بکنگ کی درخواستوں میں مدد کے لیے دستیاب ہے۔",
    ctaBtn: "کنسیرج ڈیسک سے واٹس ایپ چیٹ کریں",
    categories: [
      {
        key: "booking",
        label: "بکنگ اور ریزرویشن",
        icon: BookOpen,
        faqs: [
          {
            question: "مجھے اپنی وی آئی پی گاڑی کتنی دیر پہلے بک کرنی چاہیے؟",
            answer: "ہم مشورہ دیتے ہیں کہ اپنی پسندیدہ گاڑی حاصل کرنے کے لیے کم از کم 24 گھنٹے پہلے بکنگ کریں۔ رمضان یا حج جیسے مصروف سیزن میں 1-2 ہفتے پہلے بکنگ بہتر ہے۔"
          },
          {
            question: "کیا میں اپنی بکنگ میں ترمیم یا منسوخی کر سکتا ہوں؟",
            answer: "جی ہاں، آپ مقررہ وقت سے 24 گھنٹے پہلے تک اپنی بکنگ میں بالکل مفت ترمیم یا منسوخی کر سکتے ہیں۔"
          }
        ]
      },
      {
        key: "pricing",
        label: "قیمتیں اور ادائیگی",
        icon: CreditCard,
        faqs: [
          {
            question: "کیا آپ کے ریٹس بالکل فکسڈ ہیں؟",
            answer: "جی ہاں۔ ہمارے تمام شہروں اور ہوائی اڈوں کے ریٹس 100٪ فکسڈ اور تمام ٹیکسز، ٹولز اور پارکنگ فیس کے ساتھ شامل ہیں۔ کوئی پوشیدہ چارجز نہیں ہیں۔"
          }
        ]
      },
      {
        key: "airport",
        label: "ایئرپورٹ ٹرانسفر",
        icon: Plane,
        faqs: [
          {
            question: "ایئرپورٹ پر ڈرائیور کیسے رابطہ کرے گا؟",
            answer: "ہم تمام پروازوں کو لائیو ٹریک کرتے ہیں۔ آپ کا ڈرائیور آپ کے نام کا بورڈ لے کر صالۂ آمد پر آپ کا منتظر ہوگا۔"
          },
          {
            question: "پرواز میں تاخیر کی صورت میں کیا ہوتا ہے؟",
            answer: "پریشان ہونے کی کوئی ضرورت نہیں۔ ہم سعودی ہوائی اڈوں پر بین الاقوامی پروازوں کے لیے 90 منٹ تک بالکل مفت انتظار کی سہولت فراہم کرتے ہیں۔"
          }
        ]
      },
      {
        key: "umrah",
        label: "عمرہ اور زیارات",
        icon: Compass,
        faqs: [
          {
            question: "کیا آپ زائرین کے لیے جدہ سے مکہ ٹرانسفر فراہم کرتے ہیں؟",
            answer: "جی ہاں، ہم جدہ ایئرپورٹ (JED) اور مکہ مکرمہ کے تمام ہوٹلوں کے درمیان پریمیم اور آرام دہ فیملی ٹرانسفرز فراہم کرتے ہیں۔"
          },
          {
            question: "کیا مکہ اور مدینہ کے درمیان زیارات کے پیکیجز دستیاب ہیں؟",
            answer: "جی ہاں، ہم جدہ - مکہ - مدینہ - ایئرپورٹ کے روٹس پر کسٹم دوروں کے ساتھ مکمل عمرہ ٹرانسفر پیکیج پیش کرتے ہیں۔"
          }
        ]
      },
      {
        key: "fleet",
        label: "فلیٹ اور گاڑیاں",
        icon: Car,
        faqs: [
          {
            question: "آپ کے فلیٹ میں کون سی گاڑیاں دستیاب ہیں؟",
            answer: "ہمارے پاس ایگزیکٹو سیڈان (Camry)، پریمیم ایس یو وی (GMC Yukon)، وی آئی پی سیڈان (Mercedes S-Class)، اور آرام دہ فینز (Staria) دستیاب ہیں۔"
          },
          {
            question: "کیا گاڑیوں میں بچوں کے لیے حفاظتی سیٹیں دستیاب ہوتی ہیں؟",
            answer: "جی ہاں، درخواست پر بچوں کی سیٹیں بالکل مفت فراہم کی جاتی ہیں اور سفر شروع ہونے سے پہلے ہی گاڑی میں فٹ کر دی جاتی ہیں۔"
          }
        ]
      },
      {
        key: "corporate",
        label: "کارپوریٹ اکاوئنٹس",
        icon: Building2,
        faqs: [
          {
            question: "کیا آپ کمپنیوں کے لیے کارپوریٹ اکاوئنٹس فراہم کرتے ہیں؟",
            answer: "جی ہاں، ہم کمپنیوں، سفارت خانوں اور ہوٹلوں کے لیے مخصوص ماہانہ انوائسنگ اور اعلی ترجیح کے ساتھ کارپوریٹ اکاؤنٹس فراہم کرتے ہیں۔"
          }
        ]
      }
    ]
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function FaqPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Real-time search & category filter logic
  const filteredCategories = t.categories
    .map((cat) => {
      const filteredFaqs = cat.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return { ...cat, faqs: filteredFaqs };
    })
    .filter(
      (cat) =>
        (selectedCategory === "all" || cat.key === selectedCategory) &&
        cat.faqs.length > 0
    );

  const hasResults = filteredCategories.length > 0;

  // Flattened FAQs for Google Schema
  const allFaqsFlat = t.categories.flatMap((cat) => cat.faqs);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allFaqsFlat.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-28 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="section-container">
        
        {/* Entrance Hero text */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="max-w-3xl text-center md:text-left md:mx-0"
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

        {/* Dynamic Search & Filters Panel */}
        <div className="mt-12 grid gap-6 md:grid-cols-[280px_1fr]">
          
          {/* Left Column: Category selector list */}
          <div className="space-y-3.5">
            <div className="relative">
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-[#C9A84C]/20 bg-[#111111] py-3.5 pl-11 pr-4 text-xs text-[#F5F0E8] focus:border-[#C9A84C] focus:outline-none transition-all placeholder:text-[#7C8088]"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C9A84C]" />
            </div>

            <div className="hidden md:flex flex-col gap-2 rounded-3xl border border-[#C9A84C]/10 bg-[#111111] p-4">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`w-full rounded-xl px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedCategory === "all"
                    ? "bg-[#C9A84C] text-[#0A0A0A]"
                    : "text-[#A1A1A6] hover:bg-white/5 hover:text-[#F5F0E8]"
                }`}
              >
                {t.allCategories}
              </button>
              {t.categories.map((cat) => {
                const CatIcon = cat.icon;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`w-full rounded-xl px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2.5 ${
                      selectedCategory === cat.key
                        ? "bg-[#C9A84C] text-[#0A0A0A]"
                        : "text-[#A1A1A6] hover:bg-white/5 hover:text-[#F5F0E8]"
                    }`}
                  >
                    <CatIcon className="h-4 w-4 shrink-0" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Dynamic categorized FAQs */}
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {hasResults ? (
                <motion.div
                  key={searchQuery + selectedCategory}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {filteredCategories.map((group) => {
                    const CatIcon = group.icon;
                    return (
                      <div key={group.key} className="space-y-4">
                        <h2 className="font-heading text-lg font-bold text-[#C9A84C] flex items-center gap-2 border-b border-[#C9A84C]/10 pb-2">
                          <CatIcon className="h-5 w-5" />
                          <span>{group.label}</span>
                        </h2>

                        <div className="space-y-3">
                          {group.faqs.map((faq) => (
                            <details
                              key={faq.question}
                              className="group rounded-2xl border border-[#C9A84C]/15 bg-[#121212] p-5 transition-all duration-300 hover:border-[#C9A84C]/35"
                            >
                              <summary className="cursor-pointer font-heading text-sm md:text-base font-semibold text-[#F5F0E8] group-open:text-[#C9A84C] list-none flex items-center justify-between focus:outline-none select-none">
                                <div className="flex items-center gap-3">
                                  <HelpCircle className="h-4 w-4 text-[#C9A84C] shrink-0" />
                                  <span>{faq.question}</span>
                                </div>
                                <span className="text-xs transition-transform duration-300 group-open:rotate-180 text-[#C9A84C]">▼</span>
                              </summary>
                              
                              <p className="mt-4 text-xs md:text-sm leading-relaxed text-[#A1A1A6] border-t border-[#C9A84C]/8 pt-4 font-sans">
                                {faq.answer}
                              </p>
                            </details>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-3xl border border-[#C9A84C]/10 bg-[#111111] p-8 text-center"
                >
                  <p className="text-sm text-[#A1A1A6] leading-relaxed">{t.noResults}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Still Have Questions CTA */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="mt-20 max-w-4xl mx-auto rounded-3xl border border-[#C9A84C]/25 bg-gradient-to-br from-[#121212] to-black p-8 md:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#C9A84C10,transparent_50%)] pointer-events-none" />
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] mx-auto">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-[#F5F0E8]">{t.ctaTitle}</h3>
          <p className="text-sm text-[#A1A1A6] max-w-2xl mx-auto leading-relaxed">{t.ctaDesc}</p>
          <a
            href={contactConfig.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackEvent("whatsapp_click", {
                sourceLocation: "faq_cta",
                phoneUsed: contactConfig.whatsappNumber || "+966500123456",
                locale: language
              });
            }}
            className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-8 py-4 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] hover:bg-[#B8963B] transition-all shadow-[0_4px_20px_rgba(201,168,76,0.35)]"
          >
            <MessageSquare className="h-4 w-4 fill-current" />
            <span>{t.ctaBtn}</span>
          </a>
        </motion.div>

      </section>
    </div>
  );
}
