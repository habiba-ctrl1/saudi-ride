// Intercity car-transport routes from Dammam (نقل سيارة من الدمام إلى ...).
// These are BOOKED transport pages, not local-emergency pages. One page per
// route captures the whole semantic cluster (transport / satha / recovery /
// flatbed) — no near-duplicate direction/keyword variants.

import type { RecoveryFaq } from "@/lib/data/recovery";

export interface RecoveryRoute {
  slug: string; // e.g. "dammam-to-riyadh"
  from: string;
  to: string;
  fromAr: string;
  toAr: string;
  distanceKm: number;
  approxDrive: string; // e.g. "~4 hours"
  tagline: string;
  taglineAr: string;
  intro: string;
  introAr: string;
  image: string;
  // What the route page covers (semantic cluster)
  highlights: string[];
  highlightsAr: string[];
  faqs: RecoveryFaq[];
  faqsAr: RecoveryFaq[];
}

export const RECOVERY_ROUTES: RecoveryRoute[] = [
  {
    slug: "dammam-to-riyadh",
    from: "Dammam",
    to: "Riyadh",
    fromAr: "الدمام",
    toAr: "الرياض",
    distanceKm: 410,
    approxDrive: "~4 hours",
    tagline: "Dammam to Riyadh car transport & satha",
    taglineAr: "نقل سيارة من الدمام إلى الرياض",
    intro:
      "Moving a car from Dammam to Riyadh? As a Dammam-based operator, this is our most common intercity transport route. We flatbed your vehicle along the Dammam–Riyadh highway (Route 40, ~410 km) — whether it's a breakdown that has to reach a Riyadh dealership, a car you bought in the Eastern Province, or a full relocation. The car is winched fully onto the bed, secured, and delivered to the address, workshop, or showroom you choose. Send the vehicle type and both addresses on WhatsApp for a clear price before we book the job.",
    introAr:
      "تبي تنقل سيارتك من الدمام إلى الرياض؟ بحكم أن مقرنا في الدمام، هذا أكثر مسار نقل بين المدن لدينا. ننقل سيارتك على سطحة هيدروليك عبر طريق الدمام–الرياض (نحو ٤١٠ كم) — سواء كانت سيارة متعطلة يجب أن تصل إلى معرض في الرياض، أو سيارة اشتريتها في المنطقة الشرقية، أو نقل كامل. تُحمّل السيارة بالكامل على السطحة وتُثبّت وتُسلّم إلى العنوان أو الورشة أو المعرض الذي تختاره. أرسل نوع السيارة والعنوانين عبر واتساب للحصول على سعر واضح قبل حجز النقل.",
    image: "/locations/riyadh-hero.webp",
    highlights: [
      "Flatbed (satha) transport — no wheels on the road",
      "Broken-down & accident vehicles moved to a Riyadh workshop or dealership",
      "Newly purchased car collected in the Eastern Province and delivered to Riyadh",
      "Photo-documented handover on request",
      "Price confirmed on WhatsApp before the job is booked",
    ],
    highlightsAr: [
      "نقل على سطحة هيدروليك — دون ملامسة العجلات للأرض",
      "نقل السيارات المتعطلة والمصدومة إلى ورشة أو معرض في الرياض",
      "استلام سيارة مشتراة حديثاً من المنطقة الشرقية وتسليمها في الرياض",
      "توثيق التسليم بالصور عند الطلب",
      "تأكيد السعر عبر واتساب قبل حجز النقل",
    ],
    faqs: [
      {
        question: "How much does it cost to transport a car from Dammam to Riyadh?",
        answer:
          "There is no fixed public price — it depends on the vehicle type, the exact pickup and drop-off, and timing. Send those details on WhatsApp and we confirm a clear price before booking.",
      },
      {
        question: "Can you move a broken-down car from Dammam to Riyadh?",
        answer:
          "Yes — a non-running or accident-damaged car is winched onto the flatbed and transported to the Riyadh workshop or dealership you choose. Share a photo and the destination on WhatsApp.",
      },
      {
        question: "How long does the Dammam to Riyadh transport take?",
        answer:
          "The drive is roughly 4 hours over ~410 km on Route 40. Exact timing depends on the booking slot and pickup — we confirm the schedule with you on WhatsApp.",
      },
    ],
    faqsAr: [
      {
        question: "كم تكلفة نقل سيارة من الدمام إلى الرياض؟",
        answer:
          "لا يوجد سعر ثابت معلن — يعتمد على نوع السيارة ومكان الاستلام والتسليم والوقت. أرسل هذه التفاصيل عبر واتساب ونؤكد لك سعراً واضحاً قبل الحجز.",
      },
      {
        question: "هل تنقلون سيارة متعطلة من الدمام إلى الرياض؟",
        answer:
          "نعم، السيارة المتعطلة أو المصدومة تُرفع على السطحة وتُنقل إلى الورشة أو المعرض الذي تختاره في الرياض. أرسل صورة والوجهة عبر واتساب.",
      },
      {
        question: "كم يستغرق نقل السيارة من الدمام إلى الرياض؟",
        answer:
          "القيادة نحو ٤ ساعات على مسافة ٤١٠ كم تقريباً عبر طريق ٤٠. يعتمد الوقت الدقيق على موعد الحجز والاستلام، ونؤكد لك الجدول عبر واتساب.",
      },
    ],
  },
  {
    slug: "dammam-to-jeddah",
    from: "Dammam",
    to: "Jeddah",
    fromAr: "الدمام",
    toAr: "جدة",
    distanceKm: 1340,
    approxDrive: "~13 hours",
    tagline: "Dammam to Jeddah car transport & satha",
    taglineAr: "نقل سيارة من الدمام إلى جدة",
    intro:
      "Dammam to Jeddah is a full cross-Kingdom car transport — about 1,340 km from the Gulf coast to the Red Sea. As a Dammam-based operator we take this as a booked flatbed job: a car for sale, a relocation, or a vehicle that has to reach a specific Jeddah workshop or the Islamic Port. Your car travels secured on the bed and is delivered to the address you choose. Send the vehicle type, pickup, and destination on WhatsApp and we confirm the price and schedule before booking.",
    introAr:
      "النقل من الدمام إلى جدة نقل كامل عبر المملكة — نحو ١٣٤٠ كم من ساحل الخليج إلى ساحل البحر الأحمر. بحكم أن مقرنا في الدمام، ننفّذه كنقل محجوز على سطحة: سيارة للبيع، أو نقل سكن، أو سيارة يجب أن تصل إلى ورشة محددة في جدة أو إلى الميناء الإسلامي. تُنقل سيارتك مثبّتة على السطحة وتُسلّم إلى العنوان الذي تختاره. أرسل نوع السيارة ومكان الاستلام والوجهة عبر واتساب ونؤكد السعر والجدول قبل الحجز.",
    image: "/locations/jeddah-hero.webp",
    highlights: [
      "Cross-Kingdom flatbed transport, Gulf coast to Red Sea",
      "Cars for sale, relocations, and workshop/dealership deliveries",
      "Delivery to Jeddah city or the Islamic Port area",
      "Secured, photo-documented handover on request",
      "Price & schedule confirmed on WhatsApp before booking",
    ],
    highlightsAr: [
      "نقل عبر المملكة على سطحة، من الخليج إلى البحر الأحمر",
      "سيارات للبيع ونقل سكن وتسليم للورش والمعارض",
      "التسليم داخل جدة أو في منطقة الميناء الإسلامي",
      "تسليم مثبّت وموثّق بالصور عند الطلب",
      "تأكيد السعر والجدول عبر واتساب قبل الحجز",
    ],
    faqs: [
      {
        question: "How much is car transport from Dammam to Jeddah?",
        answer:
          "It depends on the vehicle, pickup and drop-off points, and timing — a long cross-Kingdom job. Send the details on WhatsApp and we confirm a clear price before booking.",
      },
      {
        question: "How long does Dammam to Jeddah car transport take?",
        answer:
          "It's about 1,340 km — roughly a 13-hour drive. As a booked job we agree the pickup and expected delivery window with you on WhatsApp.",
      },
      {
        question: "Can you deliver a car to Jeddah Islamic Port?",
        answer:
          "Yes — delivery to or collection from the Jeddah port area is part of the transport booking, with your clearing agent handling the gate paperwork.",
      },
    ],
    faqsAr: [
      {
        question: "كم سعر نقل سيارة من الدمام إلى جدة؟",
        answer:
          "يعتمد على نوع السيارة ونقاط الاستلام والتسليم والوقت — وهو نقل طويل عبر المملكة. أرسل التفاصيل عبر واتساب ونؤكد سعراً واضحاً قبل الحجز.",
      },
      {
        question: "كم يستغرق نقل السيارة من الدمام إلى جدة؟",
        answer:
          "المسافة نحو ١٣٤٠ كم — أي حوالي ١٣ ساعة قيادة. كعمل محجوز نتفق معك على وقت الاستلام والتسليم المتوقع عبر واتساب.",
      },
      {
        question: "هل تسلّمون السيارة في ميناء جدة الإسلامي؟",
        answer:
          "نعم، التسليم أو الاستلام من منطقة ميناء جدة جزء من حجز النقل، ويتولى مخلّصك الجمركي أوراق البوابة.",
      },
    ],
  },
  {
    slug: "dammam-to-yanbu",
    from: "Dammam",
    to: "Yanbu",
    fromAr: "الدمام",
    toAr: "ينبع",
    distanceKm: 1250,
    approxDrive: "~12 hours",
    tagline: "Dammam to Yanbu car transport & satha",
    taglineAr: "نقل سيارة من الدمام إلى ينبع",
    intro:
      "Dammam to Yanbu is a long-haul, cross-Kingdom car transport toward the Red Sea industrial coast — around 1,250 km. As a Dammam-based operator we handle this as a booked flatbed job: common for the Yanbu industrial workforce moving a car, a sale, or a relocation between the two coasts. The vehicle travels secured on the bed and is delivered to Yanbu city or the industrial area. WhatsApp the vehicle type, pickup, and destination for a clear price and schedule.",
    introAr:
      "النقل من الدمام إلى ينبع نقل طويل عبر المملكة باتجاه ساحل البحر الأحمر الصناعي — نحو ١٢٥٠ كم. بحكم أن مقرنا في الدمام، ننفّذه كنقل محجوز على سطحة: شائع لدى العاملين في صناعة ينبع لنقل سيارة، أو بيع، أو نقل سكن بين الساحلين. تُنقل السيارة مثبّتة على السطحة وتُسلّم في مدينة ينبع أو المنطقة الصناعية. أرسل نوع السيارة ومكان الاستلام والوجهة عبر واتساب للحصول على سعر وجدول واضحين.",
    image: "/locations/jeddah-hero.webp",
    highlights: [
      "Long-haul flatbed transport to the Red Sea coast",
      "Popular with the Yanbu industrial workforce",
      "Delivery to Yanbu city or the Royal Commission industrial area",
      "Secured, photo-documented handover on request",
      "Price & schedule confirmed on WhatsApp before booking",
    ],
    highlightsAr: [
      "نقل طويل على سطحة إلى ساحل البحر الأحمر",
      "مطلوب كثيراً لدى العاملين في صناعة ينبع",
      "التسليم في مدينة ينبع أو منطقة الهيئة الملكية الصناعية",
      "تسليم مثبّت وموثّق بالصور عند الطلب",
      "تأكيد السعر والجدول عبر واتساب قبل الحجز",
    ],
    faqs: [
      {
        question: "How much is car transport from Dammam to Yanbu?",
        answer:
          "It depends on the vehicle, the exact pickup and drop-off, and timing — a long cross-Kingdom job. Send the details on WhatsApp for a clear price before booking.",
      },
      {
        question: "Can you deliver to Yanbu Industrial City?",
        answer:
          "Yes — delivery to the Yanbu industrial area is part of the transport booking. Share the gate and company details so access is arranged smoothly.",
      },
      {
        question: "How long does Dammam to Yanbu transport take?",
        answer:
          "It's roughly 1,250 km, about a 12-hour drive. As a booked job we agree the pickup and delivery window with you on WhatsApp.",
      },
    ],
    faqsAr: [
      {
        question: "كم سعر نقل سيارة من الدمام إلى ينبع؟",
        answer:
          "يعتمد على نوع السيارة ومكان الاستلام والتسليم والوقت — وهو نقل طويل عبر المملكة. أرسل التفاصيل عبر واتساب للحصول على سعر واضح قبل الحجز.",
      },
      {
        question: "هل تسلّمون في مدينة ينبع الصناعية؟",
        answer: "نعم، التسليم في منطقة ينبع الصناعية جزء من حجز النقل. أرسل رقم البوابة وتفاصيل الشركة لترتيب الدخول بسهولة.",
      },
      {
        question: "كم يستغرق النقل من الدمام إلى ينبع؟",
        answer: "المسافة نحو ١٢٥٠ كم، أي حوالي ١٢ ساعة قيادة. كعمل محجوز نتفق معك على وقت الاستلام والتسليم عبر واتساب.",
      },
    ],
  },
];

export function getRecoveryRoute(slug: string) {
  return RECOVERY_ROUTES.find((r) => r.slug === slug);
}
