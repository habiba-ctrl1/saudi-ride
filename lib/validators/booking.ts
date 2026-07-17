import { z } from "zod";

export const bookingFormSchema = z.object({
  pickup: z.string().trim().min(3, "Please enter a valid pick-up location."),
  dropoff: z.string().trim().min(3, "Please enter a valid drop-off location."),
  travelDate: z.string().min(1, "Please select your travel date."),
  travelTime: z.string().min(1, "Please select your travel time."),
  passengers: z.coerce
    .number()
    .int("Passengers must be a whole number.")
    .min(1, "At least 1 passenger is required.")
    .max(8, "Maximum 8 passengers per booking request."),
  customerName: z.string().trim().min(2, "Please enter your name."),
  customerPhone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{8,20}$/, "Please enter a valid phone or WhatsApp number."),
  customerEmail: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .or(z.literal(""))
    .optional()
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
