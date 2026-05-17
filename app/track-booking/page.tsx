"use client";

import { useLanguage } from "@/lib/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShieldCheck,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  MessageCircle,
  AlertTriangle,
  XCircle,
  ArrowLeft,
  Info,
  CheckCircle2
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { contactConfig } from "@/lib/config/contact";

const translations = {
  en: {
    badge: "Chauffeur Tracking Console",
    title: "Check your chauffeur status",
    description: "Enter your secure booking reference and registered WhatsApp phone number to access live chauffeur allocation, dispatch coordinates, and vehicle details.",
    placeholderId: "Booking ID (e.g. RLT-8924-SA)",
    placeholderPhone: "WhatsApp Number (e.g. +966500123456)",
    btnLabel: "Track Chauffeur Status",
    note: "Your transfer coordinates are encrypted. Chauffeur dispatch details are updated in real-time.",
    backBtn: "Back to Tracker",
    notFound: "Booking not found. Please verify the booking reference and phone number.",
    cancelSuccess: "Your booking has been successfully cancelled. A refund/confirmation SMS has been sent.",
    cancelWindowError: "Bookings can only be cancelled up to 24 hours prior to dispatch.",
    cancelling: "Cancelling booking..."
  },
  ar: {
    badge: "منصة تتبع السائقين",
    title: "تتبع حالة السائق والرحلة",
    description: "أدخل رقم الحجز الآمن ورقم الواتساب المسجل للوصول إلى تفاصيل تخصيص السائق الفورية، وإحداثيات الموقع، وبيانات المركبة.",
    placeholderId: "رقم الحجز (مثال: RLT-8924-SA)",
    placeholderPhone: "رقم الواتساب (مثال: +966500123456)",
    btnLabel: "تتبع حالة السائق الآن",
    note: "بيانات رحلتك مشفرة بالكامل. يتم تحديث تفاصيل السائق وموقعه المباشر لحظة بلحظة.",
    backBtn: "العودة إلى التتبع",
    notFound: "لم يتم العثور على الحجز. يرجى التحقق من رقم الحجز ورقم الهاتف.",
    cancelSuccess: "تم إلغاء حجزك بنجاح. تم إرسال رسالة تأكيد نصية قصيرة.",
    cancelWindowError: "يمكن إلغاء الحجز فقط قبل موعد الرحلة بـ 24 ساعة على الأقل.",
    cancelling: "جاري إلغاء الحجز..."
  },
  ur: {
    badge: "ڈرائیور ٹریکنگ کنسول",
    title: "اپنے ڈرائیور کا اسٹیٹس اسٹیٹس",
    description: "اپنا محفوظ بکنگ حوالہ اور رجسٹرڈ واٹس ایپ نمبر درج کریں تاکہ لائیو ڈرائیور کے الاٹمنٹ، مقام کے نقاط اور گاڑی کی تفصیلات معلوم کی جا سکیں۔",
    placeholderId: "بکنگ آئی ڈی (مثال: RLT-8924-SA)",
    placeholderPhone: "واٹس ایپ نمبر (مثال: +966500123456)",
    btnLabel: "ڈرائیور کا اسٹیٹس ٹریک کریں",
    note: "آپ کے سفر کی تفصیلات مکمل طور پر محفوظ ہیں۔ ڈرائیور کی لوکیشن اور اسٹیٹس کو ہر منٹ اپ ڈیٹ کیا جاتا ہے۔",
    backBtn: "ٹریکر پر واپس جائیں",
    notFound: "بکنگ نہیں ملی۔ براہ کرم بکنگ کا حوالہ اور فون نمبر چیک کریں۔",
    cancelSuccess: "آپ کی بکنگ کامیابی کے ساتھ منسوخ کر دی گئی ہے۔ تصدیق کا پیغام بھیج دیا گیا ہے۔",
    cancelWindowError: "بکنگ صرف پک اپ سے 24 گھنٹے پہلے ہی منسوخ کی جا سکتی ہے۔",
    cancelling: "بکنگ منسوخ کی جا رہی ہے..."
  }
};

