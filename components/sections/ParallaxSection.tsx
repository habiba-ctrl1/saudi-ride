"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface ParallaxSectionProps {
  image: string;        // /public path to an optimized WebP
  title: string;
  text: string;
  buttonLabel: string;
  buttonHref: string;
}

/**
 * Full-width parallax section: image stays fixed while content scrolls over it.
 * True CSS parallax via `background-attachment: fixed` (`.parallax-bg`), which
 * falls back to a normal scroll background on mobile (see globals.css).
 * A dark gradient overlay (~50%) keeps white text readable.
 */
export function ParallaxSection({ image, title, text, buttonLabel, buttonHref }: ParallaxSectionProps) {
  return (
    <section
      className="parallax-bg premium-dark-section relative flex items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(rgba(10,10,10,0.55), rgba(10,10,10,0.45)), url(${image})`,
        minHeight: "clamp(500px, 70vh, 700px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="section-container max-w-3xl text-center"
      >
        <h2
          className="font-heading font-extrabold text-white"
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            textShadow: "0 2px 18px rgba(0,0,0,0.55)",
          }}
        >
          {title}
        </h2>
        <p
          className="mx-auto mt-5 max-w-2xl text-base md:text-lg leading-relaxed text-white/90"
          style={{ textShadow: "0 1px 10px rgba(0,0,0,0.5)" }}
        >
          {text}
        </p>
        <Link
          href={buttonHref}
          className="btn btn-primary btn-lg mt-8"
        >
          {buttonLabel}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </section>
  );
}
