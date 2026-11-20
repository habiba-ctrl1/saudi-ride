// Client-safe lead constants/types (no DB imports).
export const LEAD_STATUSES = ["new", "unreviewed", "contacted", "awaiting_info", "quotation_in_prep", "quotation_sent", "follow_up", "confirmed", "lost", "converted"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];
export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  new: "New", unreviewed: "Unreviewed", contacted: "Contacted", awaiting_info: "Awaiting information", quotation_in_prep: "Quotation in preparation",
  quotation_sent: "Quotation sent", follow_up: "Follow-up required", confirmed: "Confirmed", lost: "Lost", converted: "Converted to booking",
};
export const LEAD_SOURCES = ["website_form", "website_quote", "contact_form", "email", "manual", "whatsapp_paste"] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];
export const LEAD_SOURCE_LABEL: Record<LeadSource, string> = {
  website_form: "Website form", website_quote: "Website quotation", contact_form: "Contact form", email: "Email", manual: "Manual", whatsapp_paste: "WhatsApp paste",
};

export type LeadRow = {
  id: string; reference: string; source: LeadSource; status: LeadStatus; effective_status: LeadStatus;
  customer_name: string | null; customer_phone: string | null; customer_email: string | null; language: string | null;
  pickup: string | null; dropoff: string | null; trip_date: string | null; trip_time: string | null; trip_type: string | null;
  passengers: number | null; luggage: string | null; vehicle: string | null; budget_text: string | null; prior_quote_text: string | null;
  preferences: string | null; notes: string | null; raw_text: string | null; missing: string[]; group_key: string | null;
  client_id: string | null; quotation_id: string | null; quote_reference: string | null; quote_status: string | null;
  assigned_to: string | null; next_followup: string | null; processing_status: string; processing_error: string | null; received_at: string; updated_at: string;
};

