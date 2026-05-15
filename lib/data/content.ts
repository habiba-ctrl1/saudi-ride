export type Locale = "en" | "ar";

type SiteCopy = {
  brand: string;
  navBookNow: string;
  navLanguage: string;
  heroBadge: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  bookingBadge: string;
  bookingTitle: string;
  bookingDescription: string;
  servicesBadge: string;
  servicesTitle: string;
  fleetBadge: string;
  fleetTitle: string;
  contactBadge: string;
  contactTitle: string;
  contactDescription: string;
  whatsappLabel: string;
  whatsappCta: string;
  services: Array<{ title: string; description: string }>;
  fleet: Array<{ name: string; type: string; features: string[] }>;
  bookingForm: {
    heading: string;
    stepLabel: string;
    stepTitles: [string, string, string, string];
    labels: {
      pickup: string;
      dropoff: string;
      date: string;
      time: string;
      passengers: string;
    };
    placeholders: {
      pickup: string;
      dropoff: string;
    };
    buttons: {
      back: string;
      next: string;
      submit: string;
      submitting: string;
    };
    success: string;
    error: string;
  };
};

export const siteContent: Record<Locale, SiteCopy> = {
  en: {
    brand: "RIYADH LUXE TAXI",
    navBookNow: "Book Now",
    navLanguage: "AR",
    heroBadge: "Premium mobility in Saudi Arabia",
    heroTitle: "Premium Taxi Rides",
    heroHighlight: "Built for Comfort & Class",
    heroDescription:
      "Enjoy executive-level transportation for airports, Umrah journeys, and intercity travel with refined service standards and professional chauffeurs.",
    heroPrimaryCta: "Instant Booking",
    heroSecondaryCta: "Explore Fleet",
    bookingBadge: "Booking Experience",
    bookingTitle: "Book your next ride in under a minute",
    bookingDescription:
      "A simple, guided booking flow designed for busy travelers and families. Enter the essentials and our concierge team confirms your premium ride right away.",
    servicesBadge: "Services",
    servicesTitle: "Tailored travel categories",
    fleetBadge: "Fleet",
    fleetTitle: "Choose your preferred vehicle",
    contactBadge: "Contact",
    contactTitle: "Speak with our travel desk",
    contactDescription: "Available 24/7 for private bookings, business accounts, and custom Umrah transportation plans.",
    whatsappLabel: "Chat on WhatsApp",
    whatsappCta: "WhatsApp",
    services: [
      {
        title: "Airport Transfers",
        description: "Reliable premium pick-up and drop-off to Riyadh, Jeddah, and Madinah airports with precise scheduling."
      },
      {
        title: "Umrah / Ziyarat Tours",
        description: "Comfort-first rides for Umrah and Ziyarat trips with courteous drivers and spacious vehicles."
      },
      {
        title: "City-to-City Travel",
        description: "Smooth intercity journeys across Saudi Arabia with executive-level comfort and safety."
      }
    ],
    fleet: [
      {
        name: "Toyota Camry",
        type: "Executive Sedan",
        features: ["Air Conditioning", "2 Large Bags", "Comfort Seating"]
      },
      {
        name: "GMC Yukon",
        type: "Premium SUV",
        features: ["Air Conditioning", "4 Large Bags", "VIP Cabin Space"]
      },
      {
        name: "Hyundai Staria",
        type: "Luxury Van",
        features: ["Air Conditioning", "5 Large Bags", "Family-Friendly Cabin"]
      }
    ],
    bookingForm: {
      heading: "Instant Booking",
      stepLabel: "Step",
      stepTitles: ["Pick-up", "Drop-off", "Date & Time", "Passengers"],
      labels: {
        pickup: "Pick-up Location",
        dropoff: "Drop-off Location",
        date: "Date",
        time: "Time",
        passengers: "Passenger Count"
      },
      placeholders: {
        pickup: "e.g. King Khalid International Airport",
        dropoff: "e.g. Makkah Clock Royal Tower"
      },
      buttons: {
        back: "Back",
        next: "Next",
        submit: "Confirm Booking",
        submitting: "Submitting..."
      },
      success: "Booking request sent successfully. Our team will contact you shortly.",
      error: "Unable to submit booking right now. Please try again."
    }
  },
  ar: {
    brand: "تاكسي الرياض الفاخر",
    navBookNow: "احجز الآن",
    navLanguage: "EN",
    heroBadge: "تنقل فاخر في المملكة العربية السعودية",
    heroTitle: "رحلات تاكسي فاخرة",
    heroHighlight: "راحة وأناقة في كل مشوار",
    heroDescription:
      "استمتع بخدمة نقل راقية للمطارات ورحلات العمرة والتنقل بين المدن مع سائقين محترفين ومعايير ضيافة عالية.",
    heroPrimaryCta: "حجز فوري",
    heroSecondaryCta: "استعرض الأسطول",
    bookingBadge: "تجربة الحجز",
    bookingTitle: "احجز رحلتك القادمة خلال أقل من دقيقة",
    bookingDescription:
      "نموذج حجز بسيط وموجّه للمسافرين والعائلات. أدخل التفاصيل الأساسية وسيتواصل فريقنا لتأكيد الرحلة فوراً.",
    servicesBadge: "الخدمات",
    servicesTitle: "فئات سفر مصممة حسب احتياجك",
    fleetBadge: "الأسطول",
    fleetTitle: "اختر المركبة المناسبة لك",
    contactBadge: "التواصل",
    contactTitle: "تحدث مع فريق خدمة العملاء",
    contactDescription: "متاحون 24/7 للحجوزات الخاصة وحسابات الشركات وخطط نقل العمرة المخصصة.",
    whatsappLabel: "تواصل عبر واتساب",
    whatsappCta: "واتساب",
    services: [
      {
        title: "التوصيل من وإلى المطار",
        description: "خدمة موثوقة وفاخرة من وإلى مطارات الرياض وجدة والمدينة مع التزام دقيق بالمواعيد."
      },
      {
        title: "جولات العمرة والزيارات",
        description: "رحلات مريحة للعمرة والزيارات مع سائقين محترفين ومركبات واسعة."
      },
      {
        title: "السفر بين المدن",
        description: "رحلات سلسة بين مدن المملكة مع أعلى معايير الراحة والسلامة."
      }
    ],
    fleet: [
      {
        name: "تويوتا كامري",
        type: "سيدان تنفيذية",
        features: ["مكيف هواء", "سعة 2 حقيبة كبيرة", "مقاعد مريحة"]
      },
      {
        name: "جي إم سي يوكن",
        type: "دفع رباعي فاخر",
        features: ["مكيف هواء", "سعة 4 حقائب كبيرة", "مساحة داخلية فاخرة"]
      },
      {
        name: "هيونداي ستاريا",
        type: "فان فاخر",
        features: ["مكيف هواء", "سعة 5 حقائب كبيرة", "مناسب للعائلات"]
      }
    ],
    bookingForm: {
      heading: "حجز فوري",
      stepLabel: "الخطوة",
      stepTitles: ["موقع الانطلاق", "الوجهة", "التاريخ والوقت", "عدد الركاب"],
      labels: {
        pickup: "موقع الانطلاق",
        dropoff: "موقع الوصول",
        date: "التاريخ",
        time: "الوقت",
        passengers: "عدد الركاب"
      },
      placeholders: {
        pickup: "مثال: مطار الملك خالد الدولي",
        dropoff: "مثال: برج الساعة - مكة"
      },
      buttons: {
        back: "السابق",
        next: "التالي",
        submit: "تأكيد الحجز",
        submitting: "جارٍ الإرسال..."
      },
      success: "تم إرسال طلب الحجز بنجاح. سيتواصل فريقنا معك قريباً.",
      error: "تعذر إرسال الحجز حالياً. يرجى المحاولة مرة أخرى."
    }
  }
};
