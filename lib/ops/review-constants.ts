// Client-safe review constants/types (no DB imports).
export const REVIEW_RULES = {
  past_open: "Pickup date passed but still open",
  completed_no_payment: "Completed with no payment recorded",
  confirmed_no_price: "Confirmed with no agreed fare",
  possible_duplicate: "Possible duplicate booking",
} as const;
export type ReviewRule = keyof typeof REVIEW_RULES;

export type ReviewItem = {
  id: string; rule: ReviewRule; detail: string; created_at: string; quotation_id: string; quote_reference: string; customer_name: string; customer_phone: string | null;
  status: string; trip_date: string; trip_time: string | null; pickup_location: string; drop_location: string; quoted_price: number | null; payment_status: string;
  has_driver: boolean; pickup_details_sent: boolean; payment_recorded: boolean;
};

