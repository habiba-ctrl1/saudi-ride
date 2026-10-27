"use client";

// Replaces the old price-calculator widget on the homepage. We do not have a
// single fixed rate per trip (route, vehicle, date, passengers, luggage, and
// waiting time all affect the final price), so this form collects trip
// details and hands off to WhatsApp for a real quote from a person — no
// estimated/fake price is shown or implied anywhere in this component.
import { useId, useRef, useState } from "react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { contactConfig } from "@/lib/config/contact";
import { trackEvent } from "@/lib/analytics";
import { getUtm } from "@/lib/utm";
import { Calendar, Car, MessageCircle, Users, Phone, User, Mail, Plane, Clock, Luggage, ShieldCheck } from "lucide-react";

const PHONE_RE = /^\+?[0-9\s-]{8,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VEHICLES = [
  { key: "Sedan", en: "Sedan", ar: "سيدان" },
  { key: "VIP SUV", en: "VIP SUV", ar: "SUV فاخرة" },
  { key: "Van", en: "Van", ar: "فان" },
  { key: "Luxury", en: "Luxury", ar: "فاخرة VIP" },
  { key: "Bus", en: "Bus / Coaster", ar: "حافلة" },
];

const TRIP_TYPES = [
  { key: "One Way", en: "One Way", ar: "ذهاب فقط" },
  { key: "Round Trip", en: "Round Trip", ar: "ذهاب وعودة" },
  { key: "By the Hour", en: "By the Hour", ar: "بالساعة" },
];

const PASSENGERS = ["1", "2", "3", "4", "5-6", "7+"];
const LUGGAGE = ["0", "1", "2", "3", "4", "5-6", "7+"];
const HOURS_NEEDED = ["2", "3", "4", "6", "8", "12", "Full day"];

export interface WhatsAppQuoteFormProps {
  /** Pre-fill the pickup field (e.g. a route page passing its origin city). */
  defaultPickup?: string;
  /** Pre-fill the destination field. */
  defaultDropoff?: string;
  /** Pre-select the vehicle class. Defaults to "VIP SUV". */
  defaultVehicle?: string;
  /** Force the form's language regardless of context — used on the Arabic route
   *  pages so the form always renders RTL/Arabic even outside a language switch. */
  forceLocale?: "en" | "ar";
  /** Pre-select the trip type (e.g. "By the Hour" on a private-driver page). */
  defaultTripType?: "One Way" | "Round Trip" | "By the Hour";
  /** Contextual submit label (English only); Arabic keeps the default. */
  submitLabel?: string;
  /** Route-aware placeholders (English only), e.g. "Pickup address in Riyadh". */
  pickupPlaceholder?: string;
  dropoffPlaceholder?: string;
  /** Replaces the first line of the English WhatsApp message (e.g. a
   *  cross-border route sentence) and adds a closing availability line. */
  messageIntro?: string;
  /** Show an optional "Special requirements" field (included in the message). */
  showNotes?: boolean;
  /** Make the pickup field read-only (e.g. a fixed airport origin). */
  lockPickup?: boolean;
  /** Replace the free-text destination with a dropdown of these values. */
  dropoffOptions?: string[];
  /** Helper text shown under the destination, keyed by selected option. */
  dropoffHints?: Record<string, string>;
  /** Restrict the vehicle dropdown to these keys (e.g. ["Sedan","VIP SUV","Van"]). */
  vehicleKeys?: string[];
  /** Override the label of the "VIP SUV" option (English only). */
  suvLabel?: string;
  /** Replaces the default fare-disclaimer line under the submit button (English only). */
  footnote?: string;
}

export default function WhatsAppQuoteForm({
  defaultPickup = "",
  defaultDropoff = "",
  defaultVehicle = "VIP SUV",
  forceLocale,
  defaultTripType = "One Way",
  submitLabel,
  pickupPlaceholder,
  dropoffPlaceholder,
  messageIntro,
  showNotes = false,
  lockPickup = false,
  dropoffOptions,
  dropoffHints,
  vehicleKeys,
  suvLabel,
  footnote,
}: WhatsAppQuoteFormProps = {}) {
  const { language } = useLanguage();
  const isRtl = (forceLocale ?? language) === "ar";
  const uid = useId();

  const [tripType, setTripType] = useState<string>(defaultTripType);
  const [pickup, setPickup] = useState(defaultPickup);
  const [dropoff, setDropoff] = useState(defaultDropoff);
  const [dateTime, setDateTime] = useState("");
  const [returnDateTime, setReturnDateTime] = useState("");
  const [hoursNeeded, setHoursNeeded] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [passengers, setPassengers] = useState("");
  const [luggage, setLuggage] = useState("");
  const [vehicle, setVehicle] = useState(defaultVehicle);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  // Smart conditional fields — shown only when relevant, never required.
  const isRoundTrip = tripType === "Round Trip";
  const isHourly = tripType === "By the Hour";
  const isAirportTrip = /airport/i.test(`${pickup} ${dropoff}`);

  // submit lifecycle: a lead only counts once /api/leads answers 2xx.
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [waUrl, setWaUrl] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const startedRef = useRef(false);
  const submittingRef = useRef(false);
  const path = typeof window !== "undefined" ? window.location.pathname : undefined;

  const handleStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent("quote_form_started", { path, fromCity: pickup || undefined, toCity: dropoff || undefined, tripType, locale: language });
  };

  const openWhatsApp = (viaFallback: boolean) => {
    trackEvent("whatsapp_click", { sourceLocation: viaFallback ? "quote_form_fallback" : "quote_form_confirmation", phoneUsed: contactConfig.whatsappLink, locale: language, path });
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = async () => {
    if (submittingRef.current || status === "success") return; // duplicate-submit guard
    const nameInvalid = name.trim().length < 2;
    const phoneInvalid = !PHONE_RE.test(phone.trim());
    const emailInvalid = email.trim() !== "" && !EMAIL_RE.test(email.trim()); // email is optional
    setNameError(nameInvalid);
    setPhoneError(phoneInvalid);
    setEmailError(emailInvalid);
    if (nameInvalid || phoneInvalid || emailInvalid) {
      trackEvent("quote_form_validation_error", { path, fields: [nameInvalid && "name", phoneInvalid && "phone", emailInvalid && "email"].filter(Boolean).join(","), locale: language });
      return;
    }

    const tripLabel = TRIP_TYPES.find((tt) => tt.key === tripType);
    const lines = isRtl
      ? [
          "السلام عليكم، أرغب بالحصول على عرض سعر لرحلة نقل خاصة.",
          "",
          `• الاسم: ${name}`,
          `• نوع الرحلة: ${tripLabel?.ar ?? tripType}`,
          `• من: ${pickup || "—"}`,
          `• إلى: ${dropoff || "—"}`,
          `• التاريخ والوقت: ${dateTime || "—"}`,
          ...(isRoundTrip ? [`• تاريخ العودة: ${returnDateTime || "—"}`] : []),
          ...(isHourly ? [`• عدد الساعات: ${hoursNeeded || "—"}`] : []),
          ...(isAirportTrip ? [`• رقم الرحلة: ${flightNumber || "—"}`] : []),
          `• نوع السيارة: ${VEHICLES.find((v) => v.key === vehicle)?.ar ?? vehicle}`,
          `• عدد الركاب: ${passengers || "—"}`,
          `• الأمتعة: ${luggage || "—"}`,
          ...(showNotes && notes.trim() ? [`• ملاحظات: ${notes.trim()}`] : []),
        ]
      : [
          messageIntro ?? "Salam! I'd like a quote for a private transfer.",
          "",
          `• Name: ${name}`,
          `• Trip type: ${tripLabel?.en ?? tripType}`,
          `• From: ${pickup || "—"}`,
          `• To: ${dropoff || "—"}`,
          `• Date & time: ${dateTime || "—"}`,
          ...(isRoundTrip ? [`• Return date & time: ${returnDateTime || "—"}`] : []),
          ...(isHourly ? [`• Hours needed: ${hoursNeeded || "—"}`] : []),
          ...(isAirportTrip ? [`• Flight number: ${flightNumber || "—"}`] : []),
          `• Vehicle: ${vehicle === "VIP SUV" && suvLabel ? suvLabel : vehicle}`,
          `• Passengers: ${passengers || "—"}`,
          `• Luggage (large bags): ${luggage || "—"}`,
          ...(showNotes && notes.trim() ? [`• Special requirements: ${notes.trim()}`] : []),
          ...(messageIntro ? ["", "Please confirm availability and the total fare."] : []),
        ];

    const url = `${contactConfig.whatsappLink}?text=${encodeURIComponent(lines.join("\n"))}`;
    setWaUrl(url);

    submittingRef.current = true;
    setStatus("submitting");
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10000);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({
          origin: pickup || "Not specified",
          destination: dropoff || "Not specified",
          tripDate: dateTime || null,
          vehicleType: vehicle,
          tripType,
          passengers: passengers || null,
          luggage: luggage || null,
          flightNumber: isAirportTrip ? flightNumber || null : null,
          returnDateTime: isRoundTrip ? returnDateTime || null : null,
          hoursNeeded: isHourly ? hoursNeeded || null : null,
          notes: showNotes ? notes.trim() || null : null,
          customerName: name.trim(),
          customerPhone: phone.trim(),
          customerEmail: email.trim() || null,
          website: honeypot,
          locale: language,
          pageUrl: typeof window !== "undefined" ? window.location.href : null,
          utm: getUtm(),
          source: "whatsapp_quote_form",
        }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      trackEvent("lead_captured", { source: "whatsapp_quote_form", fromCity: pickup, toCity: dropoff, vehicleClass: vehicle, tripType, passengers, locale: language, flightNumber: flightNumber || undefined, returnDateTime: returnDateTime || undefined, hoursNeeded: hoursNeeded || undefined, luggage: luggage || undefined });
      setStatus("success");
    } catch (err) {
      const reason = ctrl.signal.aborted ? "timeout" : err instanceof Error && err.message.startsWith("status") ? err.message : "network";
      trackEvent("lead_submit_failed", { path, fromCity: pickup, toCity: dropoff, tripType, reason, locale: language });
      setStatus("error");
    } finally {
      clearTimeout(timer);
      submittingRef.current = false;
    }
  };

  const L = (en: string, ar: string) => (isRtl ? ar : en);
  const fid = (k: string) => `${uid}-${k}`;

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      onFocusCapture={handleStarted}
      className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-[28px] border border-[#0F172A]/[0.07] bg-white text-start shadow-[0_2px_6px_rgba(15,23,42,0.04),0_24px_60px_-20px_rgba(15,23,42,0.18)]"
    >
      {/* Brand hairline */}
      <div aria-hidden className="h-1 w-full bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#FACC15]" />

      <div className="space-y-6 p-5 sm:p-7 md:p-8">
        {/* Trip type — qualifies the enquiry up front */}
        <div>
          <p className="field-label mb-2">{L("Trip type", "نوع الرحلة")}</p>
          <div className="segmented" role="group" aria-label={L("Trip type", "نوع الرحلة")}>
            {TRIP_TYPES.map((tt) => (
              <button key={tt.key} type="button" onClick={() => setTripType(tt.key)} aria-pressed={tripType === tt.key}>
                {isRtl ? tt.ar : tt.en}
              </button>
            ))}
          </div>
        </div>

        {/* Route — origin/destination joined by a mini route rail */}
        <fieldset className="relative">
          <legend className="field-label mb-2">{L("Route", "المسار")}</legend>
          <div className="relative grid gap-2.5">
            <span aria-hidden className="pointer-events-none absolute z-[2] start-[1.38rem] top-[1.95rem] bottom-[1.95rem] w-0 border-s-2 border-dashed border-[#16A34A]/30" />
            <label className="field-shell" htmlFor={fid("pickup")}>
              <span aria-hidden className="relative z-[1] flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-[#16A34A] ring-4 ring-[#16A34A]/15" />
              <span className="sr-only">{L("Pickup location", "نقطة الانطلاق")}</span>
              <input
                id={fid("pickup")}
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder={isRtl ? "نقطة الانطلاق (مثال: مطار جدة)" : pickupPlaceholder ?? "Pickup — e.g. Jeddah Airport"}
                autoComplete="off"
                readOnly={lockPickup}
                aria-readonly={lockPickup || undefined}
              />
            </label>
            <label className="field-shell" htmlFor={fid("dropoff")}>
              <span aria-hidden className="relative z-[1] flex h-3 w-3 shrink-0 items-center justify-center rounded-full border-[3px] border-[#16A34A] bg-white" />
              <span className="sr-only">{L("Destination", "الوجهة")}</span>
              {dropoffOptions ? (
                <select
                  id={fid("dropoff")}
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  className={dropoff ? "" : "is-placeholder"}
                >
                  <option value="">{dropoffPlaceholder ?? "Select destination"}</option>
                  {dropoffOptions.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              ) : (
                <input
                  id={fid("dropoff")}
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  placeholder={isRtl ? "الوجهة (مثال: مكة المكرمة)" : dropoffPlaceholder ?? "Destination — e.g. Makkah hotel"}
                  autoComplete="off"
                />
              )}
            </label>
          </div>
          {dropoffHints && dropoff && dropoffHints[dropoff] && (
            <p role="status" className="mt-2 text-xs leading-relaxed text-[#475569]">{dropoffHints[dropoff]}</p>
          )}
        </fieldset>

        {/* When & who */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-4">
          <div className="field col-span-2">
            <label className="field-label" htmlFor={fid("date")}>{L("Pickup date & time", "التاريخ والوقت")}</label>
            <div className="field-shell">
              <Calendar aria-hidden />
              <input id={fid("date")} type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
            </div>
          </div>

          {isRoundTrip && (
            <div className="field col-span-2">
              <label className="field-label" htmlFor={fid("return")}>
                {L("Return date & time", "تاريخ العودة")}<span className="opt">{L("optional", "اختياري")}</span>
              </label>
              <div className="field-shell">
                <Calendar aria-hidden />
                <input id={fid("return")} type="datetime-local" value={returnDateTime} onChange={(e) => setReturnDateTime(e.target.value)} />
              </div>
            </div>
          )}

          {isHourly && (
            <div className="field col-span-2">
              <label className="field-label" htmlFor={fid("hours")}>{L("Hours needed", "عدد الساعات المطلوبة")}</label>
              <div className="field-shell">
                <Clock aria-hidden />
                <select id={fid("hours")} value={hoursNeeded} onChange={(e) => setHoursNeeded(e.target.value)} className={hoursNeeded ? "" : "is-placeholder"}>
                  <option value="">{L("Select hours", "اختر عدد الساعات")}</option>
                  {HOURS_NEEDED.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {isAirportTrip && (
            <div className="field col-span-2">
              <label className="field-label" htmlFor={fid("flight")}>
                {L("Flight number", "رقم الرحلة")}<span className="opt">{L("optional", "اختياري")}</span>
              </label>
              <div className="field-shell">
                <Plane aria-hidden />
                <input id={fid("flight")} value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} placeholder={L("e.g. SV 123", "مثال: SV 123")} autoComplete="off" />
              </div>
            </div>
          )}

          <div className="field">
            <label className="field-label" htmlFor={fid("pax")}>{L("Passengers", "عدد الركاب")}</label>
            <div className="field-shell">
              <Users aria-hidden />
              <select id={fid("pax")} value={passengers} onChange={(e) => setPassengers(e.target.value)} className={passengers ? "" : "is-placeholder"}>
                <option value="">{L("Select", "اختر")}</option>
                {PASSENGERS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label className="field-label" htmlFor={fid("bags")}>{L("Large bags", "الحقائب الكبيرة")}</label>
            <div className="field-shell">
              <Luggage aria-hidden />
              <select id={fid("bags")} value={luggage} onChange={(e) => setLuggage(e.target.value)} className={luggage ? "" : "is-placeholder"}>
                <option value="">{L("Select", "اختر")}</option>
                {LUGGAGE.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field col-span-2">
            <label className="field-label" htmlFor={fid("vehicle")}>{L("Vehicle class", "نوع السيارة")}</label>
            <div className="field-shell">
              <Car aria-hidden />
              <select id={fid("vehicle")} value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
                {VEHICLES.filter((v) => !vehicleKeys || vehicleKeys.includes(v.key)).map((v) => (
                  <option key={v.key} value={v.key}>{isRtl ? v.ar : v.key === "VIP SUV" && suvLabel ? suvLabel : v.en}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {showNotes && (
          <div className="field">
            <label className="field-label" htmlFor={fid("notes")}>
              {L("Special requirements", "ملاحظات خاصة")}<span className="opt">{L("optional", "اختياري")}</span>
            </label>
            <div className="field-shell">
              <textarea
                id={fid("notes")}
                value={notes}
                onChange={(e) => setNotes(e.target.value.slice(0, 500))}
                rows={2}
                placeholder={L("Child seats, extra stops, driver waiting, flight time…", "مقاعد أطفال، توقفات إضافية، انتظار السائق…")}
                className="w-full resize-y bg-transparent py-2 outline-none"
              />
            </div>
          </div>
        )}

        {/* Contact */}
        <div className="border-t border-dashed border-[#0F172A]/10 pt-5">
          <p className="mb-3 text-sm font-bold text-[#0F172A]">{L("Where should we send your quote?", "أين نرسل عرض السعر؟")}</p>
          <div className="grid gap-x-3 gap-y-4 sm:grid-cols-2">
            <div className="field sm:col-span-2">
              <label className="field-label" htmlFor={fid("name")}>{L("Full name", "الاسم الكامل")}</label>
              <div className={`field-shell ${nameError ? "is-invalid" : ""}`}>
                <User aria-hidden />
                <input
                  id={fid("name")}
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameError) setNameError(false);
                  }}
                  placeholder={L("Your name", "اسمك")}
                  aria-invalid={nameError}
                  aria-describedby={nameError ? fid("name-err") : undefined}
                  autoComplete="name"
                />
              </div>
              {nameError && (
                <p id={fid("name-err")} role="alert" className="field-error">
                  {L("Please enter your name.", "الرجاء إدخال اسمك.")}
                </p>
              )}
            </div>

            <div className="field">
              <label className="field-label" htmlFor={fid("phone")}>{L("Phone / WhatsApp", "رقم الجوال")}</label>
              <div className={`field-shell ${phoneError ? "is-invalid" : ""}`}>
                <Phone aria-hidden />
                <input
                  id={fid("phone")}
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (phoneError) setPhoneError(false);
                  }}
                  placeholder="+966 50 123 4567"
                  aria-invalid={phoneError}
                  aria-describedby={phoneError ? fid("phone-err") : undefined}
                  autoComplete="tel"
                  dir="ltr"
                />
              </div>
              {phoneError && (
                <p id={fid("phone-err")} role="alert" className="field-error">
                  {L("Please enter a valid phone number so we can follow up.", "الرجاء إدخال رقم جوال صحيح للمتابعة.")}
                </p>
              )}
            </div>

            <div className="field">
              <label className="field-label" htmlFor={fid("email")}>{L("Email (optional)", "البريد الإلكتروني (اختياري)")}</label>
              <div className={`field-shell ${emailError ? "is-invalid" : ""}`}>
                <Mail aria-hidden />
                <input
                  id={fid("email")}
                  type="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(false);
                  }}
                  placeholder="you@example.com"
                  aria-invalid={emailError}
                  aria-describedby={emailError ? fid("email-err") : undefined}
                  autoComplete="email"
                  dir="ltr"
                />
              </div>
              {emailError && (
                <p id={fid("email-err")} role="alert" className="field-error">
                  {L("That email address looks incomplete — fix it or leave the field empty.", "البريد الإلكتروني غير صحيح — صحّحه أو اتركه فارغاً.")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Honeypot — hidden from people and assistive tech; bots fill it */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />

        {/* Submit / confirmation */}
        {status === "success" ? (
          <div role="status" className="space-y-3 rounded-2xl border border-[#16A34A]/25 bg-[#F4FAF5] p-5 text-center">
            <p className="font-heading text-lg font-bold text-[#15803D]">{L("Request received", "تم استلام طلبك")}</p>
            <p className="text-sm leading-relaxed text-[#475569]">
              {L(
                "Your trip details are saved. Send them on WhatsApp now to speed up your quote — the fare is confirmed with you before you book.",
                "تم حفظ تفاصيل رحلتك. أرسلها عبر واتساب الآن لتسريع عرض السعر — يتم تأكيد السعر معك قبل الحجز.",
              )}
            </p>
            <button type="button" onClick={() => openWhatsApp(false)} className="btn btn-primary btn-lg btn-block">
              <MessageCircle aria-hidden />
              {L("Continue on WhatsApp", "تابع عبر واتساب")}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {status === "error" && (
              <div role="alert" className="rounded-2xl border border-[#DC2626]/30 bg-[#FEF2F2] p-4 text-sm leading-relaxed text-[#7F1D1D]">
                <p className="font-semibold">{L("We couldn't save your request just now.", "تعذّر حفظ طلبك الآن.")}</p>
                <p className="mt-1">
                  {L("Try again, or send your details straight to us on WhatsApp.", "حاول مرة أخرى، أو أرسل تفاصيلك إلينا مباشرة عبر واتساب.")}
                </p>
                <button type="button" onClick={() => openWhatsApp(true)} className="btn btn-lg btn-block mt-3">
                  <MessageCircle aria-hidden />
                  {L("Send on WhatsApp instead", "أرسل عبر واتساب بدلاً من ذلك")}
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={status === "submitting"}
              aria-busy={status === "submitting"}
              className="btn btn-primary btn-lg btn-block disabled:opacity-70"
            >
              <MessageCircle aria-hidden />
              {status === "submitting"
                ? L("Sending…", "جارٍ الإرسال…")
                : isRtl ? "احصل على عرض سعر النقل الخاص عبر واتساب" : submitLabel ?? "Get My Private Transfer Quote"}
            </button>
            <p className="text-center text-xs leading-relaxed text-[#64748B]">
              {footnote && !isRtl ? footnote : L(
                "Final pricing depends on route, vehicle, date, and passengers — confirmed with you directly before booking.",
                "السعر النهائي يعتمد على المسار والسيارة والتاريخ وعدد الركاب — يتم تأكيده معك مباشرة قبل الحجز.",
              )}
            </p>
          </div>
        )}
      </div>

      {/* Assurance footer */}
      <div className="flex items-start gap-3 border-t border-[#16A34A]/10 bg-[#F4FAF5] px-5 py-4 sm:px-8">
        <ShieldCheck aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-[#16A34A]" />
        <p className="text-xs leading-relaxed text-[#475569]">
          <span className="font-bold text-[#15803D]">{L("Private Transportation Only", "نقل خاص فقط")}</span>
          <span className="mx-1.5 text-[#94A3B8]">·</span>
          {L(
            "Every booking is your own private vehicle and professional chauffeur.",
            "كل حجز يشمل سيارتك وسائقك بشكل خاص — سيارة خاصة وسائق محترف.",
          )}
        </p>
      </div>
    </div>
  );
}
