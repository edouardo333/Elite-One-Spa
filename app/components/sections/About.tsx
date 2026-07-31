"use client";

import { useState, type MouseEvent as ReactMouseEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useLanguage } from "@/app/lib/language/LanguageContext";

const PARALLAX_MAX = 4;

function AccordionCard({
  item,
  index,
  isOpen,
  onToggle,
  prefersReducedMotion,
}: {
  item: { title: string; content: string };
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  prefersReducedMotion: boolean | null;
}) {
  const triggerId = `about-accordion-trigger-${index}`;
  const panelId = `about-accordion-panel-${index}`;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 24, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 220, damping: 24, mass: 0.5 });

  const handleMouseEnter = () => {
    if (prefersReducedMotion) return;
    y.set(-3);
  };

  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;
    x.set(relX * PARALLAX_MAX);
    y.set(-3 + relY * (PARALLAX_MAX - 3));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className="group relative"
      style={{ x: springX, y: springY }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="about-card-halo pointer-events-none absolute -z-10 rounded-[var(--radius-md)]" aria-hidden="true" />
      <div
        data-open={isOpen}
        className="about-card overflow-hidden rounded-[var(--radius-md)] border backdrop-blur-xl"
      >
        <button
          type="button"
          id={triggerId}
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left sm:px-8 sm:py-7"
        >
          <span className="about-card-title text-base font-medium sm:text-lg">
            {item.title}
          </span>
          <span className="about-card-icon relative flex h-4 w-4 shrink-0 items-center justify-center">
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
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          aria-hidden={!isOpen}
          initial={false}
          animate={{
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{
            height: {
              duration: prefersReducedMotion ? 0 : 0.7,
              ease: [0.16, 1, 0.3, 1],
            },
            opacity: {
              duration: prefersReducedMotion ? 0 : 0.55,
              delay: isOpen ? 0.08 : 0,
              ease: "easeInOut",
            },
          }}
          style={{ overflow: "hidden" }}
        >
          <p className="max-w-[54ch] px-6 pb-9 text-sm leading-[2] sm:px-8 sm:pb-10">
            {item.content}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function About() {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="apropos" className="relative pt-28 pb-14 sm:pt-36 sm:pb-18">
      <div className="container relative z-10">
        {/* Two columns */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left — presentation */}
          <motion.div
            data-reveal
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col"
          >
            <motion.p
              data-reveal
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="eyebrow mb-6"
            >
              {t.about.eyebrow}
            </motion.p>
            <motion.h2
              data-reveal
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[18ch] text-balance"
            >
              {t.about.title}
            </motion.h2>

            <p className="mt-9 max-w-[54ch] text-base leading-[1.9] sm:text-lg">
              {t.about.paragraph}
            </p>

            <p className="mt-5 max-w-[54ch] text-base leading-[1.9] sm:text-lg">
              {t.about.paragraph2}
            </p>

            <p className="mt-5 max-w-[54ch] text-base leading-[1.9] sm:text-lg">
              {t.about.paragraph3}
            </p>

            <p
              className="relative mt-10 max-w-[46ch] pl-6 font-[var(--font-heading)] text-xl italic text-[var(--color-champagne-soft)] sm:text-2xl"
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
              className="group relative mt-12 inline-flex w-fit items-center gap-3 text-[0.7rem] font-medium uppercase tracking-[0.28em] text-[var(--color-champagne)] no-underline transition-[color,filter] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:text-[var(--color-champagne-soft)] hover:[filter:drop-shadow(0_0_14px_rgba(232,201,171,0.45))]"
              style={{ backgroundImage: "none" }}
            >
              {t.about.cta}
              <span className="transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-[3px]">
                →
              </span>
            </a>
          </motion.div>

          {/* Right — accordion */}
          <motion.div
            data-reveal
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-3.5"
          >
            {t.about.items.map((item, i) => (
              <AccordionCard
                key={item.title}
                item={item}
                index={i}
                isOpen={i === openIndex}
                onToggle={() => setOpenIndex(i === openIndex ? -1 : i)}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
