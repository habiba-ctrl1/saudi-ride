// Car recovery / towing (سطحة) service data — hub + city pages + intercity routes.
//
// HONESTY RULE: the operator is a single Dammam-based satha (brother). Only the
// Eastern Province cluster (region: "eastern") claims genuine local recovery.
// Far cities are either intercity-transport destinations (transport: true) or
// noindex (no real local service). No multi-truck "network" / fixed dispatch-time
// claims. Pricing is always confirmed on WhatsApp — no fixed public numbers.

export interface RecoveryFaq {
  question: string;
  answer: string;
}

export interface RecoveryCity {
  slug: string;
  name: string;
  nameAr: string; // Arabic city name, e.g. الرياض
  sathaAr: string; // exact Arabic search phrase, e.g. سطحة الرياض
  /** "eastern" = real local coverage (brother's turf). "other" = not local. */
  region: "eastern" | "other";
  /** Reframed as intercity car-transport destination (Riyadh/Jeddah/Yanbu). */
  transport?: boolean;
  /** No real service here — keep page but noindex (Makkah/Madinah/Taif/Tabuk). */
  noindex?: boolean;
  tagline: string;
  intro: string; // unique per-city paragraph (no duplicate content)
  image: string;
  areas: string[]; // districts / nearby towns covered
  highways: string[]; // major roads where breakdowns happen
  faqs: RecoveryFaq[];
  // ── Arabic content (only for the Eastern Province cluster that has /ar pages) ──
  taglineAr?: string;
  introAr?: string;
  areasAr?: string[];
  highwaysAr?: string[];
  faqsAr?: RecoveryFaq[];
}

export const RECOVERY_WHATSAPP_TEXT =
  "Salam, I need car recovery (satha). My location: ";

export const RECOVERY_SERVICES = [
  {
    key: "flatbed",
    name: "Flatbed Tow Truck (Satha سطحة)",
    nameAr: "سطحة هيدروليك",
    desc: "Hydraulic flatbed recovery for sedans, SUVs, and luxury cars. Your vehicle is carried fully off the ground — zero wear on the transmission, ideal for AWD and low-clearance cars.",
  },
  {
    key: "breakdown",
    name: "Breakdown & Accident Recovery",
    nameAr: "سحب المتعطلة والحوادث",
    desc: "Engine failure, overheating, or an accident — we recover your car and deliver it to the workshop, dealership, or your home.",
  },
  {
    key: "battery",
    name: "Battery Jump Start",
    nameAr: "شحن البطارية",
    desc: "Dead battery in a parking lot or at home? We reach you with jump-start equipment, or tow you to the nearest battery shop if it's finished.",
  },
  {
    key: "tire",
    name: "Flat Tire Assistance",
    nameAr: "تبديل الإطارات",
    desc: "Tire burst on the road? We help you switch to the spare on the spot, or flatbed the car to the nearest tire shop.",
  },
  {
    key: "intercity",
    name: "Intercity Car Transport",
    nameAr: "نقل السيارات بين المدن",
    desc: "Moving a car between cities — Dammam to Riyadh, Jeddah, Yanbu, or any route in the Kingdom. Booked flatbed transport, priced on WhatsApp.",
  },
  {
    key: "heavy",
    name: "Heavy & Commercial Recovery",
    nameAr: "سحب المركبات الثقيلة",
    desc: "Vans, pickups, and light commercial vehicles. Larger recovery (winch ونش / heavy loader) arranged on request.",
  },
] as const;

// What determines the price — shown instead of fixed numbers.
export const RECOVERY_PRICE_FACTORS = [
  "Where the car is (district or highway) and the destination",
  "Vehicle type & size — sedan, SUV, 4x4, van",
  "Distance in kilometres (local vs intercity transport)",
  "Loading difficulty — accident, off-road, basement parking",
  "Time of day and current availability",
];

export const RECOVERY_PRICE_FACTORS_AR = [
  "موقع السيارة (الحي أو الطريق السريع) والوجهة",
  "نوع السيارة وحجمها — سيدان، دفع رباعي، فان",
  "المسافة بالكيلومترات — داخل المدينة أو نقل بين المدن",
  "صعوبة التحميل — حادث، طريق وعر، موقف سفلي",
  "الوقت من اليوم ومدى التوفر حالياً",
];

export const RECOVERY_GLOBAL_FAQS: RecoveryFaq[] = [
  {
    question: "How do I request a recovery truck (satha)?",
    answer:
      "Send your live location on WhatsApp along with your car make/model and what happened (breakdown, accident, flat battery). We confirm a clear price and the truck's timing before anything moves.",
  },
  {
    question: "How much does car towing cost in Saudi Arabia?",
    answer:
      "There is no fixed public price — the cost depends on the car's location, the destination, vehicle type, and distance. You always get a clear quote on WhatsApp before the truck moves, so there are no surprises on arrival.",
  },
  {
    question: "What is the difference between a satha (سطحة) and a normal tow truck?",
    answer:
      "A satha is a flatbed: your car is winched fully onto the truck bed, so no wheels touch the road during transport. This is the safest method for automatic, AWD, and luxury vehicles. Hook-and-chain trucks drag two wheels on the road and can damage modern cars — we recommend flatbed.",
  },
  {
    question: "Do you work at night and on Fridays?",
    answer:
      "Yes — recovery is available 24/7, including late nights, Fridays, and public holidays. Message us on WhatsApp and we confirm availability.",
  },
  {
    question: "Can you recover my car if I'm not with it?",
    answer:
      "Yes. Share the car's location, a photo, and the drop-off address on WhatsApp. Many customers leave the key with a guard or family member and track the delivery by phone.",
  },
  {
    question: "Do you transport cars between cities?",
    answer:
      "Yes — intercity car transport is one of our main services, especially from Dammam and the Eastern Province to Riyadh, Jeddah, Yanbu, and beyond. Send the car type and destination on WhatsApp for a quote.",
  },
];

