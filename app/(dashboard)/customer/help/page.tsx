"use client";

import { useState } from "react";
import { MessageCircle, Mail, Clock, ChevronDown, ChevronUp, Phone } from "lucide-react";
import Link from "next/link";

const FAQS = [
  {
    q: "How far in advance should I book my airport transfer?",
    a: "We recommend booking at least 12 hours in advance to guarantee vehicle availability, especially during peak seasons like Hajj and Umrah. However, we do try to accommodate last-minute requests within 2 hours."
  },
  {
    q: "Do you provide child seats?",
    a: "Yes, child seats are provided complimentary upon request. Please select the child seat option during the booking process or contact our support team."
  },
  {
    q: "What is your cancellation policy?",
    a: "You can cancel your booking for free up to 24 hours before the scheduled pickup time. Cancellations made within 24 hours may be subject to a fee."
  },
  {
    q: "How do I recognize my driver at the airport?",
    a: "Your driver will be waiting at the arrivals hall holding a personalized name board. You will also receive their name, photo, and vehicle details via SMS before pickup."
  }
];

export default function CustomerHelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-[#F5F0E8]">Help & Support</h1>
        <p className="text-[#A1A1A6] mt-1 text-sm">We&apos;re here to ensure your journey is seamless.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* LEFT COL: FAQS */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-[#C9A84C] font-bold uppercase tracking-wider text-sm border-b border-[#C9A84C]/10 pb-2">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div 
                key={idx} 
                className={`bg-[#111] border ${openFaq === idx ? 'border-[#C9A84C]' : 'border-[#C9A84C]/20'} rounded-2xl overflow-hidden transition-colors`}
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className={`font-bold ${openFaq === idx ? 'text-[#C9A84C]' : 'text-[#F5F0E8]'}`}>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="h-5 w-5 text-[#C9A84C]" /> : <ChevronDown className="h-5 w-5 text-[#7C8088]" />}
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-sm text-[#A1A1A6] leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CONTACT FORM */}
          <div className="bg-[#111] border border-[#C9A84C]/20 rounded-2xl p-6 md:p-8 mt-8">
            <h3 className="text-[#F5F0E8] font-bold mb-6">Send us a Message</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#A1A1A6] uppercase tracking-wider">Subject</label>
                <select className="w-full bg-[#0A0A0A] border border-[#C9A84C]/20 rounded-xl px-4 py-3 text-sm text-[#F5F0E8] focus:border-[#C9A84C] outline-none transition-colors appearance-none">
                  <option>Booking Modification</option>
                  <option>Payment Issue</option>
                  <option>Driver Feedback</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#A1A1A6] uppercase tracking-wider">Message</label>
                <textarea 
                  rows={4} 
                  className="w-full bg-[#0A0A0A] border border-[#C9A84C]/20 rounded-xl px-4 py-3 text-sm text-[#F5F0E8] focus:border-[#C9A84C] outline-none transition-colors resize-none"
                  placeholder="How can we help you today?"
                ></textarea>
              </div>
              <button className="bg-[#C9A84C] text-[#0A0A0A] font-bold uppercase tracking-wider text-xs px-6 py-3.5 rounded-xl hover:bg-[#B8963B] transition-colors w-full md:w-auto">
                Submit Request
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COL: QUICK CONTACT */}
        <div className="space-y-6">
          <div className="bg-gradient-to-b from-[#111] to-[#0A0A0A] border border-[#C9A84C]/20 rounded-3xl p-6">
            <h3 className="text-[#F5F0E8] font-heading font-bold text-lg mb-6">Immediate Support</h3>
            
            <div className="space-y-4">
              <Link href="https://wa.me/966500000000" target="_blank" className="flex items-center gap-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 p-4 rounded-2xl transition-colors group">
                <div className="bg-[#25D366] text-white p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-[#F5F0E8] text-sm">WhatsApp Support</p>
                  <p className="text-xs text-[#A1A1A6]">Fastest response time</p>
                </div>
              </Link>

              <div className="flex items-center gap-4 bg-[#1A1A1A] border border-[#C9A84C]/10 p-4 rounded-2xl">
                <div className="bg-[#333] text-[#F5F0E8] p-3 rounded-xl">
                  <Phone className="h-6 w-6 text-[#C9A84C]" />
                </div>
                <div>
                  <p className="font-bold text-[#F5F0E8] text-sm">+966 50 123 4567</p>
                  <p className="text-xs text-[#A1A1A6]">VIP Concierge Desk</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-[#1A1A1A] border border-[#C9A84C]/10 p-4 rounded-2xl">
                <div className="bg-[#333] text-[#F5F0E8] p-3 rounded-xl">
                  <Mail className="h-6 w-6 text-[#C9A84C]" />
                </div>
                <div>
                  <p className="font-bold text-[#F5F0E8] text-sm">vip@riyadhtaxi.com</p>
                  <p className="text-xs text-[#A1A1A6]">For general inquiries</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#C9A84C]/10">
              <div className="flex items-center gap-3 text-[#A1A1A6] mb-2">
                <Clock className="h-5 w-5 text-[#C9A84C]" />
                <span className="font-bold text-[#F5F0E8] text-sm">Operating Hours</span>
              </div>
              <ul className="text-sm space-y-1 ml-8">
                <li><span className="text-[#F5F0E8]">Dispatch:</span> 24/7/365</li>
                <li><span className="text-[#F5F0E8]">Support:</span> 24/7/365</li>
                <li><span className="text-[#F5F0E8]">Admin:</span> Sun-Thu (9AM - 5PM AST)</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
