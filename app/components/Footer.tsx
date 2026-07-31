"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/app/lib/language/LanguageContext";
import { useIsMobile } from "@/app/lib/useIsMobile";

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
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

function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.4" />
      <path d="m4 6.5 8 6.2 8-6.2" />
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

function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 3.2 14.9 9l6.4.9-4.65 4.5 1.1 6.4L12 17.7l-5.75 3.1 1.1-6.4L2.7 9.9 9.1 9 12 3.2Z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/eliteone+spa+Massage+Parlour/@45.5112597,-73.5688669,17z/data=!3m1!4b1!4m6!3m5!1s0x4cc91b9e18711249:0xa948201bcf1b2c91!8m2!3d45.511256!4d-73.566292!16s%2Fg%2F11h4mrlf31";

const footerLinkStyle: React.CSSProperties = {
  backgroundImage: "none",
};

const footerLinkTextClass =
  "text-[rgba(244,239,232,0.72)] transition-colors duration-[350ms] ease-out";

function FooterLink({
  href,
  children,
  disabled,
}: {
  href: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <a
      href={href}
      aria-disabled={disabled || undefined}
      onClick={disabled ? (e) => e.preventDefault() : undefined}
      className={`group/link relative inline-flex items-center gap-1.5 text-sm no-underline transition-all duration-[350ms] ease-out hover:translate-x-[3px] hover:text-[var(--color-champagne-soft)] ${footerLinkTextClass}`}
      style={footerLinkStyle}
    >
      <span className="relative">
        {children}
        <span
          className="absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-[350ms] ease-out group-hover/link:w-full"
          style={{ backgroundImage: "linear-gradient(90deg, var(--color-champagne), transparent)" }}
        />
      </span>
      <ArrowIcon className="h-3 w-3 shrink-0 -translate-x-1 text-[var(--color-champagne)] opacity-0 transition-all duration-[350ms] ease-out group-hover/link:translate-x-0 group-hover/link:opacity-100" />
    </a>
  );
}

function LegalLink({
  href,
  children,
  disabled,
}: {
  href: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <a
      href={href}
      aria-disabled={disabled || undefined}
      onClick={disabled ? (e) => e.preventDefault() : undefined}
      className="footer-legal-link text-[0.72rem] tracking-[0.02em]"
      style={footerLinkStyle}
    >
      {children}
    </a>
  );
}

