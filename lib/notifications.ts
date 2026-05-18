import { Resend } from "resend";
import twilio from "twilio";

// Initialize Resend
interface NotificationBooking {
  bookingRef: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDateTime: Date | string;
  totalPrice: number | string;
  passengers: number | string;
  driverName?: string | null;
  driverPhone?: string | null;
  vehicle?: {
    name: string;
    capacity?: number | null;
    luggage?: number | null;
    nameAr?: string | null;
    image?: string | null;
    type?: string | null;
  } | null;
}
const resendApiKey = process.env.RESEND_API_KEY;
const resendFrom = process.env.RESEND_FROM_EMAIL || "bookings@riyadhtaxidesk.sa";
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Initialize Twilio
const twilioSid = process.env.TWILIO_ACCOUNT_SID;
const twilioToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE;
const twilioClient = twilioSid && twilioToken ? twilio(twilioSid, twilioToken) : null;

// Configs
const adminEmail = process.env.ADMIN_EMAIL || "admin@riyadhtaxidesk.sa";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://saudi-ride.vercel.app";
const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+966500123456";

/**
 * Normalizes booking reference to "RT-" format to guarantee brand compliance
 */
function normalizeRef(ref: string): string {
  if (ref.startsWith("LXT-")) {
    return "RT-" + ref.substring(4);
  }
  return ref;
}

/**
 * Dispatches an SMS alert using Twilio (with dynamic fallback logging)
 */
export async function sendSMS(to: string, body: string) {
  try {
    if (twilioClient && twilioPhone) {
      const message = await twilioClient.messages.create({
        body,
        from: twilioPhone,
        to
      });
      console.log(`📲 [Twilio] SMS successfully sent to ${to}. Message ID: ${message.sid}`);
      return message.sid;
    } else {
      console.log(`📲 [SMS SIMULATION] To: ${to} | Message: "${body}"`);
      return "simulated_sms_id";
    }
  } catch (err) {
    console.error("❌ [Twilio] SMS dispatch failed:", err);
    return null;
  }
}

/**
 * Dispatches an Email alert using Resend (with dynamic fallback logging)
 */
export async function sendEmail(to: string, subject: string, html: string) {
  try {
    // If using resend in test mode, onboarding@resend.dev can only send to registered address
    const fromAddress = resendApiKey ? `Riyadh Taxi <${resendFrom}>` : "Riyadh Taxi Concierge <onboarding@resend.dev>";
    
    if (resend) {
      const response = await resend.emails.send({
        from: fromAddress,
        to: [to],
        subject,
        html
      });
      if (response.error) {
        console.error("❌ [Resend] Email dispatch failed:", response.error);
        return null;
      }
      console.log(`📧 [Resend] Email successfully sent to ${to}. ID: ${response.data?.id}`);
      return response.data?.id;
    } else {
      console.log(`📧 [EMAIL SIMULATION] To: ${to} | Subject: "${subject}" | Length: ${html.length} chars`);
      return "simulated_email_id";
    }
  } catch (err) {
    console.error("❌ [Resend] Email dispatch failed:", err);
    return null;
  }
}

/**
 * 1. Booking Confirmation Email & SMS
 */
