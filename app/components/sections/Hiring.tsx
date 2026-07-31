"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/app/lib/language/LanguageContext";
import { useIsMobile } from "@/app/lib/useIsMobile";

type Errors = Partial<
  Record<"fullName" | "phone" | "email" | "availability" | "age" | "consent", string>
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+()\-.\s]{7,}$/;

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 3.5 19 6v6c0 5-3.4 8.4-7 9.5-3.6-1.1-7-4.5-7-9.5V6l7-2.5Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2.2" />
      <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2.2" />
    </svg>
  );
}

function CompassIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15 9-2 4.5-4.5 2L10.5 11 15 9Z" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 19.5s-6.7-4.1-9-8.4C1.3 7.6 3 4.7 6.1 4.7c1.8 0 3.2 1.1 3.9 2.2.7-1.1 2.1-2.2 3.9-2.2 3.1 0 4.8 2.9 3.1 6.4-2.3 4.3-9 8.4-9 8.4Z" />
    </svg>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 3.5 13.3 8l4.7 1.3-4.7 1.3L12 15l-1.3-4.4L6 9.3 10.7 8 12 3.5Z" />
      <path d="M18.5 15.5 19.2 18l2.3.8-2.3.8-.7 2.4-.8-2.4-2.2-.8 2.2-.8.8-2.5Z" />
    </svg>
  );
}

