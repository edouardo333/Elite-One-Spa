"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/app/lib/language/LanguageContext";
import { useBodyScrollLock } from "@/app/lib/useBodyScrollLock";
import { useModalFocusTrap } from "@/app/lib/useModalFocusTrap";
import LanguageSwitcher from "./LanguageSwitcher";

const EXIT_URL = "https://www.google.com";
const FADE_MS = 1100;

type GateStatus = "open" | "closing" | "closed";

interface AgeGateProps {
  /** Appelé de façon synchrone au clic, dès la validation enregistrée — avant la fin de l'animation de fermeture. */
  onValidated: () => void;
}

export default function AgeGate({ onValidated }: AgeGateProps) {
  const [status, setStatus] = useState<GateStatus>("open");
  const prefersReducedMotion = useReducedMotion();
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useBodyScrollLock(status !== "closed");
  useModalFocusTrap(dialogRef, status !== "closed");

  useEffect(() => {
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  const handleEnter = () => {
    // Aucune sauvegarde de la validation d'âge : l'Age Gate doit réapparaître à
    // chaque nouveau chargement complet du site.
    // La modale musique est montée immédiatement (sous l'Age Gate qui se referme
    // en fondu), pour un enchaînement sans coupure ni flash.
    onValidated();
    setStatus("closing");
    const delay = prefersReducedMotion ? 0 : FADE_MS;
    closeTimeout.current = setTimeout(() => setStatus("closed"), delay);
  };

  const handleLeave = () => {
    window.location.href = EXIT_URL;
  };

  if (status === "closed") return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      tabIndex={-1}
      className="fixed inset-0 z-[100] flex overflow-y-auto bg-[var(--color-black)] transition-opacity ease-[cubic-bezier(0.19,1,0.22,1)]"
      style={{
        transitionDuration: `${prefersReducedMotion ? 0 : FADE_MS}ms`,
        opacity: status === "closing" ? 0 : 1,
      }}
    >
      {/* Hero actuel, réutilisé en arrière-plan fortement flouté */}
      <div className="fixed inset-0 scale-110">
        <Image
          src="/hero/Hero-01.webp"
          alt=""
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover object-center blur-3xl"
        />
      </div>

      {/* Overlay noir profond 90-95% avec teinte rose/prune */}
      <div
        className="fixed inset-0"
        style={{ backgroundColor: "rgba(5,4,5,0.93)" }}
      />
      <div
        className="fixed inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 75% 60% at 50% 8%, rgba(74,22,38,0.4), transparent 62%)",
            "radial-gradient(ellipse 65% 55% at 85% 100%, rgba(42,20,32,0.5), transparent 62%)",
            "radial-gradient(ellipse 60% 50% at 8% 92%, rgba(74,22,38,0.34), transparent 60%)",
          ].join(", "),
        }}
      />

      {/* Sélecteur de langue, discret, coin supérieur droit */}
      <div className="fixed right-5 top-5 z-20 sm:right-8 sm:top-8">
        <LanguageSwitcher className="text-[0.62rem] opacity-70 transition-opacity duration-300 hover:opacity-100" />
      </div>

      {/* Contenu */}
      <motion.div
        className="container relative z-10 m-auto flex shrink-0 flex-col items-center px-6 py-10 text-center xl:py-0"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 1,
          delay: prefersReducedMotion ? 0 : 0.15,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <motion.div
          className="relative mb-10 aspect-[3/2] w-[150px] sm:w-[180px] md:w-[200px]"
          animate={prefersReducedMotion ? undefined : { scale: [1, 1.02, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/logo/Logo-Elite-One-Spa.webp"
            alt="Elite One Spa"
            fill
            priority
            sizes="200px"
            className="object-contain"
            style={{ filter: "drop-shadow(0 10px 32px rgba(5,4,5,0.5))" }}
          />
        </motion.div>

        <p className="eyebrow mb-6">{t.ageGate.eyebrow}</p>

        <p
          id="age-gate-title"
          className="heading-xl max-w-2xl text-balance leading-[1.25]"
          style={{ letterSpacing: "0.015em" }}
        >
          {t.ageGate.title}
        </p>

        <p className="mt-4 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-[var(--color-champagne-dark)]">
          {t.ageGate.subtitle}
        </p>

        <p className="mx-auto mt-7 max-w-md text-balance text-sm sm:text-base">
          {t.ageGate.paragraph}
        </p>

        <div className="mx-auto mt-7 max-w-md text-left">
          <p className="text-sm text-[var(--color-text-muted)]">{t.ageGate.confirmIntro}</p>
          <ul className="mt-3 flex flex-col gap-2">
            {t.ageGate.confirmItems.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm text-[var(--color-text-muted)]"
              >
                <span aria-hidden="true" className="mt-0.5 text-[var(--color-champagne)]">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
          <button
            type="button"
            onClick={handleEnter}
            className="btn btn-primary min-w-[230px]"
          >
            {t.ageGate.enter}
          </button>
          <button
            type="button"
            onClick={handleLeave}
            className="btn btn-secondary min-w-[230px]"
          >
            {t.ageGate.leave}
          </button>
        </div>

        <p className="mx-auto mt-8 max-w-sm text-balance text-xs text-[var(--color-text-muted)]">
          {t.ageGate.consent}
        </p>
      </motion.div>
    </div>
  );
}