export async function sendBookingConfirmation(booking: NotificationBooking) {
  const ref = normalizeRef(booking.bookingRef);
  const subject = `Your Riyadh Taxi Booking Confirmed — Ref: ${ref}`;
  const trackLink = `${siteUrl}/track-booking?ref=${ref}&phone=${encodeURIComponent(booking.customerPhone)}`;
  const whatsappLink = `https://wa.me/${whatsappNumber.replace("+", "")}?text=Hello,%20I%20have%20an%20inquiry%20regarding%20booking%20${ref}`;

  const html = `
    <div style="font-family: sans-serif; padding: 25px; color: #111; max-width: 600px; border: 1px solid #C9A84C; border-radius: 16px; background-color: #fafafa;">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="font-size: 24px; font-weight: bold; color: #C9A84C; letter-spacing: 1px;">RIYADH TAXI</span>
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #888; margin-top: 4px;">Chauffeur & Luxury Transfers</div>
      </div>
      
      <div style="background: #ffffff; border: 1px solid #eee; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 25px;">
        <p style="margin: 0 0 5px 0; color: #888; font-size: 12px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Booking Reference</p>
        <h1 style="margin: 0; color: #C9A84C; font-size: 32px; font-family: monospace; font-weight: 800; letter-spacing: 1px;">${ref}</h1>
        <p style="margin: 10px 0 0 0; color: #2ecc71; font-weight: bold; font-size: 14px;">✔ CONFIRMED & SECURED</p>
      </div>

      <h3 style="color: #111; border-bottom: 2px solid #C9A84C; padding-bottom: 6px; margin-top: 0;">Trip Summary</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666; width: 120px;">Pickup:</td>
          <td style="padding: 8px 0; color: #111;">${booking.pickupLocation}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Dropoff:</td>
          <td style="padding: 8px 0; color: #111;">${booking.dropoffLocation}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Date & Time:</td>
          <td style="padding: 8px 0; color: #111; font-weight: bold;">${new Date(booking.pickupDateTime).toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Vehicle:</td>
          <td style="padding: 8px 0; color: #111;">${booking.vehicle?.name || "Premium Fleet Vehicle"}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Passengers:</td>
          <td style="padding: 8px 0; color: #111;">${booking.passengers} Passenger(s)</td>
        </tr>
      </table>

      <div style="background: #FFF9E6; border: 1px solid #C9A84C; border-radius: 12px; padding: 15px; text-align: center; margin-bottom: 25px;">
        <span style="font-size: 13px; font-weight: bold; color: #A8862A; text-transform: uppercase;">Amount Paid</span>
        <h2 style="margin: 5px 0 0 0; color: #111; font-size: 24px;">SAR ${booking.totalPrice} <span style="font-size: 14px; font-weight: normal; color: #666;">(VAT Included)</span></h2>
      </div>

      <div style="text-align: center; margin-bottom: 30px;">
        <a href="${trackLink}" style="display: inline-block; background-color: #C9A84C; color: #0A0A0A; padding: 12px 30px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-right: 10px;">Track Live Status</a>
        <a href="${whatsappLink}" style="display: inline-block; background-color: #25D366; color: #fff; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 14px;">WhatsApp Support</a>
      </div>

      <div style="background: #fff; border: 1px solid #eee; border-radius: 12px; padding: 15px; font-size: 12px; color: #666; line-height: 1.5;">
        <strong style="color: #c0392b; text-transform: uppercase; font-size: 11px; display: block; margin-bottom: 4px;">Cancellation Policy</strong>
        Bookings can be cancelled up to 24 hours prior to pick-up time. Cancellations inside the 24-hour window will incur standard dispatch fees. Contact concierge via WhatsApp for adjustments.
      </div>
    </div>
  `;

  // Trigger Email to Customer
  await sendEmail(booking.customerEmail, subject, html);

  // Trigger SMS to Customer
  const smsBody = `Confirmed! Your Riyadh Taxi transfer on ${new Date(booking.pickupDateTime).toLocaleDateString()} at ${new Date(booking.pickupDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Driver details coming soon.`;
  await sendSMS(booking.customerPhone, smsBody);
}

/**
 * 2. Driver Assignment Email & SMS
 */
