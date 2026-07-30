"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/app/lib/language/LanguageContext";

export default function FloatingBookButton() {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="fixed right-5 z-40 sm:right-7"
      style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 1.2, ease: [0.19, 1, 0.22, 1] }}
    >
      <motion.div
        className="relative"
        animate={prefersReducedMotion ? undefined : { y: [0, -8, 0] }}
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {/* Subtle ambient glow, kept outside the button's own overflow-hidden box */}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 rounded-full blur-2xl"
          style={{
            background:
              "radial-gradient(ellipse, rgba(232,120,150,0.45) 0%, rgba(150,45,80,0.28) 55%, transparent 78%)",
          }}
          animate={
            prefersReducedMotion ? undefined : { opacity: [0.55, 0.85, 0.55], scale: [0.92, 1.08, 0.92] }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }
          }
        />

        <motion.a
          href="tel:+15145438344"
          aria-label={t.footer.bookAppointmentAria}
          whileHover={
            prefersReducedMotion
              ? undefined
              : {
                  scale: 1.07,
                  transition: { type: "spring", stiffness: 340, damping: 18 },
                }
          }
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary relative flex items-center gap-2 !px-6 !py-3.5 text-[0.68rem] shadow-lg sm:!px-7 sm:!py-4 sm:text-[0.72rem]"
          style={{
            boxShadow: "0 10px 34px rgba(5,4,5,0.5), 0 0 26px rgba(232,120,150,0.3)",
          }}
        >
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{
              backgroundColor: "var(--color-champagne-soft)",
              boxShadow: "0 0 8px rgba(232,201,171,0.8)",
            }}
          />
          {t.contact.bookNow}
        </motion.a>
      </motion.div>
    </motion.div>
  );
}
