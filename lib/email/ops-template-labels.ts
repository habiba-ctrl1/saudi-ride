// Client-safe template names/labels (the full templates in ops-templates.ts pull in server-only code).
export type OpsTemplate = "quotation" | "followup" | "confirmation" | "pickup" | "thankyou" | "receipt";

export const OPS_TEMPLATE_LABEL: Record<OpsTemplate, string> = {
  quotation: "New Quotation",
  followup: "Quotation Follow-up",
  confirmation: "Booking Confirmation",
  pickup: "Driver / Pickup Details",
  thankyou: "Ride Completion / Thank You",
  receipt: "Payment / Receipt",
};