export const RECOVERY_GLOBAL_FAQS_AR: RecoveryFaq[] = [
  {
    question: "كيف أطلب سطحة؟",
    answer:
      "أرسل موقعك عبر واتساب مع نوع السيارة وما حدث (تعطل، حادث، بطارية)، وسنؤكد لك السعر والوقت خلال دقائق قبل تحرك السطحة.",
  },
  {
    question: "كم سعر السطحة؟",
    answer:
      "لا يوجد سعر ثابت معلن — يعتمد السعر على موقع السيارة والوجهة ونوع السيارة والمسافة، ويتم تأكيده عبر واتساب قبل التحرك دون أي مفاجآت.",
  },
  {
    question: "ما الفرق بين السطحة الهيدروليكية والونش؟",
    answer:
      "السطحة الهيدروليكية تحمل السيارة بالكامل على سطح مستوٍ دون أن تلمس العجلات الأرض، وهي الأنسب للسيارات الأوتوماتيك والفاخرة والدفع الرباعي. أما الونش فيسحب السيارة على عجلتين وقد يضرّ السيارات الحديثة.",
  },
  {
    question: "هل تعملون ليلاً وأيام الجمعة؟",
    answer: "نعم، الخدمة متاحة على مدار الساعة بما في ذلك الليل وأيام الجمعة والعطلات. راسلنا عبر واتساب لتأكيد التوفر.",
  },
  {
    question: "هل تنقلون السيارات من الدمام إلى مدن أخرى؟",
    answer:
      "نعم، ننقل السيارات من الدمام والمنطقة الشرقية إلى الرياض وجدة وينبع وغيرها. أرسل نوع السيارة والوجهة عبر واتساب للحصول على عرض السعر.",
  },
];