type BookingDetails = {
  id: string;
  bookingRef: string;
  status: 'PENDING' | 'CONFIRMED' | 'DRIVER_ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  pickupLocation: string;
  dropoffLocation: string;
  pickupDateTime: string;
  returnDateTime: string | null;
  isRoundTrip: boolean;
  passengers: number;
  distance: number | null;
  duration: number | null;
  totalPrice: number;
  currency: string;
  paymentStatus: string;
  paymentMethod: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  notes: string | null;
  driverName: string | null;
  driverPhone: string | null;
  flightNumber: string | null;
  createdAt: string;
  vehicle: {
    name: string;
    nameAr: string;
    image: string;
    type: string;
  };
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

export default function TrackBookingPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const isRtl = language === "ar";

  // Search State
  const [bookingId, setBookingId] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Active Booking
  const [booking, setBooking] = useState<BookingDetails | null>(null);

  // Cancellation states
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  const performTracking = useCallback(async (ref: string, phoneNum: string) => {
    try {
      setLoading(true);
      setErrorMsg("");
      setCancelSuccess(false);

      const res = await fetch(`/api/bookings/${ref}?phone=${encodeURIComponent(phoneNum)}`);
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t.notFound);
      }

      const data = await res.json();
      setBooking(data.booking);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : t.notFound);
      setBooking(null);
    } finally {
      setLoading(false);
    }
  }, [t.notFound]);

  // Auto-search from URL params on load if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const refParam = params.get("ref");
      const phoneParam = params.get("phone");
      if (refParam && phoneParam) {
        setBookingId(refParam);
        setPhone(phoneParam);
        void performTracking(refParam, phoneParam);
      }
    }
  }, [performTracking]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingId.trim() && phone.trim()) {
      // Sync into URL params quietly
      if (typeof window !== "undefined") {
        const newUrl = `${window.location.pathname}?ref=${encodeURIComponent(bookingId)}&phone=${encodeURIComponent(phone)}`;
        window.history.pushState({ path: newUrl }, "", newUrl);
      }
      void performTracking(bookingId.trim(), phone.trim());
    }
  };

  const handleCancelBooking = async () => {
    if (!booking) return;
    
    // Safety check (>24h)
    const hoursToPickup = (new Date(booking.pickupDateTime).getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursToPickup < 24) {
      alert(t.cancelWindowError);
      return;
    }

    if (!confirm(isRtl ? "هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟" : "Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      setCancelLoading(true);
      const res = await fetch(`/api/bookings/${booking.bookingRef}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CANCEL" })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to cancel booking");
      }

      setCancelSuccess(true);
      // Refresh info after 2 seconds
      setTimeout(() => {
        void performTracking(booking.bookingRef, phone);
      }, 1500);

    } catch (err) {
      alert(err instanceof Error ? err.message : "Cancellation failed");
    } finally {
      setCancelLoading(false);
    }
  };

  const getStatusStepIndex = (status: string) => {
    switch (status) {
      case "PENDING": return 0;
      case "CONFIRMED": return 1;
      case "DRIVER_ASSIGNED": return 2;
      case "IN_PROGRESS": return 3;
      case "COMPLETED": return 4;
      case "CANCELLED": return -1;
      default: return 0;
    }
  };

  const statusIndex = booking ? getStatusStepIndex(booking.status) : 0;

  const timelineSteps = [
    { labelEn: "Booking Received", labelAr: "تم استلام الطلب", descEn: "Chauffeur pending allocation", descAr: "في انتظار تعيين السائق" },
    { labelEn: "Confirmed", labelAr: "مؤكد", descEn: "VIP transfer guaranteed", descAr: "تم تأمين السائق والسيارة" },
    { labelEn: "Driver Assigned", labelAr: "تم تعيين السائق", descEn: "Driver details locked", descAr: "سائقك الخاص جاهز للتحرك" },
    { labelEn: "En Route", labelAr: "في الطريق", descEn: "Journey actively in progress", descAr: "الرحلة نشطة حالياً" },
    { labelEn: "Completed", labelAr: "مكتمل", descEn: "Chauffeur safely checked out", descAr: "تم الوصول لوجهتكم بسلام" }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-32 pb-24 relative overflow-hidden">
      
      {/* Background radial luxury glows */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-[#C9A84C]/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#C9A84C]/2.5 blur-3xl pointer-events-none" />

      <div className="section-container relative z-10 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {!booking ? (
            /* SEARCH STAGE */
            <motion.div
              key="search"
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={fadeUp}
              className="max-w-xl mx-auto space-y-10"
            >
              <div className="text-center space-y-4">
                <span className="inline-block text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-semibold">
                  {t.badge}
                </span>
                <h1 className="font-heading text-4xl font-bold leading-tight text-[#F5F0E8]">
                  {t.title}
                </h1>
                <p className="text-xs text-[#A1A1A6] max-w-sm mx-auto leading-relaxed">
                  {t.description}
                </p>
              </div>

              <div className="rounded-3xl border border-[#C9A84C]/15 bg-[#121212] p-8 shadow-[0_12px_40px_rgba(0,0,0,0.6)] relative overflow-hidden">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#C9A84C]/5 blur-2xl pointer-events-none" />

                {errorMsg && (
                  <div className="mb-6 flex items-start gap-2.5 rounded-2xl border border-red-900/40 bg-red-950/20 p-4 text-xs text-red-400">
                    <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleTrackSubmit} className="space-y-5">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[0.65rem] uppercase tracking-wider text-[#A1A1A6] mb-2 font-bold">
                        {isRtl ? "رقم الحجز الآمن" : "Secure Booking Reference"}
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingId}
                        onChange={(e) => setBookingId(e.target.value)}
                        placeholder={t.placeholderId}
                        className="w-full rounded-xl border border-[#C9A84C]/10 bg-black/40 px-4 py-3.5 text-xs text-[#F5F0E8] placeholder-[#7C8088] outline-none focus:border-[#C9A84C] focus:bg-[#121212] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[0.65rem] uppercase tracking-wider text-[#A1A1A6] mb-2 font-bold">
                        {isRtl ? "رقم الواتساب المسجل" : "Registered WhatsApp Number"}
                      </label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t.placeholderPhone}
                        className="w-full rounded-xl border border-[#C9A84C]/10 bg-black/40 px-4 py-3.5 text-xs text-[#F5F0E8] placeholder-[#7C8088] outline-none focus:border-[#C9A84C] focus:bg-[#121212] transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 w-full rounded-full bg-[#C9A84C] py-4 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] shadow-[0_4px_20px_rgba(201,168,76,0.3)] transition-all hover:bg-[#B8963B] disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-[#0A0A0A] border-t-transparent" />
                    ) : (
                      <Search className="h-4.5 w-4.5" />
                    )}
                    <span>{t.btnLabel}</span>
                  </button>

                  <div className="flex items-start gap-2 text-[0.6rem] text-[#7C8088] pt-2 border-t border-[#C9A84C]/10">
                    <ShieldCheck className="h-4 w-4 text-[#C9A84C] shrink-0" />
                    <span>{t.note}</span>
                  </div>
                </form>
              </div>
            </motion.div>
          ) : (
            /* ACTIVE BOOKING DETAILED TRACKER */
            <motion.div
              key="details"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Back button */}
              <button
                onClick={() => setBooking(null)}
                className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/20 bg-black/35 px-4.5 py-2 text-xs font-medium text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{t.backBtn}</span>
              </button>

              {/* Status Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl border border-[#C9A84C]/15 bg-[#121212]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[0.65rem] uppercase tracking-wider text-[#A1A1A6]">
                      {isRtl ? "رمز تتبع الحجز" : "Booking Reference"}
                    </span>
                    <span className="rounded bg-[#C9A84C]/10 px-2 py-0.5 text-xs font-bold text-[#C9A84C]">
                      {booking.bookingRef}
                    </span>
                  </div>
                  <h2 className="font-heading text-2xl font-bold">
                    {booking.customerName}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  {booking.status === "CANCELLED" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-950/40 border border-red-900/35 px-4.5 py-1.5 text-xs font-bold text-red-400">
                      <XCircle className="h-4 w-4" />
                      {isRtl ? "تم إلغاء الحجز" : "Cancelled"}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/25 px-4.5 py-1.5 text-xs font-bold text-[#C9A84C] uppercase animate-pulse">
                      <CheckCircle2 className="h-4 w-4 text-[#C9A84C]" />
                      {booking.status.replace("_", " ")}
                    </span>
                  )}
                </div>
              </div>

              {/* Grid: Map on left, Details on right */}
              <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                
                {/* LEFT: Tracking Timeline & Map */}
                <div className="space-y-8">
                  
                  {/* Timeline progress indicator */}
                  {booking.status !== "CANCELLED" && (
                    <div className="rounded-3xl border border-[#C9A84C]/10 bg-[#121212] p-6 md:p-8">
                      <h3 className="font-heading text-lg font-bold mb-8 text-[#C9A84C] border-b border-[#C9A84C]/10 pb-4">
                        {isRtl ? "خط سير الخدمة المباشر" : "Live Dispatch Timeline"}
                      </h3>

                      <div className="relative pl-6 border-l border-[#C9A84C]/10 space-y-8 text-left">
                        {timelineSteps.map((step, idx) => {
                          const isActive = idx <= statusIndex;
                          const isCurrent = idx === statusIndex;
                          
                          return (
                            <div key={idx} className="relative">
                              {/* Indicator checkpoint dot */}
                              <span className={`absolute -left-9.5 top-0.5 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                isCurrent
                                  ? "bg-[#C9A84C] border-[#C9A84C] text-[#0A0A0A] scale-110 shadow-[0_0_15px_rgba(201,168,76,0.5)]"
                                  : isActive
                                  ? "bg-[#121212] border-[#C9A84C] text-[#C9A84C]"
                                  : "bg-[#121212] border-[#7C8088]/20 text-[#7C8088]/30"
                              }`}>
                                <span className={`h-2 w-2 rounded-full ${isActive ? "bg-current" : "bg-[#7C8088]/25"}`} />
                              </span>

                              <div className="space-y-1">
                                <h4 className={`text-sm font-bold transition-colors ${isActive ? "text-[#F5F0E8]" : "text-[#7C8088]/40"}`}>
                                  {isRtl ? step.labelAr : step.labelEn}
                                  {isCurrent && (
                                    <span className="ml-2 rounded-full bg-[#C9A84C]/10 px-2.5 py-0.5 text-[0.55rem] font-bold text-[#C9A84C]">
                                      {isRtl ? "مباشر" : "Active"}
                                    </span>
                                  )}
                                </h4>
                                <p className={`text-xs ${isActive ? "text-[#A1A1A6]" : "text-[#7C8088]/30"}`}>
                                  {isRtl ? step.descAr : step.descEn}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Simulated interactive map routing */}
                  <div className="rounded-3xl border border-[#C9A84C]/10 bg-[#121212] overflow-hidden shadow-xl">
                    <div className="p-4 border-b border-[#C9A84C]/10 flex items-center justify-between">
                      <span className="text-[0.65rem] uppercase tracking-wider text-[#A1A1A6] font-bold flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
                        {isRtl ? "إحداثيات المسار المباشر (مفعل)" : "Chauffeur Live Route (GPS Active)"}
                      </span>
                      <span className="text-[0.55rem] text-[#C9A84C] font-bold">
                        {booking.distance ? `${booking.distance} km` : "Dynamic estimation"}
                      </span>
                    </div>

                    <div className="relative h-72 w-full bg-black/60 flex items-center justify-center p-6 overflow-hidden">
                      {/* Grid overlay styling */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#C9A84C_1px,transparent_1px),linear-gradient(to_bottom,#C9A84C_1px,transparent_1px)] bg-[size:30px_30px] opacity-5 pointer-events-none" />

                      {/* SVG animated route */}
                      <svg className="w-full h-full max-w-sm" viewBox="0 0 400 200">
                        {/* Route Line background */}
                        <path
                          d="M 50 100 Q 200 30 350 100"
                          fill="none"
                          stroke="#7c8088"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                          opacity="0.3"
                        />
                        {/* Route Line Active progression */}
                        <motion.path
                          d="M 50 100 Q 200 30 350 100"
                          fill="none"
                          stroke="#C9A84C"
                          strokeWidth="3"
                          initial={{ strokeDasharray: "350", strokeDashoffset: "350" }}
                          animate={{ strokeDashoffset: booking.status === "COMPLETED" ? 0 : booking.status === "IN_PROGRESS" ? 175 : 350 }}
                          transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
                        />

                        {/* Pickup Landmark Pin */}
                        <circle cx="50" cy="100" r="8" fill="#121212" stroke="#C9A84C" strokeWidth="2" />
                        <circle cx="50" cy="100" r="3" fill="#C9A84C" />
                        <text x="35" y="125" fill="#7C8088" fontSize="8" fontWeight="bold">PICKUP</text>

                        {/* Drop-off Landmark Pin */}
                        <circle cx="350" cy="100" r="8" fill="#121212" stroke="#C9A84C" strokeWidth="2" />
                        <circle cx="350" cy="100" r="3" fill="#C9A84C" />
                        <text x="330" y="125" fill="#C9A84C" fontSize="8" fontWeight="bold">DESTINATION</text>

                        {/* Car position avatar representing real GPS updates */}
                        {booking.status === "IN_PROGRESS" && (
                          <motion.g
                            initial={{ offset: 0 }}
                            animate={{ offset: 1 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                          >
                            <circle cx="200" cy="65" r="14" fill="#C9A84C" className="shadow-[0_0_15px_rgba(201,168,76,0.8)]" />
                            <text x="195" y="69" fill="#0A0A0A" fontSize="10" fontWeight="bold">🚗</text>
                          </motion.g>
                        )}
                      </svg>

                      {/* Map info tag */}
                      <div className="absolute bottom-4 left-4 right-4 bg-black/85 border border-[#C9A84C]/20 rounded-xl p-3 flex justify-between text-[0.6rem] backdrop-blur-md">
                        <div>
                          <p className="text-[#7C8088] font-bold">PICKUP POINT</p>
                          <p className="text-[#F5F0E8] truncate max-w-[180px]">{booking.pickupLocation}</p>
                        </div>
                        <div className="text-right border-l border-[#C9A84C]/10 pl-4">
                          <p className="text-[#7C8088] font-bold">DESTINATION</p>
                          <p className="text-[#F5F0E8] truncate max-w-[180px]">{booking.dropoffLocation}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* RIGHT: Booking Summary & Chauffeur card */}
                <div className="space-y-8">
                  
                  {/* Chauffeur card once allocated */}
                  {booking.status === "DRIVER_ASSIGNED" || booking.status === "IN_PROGRESS" || booking.status === "COMPLETED" ? (
                    <div className="rounded-3xl border border-[#C9A84C]/15 bg-[#121212] p-6 shadow-xl relative overflow-hidden">
                      {/* background gold crescent branding symbol */}
                      <div className="absolute right-0 top-0 text-[8rem] text-[#C9A84C]/5 font-serif select-none pointer-events-none">🌙</div>

                      <h3 className="font-heading text-sm uppercase tracking-wider text-[#C9A84C] mb-6 font-bold">
                        {isRtl ? "تفاصيل سائقك الخاص" : "VIP Chauffeur Assigned"}
                      </h3>

                      <div className="flex items-center gap-4 mb-6">
                        <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-[#C9A84C]">
                          <Image
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                            alt={booking.driverName || "Driver"}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div>
                          <h4 className="font-heading text-base font-bold text-[#F5F0E8]">
                            {booking.driverName || "Captain Farhan Al-Harbi"}
                          </h4>
                          <p className="text-[0.6rem] text-[#C9A84C] font-semibold tracking-widest uppercase">
                            5.0 ⭐ VIP CHAUFFEUR
                          </p>
                          <p className="text-[0.65rem] text-[#7C8088] mt-1 font-bold">
                            Plate: {isRtl ? "ر ي ض ٧ ٨ ٦" : "RUH-786-SA"}
                          </p>
                        </div>
                      </div>

                      {/* Contact Actions */}
                      <div className="grid gap-3 grid-cols-2">
                        <a
                          href={`tel:${booking.driverPhone || "+966500123456"}`}
                          className="flex items-center justify-center gap-2 rounded-full bg-[#1A1A1A] border border-[#C9A84C]/20 hover:border-[#C9A84C]/60 py-3 text-xs font-bold text-[#F5F0E8] transition-all"
                        >
                          <Phone className="h-4 w-4 text-[#C9A84C]" />
                          <span>{isRtl ? "اتصال" : "Call Chauffeur"}</span>
                        </a>

                        <a
                          href={`https://wa.me/${booking.driverPhone?.replace(/\+/g, "") || "966500123456"}?text=Salam,%20Captain.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 rounded-full bg-[#C9A84C] hover:bg-[#B8963B] py-3 text-xs font-bold text-[#0A0A0A] transition-all"
                        >
                          <MessageCircle className="h-4 w-4 fill-current" />
                          <span>{isRtl ? "واتساب" : "WhatsApp"}</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    /* Default Chauffeur allocation card */
                    booking.status !== "CANCELLED" && (
                      <div className="rounded-3xl border border-[#C9A84C]/10 bg-[#121212] p-6 text-center space-y-4">
                        <User className="h-10 w-10 text-[#C9A84C]/40 mx-auto animate-pulse" />
                        <div>
                          <h4 className="font-heading text-sm font-bold text-[#F5F0E8]">
                            {isRtl ? "سائقك الخاص قيد التخصيص" : "Chauffeur Allocation In Progress"}
                          </h4>
                          <p className="text-[0.6rem] text-[#7C8088] max-w-[200px] mx-auto mt-1 leading-relaxed">
                            {isRtl
                              ? "سيتم إرسال إشعار SMS ورابط مباشر بمجرد انطلاق السائق إليك."
                              : "Chauffeur details and live plate verification coordinates will sync 1 hour before dispatch."}
                          </p>
                        </div>
                      </div>
                    )
                  )}

                  {/* Booking Coordinates details */}
                  <div className="rounded-3xl border border-[#C9A84C]/10 bg-[#121212] p-6 space-y-6">
                    <h3 className="font-heading text-sm uppercase tracking-wider text-[#A1A1A6] font-bold border-b border-[#C9A84C]/10 pb-3">
                      {isRtl ? "ملخص إحداثيات النقل" : "Transfer Coordinates"}
                    </h3>

                    <div className="space-y-4 text-xs">
                      
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-[#C9A84C] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[0.6rem] text-[#7C8088] font-bold uppercase">{isRtl ? "نقطة الركوب" : "Pickup point"}</p>
                          <p className="text-[#F5F0E8]">{booking.pickupLocation}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-[#C9A84C] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[0.6rem] text-[#7C8088] font-bold uppercase">{isRtl ? "الوجهة" : "Destination"}</p>
                          <p className="text-[#F5F0E8]">{booking.dropoffLocation}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#C9A84C]/10">
                        <div className="flex items-start gap-2.5">
                          <Calendar className="h-4 w-4 text-[#C9A84C] shrink-0" />
                          <div>
                            <p className="text-[0.55rem] text-[#7C8088] font-bold uppercase">{isRtl ? "التاريخ" : "Date"}</p>
                            <p className="text-[0.65rem] text-[#F5F0E8] font-semibold">
                              {new Date(booking.pickupDateTime).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <Clock className="h-4 w-4 text-[#C9A84C] shrink-0" />
                          <div>
                            <p className="text-[0.55rem] text-[#7C8088] font-bold uppercase">{isRtl ? "الوقت" : "Time"}</p>
                            <p className="text-[0.65rem] text-[#F5F0E8] font-semibold">
                              {new Date(booking.pickupDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-[#C9A84C]/10 pt-4">
                        <div>
                          <p className="text-[0.6rem] text-[#7C8088] font-bold uppercase">{isRtl ? "المركبة المحجوزة" : "Reserved Class"}</p>
                          <p className="text-[0.7rem] font-bold text-[#F5F0E8]">{booking.vehicle.name}</p>
                        </div>
                        <span className="rounded bg-[#C9A84C]/10 px-2 py-0.5 text-[0.55rem] font-bold text-[#C9A84C]">
                          {booking.vehicle.type}
                        </span>
                      </div>

                      {booking.flightNumber && (
                        <div className="flex items-center justify-between bg-black/35 rounded-xl p-3 border border-[#C9A84C]/10">
                          <span className="text-[0.6rem] text-[#7C8088] font-bold uppercase">{isRtl ? "رقم الرحلة" : "Flight details"}</span>
                          <span className="text-xs font-bold text-[#C9A84C]">{booking.flightNumber}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between border-t border-[#C9A84C]/10 pt-4 text-sm font-bold">
                        <span className="text-[#A1A1A6]">{isRtl ? "الأجرة الكلية" : "Total Fare"}</span>
                        <span className="text-[#C9A84C] font-heading text-lg">
                          SAR {booking.totalPrice}
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Cancellation Action Box */}
                  {booking.status !== "CANCELLED" && booking.status !== "COMPLETED" && (
                    <div className="rounded-3xl border border-red-900/25 bg-red-950/5 p-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <Info className="h-4.5 w-4.5 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-[#F5F0E8]">
                            {isRtl ? "إلغاء أو تعديل الحجز" : "Cancel or Modify Transfer"}
                          </h4>
                          <p className="text-[0.6rem] text-[#A1A1A6] leading-relaxed mt-1">
                            {isRtl
                              ? "يمكنك إلغاء هذا الحجز مجاناً قبل ٢٤ ساعة من موعد الرحلة. للتعديل، يرجى التواصل مع الدعم."
                              : "Free cancellation and dynamic rescheduling are guaranteed up to 24 hours before pickup."}
                          </p>
                        </div>
                      </div>

                      {cancelSuccess ? (
                        <div className="rounded-xl border border-green-900/30 bg-green-950/20 p-3 text-center text-[0.65rem] font-bold text-green-400">
                          {t.cancelSuccess}
                        </div>
                      ) : (
                        <div className="grid gap-2 grid-cols-2 pt-2">
                          <button
                            onClick={handleCancelBooking}
                            disabled={cancelLoading}
                            className="flex items-center justify-center gap-1 w-full rounded-full border border-red-900/30 bg-red-950/10 hover:bg-red-950/30 text-[0.65rem] font-bold text-red-400 py-3 transition-all"
                          >
                            {cancelLoading ? "..." : <XCircle className="h-3.5 w-3.5" />}
                            <span>{isRtl ? "إلغاء الرحلة" : "Cancel Transfer"}</span>
                          </button>

                          <a
                            href={`https://wa.me/${contactConfig.whatsappNumber}?text=Salam,%20I%20want%20to%20modify%20booking%20reference%20${booking.bookingRef}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1 w-full rounded-full border border-[#C9A84C]/25 bg-black/40 hover:bg-[#C9A84C]/10 text-[0.65rem] font-bold text-[#C9A84C] py-3 transition-all text-center"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span>{isRtl ? "طلب تعديل" : "Request Modify"}</span>
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
