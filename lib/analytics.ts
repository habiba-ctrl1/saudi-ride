type EventName =
  | "booking_started"
  | "booking_completed"
  | "price_calculated"
  | "vehicle_selected"
  | "whatsapp_click"
  | "quote_generated"
  | "phone_click"
  | "email_click"
  | "lead_captured"
  | "rfq_opened"
  | "quote_form_started"
  | "quote_form_validation_error"
  | "lead_submit_failed";

interface BookingStartedProps {
  fromCity?: string;
  toCity?: string;
  vehicleClass?: string;
  locale?: string;
}

interface BookingCompletedProps {
  bookingId?: string;
  amount?: number;
  currency?: string;
  vehicleClass?: string;
  fromCity?: string;
  toCity?: string;
}

interface PriceCalculatedProps {
  fromCity: string;
  toCity: string;
  distanceKm: number;
  estimatedPriceSar: number;
  vehicleClass: string;
}

interface VehicleSelectedProps {
  vehicleClass: string;
  priceSar?: number;
  sourceContext?: string; // e.g., "pricing_calculator", "booking_form"
}

interface WhatsappClickProps {
  sourceLocation: string; // e.g., "faq_cta", "contact_card", "footer"
  phoneUsed: string;
  locale: string;
  path?: string; // page pathname the click originated from, for lead attribution
  routeId?: string; // e.g. "riyadh_dammam_airport" — route identifier only, never personal data
}

interface QuoteGeneratedProps {
  fromCity?: string;
  toCity?: string;
  vehicleClass?: string;
  estimatedPriceSar?: number;
  locale?: string;
}

interface PhoneClickProps {
  sourceLocation: string;
  phoneUsed: string;
  locale?: string;
  path?: string;
}

interface EmailClickProps {
  sourceLocation: string;
  emailUsed: string;
  locale?: string;
  path?: string;
}

interface LeadCapturedProps {
  source: string; // e.g., "price_calculator"
  fromCity?: string;
  toCity?: string;
  vehicleClass?: string;
  tripType?: string;
  passengers?: string;
  estimatedPriceSar?: number;
  locale?: string;
  flightNumber?: string;
  returnDateTime?: string;
  hoursNeeded?: string;
  luggage?: string;
}

interface QuoteFormEventProps {
  /** Page pathname — never personal data. */
  path?: string;
  fromCity?: string;
  toCity?: string;
  tripType?: string;
  /** validation errors only: which fields failed (names, never values) */
  fields?: string;
  /** submit failures only: HTTP status or "timeout"/"network" */
  reason?: string;
  locale?: string;
}

type EventPropsMap = {
  booking_started: BookingStartedProps;
  booking_completed: BookingCompletedProps;
  price_calculated: PriceCalculatedProps;
  vehicle_selected: VehicleSelectedProps;
  whatsapp_click: WhatsappClickProps;
  quote_generated: QuoteGeneratedProps;
  phone_click: PhoneClickProps;
  email_click: EmailClickProps;
  lead_captured: LeadCapturedProps;
  rfq_opened: LeadCapturedProps;
  quote_form_started: QuoteFormEventProps;
  quote_form_validation_error: QuoteFormEventProps;
  lead_submit_failed: QuoteFormEventProps;
};

// Event meanings (keep them separate):
//   whatsapp_click / phone_click / email_click  = contact button clicked
//   rfq_opened                                  = RFQ text handed to WhatsApp/mail app, delivery unknown
//   quote_form_started                          = visitor began the form
//   lead_captured                               = server accepted the enquiry (2xx) — the only "lead"
// Qualified leads and bookings live in the admin panel, not here.

// Pickup/drop-off are free text (can be a home address) and flight numbers are
// personal, so none of these may reach GA4, GTM or Clarity.
const PRIVATE_KEYS = ["fromCity", "toCity", "flightNumber", "returnDateTime"];

let lastContactEventAt = 0;

/**
 * Record key client interaction events in GA4 / GTM / Clarity,
 * with console traces in development mode.
 */
export function trackEvent<E extends EventName>(
  eventName: E,
  properties?: EventPropsMap[E]
) {
  try {
    const isDev = process.env.NODE_ENV === "development";
    
    if (isDev) {
      console.log(`📊 [Analytics Event Logged]: "${eventName}"`, properties);
    }

    // Forward to GA4 / GTM (dataLayer) + Microsoft Clarity when present.
    if (typeof window !== "undefined") {
      if (/^(whatsapp|phone|email)_click$/.test(eventName)) lastContactEventAt = Date.now();
      const safe: Record<string, unknown> = { path: window.location.pathname };
      for (const [k, v] of Object.entries(properties ?? {})) {
        if (v !== undefined && !PRIVATE_KEYS.includes(k)) safe[k] = v;
      }
      const w = window as unknown as {
        dataLayer?: Record<string, unknown>[];
        gtag?: (...args: unknown[]) => void;
        clarity?: (...args: unknown[]) => void;
      };
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({ event: eventName, ...safe });
      if (typeof w.gtag === "function") w.gtag("event", eventName, safe);
      if (typeof w.clarity === "function") {
        try {
          w.clarity("event", eventName);
        } catch {
          /* clarity not ready — ignore */
        }
      }
    }
  } catch (error) {
    console.error("❌ Analytics tracking execution failure:", error);
  }
}

/**
 * Counts clicks on any WhatsApp / tel / mailto link that does not already call
 * trackEvent itself (most server-rendered pages). Runs after the link's own
 * handler and skips when that handler just reported, so nothing is counted twice.
 */
export function installContactClickTracking(): () => void {
  const onClick = (e: MouseEvent) => {
    const href = (e.target as Element | null)?.closest?.("a[href]")?.getAttribute("href") ?? "";
    const kind = /^(https?:)?\/\/(wa\.me|api\.whatsapp\.com)\//.test(href) ? "whatsapp" : href.startsWith("tel:") ? "phone" : href.startsWith("mailto:") ? "email" : null;
    if (!kind) return;
    const path = window.location.pathname;
    const locale = path === "/ar" || path.startsWith("/ar/") ? "ar" : "en";
    const clickedAt = Date.now();
    setTimeout(() => {
      if (lastContactEventAt >= clickedAt - 50) return;
      const sourceLocation = "page_link";
      if (kind === "whatsapp") trackEvent("whatsapp_click", { sourceLocation, phoneUsed: "", locale, path });
      else if (kind === "phone") trackEvent("phone_click", { sourceLocation, phoneUsed: "", locale, path });
      else trackEvent("email_click", { sourceLocation, emailUsed: "", locale, path });
    }, 0);
  };
  document.addEventListener("click", onClick, true);
  return () => document.removeEventListener("click", onClick, true);
}