export const RECOVERY_CITIES: RecoveryCity[] = [
  // ─────────────── EASTERN PROVINCE CLUSTER (real local coverage) ───────────────
  {
    slug: "dammam",
    name: "Dammam",
    nameAr: "الدمام",
    sathaAr: "سطحة الدمام",
    region: "eastern",
    tagline: "Dammam-based flatbed satha — Eastern Province, 24/7",
    intro:
      "Dammam is our home base. We run a hydraulic flatbed (satha) for the city and the surrounding Eastern Province — Dammam, Al-Khobar, Dhahran, Qatif, and the corridor toward Jubail. Breakdown, accident, dead battery, or a car that won't start: share your location on WhatsApp and we confirm the price and timing before the truck moves. We also handle booked intercity transport from Dammam to Riyadh, Jeddah, and beyond.",
    image: "/services/car-recovery-hero.webp",
    areas: ["Dammam Corniche", "Al-Khobar", "Dhahran", "Qatif", "Half Moon Bay", "Dammam Industrial City", "Jubail Road", "King Fahd Causeway approach"],
    highways: ["Dammam–Riyadh Highway (Route 40)", "Dhahran–Jubail Highway", "King Fahd Causeway Expressway", "Abu Hadriyah Highway (Route 95)"],
    faqs: [
      {
        question: "Do you cover Al-Khobar and Dhahran from Dammam?",
        answer:
          "Yes — Dammam, Al-Khobar, Dhahran, and Qatif are all part of our Eastern Province coverage. Share your live location on WhatsApp and we confirm timing before dispatch.",
      },
      {
        question: "My car broke down near the King Fahd Causeway. Can you help?",
        answer:
          "Yes — we recover vehicles from the causeway approach roads on the Saudi side. If you were heading to Bahrain, we can flatbed the car back to Khobar or Dammam.",
      },
      {
        question: "Can you transport my car from Dammam to another city?",
        answer:
          "Yes — booked intercity car transport (Dammam to Riyadh, Jeddah, Yanbu, and more) is one of our main services. Send the car type and destination on WhatsApp for a quote.",
      },
    ],
    taglineAr: "سطحة الدمام والمنطقة الشرقية على مدار الساعة",
    introAr:
      "مقرنا في الدمام، ونقدّم خدمة سطحة هيدروليك لسحب ونقل السيارات في الدمام والمناطق المجاورة بالمنطقة الشرقية — الخبر والظهران والقطيف وطريق الجبيل. تعطل، حادث، بطارية فاضية، أو سيارة لا تعمل: أرسل موقعك عبر واتساب ونؤكد لك السعر والوقت قبل تحرك السطحة. كما ننقل السيارات من الدمام إلى الرياض وجدة وغيرها بالحجز المسبق.",
    areasAr: ["كورنيش الدمام", "الخبر", "الظهران", "القطيف", "نصف القمر", "المدينة الصناعية بالدمام", "طريق الجبيل"],
    highwaysAr: ["طريق الدمام–الرياض", "طريق الظهران–الجبيل", "جسر الملك فهد", "طريق أبو حدرية"],
    faqsAr: [
      {
        question: "هل السطحة متوفرة في الدمام على مدار ٢٤ ساعة؟",
        answer:
          "نعم، خدمة سحب السيارات متاحة على مدار الساعة في الدمام والمنطقة الشرقية. أرسل موقعك عبر واتساب لنؤكد لك التوفر والوقت.",
      },
      {
        question: "هل تغطون الخبر والظهران من الدمام؟",
        answer: "نعم، الدمام والخبر والظهران والقطيف كلها ضمن تغطيتنا في المنطقة الشرقية. شارك موقعك عبر واتساب ونؤكد الوقت قبل التحرك.",
      },
      {
        question: "هل تنقلون السيارة من الدمام إلى مدينة أخرى؟",
        answer:
          "نعم، نقل السيارات من الدمام إلى الرياض وجدة وينبع وغيرها من خدماتنا الأساسية بالحجز المسبق. أرسل نوع السيارة والوجهة عبر واتساب للحصول على السعر.",
      },
    ],
  },
  {
    slug: "al-khobar",
    name: "Al Khobar",
    nameAr: "الخبر",
    sathaAr: "سطحة الخبر",
    region: "eastern",
    tagline: "Khobar, Corniche & the Causeway approach",
    intro:
      "Al Khobar sits between Dammam, Dhahran, and the King Fahd Causeway to Bahrain. From our Dammam base we cover the Khobar waterfront, the Al-Rashid Mall area, Al-Thuqbah, and the busy Causeway approach roads where weekend traffic and salt-air corrosion cause frequent breakdowns. Share your location on WhatsApp for a clear price before dispatch.",
    image: "/locations/dammam-hero.webp",
    areas: ["Al Khobar Corniche", "Al-Rashid Mall area", "Al-Thuqbah", "Half Moon Bay", "Causeway approach", "Dhahran–Khobar Road"],
    highways: ["King Fahd Causeway Approach", "Dammam–Khobar Highway", "Dhahran–Jubail Highway", "Abu Hadriyah Highway"],
    faqs: [
      {
        question: "Can you recover my car from the King Fahd Causeway?",
        answer:
          "We recover vehicles from the Saudi side of the causeway approach roads. Share your location on WhatsApp and we confirm. If you are on the Bahraini side, we can arrange collection at the Saudi customs checkpoint.",
      },
      {
        question: "Do you reach Half Moon Bay?",
        answer:
          "Yes, Half Moon Bay and the Khobar beach areas are within our Eastern Province coverage. Send your live location on WhatsApp and we confirm timing.",
      },
    ],
    taglineAr: "سطحة الخبر والكورنيش وطريق الجسر",
    introAr:
      "تقع الخبر بين الدمام والظهران وجسر الملك فهد المؤدي إلى البحرين. من مقرنا في الدمام نغطي كورنيش الخبر ومنطقة الراشد مول والثقبة وطرق الجسر المزدحمة حيث تكثر الأعطال بسبب الزحام والرطوبة المالحة. أرسل موقعك عبر واتساب لتأكيد السعر قبل التحرك.",
    areasAr: ["كورنيش الخبر", "منطقة الراشد مول", "الثقبة", "نصف القمر", "طريق الجسر", "طريق الظهران–الخبر"],
    highwaysAr: ["طريق جسر الملك فهد", "طريق الدمام–الخبر", "طريق الظهران–الجبيل", "طريق أبو حدرية"],
    faqsAr: [
      {
        question: "هل تسحبون السيارة من جسر الملك فهد؟",
        answer:
          "نعم، نسحب السيارات من طرق الجسر على الجانب السعودي. شارك موقعك عبر واتساب ونؤكد لك. وإن كنت على الجانب البحريني يمكن ترتيب الاستلام عند جمارك المملكة.",
      },
      {
        question: "هل السطحة متوفرة في الخبر ٢٤ ساعة؟",
        answer: "نعم، خدمة السطحة متاحة على مدار الساعة في الخبر ضمن تغطيتنا للمنطقة الشرقية. أرسل موقعك عبر واتساب لتأكيد الوقت.",
      },
    ],
  },
  {
    slug: "dhahran",
    name: "Dhahran",
    nameAr: "الظهران",
    sathaAr: "سطحة الظهران",
    region: "eastern",
    tagline: "Dhahran, Aramco area & the university district",
    intro:
      "Dhahran is minutes from our Dammam base — home to Saudi Aramco, KFUPM, and the Dhahran expressways linking Khobar and Dammam. We recover cars from the residential districts, the mall area, and the highways around Dhahran, and flatbed them to any workshop or dealership in the Eastern Province. Send your location on WhatsApp and we confirm the price first.",
    image: "/locations/dammam-hero.webp",
    areas: ["Dhahran Hills", "KFUPM area", "Doha district", "Aramco camp approach", "Dhahran Mall area", "Dhahran–Khobar Road"],
    highways: ["Dhahran–Khobar Highway", "Dhahran–Jubail Highway", "Dammam–Dhahran Expressway", "Abu Hadriyah Highway"],
    faqs: [
      {
        question: "How quickly can a satha reach Dhahran?",
        answer:
          "Dhahran is very close to our Dammam base, so it is one of the fastest areas for us to reach. Share your live location on WhatsApp and we confirm the exact timing before dispatch.",
      },
      {
        question: "Can you recover a car near the Aramco or KFUPM areas?",
        answer:
          "Yes — we cover the residential and approach areas around Aramco and KFUPM. For gated zones, share the gate and any pass details so entry is smooth.",
      },
    ],
    taglineAr: "سطحة الظهران ومنطقة أرامكو والجامعة",
    introAr:
      "الظهران على بُعد دقائق من مقرنا في الدمام — وتضم أرامكو السعودية وجامعة الملك فهد للبترول والمعادن والطرق السريعة الرابطة بين الخبر والدمام. نسحب السيارات من الأحياء السكنية ومنطقة المول والطرق حول الظهران وننقلها إلى أي ورشة أو معرض في المنطقة الشرقية. أرسل موقعك عبر واتساب ونؤكد السعر أولاً.",
    areasAr: ["تلال الظهران", "منطقة جامعة البترول", "حي الدوحة", "مدخل حي أرامكو", "منطقة ظهران مول", "طريق الظهران–الخبر"],
    highwaysAr: ["طريق الظهران–الخبر", "طريق الظهران–الجبيل", "طريق الدمام–الظهران السريع", "طريق أبو حدرية"],
    faqsAr: [
      {
        question: "كم يستغرق وصول السطحة إلى الظهران؟",
        answer:
          "الظهران قريبة جداً من مقرنا في الدمام، لذا تُعد من أسرع المناطق وصولاً. شارك موقعك عبر واتساب ونؤكد لك الوقت بدقة قبل التحرك.",
      },
      {
        question: "هل تسحبون السيارة قرب مناطق أرامكو أو الجامعة؟",
        answer: "نعم، نغطي المناطق السكنية والمداخل قرب أرامكو وجامعة البترول. للمناطق المسوّرة، أرسل رقم البوابة وتفاصيل التصريح لتسهيل الدخول.",
      },
    ],
  },
  {
    slug: "qatif",
    name: "Qatif",
    nameAr: "القطيف",
    sathaAr: "سطحة القطيف",
    region: "eastern",
    tagline: "Qatif, Saihat & Tarout coverage",
    intro:
      "Qatif and its towns — Saihat, Tarout, Anak, and Safwa — sit just north of Dammam along the Gulf coast. From our Dammam base we cover the Qatif districts, the coastal road, and the highway toward Jubail, recovering breakdowns and accident vehicles to workshops across the Eastern Province. WhatsApp your location for a clear price before the truck moves.",
    image: "/locations/dammam-hero.webp",
    areas: ["Qatif center", "Saihat", "Tarout Island", "Anak", "Safwa", "Qatif Corniche", "Qatif–Jubail Road"],
    highways: ["Qatif–Dammam Road", "Abu Hadriyah Highway (Route 95)", "Qatif–Jubail Highway", "Coastal Road"],
    faqs: [
      {
        question: "Do you cover Saihat and Tarout?",
        answer:
          "Yes — Saihat, Tarout Island, Anak, and Safwa are all part of our Qatif-area coverage from Dammam. Share your live location on WhatsApp and we confirm timing.",
      },
      {
        question: "Can you tow an accident car from the Qatif–Jubail road?",
        answer:
          "Yes — we recover breakdowns and accident vehicles from the Qatif and Abu Hadriyah highway corridor and flatbed them to the workshop of your choice.",
      },
    ],
    taglineAr: "سطحة القطيف وسيهات وتاروت",
    introAr:
      "تقع القطيف ومدنها — سيهات وتاروت وعنك وصفوى — شمال الدمام على ساحل الخليج مباشرة. من مقرنا في الدمام نغطي أحياء القطيف والطريق الساحلي والطريق باتجاه الجبيل، ونسحب السيارات المتعطلة والمصدومة إلى الورش في أنحاء المنطقة الشرقية. أرسل موقعك عبر واتساب لتأكيد السعر قبل تحرك السطحة.",
    areasAr: ["وسط القطيف", "سيهات", "جزيرة تاروت", "عنك", "صفوى", "كورنيش القطيف", "طريق القطيف–الجبيل"],
    highwaysAr: ["طريق القطيف–الدمام", "طريق أبو حدرية", "طريق القطيف–الجبيل", "الطريق الساحلي"],
    faqsAr: [
      {
        question: "هل تغطون سيهات وتاروت؟",
        answer: "نعم، سيهات وجزيرة تاروت وعنك وصفوى كلها ضمن تغطيتنا لمنطقة القطيف انطلاقاً من الدمام. شارك موقعك عبر واتساب ونؤكد الوقت.",
      },
      {
        question: "هل تسحبون سيارة حادث من طريق القطيف–الجبيل؟",
        answer: "نعم، نسحب السيارات المتعطلة والمصدومة من طريق القطيف وأبو حدرية وننقلها إلى الورشة التي تختارها.",
      },
    ],
  },
  {
    slug: "ras-tanura",
    name: "Ras Tanura",
    nameAr: "رأس تنورة",
    sathaAr: "سطحة رأس تنورة",
    region: "eastern",
    tagline: "Ras Tanura, refinery area & the coast road",
    intro:
      "Ras Tanura, north of Qatif, is home to one of the world's largest refineries and a long stretch of coastal highway. From our Dammam base we recover vehicles from Ras Tanura town, the industrial and refinery approach roads, and the highway back toward Qatif and Jubail. Long distances make breakdown recovery important here — WhatsApp us early with your location for a clear quote.",
    image: "/locations/dammam-hero.webp",
    areas: ["Ras Tanura town", "Najmah", "Refinery approach", "Ras Tanura Corniche", "Rahima", "Coast road"],
    highways: ["Ras Tanura–Qatif Road", "Abu Hadriyah Highway", "Ras Tanura–Jubail Road"],
    faqs: [
      {
        question: "Do you cover the Ras Tanura refinery and industrial roads?",
        answer:
          "We cover the town and the public approach roads to the refinery area. For secured gates, share your gate number and pass details so access is arranged smoothly.",
      },
      {
        question: "My car broke down on the Ras Tanura coast road. Can you reach me?",
        answer:
          "Yes — share your live location and the nearest landmark on WhatsApp. We dispatch a flatbed from the Dammam/Qatif direction and confirm timing before it moves.",
      },
    ],
    taglineAr: "سطحة رأس تنورة ومنطقة المصفاة والطريق الساحلي",
    introAr:
      "تقع رأس تنورة شمال القطيف، وتضم واحدة من أكبر المصافي في العالم وامتداداً طويلاً من الطريق الساحلي. من مقرنا في الدمام نسحب السيارات من مدينة رأس تنورة وطرق المصفاة والمنطقة الصناعية والطريق باتجاه القطيف والجبيل. المسافات الطويلة تجعل خدمة السحب مهمة هنا — راسلنا مبكراً عبر واتساب مع موقعك للحصول على السعر.",
    areasAr: ["مدينة رأس تنورة", "النجمة", "مدخل المصفاة", "كورنيش رأس تنورة", "رحيمة", "الطريق الساحلي"],
    highwaysAr: ["طريق رأس تنورة–القطيف", "طريق أبو حدرية", "طريق رأس تنورة–الجبيل"],
    faqsAr: [
      {
        question: "هل تغطون مصفاة رأس تنورة والطرق الصناعية؟",
        answer: "نغطي المدينة والطرق العامة المؤدية لمنطقة المصفاة. للبوابات المؤمّنة، أرسل رقم البوابة وتفاصيل التصريح لترتيب الدخول بسهولة.",
      },
      {
        question: "تعطلت سيارتي على الطريق الساحلي برأس تنورة، هل تصلون إليّ؟",
        answer: "نعم، شارك موقعك وأقرب معلم عبر واتساب، ونرسل سطحة من اتجاه الدمام/القطيف ونؤكد الوقت قبل التحرك.",
      },
    ],
  },
  {
    slug: "abqaiq",
    name: "Abqaiq",
    nameAr: "بقيق",
    sathaAr: "سطحة بقيق",
    region: "eastern",
    tagline: "Abqaiq (Buqayq) town & the oil-facility roads",
    intro:
      "Abqaiq (Buqayq) lies southwest of Dammam, a major oil-processing town on the road toward Al-Ahsa and Riyadh. From our Dammam base we recover vehicles in Abqaiq town and along the highways that pass through it — key breakdown routes for workers and long-distance drivers. Send your location on WhatsApp and we confirm the price and timing first.",
    image: "/locations/dammam-hero.webp",
    areas: ["Abqaiq town", "Abqaiq industrial approach", "Residential districts", "Abqaiq–Hofuf Road", "Abqaiq–Dammam Road"],
    highways: ["Abqaiq–Dammam Highway", "Abqaiq–Al-Ahsa (Hofuf) Road", "Abqaiq–Riyadh corridor"],
    faqs: [
      {
        question: "Do you cover Abqaiq from Dammam?",
        answer:
          "Yes — Abqaiq is on our Eastern Province routes toward Al-Ahsa and Riyadh. Share your live location on WhatsApp and we confirm the timing before dispatch.",
      },
      {
        question: "My car broke down on the Abqaiq–Hofuf road. Can you help?",
        answer:
          "Yes — that corridor is one we cover for both local recovery and onward transport. Share your location and destination and we send a clear quote.",
      },
    ],
    taglineAr: "سطحة بقيق ومدينة المعالجة والطرق المحيطة",
    introAr:
      "تقع بقيق جنوب غرب الدمام، وهي مدينة رئيسية لمعالجة النفط على الطريق باتجاه الأحساء والرياض. من مقرنا في الدمام نسحب السيارات داخل بقيق وعلى الطرق السريعة التي تمر بها — وهي طرق أعطال مهمة للعاملين وسائقي المسافات الطويلة. أرسل موقعك عبر واتساب ونؤكد السعر والوقت أولاً.",
    areasAr: ["مدينة بقيق", "مدخل المنطقة الصناعية", "الأحياء السكنية", "طريق بقيق–الهفوف", "طريق بقيق–الدمام"],
    highwaysAr: ["طريق بقيق–الدمام", "طريق بقيق–الأحساء (الهفوف)", "محور بقيق–الرياض"],
    faqsAr: [
      {
        question: "هل تغطون بقيق انطلاقاً من الدمام؟",
        answer: "نعم، بقيق على مساراتنا في المنطقة الشرقية باتجاه الأحساء والرياض. شارك موقعك عبر واتساب ونؤكد الوقت قبل التحرك.",
      },
      {
        question: "تعطلت سيارتي على طريق بقيق–الهفوف، هل تساعدونني؟",
        answer: "نعم، هذا المحور من المسارات التي نغطيها للسحب المحلي والنقل بعيد المدى. أرسل موقعك والوجهة ونرسل لك السعر.",
      },
    ],
  },
  {
    slug: "al-ahsa",
    name: "Al-Ahsa",
    nameAr: "الأحساء",
    sathaAr: "سطحة الأحساء",
    region: "eastern",
    tagline: "Al-Ahsa, Hofuf & Al-Mubarraz",
    intro:
      "Al-Ahsa — including Hofuf and Al-Mubarraz — is the largest governorate in the Eastern Province, about 150 km from Dammam. We serve the Al-Ahsa cities for local recovery and, very commonly, for booked transport between Al-Ahsa and Dammam or Riyadh. Whether your car broke down in Hofuf, Al-Mubarraz, or on the highway, WhatsApp your location and we confirm a clear price before dispatch.",
    image: "/locations/dammam-hero.webp",
    areas: ["Hofuf", "Al-Mubarraz", "Al-Ahsa center", "Al-Oyoun", "Al-Jishsha", "King Fahd Road (Al-Ahsa)"],
    highways: ["Al-Ahsa–Dammam Highway", "Al-Ahsa–Riyadh Highway", "Hofuf–Abqaiq Road", "Al-Ahsa–Salwa (Qatar) Road"],
    faqs: [
      {
        question: "Do you cover Hofuf and Al-Mubarraz separately?",
        answer:
          "We cover the whole Al-Ahsa area — Hofuf, Al-Mubarraz, Al-Oyoun, and the surrounding towns — from one service. Share your exact location on WhatsApp and we confirm timing and price.",
      },
      {
        question: "Can you transport my car from Al-Ahsa to Dammam or Riyadh?",
        answer:
          "Yes — Al-Ahsa ⇄ Dammam and Al-Ahsa ⇄ Riyadh are common booked transport jobs for us. Send the car type and destination on WhatsApp for a quote.",
      },
    ],
    taglineAr: "سطحة الأحساء والهفوف والمبرز",
    introAr:
      "الأحساء — وتشمل الهفوف والمبرز — أكبر محافظات المنطقة الشرقية، وتبعد نحو ١٥٠ كم عن الدمام. نخدم مدن الأحساء للسحب المحلي، وكثيراً جداً للنقل المحجوز بين الأحساء والدمام أو الرياض. سواء تعطلت سيارتك في الهفوف أو المبرز أو على الطريق السريع، أرسل موقعك عبر واتساب ونؤكد لك السعر قبل التحرك.",
    areasAr: ["الهفوف", "المبرز", "وسط الأحساء", "العيون", "الجشة", "طريق الملك فهد بالأحساء"],
    highwaysAr: ["طريق الأحساء–الدمام", "طريق الأحساء–الرياض", "طريق الهفوف–بقيق", "طريق الأحساء–سلوى (قطر)"],
    faqsAr: [
      {
        question: "هل تغطون الهفوف والمبرز؟",
        answer:
          "نعم، نغطي منطقة الأحساء بالكامل — الهفوف والمبرز والعيون والمدن المجاورة — بخدمة واحدة. شارك موقعك بدقة عبر واتساب ونؤكد الوقت والسعر.",
      },
      {
        question: "هل تنقلون سيارتي من الأحساء إلى الدمام أو الرياض؟",
        answer: "نعم، النقل بين الأحساء والدمام والأحساء والرياض من أكثر أعمال النقل المحجوز لدينا. أرسل نوع السيارة والوجهة عبر واتساب للسعر.",
      },
    ],
  },
  {
    slug: "jubail",
    name: "Jubail",
    nameAr: "الجبيل",
    sathaAr: "سطحة الجبيل",
    region: "eastern",
    tagline: "Jubail city & the Abu Hadriyah corridor",
    intro:
      "Jubail is Saudi Arabia's largest industrial city, about 90 km up the coast from Dammam. The Royal Commission industrial area, the petrochemical plants, and the long Dammam–Jubail highway generate steady demand for flatbed recovery. From our Dammam base we cover Jubail City and the Abu Hadriyah corridor toward Qatif and Dammam. Share your location on WhatsApp for a clear price before dispatch.",
    image: "/locations/dammam-hero.webp",
    areas: ["Jubail City Center", "Jubail Industrial City approach", "Al-Deffi", "Fanateer Beach", "Jubail–Ras Tanura Road"],
    highways: ["Dammam–Jubail Highway", "Abu Hadriyah Highway (Route 95)", "Jubail–Ras Tanura Road"],
    faqs: [
      {
        question: "Can you reach the Jubail industrial area?",
        answer:
          "We cover Jubail City and the public approach roads to the industrial area. For secured gates, share your gate number and sponsor details so entry is arranged smoothly.",
      },
      {
        question: "My car broke down on the Dammam–Jubail highway. Can you help?",
        answer:
          "Yes — the Dammam–Jubail corridor is a route we cover directly from our Dammam base. Share your live location and the nearest highway sign and we confirm timing.",
      },
    ],
    taglineAr: "سطحة الجبيل ومحور أبو حدرية",
    introAr:
      "الجبيل أكبر مدينة صناعية في السعودية، وتبعد نحو ٩٠ كم شمال الدمام على الساحل. الهيئة الملكية للمنطقة الصناعية ومصانع البتروكيماويات وطريق الدمام–الجبيل الطويل تولّد طلباً مستمراً على خدمة السطحة. من مقرنا في الدمام نغطي مدينة الجبيل ومحور أبو حدرية باتجاه القطيف والدمام. أرسل موقعك عبر واتساب لتأكيد السعر قبل التحرك.",
    areasAr: ["وسط مدينة الجبيل", "مدخل المدينة الصناعية", "الدفي", "شاطئ الفناتير", "طريق الجبيل–رأس تنورة"],
    highwaysAr: ["طريق الدمام–الجبيل", "طريق أبو حدرية", "طريق الجبيل–رأس تنورة"],
    faqsAr: [
      {
        question: "هل تصلون إلى المنطقة الصناعية بالجبيل؟",
        answer: "نغطي مدينة الجبيل والطرق العامة المؤدية للمنطقة الصناعية. للبوابات المؤمّنة، أرسل رقم البوابة وتفاصيل الكفيل لترتيب الدخول.",
      },
      {
        question: "تعطلت سيارتي على طريق الدمام–الجبيل، هل تساعدونني؟",
        answer: "نعم، محور الدمام–الجبيل من المسارات التي نغطيها مباشرة من مقرنا في الدمام. شارك موقعك وأقرب لوحة إرشادية ونؤكد الوقت.",
      },
    ],
  },

  // ─────────── INTERCITY TRANSPORT DESTINATIONS (reframed, honest, EN) ───────────
  {
    slug: "riyadh",
    name: "Riyadh",
    nameAr: "الرياض",
    sathaAr: "سطحة الرياض",
    region: "other",
    transport: true,
    tagline: "Dammam ⇄ Riyadh car transport",
    intro:
      "We are a Dammam-based operator, and Riyadh is our most common intercity transport route. If your car needs to move between the Eastern Province and the capital — a breakdown that must reach a Riyadh dealership, a purchase to collect, or a relocation — we flatbed it on a booked job along the Dammam–Riyadh highway (Route 40). For a live emergency inside Riyadh city we can help coordinate; for transport to or from Dammam, send the details on WhatsApp for a quote.",
    image: "/locations/riyadh-hero.webp",
    areas: ["Dammam ⇄ Riyadh transport", "Riyadh dealerships & workshops", "Al-Kharj Road", "Riyadh Ring Roads (drop-off)", "Route 40 corridor"],
    highways: ["Dammam–Riyadh Highway (Route 40)", "Al-Kharj Road", "Riyadh–Qassim Highway"],
    faqs: [
      {
        question: "Do you transport cars between Dammam and Riyadh?",
        answer:
          "Yes — Dammam ⇄ Riyadh is our main intercity route. We flatbed your car along Route 40 on a booked job. Send the car type, pickup, and destination on WhatsApp for a clear quote.",
      },
      {
        question: "My car broke down on the Riyadh–Dammam highway. Can you recover it?",
        answer:
          "Yes — Route 40 is the corridor we run most. Share your live location and we arrange recovery back to Dammam, onward to Riyadh, or to any workshop on the way.",
      },
    ],
  },
  {
    slug: "jeddah",
    name: "Jeddah",
    nameAr: "جدة",
    sathaAr: "سطحة جدة",
    region: "other",
    transport: true,
    tagline: "Dammam ⇄ Jeddah car transport",
    intro:
      "Jeddah is a long-haul transport route for us from our Dammam base — a booked cross-Kingdom job rather than a local emergency call. Moving a car between the Eastern Province and the Red Sea coast (for a sale, a move, or a workshop), we arrange flatbed transport and confirm the price on WhatsApp. Share the vehicle type, pickup, and destination for a quote.",
    image: "/locations/jeddah-hero.webp",
    areas: ["Dammam ⇄ Jeddah transport", "Cross-Kingdom relocation", "Dealership & port delivery", "Jeddah drop-off (city / port)"],
    highways: ["Dammam–Riyadh–Jeddah corridor", "Makkah Highway (drop-off)", "Jeddah Islamic Port approach"],
    faqs: [
      {
        question: "Do you transport cars from Dammam to Jeddah?",
        answer:
          "Yes — Dammam to Jeddah is a booked long-distance transport job. We flatbed the car across the Kingdom and confirm a clear price on WhatsApp first. Send the car type and both addresses for a quote.",
      },
      {
        question: "Can you deliver a car to Jeddah Islamic Port?",
        answer:
          "Yes — we can deliver to or collect from the Jeddah port area as part of an intercity transport booking, with your clearing agent handling the gate paperwork.",
      },
    ],
  },
  {
    slug: "yanbu",
    name: "Yanbu",
    nameAr: "ينبع",
    sathaAr: "سطحة ينبع",
    region: "other",
    transport: true,
    tagline: "Dammam ⇄ Yanbu car transport",
    intro:
      "Yanbu, on the Red Sea industrial coast, is a long-haul transport route for us from Dammam — a booked flatbed job across the Kingdom. If a car needs to move between the Eastern Province and Yanbu (for the industrial workforce, a sale, or a relocation), send the vehicle type, pickup, and destination on WhatsApp and we confirm the price before dispatch.",
    image: "/locations/jeddah-hero.webp",
    areas: ["Dammam ⇄ Yanbu transport", "Yanbu Industrial City delivery", "Cross-Kingdom relocation", "Yanbu drop-off"],
    highways: ["Dammam–Riyadh–Yanbu corridor", "Yanbu–Madinah Highway (drop-off)", "Yanbu Industrial approach"],
    faqs: [
      {
        question: "Do you transport cars from Dammam to Yanbu?",
        answer:
          "Yes — Dammam to Yanbu is a booked long-distance flatbed transport job. Send the car type, pickup, and destination on WhatsApp and we confirm a clear price before dispatch.",
      },
      {
        question: "Can you deliver to Yanbu Industrial City?",
        answer:
          "Yes — we can deliver to the Yanbu industrial area as part of the transport booking. Share the gate and company details so access is arranged smoothly.",
      },
    ],
  },

  // ───────────────── NOINDEX — no real local service in these cities ─────────────
  {
    slug: "makkah",
    name: "Makkah",
    nameAr: "مكة المكرمة",
    sathaAr: "سطحة مكة",
    region: "other",
    noindex: true,
    tagline: "Intercity car transport to/from Makkah",
    intro:
      "We are a Dammam-based operator and do not run a local recovery truck inside Makkah. What we can help with is booked intercity car transport between the Eastern Province and Makkah. For a live breakdown inside Makkah, please use a local Makkah recovery service; for moving a car to or from Dammam, WhatsApp us for a quote.",
    image: "/locations/makkah-hero.webp",
    areas: ["Dammam ⇄ Makkah transport (booked)"],
    highways: ["Cross-Kingdom transport corridor"],
    faqs: [
      {
        question: "Do you have a tow truck inside Makkah?",
        answer:
          "No — we are based in Dammam and don't operate a local truck in Makkah. We can arrange booked intercity car transport between Makkah and the Eastern Province. WhatsApp us for a quote.",
      },
    ],
  },
  {
    slug: "madinah",
    name: "Madinah",
    nameAr: "المدينة المنورة",
    sathaAr: "سطحة المدينة",
    region: "other",
    noindex: true,
    tagline: "Intercity car transport to/from Madinah",
    intro:
      "We are a Dammam-based operator without a local recovery truck in Madinah. We can help with booked intercity car transport between the Eastern Province and Madinah. For a live breakdown inside Madinah, please use a local service; for moving a car to or from Dammam, WhatsApp us for a quote.",
    image: "/locations/madinah-hero.webp",
    areas: ["Dammam ⇄ Madinah transport (booked)"],
    highways: ["Cross-Kingdom transport corridor"],
    faqs: [
      {
        question: "Do you have a tow truck inside Madinah?",
        answer:
          "No — we're based in Dammam. We can arrange booked intercity car transport between Madinah and the Eastern Province. WhatsApp us for a quote.",
      },
    ],
  },
  {
    slug: "taif",
    name: "Taif",
    nameAr: "الطائف",
    sathaAr: "سطحة الطائف",
    region: "other",
    noindex: true,
    tagline: "Intercity car transport to/from Taif",
    intro:
      "We are a Dammam-based operator and do not run a local truck in Taif. We can help with booked intercity car transport between the Eastern Province and Taif. For a live breakdown on the Taif mountain roads, please use a local recovery service; for transport to or from Dammam, WhatsApp us for a quote.",
    image: "/locations/makkah-hero.webp",
    areas: ["Dammam ⇄ Taif transport (booked)"],
    highways: ["Cross-Kingdom transport corridor"],
    faqs: [
      {
        question: "Do you have a tow truck inside Taif?",
        answer:
          "No — we're based in Dammam. We can arrange booked intercity car transport between Taif and the Eastern Province. WhatsApp us for a quote.",
      },
    ],
  },
  {
    slug: "tabuk",
    name: "Tabuk",
    nameAr: "تبوك",
    sathaAr: "سطحة تبوك",
    region: "other",
    noindex: true,
    tagline: "Intercity car transport to/from Tabuk",
    intro:
      "We are a Dammam-based operator and do not run a local truck in the Tabuk region. We can help with booked long-distance car transport between the Eastern Province and the northwest. For a live breakdown in Tabuk, please use a local service; for transport to or from Dammam, WhatsApp us for a quote.",
    image: "/locations/riyadh-hero.webp",
    areas: ["Dammam ⇄ Tabuk transport (booked)"],
    highways: ["Cross-Kingdom transport corridor"],
    faqs: [
      {
        question: "Do you have a tow truck inside Tabuk?",
        answer:
          "No — we're based in Dammam. We can arrange booked long-distance car transport between Tabuk and the Eastern Province. WhatsApp us for a quote.",
      },
    ],
  },
];

export function getRecoveryCity(slug: string) {
  return RECOVERY_CITIES.find((c) => c.slug === slug);
}

/** Eastern Province cluster that has full Arabic content + /ar pages. */
export const RECOVERY_AR_CITIES = RECOVERY_CITIES.filter((c) => c.introAr);

/** City slugs safe to index (excludes noindex far cities). */
export const RECOVERY_INDEXABLE_CITIES = RECOVERY_CITIES.filter((c) => !c.noindex);
