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
];