const HIGHLIGHT_ICONS = [ShieldIcon, LockIcon, ClockIcon, CompassIcon, HeartIcon, SparkleIcon];

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function FieldLabel({
  htmlFor,
  children,
  optionalTag,
}: {
  htmlFor: string;
  children: React.ReactNode;
  optionalTag?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 flex items-baseline justify-between gap-3 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[var(--color-champagne-soft)]"
    >
      <span>{children}</span>
      {optionalTag && (
        <span className="text-[0.6rem] font-normal normal-case tracking-normal text-[var(--color-text-muted)]">
          {optionalTag}
        </span>
      )}
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

export default function Hiring() {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const uid = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: "200px 0px 200px 0px" });
  const animateHalos = !prefersReducedMotion && !isMobile && isInView;

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [availability, setAvailability] = useState("");
  const [experience, setExperience] = useState("");
  const [message, setMessage] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const f = t.hiring.form;
  const ids = {
    fullName: `${uid}-fullName`,
    phone: `${uid}-phone`,
    email: `${uid}-email`,
    availability: `${uid}-availability`,
    experience: `${uid}-experience`,
    message: `${uid}-message`,
    age: `${uid}-age`,
    consent: `${uid}-consent`,
  };

  function validate(): Errors {
    const next: Errors = {};
    if (!fullName.trim()) next.fullName = f.errors.required;
    if (!phone.trim()) next.phone = f.errors.required;
    else if (!PHONE_PATTERN.test(phone.trim())) next.phone = f.errors.invalidPhone;
    if (!email.trim()) next.email = f.errors.required;
    else if (!EMAIL_PATTERN.test(email.trim())) next.email = f.errors.invalidEmail;
    if (!availability.trim()) next.availability = f.errors.required;
    if (!ageConfirmed) next.age = f.errors.ageRequired;
    if (!consent) next.consent = f.errors.consentRequired;
    return next;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const subject = "Elite One Spa - Job Application";
    const body = [
      `${f.fields.fullName.label}: ${fullName.trim()}`,
      `${f.fields.phone.label}: ${phone.trim()}`,
      `${f.fields.email.label}: ${email.trim()}`,
      `${f.fields.availability.label}: ${availability.trim()}`,
      `${f.fields.experience.label}: ${experience.trim() || "-"}`,
      `${f.fields.message.label}: ${message.trim() || "-"}`,
    ].join("\n");
    const mailtoUrl = `mailto:info@eliteonespa.ca?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setStatus("submitting");
    window.location.href = mailtoUrl;
    window.setTimeout(() => {
      setStatus("success");
    }, 900);
  }

  function resetForm() {
    setFullName("");
    setPhone("");
    setEmail("");
    setAvailability("");
    setExperience("");
    setMessage("");
    setAgeConfirmed(false);
    setConsent(false);
    setErrors({});
    setStatus("idle");
  }

  return (
    <section
      ref={sectionRef}
      id="carrieres"
      className="relative overflow-hidden bg-[var(--color-black)] py-14 sm:py-18"
    >
      {/* Continuity veil — picks up the dark tail of the previous scene */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-32 sm:h-44"
        style={{
          backgroundImage: "linear-gradient(180deg, var(--color-black) 0%, transparent 100%)",
        }}
      />

      {/* Base gradient — black, plum, bordeaux */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 70% 40% at 12% 8%, rgba(74,22,38,0.4), transparent 72%)",
            "radial-gradient(ellipse 65% 45% at 90% 92%, rgba(42,20,32,0.42), transparent 70%)",
            "linear-gradient(180deg, var(--color-black) 0%, rgba(20,11,16,0.94) 14%, rgba(32,15,22,0.9) 46%, rgba(20,11,16,0.95) 82%, var(--color-black) 100%)",
          ].join(", "),
        }}
      />

      {/* Cinematic halos — rose & bordeaux, drifting slowly */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <motion.div
          className="absolute -left-[8%] top-[6%] h-[40%] w-[42%] min-h-[360px]"
          style={{
            background: "radial-gradient(ellipse, rgba(150,45,80,0.42) 0%, rgba(150,45,80,0.2) 46%, transparent 74%)",
            borderRadius: "48% 52% 40% 60% / 56% 44% 62% 38%",
            filter: "blur(72px)",
          }}
          animate={
            animateHalos
              ? { x: ["0%", "3%", "-2%", "0%"], y: ["0%", "-3%", "2%", "0%"] }
              : undefined
          }
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-[10%] bottom-[2%] h-[42%] w-[44%] min-h-[380px]"
          style={{
            background: "radial-gradient(ellipse, rgba(100,40,72,0.46) 0%, rgba(100,40,72,0.22) 46%, transparent 74%)",
            borderRadius: "56% 44% 62% 38% / 46% 55% 45% 54%",
            filter: "blur(74px)",
          }}
          animate={
            animateHalos
              ? { x: ["0%", "-3%", "2%", "0%"], y: ["0%", "3%", "-2%", "0%"] }
              : undefined
          }
          transition={{ duration: 32, repeat: Infinity, ease: "easeInOut", delay: 5 }}
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
              {t.hiring.eyebrow}
            </motion.p>
            <motion.h2
              data-reveal
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[18ch] text-balance"
            >
              {t.hiring.title}
            </motion.h2>

            <p className="mt-9 max-w-[54ch] text-base leading-[1.9] sm:text-lg">
              {t.hiring.paragraph}
            </p>

            <div
              className="mt-6 max-w-[54ch] rounded-[var(--radius-md)] border px-5 py-4 text-sm leading-[1.8]"
              style={{
                borderColor: "rgba(232,201,171,0.28)",
                backgroundColor: "rgba(232,201,171,0.06)",
                color: "var(--color-champagne-soft)",
              }}
            >
              {t.hiring.paragraph2}
            </div>

            {/* Highlights */}
            <div className="mt-10 flex flex-col gap-5">
              {t.hiring.highlights.map((item, index) => {
                const Icon = HIGHLIGHT_ICONS[index % HIGHLIGHT_ICONS.length];
                return (
                  <motion.div
                    key={item.title}
                    data-reveal
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.7, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
                    className="group relative -m-2.5 flex cursor-default items-start gap-4 rounded-[var(--radius-md)] p-2.5 transition-transform duration-[350ms] ease-out hover:translate-x-1 motion-reduce:transition-none motion-reduce:hover:translate-x-0"
                  >
                    <div
                      className="pointer-events-none absolute inset-0 -z-10 rounded-[var(--radius-md)] opacity-0 blur-xl transition-opacity duration-[350ms] ease-out group-hover:opacity-100 motion-reduce:transition-none"
                      style={{
                        background:
                          "radial-gradient(ellipse 90% 100% at 18% 50%, rgba(232,120,150,0.16), transparent 75%)",
                      }}
                    />
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(232,120,150,0.3)] bg-[rgba(232,120,150,0.08)] transition-all duration-[350ms] ease-out group-hover:border-[rgba(232,120,150,0.65)] group-hover:bg-[rgba(232,120,150,0.18)] group-hover:shadow-[0_0_20px_rgba(232,90,140,0.5)] motion-reduce:transition-none"
                    >
                      <Icon className="h-4.5 w-4.5 text-[var(--color-champagne-soft)] transition-transform duration-[350ms] ease-out group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
                    </span>
                    <div>
                      <p className="hiring-highlight-title text-sm font-medium sm:text-[0.95rem]">
                        {item.title}
                      </p>
                      <p className="hiring-highlight-desc mt-1 max-w-[46ch] text-[0.82rem] leading-[1.75]">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <p
              className="relative mt-11 max-w-[46ch] pl-6 font-[var(--font-heading)] text-lg italic text-[var(--color-champagne-soft)] sm:text-xl"
              style={{ letterSpacing: "0.01em" }}
            >
              <span
                className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-px"
                style={{
                  backgroundImage: "linear-gradient(to bottom, transparent, rgba(232,201,171,0.6), transparent)",
                }}
              />
              {t.hiring.note}
            </p>
          </motion.div>

          {/* Right — application form */}
          <motion.div
            data-reveal
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[var(--radius-lg)] opacity-80 blur-[50px]"
              style={{
                background: "radial-gradient(ellipse 70% 70% at 50% 30%, rgba(232,120,150,0.22), transparent 72%)",
              }}
            />
            <div
              className="relative overflow-hidden rounded-[var(--radius-lg)] border p-7 backdrop-blur-2xl sm:p-9"
              style={{
                borderColor: "rgba(232,120,150,0.24)",
                backgroundColor: "rgba(20,11,16,0.58)",
                boxShadow: "0 30px 80px rgba(5,4,5,0.5), 0 0 50px rgba(232,120,150,0.12), inset 0 0 30px rgba(150,45,80,0.06)",
              }}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                  backgroundImage: "linear-gradient(90deg, transparent, rgba(232,201,171,0.45) 50%, transparent)",
                }}
              />

              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-start py-6 text-left"
                >
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-full border"
                    style={{ borderColor: "rgba(232,201,171,0.5)", backgroundColor: "rgba(232,201,171,0.14)" }}
                  >
                    <CheckIcon className="h-5 w-5 text-[var(--color-champagne-soft)]" />
                  </span>
                  <h3 className="mt-5 text-2xl">{f.successTitle}</h3>
                  <p className="mt-3 max-w-[46ch] text-sm leading-[1.85] text-[var(--color-text-muted)]">
                    {f.successMessage}
                  </p>
                  <button type="button" onClick={resetForm} className="btn btn-secondary mt-7">
                    {f.resetCta}
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                  <div>
                    <h3 className="text-2xl">{f.title}</h3>
                    <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">{f.subtitle}</p>
                  </div>

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
                    <FieldLabel htmlFor={ids.availability}>{f.fields.availability.label}</FieldLabel>
                    <input
                      id={ids.availability}
                      type="text"
                      value={availability}
                      onChange={(e) => {
                        setAvailability(e.target.value);
                        if (errors.availability) setErrors((prev) => ({ ...prev, availability: undefined }));
                      }}
                      placeholder={f.fields.availability.placeholder}
                      aria-invalid={!!errors.availability}
                      aria-describedby={errors.availability ? `${ids.availability}-error` : undefined}
                      className="w-full rounded-[var(--radius-sm)] border px-4 py-3 text-sm input-field"
                      style={errors.availability ? inputErrorStyle : inputBaseStyle}
                    />
                    {errors.availability && (
                      <ErrorText id={`${ids.availability}-error`}>{errors.availability}</ErrorText>
                    )}
                  </div>

                  <div>
                    <FieldLabel htmlFor={ids.experience} optionalTag={f.fields.experience.optionalTag}>
                      {f.fields.experience.label}
                    </FieldLabel>
                    <textarea
                      id={ids.experience}
                      rows={2}
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder={f.fields.experience.placeholder}
                      className="w-full resize-none rounded-[var(--radius-sm)] border px-4 py-3 text-sm input-field"
                      style={inputBaseStyle}
                    />
                  </div>

                  <div>
                    <FieldLabel htmlFor={ids.message}>{f.fields.message.label}</FieldLabel>
                    <textarea
                      id={ids.message}
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={f.fields.message.placeholder}
                      className="w-full resize-none rounded-[var(--radius-sm)] border px-4 py-3 text-sm input-field"
                      style={inputBaseStyle}
                    />
                  </div>

                  <div
                    className="mt-1 flex flex-col gap-4 rounded-[var(--radius-md)] border px-5 py-5"
                    style={{ borderColor: "var(--color-border)", backgroundColor: "rgba(244,239,232,0.03)" }}
                  >
                    <div>
                      <label htmlFor={ids.age} className="flex cursor-pointer items-start gap-3 py-1.5 text-sm text-[var(--color-offwhite)] xl:py-0">
                        <span
                          className="checkbox-box relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border"
                          style={{
                            borderColor: ageConfirmed ? "rgba(232,120,150,0.7)" : "var(--color-border)",
                            backgroundColor: ageConfirmed ? "rgba(232,120,150,0.18)" : "rgba(244,239,232,0.03)",
                          }}
                        >
                          <input
                            id={ids.age}
                            type="checkbox"
                            checked={ageConfirmed}
                            onChange={(e) => {
                              setAgeConfirmed(e.target.checked);
                              if (errors.age) setErrors((prev) => ({ ...prev, age: undefined }));
                            }}
                            aria-invalid={!!errors.age}
                            aria-describedby={errors.age ? `${ids.age}-error` : undefined}
                            className="checkbox-input absolute inset-0 h-full w-full cursor-pointer opacity-0"
                          />
                          {ageConfirmed && <CheckIcon className="h-3 w-3 text-[var(--color-champagne-soft)]" />}
                        </span>
                        <span className="leading-snug">{f.fields.ageConfirm.label}</span>
                      </label>
                      {errors.age && <ErrorText id={`${ids.age}-error`}>{errors.age}</ErrorText>}
                    </div>

                    <div>
                      <label htmlFor={ids.consent} className="flex cursor-pointer items-start gap-3 py-1.5 text-sm text-[var(--color-offwhite)] xl:py-0">
                        <span
                          className="checkbox-box relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border"
                          style={{
                            borderColor: consent ? "rgba(232,120,150,0.7)" : "var(--color-border)",
                            backgroundColor: consent ? "rgba(232,120,150,0.18)" : "rgba(244,239,232,0.03)",
                          }}
                        >
                          <input
                            id={ids.consent}
                            type="checkbox"
                            checked={consent}
                            onChange={(e) => {
                              setConsent(e.target.checked);
                              if (errors.consent) setErrors((prev) => ({ ...prev, consent: undefined }));
                            }}
                            aria-invalid={!!errors.consent}
                            aria-describedby={errors.consent ? `${ids.consent}-error` : undefined}
                            className="checkbox-input absolute inset-0 h-full w-full cursor-pointer opacity-0"
                          />
                          {consent && <CheckIcon className="h-3 w-3 text-[var(--color-champagne-soft)]" />}
                        </span>
                        <span className="leading-snug">{f.fields.consent.label}</span>
                      </label>
                      {errors.consent && <ErrorText id={`${ids.consent}-error`}>{errors.consent}</ErrorText>}
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={status === "submitting"}
                    aria-busy={status === "submitting"}
                    whileHover={prefersReducedMotion || status === "submitting" ? undefined : { scale: 1.015, y: -2 }}
                    whileTap={status === "submitting" ? undefined : { scale: 0.98 }}
                    className="btn btn-primary mt-2 w-full disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "submitting" ? f.submitting : f.submit}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