export async function sendDriverAssignment(booking: NotificationBooking) {
  const ref = normalizeRef(booking.bookingRef);
  const subject = `Your Driver is Ready — Riyadh Taxi Ref: ${ref}`;
  const callHref = `tel:${booking.driverPhone}`;

  const html = `
    <div style="font-family: sans-serif; padding: 25px; color: #111; max-width: 600px; border: 1px solid #C9A84C; border-radius: 16px; background-color: #fafafa;">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="font-size: 24px; font-weight: bold; color: #C9A84C; letter-spacing: 1px;">RIYADH TAXI</span>
      </div>

      <div style="background: #ffffff; border: 1px solid #eee; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 25px;">
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" style="width: 80px; height: 80px; border-radius: 50%; border: 3px solid #C9A84C; object-fit: cover; margin-bottom: 12px;" />
        <h2 style="margin: 0; color: #111;">${booking.driverName}</h2>
        <p style="margin: 4px 0 0 0; color: #C9A84C; font-weight: bold;">Professional Chauffeur assigned</p>
        <p style="margin: 10px 0 0 0; font-size: 14px; font-family: monospace; font-weight: bold; color: #666;">Phone: ${booking.driverPhone}</p>
      </div>

      <h3 style="color: #111; border-bottom: 2px solid #C9A84C; padding-bottom: 6px; margin-top: 0;">Vehicle Details</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666; width: 120px;">Vehicle Class:</td>
          <td style="padding: 8px 0; color: #111; font-weight: bold;">${booking.vehicle?.name || "Premium Luxury Vehicle"}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Plate Number:</td>
          <td style="padding: 8px 0; color: #C9A84C; font-weight: bold; font-family: monospace; font-size: 16px;">KSA 9921</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Capacity:</td>
          <td style="padding: 8px 0; color: #111;">Max ${booking.vehicle?.capacity || 4} Passengers & ${booking.vehicle?.luggage || 3} Bags</td>
        </tr>
      </table>

      <div style="background: #fff; border: 1px solid #eee; border-radius: 12px; padding: 15px; font-size: 13px; color: #555; line-height: 1.5; margin-bottom: 25px;">
        <strong style="color: #111; display: block; margin-bottom: 4px;">Pickup Instructions</strong>
        Your chauffeur will arrive at the scheduled pickup point exactly 15 minutes before departure and will contact you directly via phone or WhatsApp. He will carry a Riyadh Taxi greeting sign with your name.
      </div>

      <div style="text-align: center;">
        <a href="${callHref}" style="display: inline-block; background-color: #C9A84C; color: #0A0A0A; padding: 12px 40px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Call Chauffeur Now</a>
      </div>
    </div>
  `;

  // Trigger Email
  await sendEmail(booking.customerEmail, subject, html);

  // Trigger SMS
  const smsBody = `Your driver ${booking.driverName} (${booking.driverPhone}) will pick you up in a ${booking.vehicle?.name || "Riyadh Taxi"}. He'll call 30 mins before.`;
  await sendSMS(booking.customerPhone, smsBody);
}

/**
 * 3. Booking Reminder Email (24 hours before pickup)
 */