export default function Footer() {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const telHref = `tel:${t.contact.numberHref}`;
  const mailHref = `mailto:${t.footer.email}`;
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { margin: "200px 0px 200px 0px" });
  const animateHalos = !prefersReducedMotion && !isMobile && isInView;

  const trustItems = [
    { icon: StarIcon, label: t.footer.trust.rating },
    { icon: CheckIcon, label: t.footer.trust.discreet },
    { icon: CheckIcon, label: t.footer.trust.downtown },
    { icon: CheckIcon, label: t.footer.trust.adultsOnly },
    { icon: CheckIcon, label: t.footer.trust.openDaily },
  ];

  const fadeUp = {
    "data-reveal": true,
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  };

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-[var(--color-black)] pt-14 pb-32 sm:pt-18 sm:pb-32 xl:pb-10"
    >
      {/* Continuity veil — picks up the dark tail of the previous section */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-32 sm:h-44"
        style={{
          backgroundImage: "linear-gradient(180deg, rgba(20,11,16,0.5) 0%, transparent 100%)",
        }}
      />

      {/* Base gradient — black, plum, bordeaux, cinematic and consistent with the rest of the site */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 60% 40% at 10% 0%, rgba(74,22,38,0.36), transparent 70%)",
            "radial-gradient(ellipse 55% 38% at 95% 15%, rgba(42,20,32,0.34), transparent 68%)",
            "linear-gradient(180deg, var(--color-black) 0%, rgba(20,11,16,0.96) 30%, rgba(20,11,16,0.98) 100%)",
          ].join(", "),
        }}
      />

      {/* Slow drifting halos, matching the site's cinematic backdrop language */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <motion.div
          className="absolute -left-[8%] top-[-10%] h-[46%] w-[40%] min-h-[320px]"
          style={{
            background: "radial-gradient(ellipse, rgba(100,40,72,0.36) 0%, transparent 72%)",
            filter: "blur(80px)",
          }}
          animate={
            animateHalos
              ? { x: ["0%", "3%", "-2%", "0%"], y: ["0%", "-2%", "2%", "0%"] }
              : undefined
          }
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-[10%] bottom-[-10%] h-[42%] w-[38%] min-h-[300px]"
          style={{
            background: "radial-gradient(ellipse, rgba(150,45,80,0.3) 0%, transparent 72%)",
            filter: "blur(80px)",
          }}
          animate={
            animateHalos
              ? { x: ["0%", "-3%", "2%", "0%"], y: ["0%", "2%", "-2%", "0%"] }
              : undefined
          }
          transition={{ duration: 34, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")",
            mixBlendMode: "overlay",
          }}
        />
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 gap-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* Column 1 — brand */}
          <motion.div {...fadeUp} className="flex flex-col gap-7">
            <a
              href="#accueil"
              aria-label={t.footer.logoAria}
              className="group relative flex h-[80px] w-[270px] shrink-0 items-center"
              style={{ backgroundImage: "none" }}
            >
              <Image
                src="/logo/Logo-Elite-One-Spa.webp"
                alt="Elite One Spa"
                fill
                sizes="270px"
                className="origin-left object-contain object-left transition-[transform,filter] duration-[350ms] ease-out [filter:drop-shadow(0_0_0_rgba(232,120,150,0))_brightness(1)] group-hover:scale-[1.06] group-hover:[filter:drop-shadow(0_0_14px_rgba(232,120,150,0.5))_drop-shadow(0_0_26px_rgba(120,35,65,0.35))_brightness(1.08)]"
              />
            </a>
            <p className="max-w-[42ch] text-[0.88rem] leading-[1.9] text-[var(--color-text-muted)]">
              {t.footer.tagline}
            </p>
          </motion.div>

          {/* Column 2 — contact */}
          <motion.div {...fadeUp} className="flex flex-col gap-5">
            <h3 className="eyebrow !text-[0.68rem] !tracking-[0.24em]">{t.footer.contactTitle}</h3>
            <ul className="flex flex-col gap-3.5">
              <li className="group flex items-start gap-3 transition-transform duration-[350ms] ease-out hover:translate-x-[3px]">
                <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-champagne)] transition-all duration-[350ms] ease-out [filter:drop-shadow(0_0_0_rgba(232,120,150,0))] group-hover:text-[#e8a0b0] group-hover:[filter:drop-shadow(0_0_6px_rgba(232,120,150,0.55))]" />
                <a
                  href={telHref}
                  aria-label={t.contact.callAria}
                  className={`text-sm no-underline group-hover:text-[var(--color-champagne-soft)] ${footerLinkTextClass}`}
                  style={footerLinkStyle}
                >
                  {t.contact.number}
                </a>
              </li>
              <li className="group flex items-start gap-3 transition-transform duration-[350ms] ease-out hover:translate-x-[3px]">
                <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-champagne)] transition-all duration-[350ms] ease-out [filter:drop-shadow(0_0_0_rgba(232,120,150,0))] group-hover:text-[#e8a0b0] group-hover:[filter:drop-shadow(0_0_6px_rgba(232,120,150,0.55))]" />
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.footer.addressAria}
                  className={`text-sm leading-[1.6] no-underline group-hover:text-[var(--color-champagne-soft)] ${footerLinkTextClass}`}
                  style={footerLinkStyle}
                >
                  {t.footer.address}
                </a>
              </li>
              <li className="group flex items-start gap-3 transition-transform duration-[350ms] ease-out hover:translate-x-[3px]">
                <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-champagne)] transition-all duration-[350ms] ease-out [filter:drop-shadow(0_0_0_rgba(232,120,150,0))] group-hover:text-[#e8a0b0] group-hover:[filter:drop-shadow(0_0_6px_rgba(232,120,150,0.55))]" />
                <a
                  href={mailHref}
                  aria-label={t.footer.emailAria}
                  className={`text-sm no-underline group-hover:text-[var(--color-champagne-soft)] ${footerLinkTextClass}`}
                  style={footerLinkStyle}
                >
                  {t.footer.email}
                </a>
              </li>
              <li className="group flex items-start gap-3 transition-transform duration-[350ms] ease-out hover:translate-x-[3px]">
                <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-champagne)] transition-all duration-[350ms] ease-out [filter:drop-shadow(0_0_0_rgba(232,120,150,0))] group-hover:text-[#e8a0b0] group-hover:[filter:drop-shadow(0_0_6px_rgba(232,120,150,0.55))]" />
                <span className="text-sm leading-[1.6] text-[var(--color-text-muted)] transition-colors duration-[350ms] ease-out group-hover:text-[var(--color-champagne-soft)]">
                  {t.footer.hoursValue}
                </span>
              </li>
            </ul>
          </motion.div>

          {/* Column 3 — quick links */}
          <motion.div {...fadeUp} className="flex flex-col gap-5">
            <h3 className="eyebrow !text-[0.68rem] !tracking-[0.24em]">{t.footer.linksTitle}</h3>
            <ul className="flex flex-col gap-3.5">
              {t.nav.links.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4 — trust badges + booking */}
          <motion.div {...fadeUp} className="flex flex-col gap-5">
            <h3 className="eyebrow !text-[0.68rem] !tracking-[0.24em]">{t.footer.trustTitle}</h3>
            <ul className="flex flex-col gap-3">
              {trustItems.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="group flex items-center gap-2.5 transition-transform duration-[350ms] ease-out hover:translate-x-1"
                >
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[rgba(232,120,150,0.32)] bg-[rgba(232,120,150,0.08)] transition-all duration-[350ms] ease-out group-hover:border-[rgba(232,120,150,0.65)] group-hover:bg-[rgba(232,120,150,0.16)] group-hover:shadow-[0_0_10px_rgba(232,120,150,0.45)]"
                  >
                    <Icon className="h-2.5 w-2.5 text-[var(--color-champagne)] transition-colors duration-[350ms] ease-out group-hover:text-[var(--color-champagne-soft)]" />
                  </span>
                  <span className="text-[0.82rem] text-[var(--color-offwhite)] transition-colors duration-[350ms] ease-out group-hover:text-[var(--color-champagne-soft)]">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
            <motion.a
              href="tel:+15145438344"
              aria-label={t.footer.bookAppointmentAria}
              whileHover={
                prefersReducedMotion ? undefined : { scale: 1.02, y: -2 }
              }
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="btn btn-primary mt-2 w-fit"
            >
              {t.footer.bookAppointment}
            </motion.a>
          </motion.div>
        </div>

        {/* Fine separator */}
        <div
          className="mt-16 h-px w-full sm:mt-20"
          style={{
            backgroundImage:
              "linear-gradient(90deg, transparent, rgba(244,239,232,0.14) 50%, transparent)",
          }}
        />

        <div className="mt-8 flex flex-col items-center gap-1.5 text-center">
          <p className="text-[0.72rem] tracking-[0.02em] text-[var(--color-text-muted)]">
            © 2026 Elite One Spa. All rights reserved.
          </p>
          <p className="text-[0.72rem] tracking-[0.02em] text-[var(--color-text-muted)]">
            Created by Brochu Digital
          </p>
          <div className="mt-2 flex items-center gap-6">
            <LegalLink href="#" disabled>{t.footer.links.privacy}</LegalLink>
            <LegalLink href="#" disabled>{t.footer.links.terms}</LegalLink>
            <LegalLink href="/business-card">{t.footer.links.saveContact}</LegalLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
