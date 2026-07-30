"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/app/lib/language/LanguageContext";

function HandDots({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full"
          style={{
            backgroundColor: "var(--color-champagne)",
            boxShadow: "0 0 6px rgba(232,201,171,0.55)",
          }}
        />
      ))}
    </span>
  );
}

function PriceRow({ label, price, dots }: { label: string; price: string; dots: number }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <span className="inline-flex items-center gap-2.5 text-sm text-[var(--color-offwhite)]">
        <HandDots count={dots} />
        {label}
      </span>
      <span className="font-[var(--font-heading)] text-lg font-medium text-[var(--color-champagne-soft)]">
        {price}
      </span>
    </div>
  );
}

export default function Services() {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="soins" className="relative py-14 sm:py-18">
      <div className="container relative z-10">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="eyebrow mb-6"
          >
            {t.services.eyebrow}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-balance"
          >
            {t.services.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 text-sm uppercase tracking-[0.24em] text-[var(--color-text-muted)]"
          >
            {t.services.subtitle}
          </motion.p>
        </div>

        {/* Cards */}
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 pt-4 md:grid-cols-3 md:gap-7">
          {t.services.cards.map((card, index) => {
            const popular = index === t.services.cards.length - 1;
            return (
              <motion.div
                key={card.duration}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1, delay: index * 0.14, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {/* Ambient halo */}
                <motion.div
                  className="pointer-events-none absolute -inset-6 -z-10 rounded-[var(--radius-lg)]"
                  style={{
                    background: popular
                      ? "radial-gradient(ellipse 70% 70% at 50% 40%, rgba(232,120,150,0.32), transparent 72%)"
                      : "radial-gradient(ellipse 70% 70% at 50% 40%, rgba(150,45,80,0.2), transparent 72%)",
                    filter: "blur(46px)",
                  }}
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : { x: ["0%", "3%", "-3%", "0%"], y: ["0%", "-3%", "2%", "0%"] }
                  }
                  transition={{
                    duration: 24 + index * 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 2,
                  }}
                />

                {popular && (
                  <div className="absolute -top-3.5 left-1/2 z-20 -translate-x-1/2 sm:-top-4">
                    <span
                      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-1.5 text-[0.6rem] font-medium uppercase tracking-[0.16em] backdrop-blur-md"
                      style={{
                        borderColor: "rgba(232,201,171,0.55)",
                        backgroundColor: "rgba(20,11,16,0.92)",
                        color: "var(--color-champagne-soft)",
                        boxShadow: "0 0 22px rgba(232,201,171,0.38)",
                      }}
                    >
                      ✨ {t.services.popularBadge}
                    </span>
                  </div>
                )}

                <motion.div
                  whileHover={prefersReducedMotion ? undefined : { y: -10 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border p-7 backdrop-blur-2xl transition-[border-color,box-shadow,background-color] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] sm:p-8"
                  style={{
                    borderColor: popular ? "rgba(232,120,150,0.36)" : "rgba(232,120,150,0.16)",
                    backgroundColor: popular ? "rgba(24,13,18,0.66)" : "rgba(20,11,16,0.5)",
                    boxShadow: popular
                      ? "0 0 46px rgba(232,120,150,0.2), inset 0 0 30px rgba(150,45,80,0.08)"
                      : "0 0 0 rgba(0,0,0,0)",
                  }}
                >
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, transparent, rgba(232,201,171,0.5) 50%, transparent)",
                    }}
                  />

                  <div className="flex items-baseline gap-2.5">
                    <span className="font-[var(--font-heading)] text-[clamp(3rem,2.2rem+3vw,4.25rem)] font-medium leading-none text-[var(--color-champagne-soft)]">
                      {card.duration}
                    </span>
                    <span className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
                      {t.services.minutesLabel}
                    </span>
                  </div>

                  <p className="mt-5 max-w-[32ch] text-sm leading-[1.85] text-[var(--color-text-muted)]">
                    {card.description}
                  </p>

                  <div
                    className="mt-7 flex flex-col divide-y divide-[rgba(244,239,232,0.12)] overflow-hidden rounded-[var(--radius-sm)] border"
                    style={{ borderColor: "var(--color-border)", backgroundColor: "rgba(244,239,232,0.03)" }}
                  >
                    <PriceRow label={t.services.twoHandsLabel} price={card.priceTwo} dots={2} />
                    <PriceRow label={t.services.fourHandsLabel} price={card.priceFour} dots={4} />
                  </div>

                  <a
                    href="tel:+15145438344"
                    aria-label={t.services.bookAria.replace("{duration}", card.duration)}
                    className={`btn mt-8 w-full ${popular ? "btn-primary" : "btn-secondary"}`}
                  >
                    {t.services.ctaBook}
                  </a>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
