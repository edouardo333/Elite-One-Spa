"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/app/lib/language/LanguageContext";

export default function About() {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="apropos"
      className="relative overflow-hidden bg-[var(--color-black)] py-28 sm:py-36"
    >
      {/* Ambient rose/plum halo */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 55% 45% at 18% 15%, rgba(74,22,38,0.4), transparent 62%)",
            "radial-gradient(ellipse 50% 40% at 88% 85%, rgba(232,120,150,0.14), transparent 60%)",
          ].join(", "),
        }}
      />

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
            {t.about.eyebrow}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-balance"
          >
            {t.about.title}
          </motion.h2>
        </div>

        {/* Two columns */}
        <div className="mt-20 grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left — presentation */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col lg:justify-center"
          >
            <p className="text-base sm:text-lg">{t.about.paragraph}</p>

            <p
              className="relative mt-10 pl-6 font-[var(--font-heading)] text-xl italic text-[var(--color-champagne-soft)] sm:text-2xl"
              style={{ letterSpacing: "0.01em" }}
            >
              <span
                className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-px"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, transparent, rgba(232,201,171,0.6), transparent)",
                }}
              />
              {t.about.quote}
            </p>

            <a
              href="#soins"
              className="group mt-12 inline-flex w-fit items-center gap-3 text-[0.7rem] font-medium uppercase tracking-[0.28em] text-[var(--color-champagne)] no-underline transition-colors duration-500 hover:text-[var(--color-champagne-soft)]"
              style={{ backgroundImage: "none" }}
            >
              {t.about.cta}
              <span className="transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-1.5">
                →
              </span>
            </a>
          </motion.div>

          {/* Right — accordion */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-3.5"
          >
            {t.about.items.map((item, i) => {
              const isOpen = i === openIndex;
              return (
                <div
                  key={item.title}
                  className="overflow-hidden rounded-[var(--radius-md)] border backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                  style={{
                    backgroundColor: isOpen
                      ? "rgba(232,120,150,0.08)"
                      : "rgba(244,239,232,0.03)",
                    borderColor: isOpen
                      ? "rgba(232,120,150,0.32)"
                      : "var(--color-border)",
                    boxShadow: isOpen
                      ? "0 0 28px rgba(232,120,150,0.1)"
                      : "none",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left sm:px-8 sm:py-6"
                  >
                    <span className="text-base font-medium text-[var(--color-offwhite)] sm:text-lg">
                      {item.title}
                    </span>
                    <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
                      <span
                        className="absolute h-px w-4"
                        style={{ backgroundColor: "var(--color-champagne)" }}
                      />
                      <motion.span
                        className="absolute h-4 w-px"
                        style={{ backgroundColor: "var(--color-champagne)" }}
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        transition={{
                          duration: prefersReducedMotion ? 0 : 0.45,
                          ease: [0.19, 1, 0.22, 1],
                        }}
                      />
                    </span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: isOpen ? "auto" : 0,
                      opacity: isOpen ? 1 : 0,
                    }}
                    transition={{
                      height: {
                        duration: prefersReducedMotion ? 0 : 0.55,
                        ease: [0.19, 1, 0.22, 1],
                      },
                      opacity: {
                        duration: prefersReducedMotion ? 0 : 0.4,
                        ease: "easeInOut",
                      },
                    }}
                    style={{ overflow: "hidden" }}
                  >
                    <p className="px-6 pb-6 text-sm sm:px-8 sm:pb-7">
                      {item.content}
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
