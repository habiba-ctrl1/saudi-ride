"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/context/LanguageContext";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const translations = {
  en: {
    badge: "Elite Showcase",
    title: "Premium fleet & destination visuals",
    description: "Take a closer look at our impeccably maintained executive fleets and picturesque Saudi destinations. Where comfort meets absolute class.",
    images: [
      {
        src: "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80",
        title: "Executive Luxury Sedan",
        category: "Sedan Fleet"
      },
      {
        src: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
        title: "Premium GMC Yukon Denali",
        category: "SUV Fleet"
      },
      {
        src: "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1200&q=80",
        title: "Spacious Cabin Comfort",
        category: "VIP Experience"
      },
      {
        src: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80",
        title: "Long-distance Corridors",
        category: "Saudi Routes"
      }
    ]
  },
  ar: {
    badge: "معرض التميز الفاخر",
    title: "جمال الأسطول والوجهات في صور",
    description: "ألقِ نظرة فاحصة على أسطولنا الفاخر المصان بعناية والوجهات السعودية الخلابة التي نخدمها بكل حب وامتياز.",
    images: [
      {
        src: "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80",
        title: "سيارة سيدان الفاخرة لرجال الأعمال",
        category: "أسطول السيدان"
      },
      {
        src: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
        title: "جمس يوكون دينالي بريميوم",
        category: "أسطول الدفع الرباعي"
      },
      {
        src: "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1200&q=80",
        title: "راحة المقصورة الداخلية الفاخرة",
        category: "تجربة VIP"
      },
      {
        src: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80",
        title: "طرق وتوصيل ممتد ومريح",
        category: "المسارات السعودية"
      }
    ]
  },
  ur: {
    badge: "اشرافیہ شوکیس",
    title: "گاڑیوں اور خوبصورت مقامات کی تصاویر",
    description: "ہماری بہترین دیکھ بھال والی ایگزیکٹو گاڑیوں اور سعودی عرب کے خوبصورت مقامات پر ایک نظر ڈالیں۔ جہاں آرام اور بہترین کلاس کا امتزاج ہے۔",
    images: [
      {
        src: "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80",
        title: "ایگزیکٹو لگژری سیڈان",
        category: "سیڈان گاڑیاں"
      },
      {
        src: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
        title: "پریمیم جی ایم سی یوکون ڈینالی",
        category: "ایس یو وی گاڑیاں"
      },
      {
        src: "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1200&q=80",
        title: "کشادہ کیبن اور بہترین آرام",
        category: "وی آئی پی تجربہ"
      },
      {
        src: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80",
        title: "طویل فاصلے کے سفر کے مناظر",
        category: "سعودی روٹس"
      }
    ]
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

export default function GalleryPage() {
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

        {/* Gallery Visual Grid */}
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {t.images.map((img, index) => (
            <motion.div
              key={img.src}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-[#C9A84C]/15 bg-[#121212] shadow-2xl hover:border-[#C9A84C]/35 transition-all duration-300"
            >
              {/* Image Frame */}
              <div className="relative h-[22rem] w-full overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.title}
                  fill
                  className="object-cover brightness-90 transition-transform duration-700 group-hover:scale-105 group-hover:brightness-75"
                />

                {/* Elegant Hover Overlay Content */}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/25 to-transparent p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[#C9A84C] text-[0.65rem] uppercase tracking-wider font-bold">
                      <Sparkles className="h-3 w-3" />
                      <span>{img.category}</span>
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-[#F5F0E8]">
                      {img.title}
                    </h3>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
