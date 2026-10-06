// Client-safe list types/constants (no server imports).
export const VIEWS = ["all", "enquiries", "quotes", "confirmed", "upcoming", "completed", "cancelled", "lost", "paid", "unpaid", "profitable", "loss", "needcost"] as const;
export type View = (typeof VIEWS)[number];

export const VIEW_LABEL: Record<View, string> = {
  all: "All", enquiries: "New enquiries", quotes: "Quotations", confirmed: "Confirmed", upcoming: "Upcoming", completed: "Completed",
  cancelled: "Cancelled", lost: "Lost", paid: "Paid", unpaid: "Unpaid", profitable: "Profitable", loss: "Loss-making", needcost: "Cost needed",
};

export type ListFilters = {
  q?: string;
  view?: View;
  vehicle?: string;
  driver?: string; // partner id
  from?: string;
  to?: string;
  preset?: string; // today | tomorrow | week
  sort?: "date_desc" | "date_asc" | "created" | "margin";
  page?: number;
};

export type ListRow = {
  id: string;
  quote_reference: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  client_id: string | null;
  pickup_location: string;
  drop_location: string;
  trip_date: string;
  trip_time: string | null;
  vehicle: string | null;
  status: string;
  quote_stage: string;
  valid_until: string | null;
  sent_at: string | null;
  followup_at: string | null;
  quoted_price: number | null;
  actual_amount_paid: number | null;
  payment_status: string;
  driver_cost: number | null;
  extra_cost: number;
  financial_status: string;
  driver_name: string | null;
  partner_id: string | null;
  margin: number | null;
  has_receipt: boolean;
  pickup_sent: boolean;
  is_test: boolean;
};

export const PAGE_SIZE = 40;
