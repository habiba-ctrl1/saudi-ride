"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookingForm } from "@/components/booking/booking-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { contactConfig } from "@/lib/config/contact";
import { siteContent, type Locale } from "@/lib/data/content";
import { faqItems, guidePosts, popularRoutes, trustStats } from "@/lib/data/inspiration";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function HomePage() {
  const [locale, setLocale] = useState<Locale>("en");
  const copy = useMemo(() => siteContent[locale], [locale]);
  const isArabic = locale === "ar";

  return (
    <main dir={isArabic ? "rtl" : "ltr"} className="min-h-screen bg-[#f8f8f6] text-[#121417]">
      <SiteHeader />
      <section className="hero-glow relative overflow-hidden border-b border-[#e7e4db]">
        <div className="section-container py-8 md:py-12">
          <div className="mb-8 flex justify-end">
            <button
              type="button"
              onClick={() => setLocale((prev) => (prev === "en" ? "ar" : "en"))}
              className="rounded-full border border-[#d2d7dd] px-4 py-2 text-xs font-semibold tracking-[0.08em] transition hover:border-[#121417]"
            >
              {copy.navLanguage}
            </button>
          </div>

          <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.6 }}>
              <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[#7c8088]">{copy.heroBadge}</p>
              <h1 className="max-w-xl text-4xl font-semibold leading-tight md:text-6xl">
                {copy.heroTitle}
                <span className="block text-[#c7a66b]">{copy.heroHighlight}</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#49505a] md:text-lg">
                {copy.heroDescription}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#booking"
                  className="rounded-full bg-[#121417] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#1b1f24]"
                >
                  {copy.heroPrimaryCta}
                </a>
                <a
                  href="#fleet"
                  className="rounded-full border border-[#d2d7dd] px-7 py-3 text-sm font-medium text-[#121417] transition hover:border-[#121417]"
                >
                  {copy.heroSecondaryCta}
                </a>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative"
              whileHover={{ y: -4 }}
            >
              <div className="overflow-hidden rounded-3xl border border-[#ede9df] bg-white shadow-[0_30px_60px_rgba(18,20,23,0.12)]">
                <Image
                  src="https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1400&q=80"
                  alt="Luxury black sedan on city street"
                  width={1200}
                  height={800}
                  className="h-[22rem] w-full object-cover"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-container py-12">
        <div className="grid gap-4 md:grid-cols-4">
          {trustStats.map((item) => (
            <div key={item.label} className="rounded-2xl border border-[#e7e4db] bg-white p-5">
              <p className="text-2xl font-semibold text-[#c7a66b]">{item.value}</p>
              <p className="mt-1 text-sm text-[#525963]">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="booking" className="section-container py-16">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45 }}
          >
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#7c8088]">{copy.bookingBadge}</p>
            <h2 className="text-3xl font-semibold md:text-4xl">{copy.bookingTitle}</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#49505a]">{copy.bookingDescription}</p>
          </motion.div>
          <BookingForm copy={copy.bookingForm} locale={locale} />
        </div>
      </section>

      <section className="section-container py-14">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#7c8088]">{copy.servicesBadge}</p>
        <h3 className="mb-8 text-3xl font-semibold">{copy.servicesTitle}</h3>
        <div className="grid gap-5 md:grid-cols-3">
          {copy.services.map((service, index) => (
            <motion.article
              key={service.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="rounded-2xl border border-[#e7e4db] bg-white p-6"
              whileHover={{ y: -6 }}
            >
              <h4 className="mb-2 text-xl font-medium text-[#121417]">{service.title}</h4>
              <p className="text-sm leading-relaxed text-[#49505a]">{service.description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="fleet" className="section-container py-14">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#7c8088]">{copy.fleetBadge}</p>
        <h3 className="mb-8 text-3xl font-semibold">{copy.fleetTitle}</h3>
        <div className="grid gap-5 md:grid-cols-3">
          {copy.fleet.map((vehicle, index) => (
            <motion.article
              key={vehicle.name}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="rounded-2xl border border-[#e7e4db] bg-white p-6"
              whileHover={{ y: -6 }}
            >
              <p className="text-xs uppercase tracking-[0.15em] text-[#7c8088]">{vehicle.type}</p>
              <h4 className="mt-2 text-2xl font-semibold">{vehicle.name}</h4>
              <ul className="mt-4 space-y-2 text-sm text-[#49505a]">
                {vehicle.features.map((feature) => (
                  <li key={feature}>- {feature}</li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="section-container py-14">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#7c8088]">Routes</p>
            <h3 className="text-3xl font-semibold">Most requested VIP routes</h3>
          </div>
          <Link href="/routes" className="text-sm text-[#121417] underline">
            View all routes
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {popularRoutes.slice(0, 6).map((route) => (
            <div key={route} className="rounded-xl border border-[#e7e4db] bg-white px-4 py-3 text-sm">
              {route}
            </div>
          ))}
        </div>
      </section>

      <section className="section-container py-14">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#7c8088]">FAQ</p>
            <h3 className="text-3xl font-semibold">Quick answers before booking</h3>
          </div>
          <Link href="/faq" className="text-sm text-[#121417] underline">
            See full FAQ
          </Link>
        </div>
        <div className="space-y-3">
          {faqItems.map((item) => (
            <details key={item.question} className="rounded-2xl border border-[#e7e4db] bg-white p-5">
              <summary className="cursor-pointer text-base font-medium">{item.question}</summary>
              <p className="mt-3 text-sm leading-relaxed text-[#525963]">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section-container py-14">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#7c8088]">Guides</p>
            <h3 className="text-3xl font-semibold">Travel tips for Umrah and intercity journeys</h3>
          </div>
          <Link href="/guides" className="text-sm text-[#121417] underline">
            Read guides
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {guidePosts.map((post) => (
            <article key={post} className="rounded-2xl border border-[#e7e4db] bg-white p-6">
              <h4 className="text-base font-medium">{post}</h4>
              <p className="mt-2 text-sm text-[#525963]">Practical guidance for smoother and safer travel in KSA.</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="section-container pb-20 pt-14">
        <div className="rounded-3xl border border-[#e7e4db] bg-white p-8 md:p-10">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#7c8088]">{copy.contactBadge}</p>
          <h3 className="text-3xl font-semibold">{copy.contactTitle}</h3>
          <p className="mt-3 max-w-2xl text-sm text-[#49505a]">{copy.contactDescription}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <a className="rounded-full bg-[#121417] px-5 py-2 text-white" href={contactConfig.primaryPhoneLink}>
              {contactConfig.primaryPhoneDisplay}
            </a>
            <a className="rounded-full border border-[#d2d7dd] px-5 py-2" href={contactConfig.secondaryPhoneLink}>
              {contactConfig.secondaryPhoneDisplay}
            </a>
            <a className="rounded-full border border-[#d2d7dd] px-5 py-2" href={contactConfig.emailLink}>
              {contactConfig.email}
            </a>
          </div>
        </div>
      </section>

      <a
        href={contactConfig.whatsappLink}
        target="_blank"
        rel="noreferrer"
        aria-label={copy.whatsappLabel}
        className="fixed bottom-5 right-5 rounded-full bg-[#25d366] px-5 py-3 text-sm font-semibold text-white shadow-xl transition hover:scale-[1.02]"
      >
        {copy.whatsappCta}
      </a>
      <SiteFooter />
    </main>
  );
}
