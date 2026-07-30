"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import { useLanguage } from "@/app/lib/language/LanguageContext";
import { useIsMobile } from "@/app/lib/useIsMobile";

// Replace these with the real values when available.
const CONTACT_LINKS = {
  googleMapsUrl:
    "https://www.google.com/maps/place/eliteone+spa+Massage+Parlour/@45.5112597,-73.5688669,17z/data=!3m1!4b1!4m6!3m5!1s0x4cc91b9e18711249:0xa948201bcf1b2c91!8m2!3d45.511256!4d-73.566292!16s%2Fg%2F11h4mrlf31",
  email: "contact@eliteonespa.ca", // placeholder — replace with the real address
};

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="16" rx="2.4" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </svg>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 10.5c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10.5" r="2.6" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2.2" />
    </svg>
  );
}

function DirectionsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.2" />
      <path d="m4 6.5 8 6.5 8-6.5" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function QrIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3.5" y="3.5" width="6" height="6" rx="1" />
      <rect x="14.5" y="3.5" width="6" height="6" rx="1" />
      <rect x="3.5" y="14.5" width="6" height="6" rx="1" />
      <path d="M14.5 14.5h2.5v2.5M20.5 14.5v2.5h-2M14.5 20.5h6" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 3.5v11.5M7.5 10.5 12 15l4.5-4.5" />
      <path d="M4.5 17.5v1.8a2.2 2.2 0 0 0 2.2 2.2h10.6a2.2 2.2 0 0 0 2.2-2.2v-1.8" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="18" cy="5.5" r="2.3" />
      <circle cx="6" cy="12" r="2.3" />
      <circle cx="18" cy="18.5" r="2.3" />
      <path d="m8.1 10.8 7.8-4.3M8.1 13.2l7.8 4.3" />
    </svg>
  );
}

