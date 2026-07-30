"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { setMusicConsentChoice } from "@/app/lib/musicConsent";
import { markAudioSystemUnlocked, startAmbientAudio } from "./audio/useAudio";
import { useLanguage } from "@/app/lib/language/LanguageContext";
import { useBodyScrollLock } from "@/app/lib/useBodyScrollLock";
import { useModalFocusTrap } from "@/app/lib/useModalFocusTrap";

const FADE_MS = 900;

type ModalStatus = "open" | "closing" | "closed";

interface MusicConsentModalProps {
  onDismiss: () => void;
}

export default function MusicConsentModal({ onDismiss }: MusicConsentModalProps) {
  const [status, setStatus] = useState<ModalStatus>("open");
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

  const close = () => {
    markAudioSystemUnlocked();
    setStatus("closing");
    const delay = prefersReducedMotion ? 0 : FADE_MS;
    closeTimeout.current = setTimeout(() => {
      setStatus("closed");
      onDismiss();
    }, delay);
  };

  const handleActivate = () => {
    // Démarré dans le même geste utilisateur (clic), pour satisfaire les politiques d'autoplay.
    void startAmbientAudio();
    setMusicConsentChoice("accepted");
    close();
  };

  const handleDecline = () => {
    setMusicConsentChoice("declined");
    close();
  };

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") handleDecline();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handleDecline only reads refs/state setters and the stable prefersReducedMotion/onDismiss values.
  }, []);

  if (status === "closed") return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="music-consent-title"
      tabIndex={-1}
      className="fixed inset-0 z-[90] flex overflow-y-auto transition-opacity ease-[cubic-bezier(0.19,1,0.22,1)]"
      style={{
        transitionDuration: `${prefersReducedMotion ? 0 : FADE_MS}ms`,
        opacity: status === "closing" ? 0 : 1,
      }}
    >
      {/* Hero actuel, réutilisé en arrière-plan légèrement flouté */}
      <div className="fixed inset-0 scale-110">
        <Image
          src="/hero/Hero-01.webp"
          alt=""
          fill
          loading="eager"
          quality={75}
          sizes="100vw"
          className="object-cover object-center blur-2xl"
        />
      </div>

      {/* Overlay noir/prune */}
      <div className="fixed inset-0" style={{ backgroundColor: "rgba(5,4,5,0.82)" }} />
      <div
        className="fixed inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 70% 55% at 50% 8%, rgba(74,22,38,0.36), transparent 62%)",
            "radial-gradient(ellipse 60% 50% at 88% 100%, rgba(42,20,32,0.44), transparent 62%)",
          ].join(", "),
        }}
      />

      <motion.div
        className="container relative z-10 mx-6 my-auto flex max-w-md shrink-0 flex-col items-center rounded-[28px] px-8 py-10 text-center sm:px-12 sm:py-12"
        style={{
          backgroundColor: "rgba(16,13,15,0.45)",
          border: "1px solid rgba(232,201,171,0.16)",
          backdropFilter: "blur(28px) saturate(150%)",
          WebkitBackdropFilter: "blur(28px) saturate(150%)",
          boxShadow: "0 24px 80px rgba(5,4,5,0.55)",
        }}
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 1,
          delay: prefersReducedMotion ? 0 : 0.15,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <motion.div
          className="relative mb-7 aspect-[3/2] w-[110px] sm:w-[130px]"
          animate={prefersReducedMotion ? undefined : { scale: [1, 1.02, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/logo/Logo-Elite-One-Spa.webp"
            alt="Elite One Spa"
            fill
            sizes="130px"
            className="object-contain"
            style={{ filter: "drop-shadow(0 8px 24px rgba(5,4,5,0.5))" }}
          />
        </motion.div>

        <h2 id="music-consent-title" className="max-w-xs text-balance leading-[1.3]">
          {t.musicConsent.title}
        </h2>

        <p className="mx-auto mt-4 max-w-xs text-balance text-sm text-[var(--color-text-muted)]">
          {t.musicConsent.paragraph}
        </p>

        <div className="mt-8 flex w-full flex-col items-center gap-4">
          <button type="button" onClick={handleActivate} className="btn btn-primary w-full">
            {t.musicConsent.activate}
          </button>
          <button type="button" onClick={handleDecline} className="btn btn-secondary w-full">
            {t.musicConsent.decline}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
