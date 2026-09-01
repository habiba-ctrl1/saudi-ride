"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [hasClosedBubble, setHasClosedBubble] = useState(false);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+966539388072";

  // Show speech bubble after 4 seconds of page load (unless user explicitly closed it)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasClosedBubble) {
        setShowBubble(true);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [hasClosedBubble]);

  const formattedNumber = whatsappNumber.replace(/[^0-9]/g, "");
  const encodedText = encodeURIComponent(
    "Salam! I'd like to book a private taxi with Taxi Saudi Arabia.\n\n" +
      "• From: \n" +
      "• To: \n" +
      "• Date & time: \n" +
      "• Passengers & luggage: \n" +
      "• Vehicle (Sedan / SUV / Van): ",
  );
  const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodedText}`;

  return (
    <div className="fixed bottom-6 end-6 z-50 flex flex-col items-end gap-2">
      {/* Speech Bubble Prompt */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="premium-dark-section relative flex max-w-xs items-center gap-3 rounded-2xl border border-[#25D366]/30 bg-[#121212]/95 p-3.5 shadow-2xl backdrop-blur-md text-white"
          >
            <div className="relative flex-shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]/20 text-[#25D366]">
                <span className="text-base">💬</span>
              </div>
              <span className="absolute bottom-0 end-0 h-2.5 w-2.5 rounded-full bg-[#25D366] ring-2 ring-[#121212]" />
            </div>

            <div className="flex-1 pe-4 text-xs leading-relaxed">
              <p className="font-semibold text-white">Reserve Your Private Taxi</p>
              <p className="text-[#A3A3A3]">Chat 24/7 on WhatsApp — clear price, usually within 1–2 hours</p>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowBubble(false);
                setHasClosedBubble(true);
              }}
              className="absolute top-2 end-2 text-[#737373] hover:text-white transition-colors p-1"
              aria-label="Close message"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            {/* Bubble arrow pointing to button */}
            <div className="absolute -bottom-2 end-6 h-3 w-3 rotate-45 border-b border-e border-[#25D366]/30 bg-[#121212]" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex items-center justify-end">
        {/* Hover Tooltip */}
        <AnimatePresence>
          {isHovered && !showBubble && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="premium-dark-section me-3 hidden rounded-lg border border-[#C9A84C]/30 bg-[#121212] px-3.5 py-1.5 text-xs font-semibold tracking-wider text-[#C9A84C] shadow-2xl backdrop-blur-md md:block"
            >
              Reserve via WhatsApp 24/7
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Pulse Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() =>
            trackEvent("whatsapp_click", {
              sourceLocation: "floating_button",
              phoneUsed: formattedNumber,
              locale: "en",
            })
          }
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgb(37,211,102,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_40px_rgb(37,211,102,0.6)]"
          aria-label="Book via WhatsApp"
        >
          {/* Pulse animation ring */}
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-25 [animation-duration:2s]" />

          {/* WhatsApp Icon SVG */}
          <svg
            className="h-7 w-7 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.076-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
