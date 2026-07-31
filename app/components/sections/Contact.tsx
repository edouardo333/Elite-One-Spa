"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/app/lib/language/LanguageContext";
import { useIsMobile } from "@/app/lib/useIsMobile";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/eliteone+spa+Massage+Parlour/@45.5112597,-73.5688669,17z/data=!3m1!4b1!4m6!3m5!1s0x4cc91b9e18711249:0xa948201bcf1b2c91!8m2!3d45.511256!4d-73.566292!16s%2Fg%2F11h4mrlf31";

const GOOGLE_MAPS_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(
  "Elite One Spa Massage Parlour, 1621 St-Laurent Blvd, Montréal, QC",
)}&z=16&output=embed`;

type Errors = Partial<Record<"fullName" | "phone" | "email" | "subject" | "message", string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+()\-.\s]{7,}$/;

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 10.5c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10.5" r="2.6" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
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

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 3.5 19 6v6c0 5-3.4 8.4-7 9.5-3.6-1.1-7-4.5-7-9.5V6l7-2.5Z" />
      <path d="M9 12l2 2 4-4" />
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

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[var(--color-champagne-soft)]"
    >
      {children}
    </label>
  );
}

function ErrorText({ id, children }: { id: string; children: string }) {
  return (
    <p id={id} role="alert" className="mt-1.5 text-[0.72rem] leading-snug text-[#f0a3b4]">
      {children}
    </p>
  );
}

const inputBaseStyle: React.CSSProperties = {
  borderColor: "var(--color-border)",
  backgroundColor: "rgba(244,239,232,0.03)",
  color: "var(--color-offwhite)",
};

const inputErrorStyle: React.CSSProperties = {
  borderColor: "rgba(240,163,180,0.6)",
  backgroundColor: "rgba(240,163,180,0.06)",
};

const infoLinkStyle: React.CSSProperties = {
  backgroundImage: "none",
  color: "var(--color-offwhite)",
};

export default function Contact() {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const uid = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: "200px 0px 200px 0px" });
  const animateHalos = !prefersReducedMotion && !isMobile && isInView;
  // The Google Maps embed pulls its own third-party JS/CSS payload as soon as
  // the iframe exists in the DOM — `loading="lazy"` alone didn't defer it in
  // practice (it started fetching within ~30ms of page load, regardless of
  // scroll position). Gating actual iframe creation behind a one-time
  // "near viewport" check means it's never created at all until the user is
  // close to scrolling it into view.
  const mapNearViewport = useInView(sectionRef, { margin: "400px 0px 400px 0px", once: true });

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const f = t.contactSection.form;
  const telHref = `tel:${t.contact.numberHref}`;
  const mailHref = `mailto:${t.footer.email}`;
  const ids = {
    fullName: `${uid}-fullName`,
    phone: `${uid}-phone`,
    email: `${uid}-email`,
    subject: `${uid}-subject`,
    message: `${uid}-message`,
  };

  function validate(): Errors {
    const next: Errors = {};
    if (!fullName.trim()) next.fullName = f.errors.required;
    if (!phone.trim()) next.phone = f.errors.required;
    else if (!PHONE_PATTERN.test(phone.trim())) next.phone = f.errors.invalidPhone;
    if (!email.trim()) next.email = f.errors.required;
    else if (!EMAIL_PATTERN.test(email.trim())) next.email = f.errors.invalidEmail;
    if (!subject.trim()) next.subject = f.errors.required;
    if (!message.trim()) next.message = f.errors.required;
    return next;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const emailSubject = `Elite One Spa — ${subject.trim()}`;
    const body = [
      `${f.fields.fullName.label}: ${fullName.trim()}`,
      `${f.fields.phone.label}: ${phone.trim()}`,
      `${f.fields.email.label}: ${email.trim()}`,
      `${f.fields.subject.label}: ${subject.trim()}`,
      "",
      `${f.fields.message.label}:`,
      message.trim(),
    ].join("\n");

    window.location.href = `mailto:info@eliteonespa.ca?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(body)}`;
  }

  const fadeUp = {
    "data-reveal": true,
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden bg-[var(--color-black)] py-14 sm:py-18"
    >
      {/* Continuity veil — picks up the dark tail of the previous section */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-32 sm:h-44"
        style={{
          backgroundImage: "linear-gradient(180deg, var(--color-black) 0%, transparent 100%)",
        }}
      />

      {/* Base gradient — black, plum, bordeaux, cinematic and consistent with the rest of the site */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 65% 42% at 10% 6%, rgba(74,22,38,0.38), transparent 72%)",
            "radial-gradient(ellipse 60% 42% at 92% 94%, rgba(42,20,32,0.4), transparent 70%)",
            "linear-gradient(180deg, var(--color-black) 0%, rgba(20,11,16,0.94) 16%, rgba(32,15,22,0.88) 48%, rgba(20,11,16,0.95) 82%, var(--color-black) 100%)",
          ].join(", "),
        }}
      />

      {/* Slow drifting halos, matching the site's cinematic backdrop language */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <motion.div
          className="absolute -left-[8%] top-[4%] h-[42%] w-[40%] min-h-[340px]"
          style={{
            background: "radial-gradient(ellipse, rgba(150,45,80,0.36) 0%, transparent 72%)",
            filter: "blur(76px)",
          }}
          animate={
            animateHalos
              ? { x: ["0%", "3%", "-2%", "0%"], y: ["0%", "-2%", "2%", "0%"] }
              : undefined
          }
          transition={{ duration: 29, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-[10%] bottom-[0%] h-[42%] w-[42%] min-h-[340px]"
          style={{
            background: "radial-gradient(ellipse, rgba(100,40,72,0.38) 0%, transparent 72%)",
            filter: "blur(78px)",
          }}
          animate={
            animateHalos
              ? { x: ["0%", "-3%", "2%", "0%"], y: ["0%", "2%", "-2%", "0%"] }
              : undefined
          }
          transition={{ duration: 33, repeat: Infinity, ease: "easeInOut", delay: 5 }}
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
        <div className="grid grid-cols-1 items-stretch gap-14 lg:grid-cols-2 lg:gap-14">
          {/* Left — presentation + form */}
          <motion.div {...fadeUp} className="relative flex h-full flex-col">
            <div
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[var(--radius-lg)] opacity-70 blur-[50px]"
              style={{
                background: "radial-gradient(ellipse 70% 70% at 50% 20%, rgba(232,120,150,0.18), transparent 72%)",
              }}
            />
            <div
              className="relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border p-7 backdrop-blur-2xl sm:p-9"
              style={{
                borderColor: "rgba(232,120,150,0.24)",
                backgroundColor: "rgba(20,11,16,0.58)",
                boxShadow: "0 30px 80px rgba(5,4,5,0.5), 0 0 50px rgba(232,120,150,0.1), inset 0 0 30px rgba(150,45,80,0.06)",
              }}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                  backgroundImage: "linear-gradient(90deg, transparent, rgba(232,201,171,0.45) 50%, transparent)",
                }}
              />

              <p className="eyebrow">{t.contactSection.eyebrow}</p>
              <h2 className="mt-4 max-w-[18ch] text-balance">{t.contactSection.title}</h2>
              <p className="mt-5 max-w-[52ch] text-sm leading-[1.85] sm:text-[0.95rem]">
                {t.contactSection.paragraph}
              </p>

              <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-1 flex-col gap-5">
                <div>
                  <FieldLabel htmlFor={ids.fullName}>{f.fields.fullName.label}</FieldLabel>
                  <input
                    id={ids.fullName}
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                    }}
                    placeholder={f.fields.fullName.placeholder}
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? `${ids.fullName}-error` : undefined}
                    className="w-full rounded-[var(--radius-sm)] border px-4 py-3 text-sm input-field"
                    style={errors.fullName ? inputErrorStyle : inputBaseStyle}
                  />
                  {errors.fullName && <ErrorText id={`${ids.fullName}-error`}>{errors.fullName}</ErrorText>}
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor={ids.phone}>{f.fields.phone.label}</FieldLabel>
                    <input
                      id={ids.phone}
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                      }}
                      placeholder={f.fields.phone.placeholder}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? `${ids.phone}-error` : undefined}
                      className="w-full rounded-[var(--radius-sm)] border px-4 py-3 text-sm input-field"
                      style={errors.phone ? inputErrorStyle : inputBaseStyle}
                    />
                    {errors.phone && <ErrorText id={`${ids.phone}-error`}>{errors.phone}</ErrorText>}
                  </div>

                  <div>
                    <FieldLabel htmlFor={ids.email}>{f.fields.email.label}</FieldLabel>
                    <input
                      id={ids.email}
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      placeholder={f.fields.email.placeholder}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? `${ids.email}-error` : undefined}
                      className="w-full rounded-[var(--radius-sm)] border px-4 py-3 text-sm input-field"
                      style={errors.email ? inputErrorStyle : inputBaseStyle}
                    />
                    {errors.email && <ErrorText id={`${ids.email}-error`}>{errors.email}</ErrorText>}
                  </div>
                </div>

                <div>
                  <FieldLabel htmlFor={ids.subject}>{f.fields.subject.label}</FieldLabel>
                  <input
                    id={ids.subject}
                    type="text"
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value);
                      if (errors.subject) setErrors((prev) => ({ ...prev, subject: undefined }));
                    }}
                    placeholder={f.fields.subject.placeholder}
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? `${ids.subject}-error` : undefined}
                    className="w-full rounded-[var(--radius-sm)] border px-4 py-3 text-sm input-field"
                    style={errors.subject ? inputErrorStyle : inputBaseStyle}
                  />
                  {errors.subject && <ErrorText id={`${ids.subject}-error`}>{errors.subject}</ErrorText>}
                </div>

                <div className="flex flex-1 flex-col">
                  <FieldLabel htmlFor={ids.message}>{f.fields.message.label}</FieldLabel>
                  <textarea
                    id={ids.message}
                    rows={4}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                    }}
                    placeholder={f.fields.message.placeholder}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? `${ids.message}-error` : undefined}
                    className="w-full flex-1 resize-none rounded-[var(--radius-sm)] border px-4 py-3 text-sm input-field"
                    style={errors.message ? inputErrorStyle : inputBaseStyle}
                  />
                  {errors.message && <ErrorText id={`${ids.message}-error`}>{errors.message}</ErrorText>}
                </div>

                <motion.button
                  type="submit"
                  whileHover={prefersReducedMotion || isMobile ? undefined : { scale: 1.015, y: -2 }}
                  whileTap={isMobile ? undefined : { scale: 0.98 }}
                  className="btn btn-primary mt-2 w-full"
                >
                  {f.submit}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Right — map + info */}
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="relative flex h-full flex-col"
          >
            <div
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[var(--radius-lg)] opacity-70 blur-[50px]"
              style={{
                background: "radial-gradient(ellipse 70% 70% at 50% 30%, rgba(232,120,150,0.16), transparent 72%)",
              }}
            />
            <motion.div
              whileHover={prefersReducedMotion || isMobile ? undefined : { y: -3 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border backdrop-blur-2xl"
              style={{
                borderColor: "rgba(232,120,150,0.24)",
                backgroundColor: "rgba(20,11,16,0.58)",
                boxShadow: "0 30px 80px rgba(5,4,5,0.5), 0 0 50px rgba(232,120,150,0.1), inset 0 0 30px rgba(150,45,80,0.06)",
              }}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px"
                style={{
                  backgroundImage: "linear-gradient(90deg, transparent, rgba(232,201,171,0.45) 50%, transparent)",
                }}
              />

              {/* Map — the iframe itself isn't created until the section is
                  within 400px of the viewport (see mapNearViewport above),
                  so the Google Maps third-party payload never loads for
                  visitors who don't scroll this far. */}
              <div className="relative min-h-[280px] flex-1 sm:min-h-[320px]">
                {mapNearViewport ? (
                  <iframe
                    src={GOOGLE_MAPS_EMBED_SRC}
                    title={t.contactSection.mapTitle}
                    className="absolute inset-0 h-full w-full grayscale-[15%] transition-[filter] duration-500 ease-out group-hover:grayscale-0"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      backgroundImage: [
                        "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(232,120,150,0.1), transparent 70%)",
                        "linear-gradient(180deg, rgba(20,11,16,0.65) 0%, rgba(10,9,11,0.8) 100%)",
                      ].join(", "),
                    }}
                  >
                    <span style={{ color: "var(--color-champagne)" }}>
                      <PinIcon className="h-6 w-6 opacity-40" />
                    </span>
                  </div>
                )}
                {/* Subtle dark overlay to keep the map in tone with the site */}
                <div
                  className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out group-hover:opacity-60"
                  style={{
                    backgroundImage: [
                      "linear-gradient(180deg, rgba(10,9,11,0.32) 0%, transparent 22%, transparent 78%, rgba(10,9,11,0.4) 100%)",
                      "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 55%, rgba(10,9,11,0.28) 100%)",
                    ].join(", "),
                  }}
                />
              </div>

              {/* Info panel */}
              <div
                className="relative z-10 flex flex-col gap-4 border-t px-6 py-6 sm:px-7"
                style={{ borderColor: "rgba(232,201,171,0.16)" }}
              >
                <ul className="flex flex-col gap-3">
                  <li className="group/item flex items-start gap-3 transition-transform duration-[350ms] ease-out hover:translate-x-1">
                    <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-champagne)] transition-all duration-[350ms] ease-out [filter:drop-shadow(0_0_0_rgba(232,120,150,0))] group-hover/item:text-[#e8a0b0] group-hover/item:[filter:drop-shadow(0_0_6px_rgba(232,120,150,0.55))]" />
                    <a
                      href={GOOGLE_MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t.contactSection.addressAria}
                      className="text-sm leading-[1.6] no-underline transition-colors duration-[350ms] ease-out group-hover/item:text-[var(--color-champagne-soft)]"
                      style={infoLinkStyle}
                    >
                      {t.footer.address}
                    </a>
                  </li>
                  <li className="group/item flex items-start gap-3 transition-transform duration-[350ms] ease-out hover:translate-x-1">
                    <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-champagne)] transition-all duration-[350ms] ease-out [filter:drop-shadow(0_0_0_rgba(232,120,150,0))] group-hover/item:text-[#e8a0b0] group-hover/item:[filter:drop-shadow(0_0_6px_rgba(232,120,150,0.55))]" />
                    <a
                      href={telHref}
                      aria-label={t.contact.callAria}
                      className="text-sm no-underline transition-colors duration-[350ms] ease-out group-hover/item:text-[var(--color-champagne-soft)]"
                      style={infoLinkStyle}
                    >
                      {t.contact.number}
                    </a>
                  </li>
                  <li className="group/item flex items-start gap-3 transition-transform duration-[350ms] ease-out hover:translate-x-1">
                    <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-champagne)] transition-all duration-[350ms] ease-out [filter:drop-shadow(0_0_0_rgba(232,120,150,0))] group-hover/item:text-[#e8a0b0] group-hover/item:[filter:drop-shadow(0_0_6px_rgba(232,120,150,0.55))]" />
                    <a
                      href={mailHref}
                      aria-label={t.footer.emailAria}
                      className="text-sm no-underline transition-colors duration-[350ms] ease-out group-hover/item:text-[var(--color-champagne-soft)]"
                      style={infoLinkStyle}
                    >
                      {t.footer.email}
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-champagne)]" />
                    <span className="text-sm leading-[1.6] text-[var(--color-text-muted)]">
                      {t.contactSection.hoursLabel}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-champagne)]" />
                    <span className="text-sm leading-[1.6] text-[var(--color-text-muted)]">
                      {t.contactSection.ageLabel}
                    </span>
                  </li>
                </ul>

                <motion.a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.contactSection.openInMapsAria}
                  whileHover={prefersReducedMotion || isMobile ? undefined : { scale: 1.015, y: -2 }}
                  whileTap={isMobile ? undefined : { scale: 0.98 }}
                  className="group/btn btn btn-secondary mt-1 w-full"
                >
                  {t.contactSection.openInMaps}
                  <ArrowIcon className="h-3.5 w-3.5 shrink-0 -translate-x-0.5 transition-transform duration-300 ease-out group-hover/btn:translate-x-0.5" />
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
