"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/app/lib/language/LanguageContext";
import { useIsMobile } from "@/app/lib/useIsMobile";

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export default function ContactBand() {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const telHref = `tel:${t.contact.numberHref}`;
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: "200px 0px 200px 0px" });
  const animateHalos = !prefersReducedMotion && !isMobile && isInView;

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[var(--color-plum)] py-20 sm:py-28">
      {/* Voile de continuité — reprend la tombée sombre de la section précédente pour une jonction naturelle */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-28 sm:h-40"
        style={{
          backgroundImage:
            "linear-gradient(180deg, var(--color-black) 0%, transparent 100%)",
        }}
      />

      {/* Fond prune premium — base fixe + deux halos en mouvement très lent et discret */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(20,11,16,0.6) 0%, var(--color-plum) 40%, rgba(20,11,16,0.75) 100%)",
        }}
      />
      <motion.div
        className="pointer-events-none absolute -left-[10%] top-[-20%] z-0 h-[85%] w-[55%]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(150,45,80,0.34) 0%, transparent 68%)",
          filter: "blur(70px)",
        }}
        animate={
          animateHalos
            ? { x: ["0%", "4%", "-2%", "0%"], y: ["0%", "-3%", "2%", "0%"] }
            : undefined
        }
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-[10%] bottom-[-20%] z-0 h-[85%] w-[55%]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(100,40,72,0.38) 0%, transparent 68%)",
          filter: "blur(70px)",
        }}
        animate={
          animateHalos
            ? { x: ["0%", "-3%", "3%", "0%"], y: ["0%", "3%", "-2%", "0%"] }
            : undefined
        }
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      {/* Fine gold hairlines */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent, rgba(232,201,171,0.35) 50%, transparent)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent, rgba(232,201,171,0.35) 50%, transparent)",
        }}
      />

      {/* Fine grain texture for depth */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")",
          mixBlendMode: "overlay",
        }}
      />

      <div className="container relative z-10 flex flex-col items-center gap-8 text-center">
        <motion.div
          data-reveal
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2.5"
        >
          <PhoneIcon className="h-4 w-4 text-[var(--color-champagne)]" />
          <span className="eyebrow">{t.contact.badge}</span>
        </motion.div>

        <motion.div
          data-reveal
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div
            className="pointer-events-none absolute inset-0 -z-10 blur-[40px]"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 75% 85% at 50% 50%, rgba(232,120,150,0.36), transparent 72%)",
            }}
          />
          <a
            href={telHref}
            aria-label={t.contact.callAria}
            className="font-[var(--font-heading)] text-[clamp(2.3rem,1.5rem+4vw,4.5rem)] leading-none font-medium text-[var(--color-offwhite)] no-underline transition-colors duration-500 hover:text-[var(--color-champagne-soft)]"
            style={{
              backgroundImage: "none",
              letterSpacing: "0.01em",
              textShadow: "0 0 46px rgba(232,120,150,0.3)",
            }}
          >
            {t.contact.number}
          </a>
        </motion.div>

        <motion.p
          data-reveal
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="text-[0.72rem] uppercase tracking-[0.16em] text-[var(--color-text-muted)] sm:text-xs"
        >
          {t.contact.subtitle}
        </motion.p>

        <motion.div
          data-reveal
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.28, ease: [0.19, 1, 0.22, 1] }}
        >
          <motion.a
            href="tel:+15145438344"
            aria-label={t.contact.bookAria}
            whileHover={{
              scale: 1.02,
              y: -2,
              transition: { type: "spring", stiffness: 400, damping: 20 },
            }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary mt-2 min-w-[230px]"
          >
            {t.contact.bookNow}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
