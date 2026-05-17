"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Camera, Car, ChevronRight, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { contactConfig } from "@/lib/config/contact";

const GALLERY_CATEGORIES = [
  { key: "all", label: "All Media" },
  { key: "fleet", label: "Elite Fleet" },
  { key: "vip", label: "VIP Arrivals" },
  { key: "destinations", label: "Destinations" },
  { key: "weddings", label: "Weddings & Events" },
];

const GALLERY_ITEMS = [
  {
    id: "g1",
    category: "fleet",
    type: "image",
    src: "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80",
    title: "Executive Sedan — Toyota Camry",
    description: "Our premium sedans are perfect for executive city transfers and airport pickups. Smooth, reliable, and equipped with modern amenities.",
  },
  {
    id: "g2",
    category: "vip",
    type: "image",
    src: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
    title: "VIP Airport Meet & Greet",
    description: "Professional chauffeurs waiting at Jeddah Terminal 1 arrivals with customized name boards and luggage assistance.",
  },
  {
    id: "g3",
    category: "fleet",
    type: "image",
    src: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
    title: "Premium SUV — GMC Yukon",
    description: "Spacious luxury SUV, the preferred choice for family Umrah trips and corporate delegations traveling across Saudi Arabia.",
  },
  {
    id: "g4",
    category: "destinations",
    type: "image",
    src: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1200&q=80",
    title: "Makkah Grand Mosque",
    description: "Direct premium transfers to all major 5-star hotels surrounding the Haram in Makkah.",
  },
  {
    id: "g5",
    category: "weddings",
    type: "image",
    src: "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?auto=format&fit=crop&w=1200&q=80",
    title: "Royal Wedding Convoy",
    description: "Impeccably decorated Mercedes S-Class and BMW 7-Series vehicles for luxury Saudi weddings and special occasions.",
  },
  {
    id: "g6",
    category: "vip",
    type: "image",
    src: "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1200&q=80",
    title: "Executive Cabin Comfort",
    description: "Plush leather seating, ambient lighting, and complimentary refreshments in our VIP charter fleet.",
  },
  {
    id: "g7",
    category: "fleet",
    type: "image",
    src: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
    title: "Luxury Van — Hyundai Staria",
    description: "Modern, spacious VIP vans ideal for group travel, offering panoramic windows and multi-zone climate control.",
  },
  {
    id: "g8",
    category: "destinations",
    type: "image",
    src: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80",
    title: "AlUla Heritage Site",
    description: "Premium long-distance transfers to the breathtaking landscapes and luxury resorts of AlUla.",
  },
  {
    id: "g9",
    category: "weddings",
    type: "image",
    src: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80",
    title: "Event Transportation Logistics",
    description: "Coordinating multi-vehicle fleets for conferences, global summits, and large-scale corporate events in Riyadh.",
  },
  {
    id: "g10",
    category: "fleet",
    type: "image",
    src: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
    title: "Ultra Luxury — Mercedes S-Class",
    description: "The pinnacle of automotive luxury. Available for VIP hourly charters and executive airport transfers.",
  },
  {
    id: "g11",
    category: "destinations",
    type: "image",
    src: "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&w=1200&q=80",
    title: "Al-Masjid An-Nabawi, Madinah",
    description: "Respectful and punctual pilgrim transfers between Makkah, Jeddah, and Madinah.",
  },
  {
    id: "g12",
    category: "vip",
    type: "image",
    src: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
    title: "Business Delegation Support",
    description: "Discreet and professional chauffeur service for visiting dignitaries and C-suite executives.",
  },
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = GALLERY_ITEMS.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

  const openLightbox = (index: number) => {
    // Find the actual index in the main array based on the filtered item
    const item = filteredItems[index];
    const mainIndex = GALLERY_ITEMS.findIndex((i) => i.id === item.id);
    setLightboxIndex(mainIndex);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = "auto";
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % GALLERY_ITEMS.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8]">

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C9A84C]/6 to-transparent pointer-events-none" />
        <div className="absolute top-1/4 right-0 h-[600px] w-[600px] rounded-full bg-[#C9A84C]/5 blur-3xl pointer-events-none" />

        <div className="section-container relative z-10 max-w-5xl text-center">
          <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/8 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mx-auto">
              <Camera className="h-3 w-3" /> Visual Showcase
            </span>
            <h1 className="mt-6 font-heading text-4xl font-bold leading-tight md:text-6xl mx-auto max-w-4xl">
              Experience the Standard of<br />
              <span className="text-[#C9A84C]">Absolute Luxury</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-sm md:text-base leading-relaxed text-[#A1A1A6]">
              A closer look at our impeccably maintained executive fleets, VIP arrival experiences,
              and picturesque Saudi destinations. Where absolute comfort meets world-class service.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── FILTER BAR ───────────────────────────────────────────── */}
      <section className="sticky top-[72px] z-30 bg-[#0A0A0A]/95 backdrop-blur-md border-y border-[#C9A84C]/10 py-4 mb-10">
        <div className="section-container max-w-5xl">
          <div className="flex items-center justify-center gap-2 overflow-x-auto">
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`shrink-0 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  activeCategory === cat.key
                    ? "bg-[#C9A84C] text-[#0A0A0A] shadow-[0_4px_14px_rgba(201,168,76,0.3)]"
                    : "border border-[#C9A84C]/20 text-[#A1A1A6] hover:border-[#C9A84C]/50 hover:text-[#F5F0E8]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GALLERY MASONRY ──────────────────────────────────────── */}
      <section className="section-container max-w-7xl py-10 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                variants={fadeUp}
                transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
                className="group relative break-inside-avoid overflow-hidden rounded-3xl bg-[#111111] cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <div className="relative w-full aspect-[4/3] md:aspect-auto md:h-auto overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.title}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="rounded-full bg-black/60 border border-[#C9A84C]/30 px-3 py-1 text-[0.55rem] font-bold uppercase tracking-wider text-[#C9A84C] backdrop-blur-md">
                      {GALLERY_CATEGORIES.find(c => c.key === item.category)?.label}
                    </span>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10 transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                    <h3 className="font-heading text-lg font-bold text-[#F5F0E8] mb-2">{item.title}</h3>
                    <p className="text-xs text-[#A1A1A6] line-clamp-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ─── CTA SECTION ────────────────────────────────────────── */}
      <section className="section-container max-w-4xl pb-32">
        <div className="rounded-3xl border border-[#C9A84C]/20 bg-gradient-to-br from-[#111111] to-[#0A0A0A] p-10 md:p-14 text-center relative overflow-hidden shadow-[0_0_50px_rgba(201,168,76,0.05)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#C9A84C15,transparent_50%)] pointer-events-none" />
          
          <Sparkles className="h-8 w-8 text-[#C9A84C] mx-auto mb-6" />
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Experience the Luxury Yourself
          </h2>
          <p className="text-sm md:text-base text-[#A1A1A6] max-w-2xl mx-auto mb-8">
            Whether it&apos;s a VIP airport transfer, a corporate delegation, or a spiritual Umrah journey, 
            Riyadh Luxe guarantees an unparalleled travel experience.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/book"
              className="flex items-center gap-2 rounded-full bg-[#C9A84C] px-8 py-4 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] hover:bg-[#B8963B] transition-all shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
            >
              <Car className="h-4 w-4" />
              Book Your Transfer
            </Link>
            <a
              href={`https://wa.me/${contactConfig.whatsappNumber}?text=Salam, I would like to inquire about your luxury fleet services.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-[#C9A84C]/30 px-8 py-4 text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all"
            >
              <MessageCircle className="h-4 w-4 fill-current" />
              Inquire via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ─── LIGHTBOX MODAL ─────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0A]/95 backdrop-blur-xl p-4 md:p-8"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 z-50 rounded-full bg-black/50 p-3 text-white hover:bg-[#C9A84C] hover:text-black transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <button
              onClick={prevImage}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 rounded-full bg-black/50 p-4 text-white hover:bg-[#C9A84C] hover:text-black transition-colors"
            >
              <ChevronRight className="h-6 w-6 rotate-180" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 rounded-full bg-black/50 p-4 text-white hover:bg-[#C9A84C] hover:text-black transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-6xl max-h-[85vh] flex flex-col md:flex-row bg-[#111111] rounded-2xl overflow-hidden border border-[#C9A84C]/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative flex-1 bg-black min-h-[40vh] md:min-h-0">
                <Image
                  src={GALLERY_ITEMS[lightboxIndex].src}
                  alt={GALLERY_ITEMS[lightboxIndex].title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
              <div className="w-full md:w-[350px] shrink-0 p-8 flex flex-col justify-center border-t md:border-t-0 md:border-l border-[#C9A84C]/10">
                <span className="inline-block rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-3 py-1 text-[0.55rem] font-bold uppercase tracking-wider text-[#C9A84C] mb-4 w-fit">
                  {GALLERY_CATEGORIES.find(c => c.key === GALLERY_ITEMS[lightboxIndex].category)?.label}
                </span>
                <h3 className="font-heading text-2xl font-bold text-[#F5F0E8] mb-4">
                  {GALLERY_ITEMS[lightboxIndex].title}
                </h3>
                <p className="text-sm text-[#A1A1A6] leading-relaxed mb-8">
                  {GALLERY_ITEMS[lightboxIndex].description}
                </p>
                <div className="mt-auto">
                  <p className="text-[0.6rem] text-[#7C8088] uppercase tracking-wider mb-2">Interested in this experience?</p>
                  <Link
                    href="/book"
                    onClick={closeLightbox}
                    className="flex items-center justify-center gap-2 w-full rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 py-3 text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black transition-all"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
