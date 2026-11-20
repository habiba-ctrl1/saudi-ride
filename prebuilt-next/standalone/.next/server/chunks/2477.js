"use strict";exports.id=2477,exports.ids=[2477],exports.modules={13053:(a,b,c)=>{c.d(b,{U5:()=>f,l1:()=>e});let d=a=>String(a??"").replace(/\s+/g," ").trim();function e(a,...b){return[`[TSA] ${d(a)}`,...b.map(d).filter(Boolean)].join(" \xb7 ").slice(0,180)}function f(a,b,c){return[`[TSA copy] ${d(a)}`,d(b),d(c)].filter(Boolean).join(" \xb7 ").slice(0,180)}},52477:(a,b,c)=>{c.d(b,{Az:()=>G,HS:()=>O,KN:()=>N,LO:()=>F,OW:()=>L,Qx:()=>E,YP:()=>B,ZM:()=>D,Ze:()=>I,l_:()=>H,n1:()=>P});var d=c(73024),e=c(76760),f=c.n(e),g=c(52731),h=c(30071),i=c.n(h),j=c(70373),k=c(13053);function l(a){return String(a??"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}let m=process.env.GMAIL_USER,n=process.env.GMAIL_APP_PASSWORD,o=process.env.SMTP_HOST,p=process.env.SMTP_USER,q=process.env.SMTP_PASS,r=Number(process.env.SMTP_PORT||465),s=o&&p&&q?g.createTransport({host:o,port:r,secure:465===r,auth:{user:p,pass:q}}):m&&n?g.createTransport({service:"gmail",auth:{user:m,pass:n}}):null,t=process.env.TWILIO_ACCOUNT_SID,u=process.env.TWILIO_AUTH_TOKEN,v=process.env.TWILIO_PHONE,w=t&&u?i()(t,u):null,x=process.env.ADMIN_EMAIL||"infotaxisaudiarabia@gmail.com",y=process.env.NEXT_PUBLIC_SITE_URL||"https://saudi-ride.vercel.app",z=process.env.NEXT_PUBLIC_WHATSAPP_NUMBER||"+966539388072";function A(a){return a.startsWith("LXT-")?"RT-"+a.substring(4):a}async function B(a,b){try{if(!w||!v)return console.log(`📲 [SMS SIMULATION] To: ${a} | Message: "${b}"`),"simulated_sms_id";{let c=await w.messages.create({body:b,from:v,to:a});return console.log(`📲 [Twilio] SMS successfully sent to ${a}. Message ID: ${c.sid}`),c.sid}}catch(a){return console.error("❌ [Twilio] SMS dispatch failed:",a),null}}function C(a,b){let c=[...b??[]];if(a.includes("cid:tsa-logo")&&!c.some(a=>"tsa-logo"===a.cid))try{c.push({filename:"tsa-logo.png",content:(0,d.readFileSync)(f().join(process.cwd(),"lib/pdf/tsa-logo-green.png")),cid:"tsa-logo",contentType:"image/png"})}catch(a){console.error("inline logo not attached:",a instanceof Error?a.message:a)}return c}async function D(a,b,c,d){try{let e=d?.cc!==void 0?Array.isArray(d.cc)?d.cc:[d.cc]:a!==x?[x]:[],f=d?.bcc!==void 0?(Array.isArray(d.bcc)?d.bcc:[d.bcc]).filter(Boolean):[];if(!s)return console.log(`📧 [EMAIL SIMULATION] To: ${a}${e.length?` (cc: ${e.join(", ")})`:""}${f.length?` (bcc: ${f.join(", ")})`:""} | Subject: "${b}" | Length: ${c.length} chars`),"simulated_email_id";{let g=await s.sendMail({from:`Taxi Saudi Arabia <${process.env.EMAIL_FROM||"info@taxisaudiarabia.com"}>`,to:a,...e.length?{cc:e}:{},...f.length?{bcc:f}:{},...C(c,d?.attachments).length?{attachments:C(c,d?.attachments)}:{},subject:b,html:c});return console.log(`📧 [Gmail] Email successfully sent to ${a}${e.length?` (cc: ${e.join(", ")})`:""}${f.length?` (bcc: ${f.join(", ")})`:""}. ID: ${g.messageId}`),g.messageId}}catch(e){let c=e instanceof Error?e.message:String(e);return console.error("❌ [Gmail] Email dispatch failed:",c),d?.failureContext&&await O({channel:d.failureContext.channel,target:a,bookingRef:d.failureContext.bookingRef??null,subject:b,error:c}),null}}async function E(a,b,c,d){if(!s)return{ok:!1,error:"Email is not configured (GMAIL_USER / GMAIL_APP_PASSWORD missing)"};try{let e=(Array.isArray(d?.bcc)?d.bcc:d?.bcc?[d.bcc]:[]).filter(b=>b&&b.toLowerCase()!==a.toLowerCase()),f=await s.sendMail({from:`Taxi Saudi Arabia <${process.env.EMAIL_FROM||"info@taxisaudiarabia.com"}>`,to:a,...e.length?{bcc:e}:{},...C(c,d?.attachments).length?{attachments:C(c,d?.attachments)}:{},subject:b,html:c});return{ok:!0,messageId:f.messageId}}catch(a){return{ok:!1,error:a instanceof Error?a.message:String(a)}}}async function F(a){let b=A(a.bookingRef),c=`Your Taxi Saudi Arabia Booking Confirmed — Ref: ${b}`,d=`${y}/track-booking?ref=${b}&phone=${encodeURIComponent(a.customerPhone)}`,e=`https://wa.me/${z.replace("+","")}?text=Hello,%20I%20have%20an%20inquiry%20regarding%20booking%20${b}`,f=`
    <div style="font-family: sans-serif; padding: 25px; color: #111; max-width: 600px; border: 1px solid #C9A84C; border-radius: 16px; background-color: #fafafa;">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="font-size: 24px; font-weight: bold; color: #C9A84C; letter-spacing: 1px;">TAXI SAUDI ARABIA</span>
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #888; margin-top: 4px;">Chauffeur & Luxury Transfers</div>
      </div>
      
      <div style="background: #ffffff; border: 1px solid #eee; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 25px;">
        <p style="margin: 0 0 5px 0; color: #888; font-size: 12px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Booking Reference</p>
        <h1 style="margin: 0; color: #C9A84C; font-size: 32px; font-family: monospace; font-weight: 800; letter-spacing: 1px;">${b}</h1>
        <p style="margin: 10px 0 0 0; color: #2ecc71; font-weight: bold; font-size: 14px;">✔ REQUEST RECEIVED — we'll confirm your price on WhatsApp shortly</p>
      </div>

      <h3 style="color: #111; border-bottom: 2px solid #C9A84C; padding-bottom: 6px; margin-top: 0;">Trip Summary</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666; width: 120px;">Pickup:</td>
          <td style="padding: 8px 0; color: #111;">${l(a.pickupLocation)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Dropoff:</td>
          <td style="padding: 8px 0; color: #111;">${l(a.dropoffLocation)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Date & Time:</td>
          <td style="padding: 8px 0; color: #111; font-weight: bold;">${new Date(a.pickupDateTime).toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Vehicle:</td>
          <td style="padding: 8px 0; color: #111;">${l(a.vehicle?.name||"Premium Fleet Vehicle")}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Passengers:</td>
          <td style="padding: 8px 0; color: #111;">${a.passengers} Passenger(s)</td>
        </tr>
      </table>

      <div style="background: #FFF9E6; border: 1px solid #C9A84C; border-radius: 12px; padding: 15px; text-align: center; margin-bottom: 25px;">
        <span style="font-size: 13px; font-weight: bold; color: #A8862A; text-transform: uppercase;">Price Pending</span>
        <h2 style="margin: 5px 0 0 0; color: #111; font-size: 16px; font-weight: normal;">Our team will confirm your exact fare on WhatsApp shortly.</h2>
      </div>

      <div style="text-align: center; margin-bottom: 30px;">
        <a href="${d}" style="display: inline-block; background-color: #C9A84C; color: #0A0A0A; padding: 12px 30px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-right: 10px;">Track Live Status</a>
        <a href="${e}" style="display: inline-block; background-color: #25D366; color: #fff; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 14px;">WhatsApp Support</a>
      </div>

      <div style="background: #fff; border: 1px solid #eee; border-radius: 12px; padding: 15px; font-size: 12px; color: #666; line-height: 1.5;">
        <strong style="color: #c0392b; text-transform: uppercase; font-size: 11px; display: block; margin-bottom: 4px;">Cancellation Policy</strong>
        Bookings can be cancelled up to 24 hours prior to pick-up time. Cancellations inside the 24-hour window will incur standard dispatch fees. Contact concierge via WhatsApp for adjustments.
      </div>
    </div>
  `,g=await D(a.customerEmail,c,f,{failureContext:{channel:"customer_email",bookingRef:b}}),h=`Request received! Your Taxi Saudi Arabia transfer on ${new Date(a.pickupDateTime).toLocaleDateString()} at ${new Date(a.pickupDateTime).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}. We'll confirm your price on WhatsApp shortly.`;return{email:g,sms:await B(a.customerPhone,h)}}async function G(a){let b=A(a.bookingRef),c=`Your Driver is Ready — Taxi Saudi Arabia Ref: ${b}`,d=`tel:${encodeURIComponent(a.driverPhone??"")}`,e=`
    <div style="font-family: sans-serif; padding: 25px; color: #111; max-width: 600px; border: 1px solid #C9A84C; border-radius: 16px; background-color: #fafafa;">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="font-size: 24px; font-weight: bold; color: #C9A84C; letter-spacing: 1px;">TAXI SAUDI ARABIA</span>
      </div>

      <div style="background: #ffffff; border: 1px solid #eee; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 25px;">
        <div style="width: 64px; height: 64px; line-height: 64px; margin: 0 auto 12px; border-radius: 50%; border: 3px solid #C9A84C; background: #FFF9E6; color: #C9A84C; font-size: 24px; font-weight: 800;">${l((a.driverName||"D").trim().charAt(0).toUpperCase())}</div>
        <h2 style="margin: 0; color: #111;">${l(a.driverName)}</h2>
        <p style="margin: 4px 0 0 0; color: #C9A84C; font-weight: bold;">Professional Chauffeur assigned</p>
        <p style="margin: 10px 0 0 0; font-size: 14px; font-family: monospace; font-weight: bold; color: #666;">Phone: ${l(a.driverPhone)}</p>
      </div>

      <h3 style="color: #111; border-bottom: 2px solid #C9A84C; padding-bottom: 6px; margin-top: 0;">Vehicle Details</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666; width: 120px;">Vehicle Class:</td>
          <td style="padding: 8px 0; color: #111; font-weight: bold;">${l(a.vehicle?.name||"Premium Luxury Vehicle")}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Plate Number:</td>
          <td style="padding: 8px 0; color: #C9A84C; font-weight: bold; font-family: monospace; font-size: 16px;">${l(a.vehicle?.plateNumber||"Confirm with driver on arrival")}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Capacity:</td>
          <td style="padding: 8px 0; color: #111;">Max ${a.vehicle?.capacity||4} Passengers & ${a.vehicle?.luggage||3} Bags</td>
        </tr>
      </table>

      <div style="background: #fff; border: 1px solid #eee; border-radius: 12px; padding: 15px; font-size: 13px; color: #555; line-height: 1.5; margin-bottom: 25px;">
        <strong style="color: #111; display: block; margin-bottom: 4px;">Pickup Instructions</strong>
        Your chauffeur will arrive at the scheduled pickup point exactly 15 minutes before departure and will contact you directly via phone or WhatsApp. He will carry a Taxi Saudi Arabia greeting sign with your name.
      </div>

      <div style="text-align: center;">
        <a href="${d}" style="display: inline-block; background-color: #C9A84C; color: #0A0A0A; padding: 12px 40px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Call Chauffeur Now</a>
      </div>
    </div>
  `;await D(a.customerEmail,c,e);let f=`Your driver ${a.driverName} (${a.driverPhone}) will pick you up in a ${a.vehicle?.name||"Taxi Saudi Arabia"}. He'll call 30 mins before.`;await B(a.customerPhone,f)}async function H(a){let b=A(a.bookingRef),c=(0,k.l1)("Booking","New booking",b,a.customerName),d=`${y}/admin/bookings`,e=`
    <div style="font-family: sans-serif; padding: 25px; color: #111; max-width: 600px; border: 2px solid #C9A84C; border-radius: 16px; background-color: #fafafa;">
      <h2 style="color: #C9A84C; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 0;">🔔 New Reservation Received</h2>
      <p>A new booking request has been received. Payment is collected from the customer on arrival — this is an enquiry to confirm and dispatch.</p>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666; width: 120px;">Reference ID:</td>
          <td style="padding: 8px 0; color: #C9A84C; font-weight: bold; font-family: monospace;">${b}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Customer Name:</td>
          <td style="padding: 8px 0; color: #111; font-weight: bold;">${l(a.customerName)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Phone:</td>
          <td style="padding: 8px 0; color: #111;"><a href="tel:${encodeURIComponent(a.customerPhone)}">${l(a.customerPhone)}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Email:</td>
          <td style="padding: 8px 0; color: #111;"><a href="mailto:${encodeURIComponent(a.customerEmail)}">${l(a.customerEmail)}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Route:</td>
          <td style="padding: 8px 0; color: #111;">${l(a.pickupLocation)} → ${l(a.dropoffLocation)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Vehicle:</td>
          <td style="padding: 8px 0; color: #111;">${l(a.vehicle?.name||"Premium Fleet Vehicle")}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Fare:</td>
          <td style="padding: 8px 0; color: #c0392b; font-weight: bold;">NOT SET — set the real price in Admin &gt; Bookings before quoting the customer</td>
        </tr>
      </table>

      <div style="text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
        <a href="${d}" style="display: inline-block; background-color: #C9A84C; color: #0A0A0A; padding: 12px 30px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 14px; text-transform: uppercase;">Manage In Admin Portal</a>
      </div>
    </div>
  `;return{email:await D(x,c,e,{failureContext:{channel:"admin_email",bookingRef:b}})}}async function I(a){let b=A(a.bookingRef),c=a.hoursUntilPickup<0,d=c?`${Math.abs(Math.round(a.hoursUntilPickup))}h OVERDUE`:`in ${Math.round(a.hoursUntilPickup)}h`,e=(0,k.l1)("URGENT",b,"still no price",`pickup ${d}`),f=`${y}/admin/bookings`,g=`
    <div style="font-family: sans-serif; padding: 25px; color: #111; max-width: 600px; border: 3px solid #c0392b; border-radius: 16px; background-color: #fff5f5;">
      <h2 style="color: #c0392b; border-bottom: 1px solid #f5c6c6; padding-bottom: 10px; margin-top: 0;">🚨 Booking Needs Attention Now</h2>
      <p style="color: #111;">This booking is still <strong>Pending / No price set</strong>, and pickup is
        <strong style="color: #c0392b;">${c?"already overdue":d}</strong>.
        The first alert for this booking may have been missed.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 8px 0; font-weight: bold; color: #666; width: 120px;">Reference:</td><td style="padding: 8px 0; color: #c0392b; font-weight: bold; font-family: monospace;">${b}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Customer:</td><td style="padding: 8px 0; color: #111; font-weight: bold;">${l(a.customerName)}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Phone:</td><td style="padding: 8px 0; color: #111;"><a href="tel:${encodeURIComponent(a.customerPhone)}">${l(a.customerPhone)}</a></td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Route:</td><td style="padding: 8px 0; color: #111;">${l(a.pickupLocation)} → ${l(a.dropoffLocation)}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Pickup:</td><td style="padding: 8px 0; color: #111; font-weight: bold;">${new Date(a.pickupDateTime).toLocaleString()}</td></tr>
      </table>
      <div style="text-align: center; border-top: 1px solid #f5c6c6; padding-top: 20px;">
        <a href="${f}" style="display: inline-block; background-color: #c0392b; color: #fff; padding: 12px 30px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 14px; text-transform: uppercase;">Open Admin &gt; Bookings Now</a>
      </div>
    </div>
  `;return{email:await D(x,e,g)}}let J=process.env.TRUSTPILOT_INVITE_EMAIL,K=process.env.NEXT_PUBLIC_TRUSTPILOT_URL||"https://www.trustpilot.com/evaluate/taxisaudiarabia.com";async function L(a){let b=`Thank you for riding with Taxi Saudi Arabia 🚗`,c=`
    <div style="font-family: Arial, sans-serif; color:#111827; max-width:520px;">
      <p>Dear ${l(a.customerName)},</p>

      <p>Thank you for choosing Taxi Saudi Arabia for your transfer from ${l(a.pickupLocation)} to ${l(a.dropoffLocation)}. We hope you had a comfortable and enjoyable ride${a.driverName?` with ${l(a.driverName)}`:""}.</p>

      <p>We'd really appreciate it if you could take a moment to share your experience — it helps us keep improving our service.</p>

      <div style="text-align:center; margin:28px 0;">
        <a href="${K}"
           style="background-color:#16A34A; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:6px; font-weight:bold; display:inline-block;">
          ⭐ Leave us a review on Trustpilot
        </a>
      </div>

      <p>Thank you again for travelling with us, and we look forward to welcoming you back in the future!</p>

      <p>Best regards,<br>Taxi Saudi Arabia</p>
    </div>
  `;return{email:await D(a.customerEmail,b,c,{bcc:J||void 0})}}async function M(a){let b=A(a.bookingRef),c=`Taxi Saudi Arabia: Booking ${b} received. We'll confirm shortly. Track: ${y}/track-booking`;await B(a.customerPhone,c)}async function N(a){let b=(0,k.l1)("Lead","Website calculator",`${a.origin} → ${a.destination}`),c=`${y}/admin`,d=[`<tr><td style="padding: 8px 0; font-weight: bold; color: #666; width: 120px;">Route:</td><td style="padding: 8px 0; color: #111; font-weight: bold;">${l(a.origin)} → ${l(a.destination)}</td></tr>`,a.tripDate?`<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Date/Time:</td><td style="padding: 8px 0; color: #111;">${l(a.tripDate)}</td></tr>`:"",a.vehicleType?`<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Vehicle:</td><td style="padding: 8px 0; color: #111;">${l(a.vehicleType)}</td></tr>`:"",a.customerName?`<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Name:</td><td style="padding: 8px 0; color: #111;">${l(a.customerName)}</td></tr>`:"",a.customerPhone?`<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Phone:</td><td style="padding: 8px 0; color: #111;"><a href="tel:${encodeURIComponent(a.customerPhone)}">${l(a.customerPhone)}</a></td></tr>`:"",a.customerEmail?`<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Email:</td><td style="padding: 8px 0; color: #111;"><a href="mailto:${encodeURIComponent(a.customerEmail)}">${l(a.customerEmail)}</a></td></tr>`:"",a.tripType?`<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Trip type:</td><td style="padding: 8px 0; color: #111;">${l(a.tripType)}</td></tr>`:"",a.returnDateTime?`<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Return:</td><td style="padding: 8px 0; color: #111;">${l(a.returnDateTime)}</td></tr>`:"",a.hoursNeeded?`<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Hours:</td><td style="padding: 8px 0; color: #111;">${l(a.hoursNeeded)}</td></tr>`:"",a.passengers?`<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Passengers:</td><td style="padding: 8px 0; color: #111;">${l(a.passengers)}</td></tr>`:"",a.luggage?`<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Luggage:</td><td style="padding: 8px 0; color: #111;">${l(a.luggage)}</td></tr>`:"",a.flightNumber?`<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Flight:</td><td style="padding: 8px 0; color: #111;">${l(a.flightNumber)}</td></tr>`:"",a.notes?`<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Notes:</td><td style="padding: 8px 0; color: #111;">${l(a.notes)}</td></tr>`:"",`<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Source:</td><td style="padding: 8px 0; color: #111;">${l(a.source||"website")}</td></tr>`].join(""),e=`
    <div style="font-family: sans-serif; padding: 25px; color: #111; max-width: 600px; border: 2px solid #C9A84C; border-radius: 16px; background-color: #fafafa;">
      <h2 style="color: #C9A84C; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 0;">🔔 New Quote Request (Website Widget)</h2>
      <p>A visitor requested a quote and was handed off to WhatsApp. Follow up if they haven't messaged yet — they may not finish the chat.</p>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">${d}</table>
      <div style="text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
        <a href="${c}" style="display: inline-block; background-color: #C9A84C; color: #0A0A0A; padding: 12px 30px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 14px; text-transform: uppercase;">Open Admin Portal</a>
      </div>
    </div>
  `;return{email:await D(x,b,e,{failureContext:{channel:"lead_admin_email",bookingRef:a.id}})}}async function O(a){try{await j.z.notificationFailure.create({data:{channel:a.channel,target:a.target??null,bookingRef:a.bookingRef??null,subject:a.subject??null,error:a.error.slice(0,1e3)}})}catch(b){console.error("❌ Could not record notification failure:",b,a)}}async function P(a){let b=A(a.bookingRef),c=!1,d=!1;if(a.customerEmail)try{let e=await F(a);c=!!e.email,d=!!e.sms,e.sms||await O({channel:"customer_sms",target:a.customerPhone,bookingRef:b,error:"sendSMS returned null (Twilio not configured?)"})}catch(c){await O({channel:"customer_email",target:a.customerEmail,bookingRef:b,error:String(c)})}else try{await M(a),d=!0}catch(c){await O({channel:"customer_sms",target:a.customerPhone,bookingRef:b,error:String(c)})}let e=!1;try{e=!!(await H(a)).email}catch(a){await O({channel:"admin_email",bookingRef:b,error:String(a)})}return{customerEmail:c,customerSms:d,adminEmail:e}}}};