export async function sendBookingReminder(booking: NotificationBooking) {
  const ref = normalizeRef(booking.bookingRef);
  const timeString = new Date(booking.pickupDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const subject = `Reminder: Your Riyadh Taxi Transfer Tomorrow at ${timeString}`;

  const html = `
    <div style="font-family: sans-serif; padding: 25px; color: #111; max-width: 600px; border: 1px solid #C9A84C; border-radius: 16px; background-color: #fafafa;">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="font-size: 24px; font-weight: bold; color: #C9A84C; letter-spacing: 1px;">RIYADH TAXI</span>
      </div>

      <h2 style="color: #C9A84C; font-size: 20px; border-bottom: 2px solid #C9A84C; padding-bottom: 6px;">Reminder: Upcoming Journey Tomorrow</h2>
      
      <p>This is a standard reminder that your luxury chauffeur service is scheduled for tomorrow.</p>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #eee;">
        <tr>
          <td style="padding: 10px; font-weight: bold; color: #666; width: 100px;">Reference:</td>
          <td style="padding: 10px; color: #C9A84C; font-weight: bold; font-family: monospace;">${ref}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; color: #666;">Date/Time:</td>
          <td style="padding: 10px; color: #111; font-weight: bold;">${new Date(booking.pickupDateTime).toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; color: #666;">Route:</td>
          <td style="padding: 10px; color: #111;">${booking.pickupLocation} → ${booking.dropoffLocation}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; color: #666;">Chauffeur:</td>
          <td style="padding: 10px; color: #111;">${booking.driverName || "Assigning shortly..."} (${booking.driverPhone || "Pending"})</td>
        </tr>
      </table>

      <div style="background: #eef2f7; border: 1px solid #d0d7de; border-radius: 12px; padding: 15px; margin-bottom: 25px;">
        <h4 style="margin: 0 0 5px 0; color: #0969da;">🌤 Destination Weather Preview</h4>
        <p style="margin: 0; font-size: 13px; color: #555;">Clear sky with comfortable traveling conditions forecast. High around 31°C, light breezes.</p>
      </div>

      <div style="background: #FFF9E6; border: 1px solid #C9A84C; border-radius: 12px; padding: 15px; font-size: 13px; color: #111; text-align: center;">
        <strong>Need Changes?</strong> Adjustments or itinerary changes can be requested up to 24 hours prior to travel. Reach our concierge desk immediately via WhatsApp.
      </div>
    </div>
  `;

  // Trigger Email
  await sendEmail(booking.customerEmail, subject, html);
}

/**
 * 4. Admin Notification Email (new booking)
 */
export async function sendAdminNotification(booking: NotificationBooking) {
  const ref = normalizeRef(booking.bookingRef);
  const subject = `🆕 New Booking — ${ref} — ${booking.customerName}`;
  const adminPanelLink = `${siteUrl}/admin/bookings`;

  const html = `
    <div style="font-family: sans-serif; padding: 25px; color: #111; max-width: 600px; border: 2px solid #C9A84C; border-radius: 16px; background-color: #fafafa;">
      <h2 style="color: #C9A84C; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 0;">🔔 New Reservation Received</h2>
      <p>A new chauffeur booking has been placed and payment has been processed.</p>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666; width: 120px;">Reference ID:</td>
          <td style="padding: 8px 0; color: #C9A84C; font-weight: bold; font-family: monospace;">${ref}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Customer Name:</td>
          <td style="padding: 8px 0; color: #111; font-weight: bold;">${booking.customerName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Phone:</td>
          <td style="padding: 8px 0; color: #111;"><a href="tel:${booking.customerPhone}">${booking.customerPhone}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Email:</td>
          <td style="padding: 8px 0; color: #111;"><a href="mailto:${booking.customerEmail}">${booking.customerEmail}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Route:</td>
          <td style="padding: 8px 0; color: #111;">${booking.pickupLocation} → ${booking.dropoffLocation}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Vehicle:</td>
          <td style="padding: 8px 0; color: #111;">${booking.vehicle?.name || "Premium Fleet Vehicle"}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Fare Total:</td>
          <td style="padding: 8px 0; color: #111; font-weight: bold;">SAR ${booking.totalPrice} (Paid)</td>
        </tr>
      </table>

      <div style="text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
        <a href="${adminPanelLink}" style="display: inline-block; background-color: #C9A84C; color: #0A0A0A; padding: 12px 30px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 14px; text-transform: uppercase;">Manage In Admin Portal</a>
      </div>
    </div>
  `;

  // Trigger Email to Admin
  await sendEmail(adminEmail, subject, html);
}

/**
 * 5. Booking Created SMS
 */
export async function sendBookingCreatedSMS(booking: NotificationBooking) {
  const ref = normalizeRef(booking.bookingRef);
  const body = `Riyadh Taxi: Booking ${ref} received. We'll confirm shortly. Track: ${siteUrl}/track-booking`;
  await sendSMS(booking.customerPhone, body);
}

/**
 * 6. 1 Hour Before Pickup SMS
 */
export async function sendOneHourBeforeSMS(booking: NotificationBooking) {
  const body = `Your Riyadh Taxi transfer starts in 1 hour. Driver: ${booking.driverName || "Chauffeur"} ${booking.driverPhone || ""}`;
  await sendSMS(booking.customerPhone, body);
}

/**
 * 7. Booking Completed SMS
 */
export async function sendBookingCompletedSMS(booking: NotificationBooking) {
  const body = `Thank you for riding with Riyadh Taxi! Rate your experience: ${siteUrl}/reviews/new`;
  await sendSMS(booking.customerPhone, body);
}
