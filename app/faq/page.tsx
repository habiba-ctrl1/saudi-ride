"use client";

import { useLanguage } from "@/lib/context/LanguageContext";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

const translations = {
  en: {
    badge: "Information Desk",
    title: "Frequently asked questions",
    description: "Everything you need to know about reserving private VIP chauffeur services for spiritual, business, or family travel in Saudi Arabia.",
    faqs: [
      {
        question: "Do you provide Jeddah Airport to Makkah transfers?",
        answer: "Yes, we specialize in high-demand, pre-booked airport transfers between Jeddah Airport (JED) and Makkah hotels at fully fixed, all-inclusive rates."
      },
      {
        question: "Is this service better than app-based ride hailing for Umrah?",
        answer: "Absolutely. For pilgrimage logistics and long-distance intercity routes, our pre-booked chauffeur model guarantees reliability, a highly clean VIP vehicle of choice, and a licensed chauffeur waiting precisely at your gate."
      },
      {
        question: "Can I book from the UK, USA, or other countries before arrival?",
        answer: "Yes. Our concierge desk is fully optimized for international travelers. You can book online or discuss requirements with a dedicated concierge on WhatsApp before flight takeoff."
      },
      {
        question: "What is your child-safety seat policy for family transfers?",
        answer: "We prioritize safety. Child seats, infant carriers, and toddler booster cushions can be requested during booking and will be fitted inside your assigned GMC Yukon or Hyundai Staria before pickup."
      },
      {
        question: "How do you handle airport pickup delays?",
        answer: "We track all flights in real-time. If your flight is delayed or custom queues are long, your private chauffeur will adjust arrival times and wait up to 90 minutes free of charge."
      }
    ]
  },
  ar: {
    badge: "الأسئلة الشائعة",
    title: "أجوبة سريعة قبل إتمام الحجز",
    description: "كل ما تحتاج إلى معرفته حول حجز خدمات السائقين الخاصة وكبار الشخصيات للعمرة والأعمال والرحلات العائلية بالمملكة.",
    faqs: [
      {
        question: "هل توفرون خدمة التوصيل من مطار جدة إلى مكة المكرمة؟",
        answer: "نعم، نحن متخصصون في تقديم خدمات النقل الفاخرة ومسبقة الحجز بين مطار جدة الدولي (JED) وفنادق مكة المكرمة بأسعار ثابتة وشاملة بالكامل."
      },
      {
        question: "هل هذه الخدمة أفضل من تطبيقات التوصيل العادية للعمرة؟",
        answer: "بكل تأكيد. لخدمات العمرة والمسافات الطويلة، يضمن لك نموذج السائق الخاص والسيارات الفاخرة المحددة مسبقاً الموثوقية التامة، والنظافة، والاستقبال اللائق في المطار دون عناء الانتظار."
      },
      {
        question: "هل يمكنني الحجز من بريطانيا أو أمريكا أو الدول الأخرى قبل الوصول؟",
        answer: "نعم، موقعنا ومكتب الكونسيرج مهيأ بالكامل لاستقبال الحجوزات الدولية. يمكنك الدفع والحجز إلكترونياً أو التحدث مباشرة مع الكونسيرج عبر الواتساب لتأكيد التفاصيل قبل رحلتك."
      },
      {
        question: "ما هي سياستكم بشأن مقاعد الأطفال لسلامة العائلة؟",
        answer: "نحن نولي السلامة أهمية قصوى. يمكن طلب مقاعد الأطفال الرضع والصغار أثناء عملية الحجز لتجهيزها وتثبيتها مسبقاً في سيارات GMC أو Staria قبل وصولكم."
      },
      {
        question: "كيف تتعاملون مع تأخر الرحلات في المطار؟",
        answer: "نحن نقوم بتتبع جميع الرحلات الجوية لحظة بلحظة. إذا تأخرت رحلتكم أو استغرقت إجراءات الجمارك وقتاً أطول، فسيقوم السائق بتعديل موعد وصوله والانتظار مجاناً لمدة تصل إلى 90 دقيقة."
      }
    ]
  },
  ur: {
    badge: "اکثر پوچھے گئے سوالات",
    title: "بکنگ سے پہلے فوری جوابات",
    description: "سعودی عرب میں روحانی، کاروباری یا خاندانی سفر کے لیے نجی VIP ڈرائیور سروسز بک کرنے کے بارے میں وہ سب کچھ جو آپ کو جاننے کی ضرورت ہے۔",
    faqs: [
      {
        question: "کیا آپ جدہ ایئرپورٹ سے مکہ مکرمہ ٹرانسفر فراہم کرتے ہیں؟",
        answer: "جی ہاں، ہم جدہ ہوائی اڈے (JED) اور مکہ مکرمہ کے ہوٹلوں کے درمیان مکمل طور پر فکسڈ اور تمام مراعات سے لیس ریٹس پر پہلے سے بک شدہ ٹرانسفر فراہم کرتے ہیں۔"
      },
      {
        question: "کیا یہ سروس عمرہ کے لیے عام رائیڈ ہیلنگ ایپس سے بہتر ہے؟",
        answer: "بلاشبہ۔ طویل فاصلے اور عمرہ زائرین کے لیے، ہماری ڈرائیور سروس بہتر اور آرام دہ سفر، صاف ستھری گاڑی اور آپ کے گیٹ پر انتظار کرنے والے لائسنس یافتہ ڈرائیور کی ضمانت دیتی ہے۔"
      },
      {
        question: "کیا میں پہنچنے سے پہلے برطانیہ، امریکہ یا دیگر ممالک سے بکنگ کر سکتا ہوں؟",
        answer: "جی ہاں۔ ہماری سروس بین الاقوامی مسافروں کے لیے مکمل طور پر موزوں ہے۔ آپ پرواز سے پہلے واٹس ایپ پر نجی دربان سے رابطہ کر کے بکنگ کر سکتے ہیں۔"
      },
      {
        question: "کیا فیملی ٹرانسفر کے لیے بچوں کے لیے سیٹیں فراہم کی جاتی ہیں؟",
        answer: "جی ہاں، ہم حفاظت کو ترجیح دیتے ہیں۔ بچوں کی سیٹیں بکنگ کے وقت طلب کی جا سکتی ہیں اور وہ آپ کی گاڑی میں پک اپ سے پہلے ہی فٹ کر دی جائیں گی۔"
      },
      {
        question: "اگر ایئرپورٹ پر پرواز میں تاخیر ہو جائے تو کیا ہوتا ہے؟",
        answer: "ہم تمام پروازوں کو لائیو ٹریک کرتے ہیں۔ پرواز کی تاخیر کی صورت میں، آپ کا ڈرائیور وقت کو ایڈجسٹ کر لے گا اور 90 منٹ تک بالکل مفت انتظار کرے گا۔"
      }
    ]
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

export default function FaqPage() {
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

        {/* FAQs list accordion */}
        <div className="mt-14 space-y-4">
          {t.faqs.map((item, index) => (
            <motion.details
              key={item.question}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group rounded-3xl border border-[#C9A84C]/15 bg-[#121212] p-7 transition-all duration-300 hover:border-[#C9A84C]/35"
            >
              <summary className="cursor-pointer font-heading text-base md:text-lg font-semibold text-[#F5F0E8] group-open:text-[#C9A84C] list-none flex items-center justify-between focus:outline-none">
                <div className="flex items-center gap-3.5">
                  <HelpCircle className="h-4.5 w-4.5 text-[#C9A84C] shrink-0" />
                  <span>{item.question}</span>
                </div>
                <span className="text-xs transition-transform duration-300 group-open:rotate-180 text-[#C9A84C]">▼</span>
              </summary>
              
              <p className="mt-5 text-xs md:text-sm leading-relaxed text-[#A1A1A6] border-t border-[#C9A84C]/10 pt-5 font-sans">
                {item.answer}
              </p>
            </motion.details>
          ))}
        </div>
      </section>
    </div>
  );
}
