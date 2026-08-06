import { track } from "@vercel/analytics";

type EventName =
  | "booking_started"
  | "booking_completed"
  | "price_calculated"
  | "vehicle_selected"
  | "whatsapp_click"
  | "quote_generated"
  | "phone_click"
  | "lead_captured";

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
}

interface LeadCapturedProps {
  source: string; // e.g., "price_calculator"
  fromCity?: string;
  toCity?: string;
  vehicleClass?: string;
  estimatedPriceSar?: number;
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
  lead_captured: LeadCapturedProps;
};

/**
 * Capture and record key client interaction events across Vercel Analytics
 * with fallbacks to developer console log traces in development mode.
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

    // Safely execute Vercel Analytics tracking call
    track(eventName, properties as Record<string, string | number | boolean | null | undefined>);

    // Forward to GA4 / GTM (dataLayer) + Microsoft Clarity when present.
    if (typeof window !== "undefined") {
      const w = window as unknown as {
        dataLayer?: Record<string, unknown>[];
        gtag?: (...args: unknown[]) => void;
        clarity?: (...args: unknown[]) => void;
      };
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({ event: eventName, ...(properties as Record<string, unknown>) });
      if (typeof w.gtag === "function") w.gtag("event", eventName, properties ?? {});
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
