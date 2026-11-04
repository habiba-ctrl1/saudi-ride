// Client feedback received on WhatsApp, shown as the chat itself.
// Rules: crop to the message bubbles only (no phone number, profile photo or contact header), never edit the text,
// alt text must describe what the screenshot actually shows. Newest first.
export type WhatsAppReview = {
  id: string;
  image: string;
  width: number;
  height: number;
  alt: string;
  label: string;
  month: string;
  /** English translation of the client's own lines, for non-English screenshots. */
  translation?: string;
};

export const WHATSAPP_REVIEWS: WhatsAppReview[] = [
  {
    id: "repeat-client-dammam-riyadh-2026-10",
    image: "/reviews/whatsapp-repeat-client-dammam-riyadh.webp",
    width: 872,
    height: 446,
    alt: "WhatsApp chat: a client writes that he had a great journey and will use Taxi Saudi Arabia again, then days later asks for a Dammam airport to Riyadh transfer at 3am, paying cash at a station like last time.",
    label: "Repeat client · Riyadh trip, then a Dammam airport to Riyadh rebooking",
    month: "October 2026",
  },
  {
    id: "arabic-client-2026-08",
    image: "/reviews/whatsapp-arabic-client-august-2026.webp",
    width: 885,
    height: 384,
    alt: "WhatsApp chat in Arabic: a client writes MashaAllah, excellent service, the car is comfortable and the driver is excellent and polite. Taxi Saudi Arabia thanks him and invites him to book again.",
    label: "Arabic-speaking client",
    month: "August 2026",
    translation: "“MashaAllah, Tabarakallah. Your service is excellent, the car is comfortable and the driver is excellent and polite.”",
  },
];