export default function BusinessCard() {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const telHref = `tel:${t.contact.numberHref}`;

  return (
    <main
      id="main-content"
      className="relative isolate flex min-h-dvh w-full flex-col items-center overflow-hidden px-6 pb-10 pt-8 sm:px-10 sm:pb-14 sm:pt-10"
      style={{
        paddingTop: "max(2rem, env(safe-area-inset-top))",
        paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))",
      }}
    >
      {/* Ambient background washes */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-[-10%] h-[60%] w-[120%] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(232,120,150,0.16) 0%, rgba(74,22,38,0.12) 42%, transparent 72%)",
            filter: "blur(60px)",
          }}
          animate={
            prefersReducedMotion || isMobile ? undefined : { opacity: [0.6, 0.95, 0.6] }
          }
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          className="absolute bottom-[-15%] left-1/2 h-[50%] w-[130%] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(42,20,32,0.5) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
      </div>

      {/* Language switcher */}
      <div className="flex w-full max-w-sm justify-end">
        <LanguageSwitcher />
      </div>

      {/* Center content */}
      <div className="flex w-full max-w-sm flex-1 flex-col items-center justify-center text-center">
        {/* Logo — CSS-driven entrance (see note below): visible by default,
            fade-in is a pure-CSS enhancement that runs without JS. */}
        <div className="group relative mb-8 flex items-center justify-center fade-in">
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 280,
              height: 280,
              background:
                "radial-gradient(circle, rgba(232,120,150,0.38) 0%, rgba(232,201,171,0.22) 40%, transparent 74%)",
              filter: "blur(26px)",
            }}
            animate={
              prefersReducedMotion
                ? undefined
                : { opacity: [0.55, 0.9, 0.55], scale: [0.95, 1.05, 0.95] }
            }
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="relative aspect-[3/2] w-[229px] sm:w-[257px]"
            animate={
              prefersReducedMotion
                ? undefined
                : { scale: [1, 1.025, 1], y: [0, -6, 0] }
            }
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/logo/Logo-Elite-One-Spa.webp"
              alt={t.nav.logoAria}
              fill
              sizes="238px"
              priority
              className="object-contain"
              style={{ filter: "drop-shadow(0 10px 28px rgba(5,4,5,0.5))" }}
            />
          </motion.div>
        </div>

        <p className="eyebrow mb-5 fade-in" style={{ animationDelay: "0.1s" }}>
          {t.businessCard.eyebrow}
        </p>

        <h1
          className="text-balance fade-in"
          style={{
            fontSize: "clamp(2.1rem, 1.5rem + 3vw, 3.1rem)",
            letterSpacing: "0.015em",
            animationDelay: "0.2s",
          }}
        >
          {t.businessCard.name}
        </h1>

        {/* Premium information row */}
        <div
          className="mt-4 flex w-full flex-wrap items-center justify-center gap-x-8 gap-y-4 fade-in"
          style={{ animationDelay: "0.28s" }}
        >
          <span
            className="flex items-center gap-1.5 text-[0.7rem] tracking-[0.04em]"
            style={{ color: "rgba(244,239,232,0.6)" }}
          >
            <PinIcon className="h-3.5 w-3.5 shrink-0 text-[var(--color-champagne)]" />
            {t.businessCard.infoBar.location}
          </span>
          <span
            className="flex items-center gap-1.5 text-[0.7rem] tracking-[0.04em]"
            style={{ color: "rgba(244,239,232,0.6)" }}
          >
            <ClockIcon className="h-3.5 w-3.5 shrink-0 text-[var(--color-champagne)]" />
            {t.businessCard.infoBar.hours}
          </span>
          <span
            className="flex items-center gap-1.5 text-[0.7rem] tracking-[0.04em]"
            style={{ color: "rgba(244,239,232,0.6)" }}
          >
            <LockIcon className="h-3.5 w-3.5 shrink-0 text-[var(--color-champagne)]" />
            {t.businessCard.infoBar.discretion}
          </span>
        </div>

        {/* Ornamental divider */}
        <div
          className="my-6 flex items-center gap-3 fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <span
            className="h-px w-10"
            style={{
              backgroundImage:
                "linear-gradient(90deg, transparent, rgba(232,201,171,0.6))",
            }}
          />
          <span
            aria-hidden="true"
            className="text-[0.7rem] leading-none"
            style={{
              color: "var(--color-champagne)",
              textShadow: "0 0 8px rgba(232,201,171,0.8)",
            }}
          >
            ✦
          </span>
          <span
            className="h-px w-10"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(232,201,171,0.6), transparent)",
            }}
          />
        </div>

        <div
          className="flex flex-col items-center gap-2 fade-in"
          style={{ animationDelay: "0.35s" }}
        >
          <p
            className="text-balance text-sm sm:text-base"
            style={{ color: "rgba(244,239,232,0.84)" }}
          >
            {t.businessCard.description}
          </p>
        </div>

        {/* CTA buttons — default visible; whileHover/whileTap are
            interaction-only enhancements that never gate initial visibility.
            Book Now stands alone as the primary action; the secondary trio
            is visually grouped and slightly de-emphasized below it. */}
        <div className="mt-10 flex w-full flex-col items-stretch">
          <motion.a
            href="/#soins"
            aria-label={t.businessCard.ctaBookAria}
            className="btn btn-primary w-full !py-4 !text-[0.86rem] fade-in"
            style={{ animationDelay: "0.45s", letterSpacing: "0.05em" }}
            whileHover={{
              scale: 1.02,
              y: -2,
              transition: { type: "spring", stiffness: 400, damping: 20 },
            }}
            whileTap={{ scale: 0.98 }}
          >
            <CalendarIcon className="h-4 w-4" />
            {t.businessCard.ctaBook}
          </motion.a>

          <div className="mt-5 flex w-full flex-col items-stretch gap-3">
            <motion.a
              href={telHref}
              aria-label={t.businessCard.ctaCallAria}
              className="btn btn-secondary w-full !py-3.5 !text-[0.8rem] fade-in"
              style={{ animationDelay: "0.55s" }}
              whileHover={{
                scale: 1.02,
                y: -2,
                transition: { type: "spring", stiffness: 400, damping: 20 },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <PhoneIcon className="h-4 w-4" />
              {t.businessCard.ctaCall}
            </motion.a>

            <motion.a
              href={CONTACT_LINKS.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.businessCard.ctaDirectionsAria}
              className="btn btn-secondary w-full !py-3.5 !text-[0.8rem] fade-in"
              style={{ animationDelay: "0.65s" }}
              whileHover={{
                scale: 1.02,
                y: -2,
                transition: { type: "spring", stiffness: 400, damping: 20 },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <DirectionsIcon className="h-4 w-4" />
              {t.businessCard.ctaDirections}
            </motion.a>

            <motion.a
              href={`mailto:${CONTACT_LINKS.email}`}
              aria-label={t.businessCard.ctaEmailAria}
              className="btn btn-secondary w-full !py-3.5 !text-[0.8rem] fade-in"
              style={{ animationDelay: "0.75s" }}
              whileHover={{
                scale: 1.02,
                y: -2,
                transition: { type: "spring", stiffness: 400, damping: 20 },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <EmailIcon className="h-4 w-4" />
              {t.businessCard.ctaEmail}
            </motion.a>
          </div>
        </div>
      </div>

      {/* Contact strip */}
      <div
        className="flex w-full max-w-sm flex-col items-center gap-4 border-t pt-6 fade-in"
        style={{ borderColor: "var(--color-border)", animationDelay: "0.85s" }}
      >
        <a
          href={CONTACT_LINKS.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.footer.addressAria}
          className="group flex items-center gap-2.5 text-[0.82rem] no-underline"
          style={{ backgroundImage: "none" }}
        >
          <PinIcon className="h-4 w-4 shrink-0 text-[var(--color-champagne)] transition-transform duration-300 group-hover:scale-110" />
          <span className="text-[rgba(244,239,232,0.72)] transition-colors duration-300 group-hover:text-[var(--color-champagne-soft)]">
            {t.footer.address}
          </span>
        </a>
        <div className="flex items-center gap-2.5 text-[0.82rem]">
          <ClockIcon className="h-4 w-4 shrink-0 text-[var(--color-champagne)]" />
          <span className="text-[rgba(244,239,232,0.72)]">{t.businessCard.contactHoursDaily}</span>
        </div>
        <p className="mt-1 text-[0.68rem] uppercase tracking-[0.18em]" style={{ color: "rgba(244,239,232,0.4)" }}>
          {t.businessCard.footerNote}
        </p>
      </div>

      {/* QR code placeholder — reserved for a future dynamic QR code;
          no generation, download, or share functionality yet. */}
      <div
        className="mt-8 flex w-full max-w-sm flex-col items-center gap-4 border-t pt-8 fade-in"
        style={{ borderColor: "var(--color-border)", animationDelay: "0.95s" }}
      >
        <p className="eyebrow !text-[0.68rem]">{t.businessCard.qrTitle}</p>
        <motion.div
          className="flex h-32 w-32 flex-col items-center justify-center rounded-2xl border border-dashed"
          style={{
            borderColor: "rgba(232,201,171,0.25)",
            background: "rgba(244,239,232,0.03)",
          }}
          animate={
            prefersReducedMotion
              ? undefined
              : { borderColor: ["rgba(232,201,171,0.25)", "rgba(232,201,171,0.55)", "rgba(232,201,171,0.25)"] }
          }
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <QrIcon className="h-8 w-8 text-[rgba(232,201,171,0.55)]" />
        </motion.div>
        <p className="text-[0.72rem]" style={{ color: "rgba(244,239,232,0.5)" }}>
          {t.businessCard.qrCaption}
        </p>

        {/* Future actions — visual only, no functionality yet. */}
        <div className="-mt-[14px] flex items-center gap-6">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            aria-disabled="true"
            tabIndex={-1}
            className="flex items-center gap-1.5 text-[0.68rem] uppercase tracking-[0.06em] no-underline"
            style={{ color: "rgba(244,239,232,0.4)", backgroundImage: "none", cursor: "default" }}
          >
            <DownloadIcon className="h-3.5 w-3.5 shrink-0" />
            {t.businessCard.downloadContact}
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            aria-disabled="true"
            tabIndex={-1}
            className="flex items-center gap-1.5 text-[0.68rem] uppercase tracking-[0.06em] no-underline"
            style={{ color: "rgba(244,239,232,0.4)", backgroundImage: "none", cursor: "default" }}
          >
            <ShareIcon className="h-3.5 w-3.5 shrink-0" />
            {t.businessCard.shareContact}
          </a>
        </div>
      </div>
    </main>
  );
}
