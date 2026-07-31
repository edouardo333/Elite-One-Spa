"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useAudio } from "./useAudio";
import { useLanguage } from "@/app/lib/language/LanguageContext";
import { useIsMobile } from "@/app/lib/useIsMobile";

export default function AudioPlayer() {
  const { isMuted, isPlaying, isUnlocked, toggleMute } = useAudio();
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  if (!isUnlocked) return null;

  // Silencieux visuellement si l'utilisateur a coupé le son OU si l'ambiance n'a
  // jamais été démarrée (choix "Continuer sans musique") — un clic dans les deux
  // cas doit (re)lancer ou réactiver le son, cf. toggleMute dans useAudio.
  const isSilent = isMuted || !isPlaying;
  const label = isSilent ? t.audioPlayer.activateAria : t.audioPlayer.muteAria;

  return (
    <motion.button
      type="button"
      onClick={toggleMute}
      aria-label={label}
      aria-pressed={!isSilent}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: [0.19, 1, 0.22, 1] }}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.06 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
      className="fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-full"
      style={{
        border: `1px solid ${isSilent ? "var(--color-border)" : "rgba(232,201,171,0.45)"}`,
        backgroundColor: "rgba(10,9,11,0.55)",
        backdropFilter: "blur(18px) saturate(140%)",
        WebkitBackdropFilter: "blur(18px) saturate(140%)",
        boxShadow: isSilent ? "none" : "0 0 24px rgba(232,201,171,0.22)",
      }}
    >
      {!prefersReducedMotion && !isMobile && isPlaying && !isMuted && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full"
          style={{ border: "1px solid rgba(232,201,171,0.35)" }}
          animate={{ scale: [1, 1.35], opacity: [0.55, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      {isSilent ? <MutedIcon /> : <SoundIcon />}
      <span className="sr-only">
        {isSilent ? t.audioPlayer.srMuted : t.audioPlayer.srActive}
      </span>
    </motion.button>
  );
}

function SoundIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="var(--color-champagne)" />
      <path
        d="M16.5 8.5a5 5 0 0 1 0 7"
        stroke="var(--color-champagne)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M19 6a8.5 8.5 0 0 1 0 12"
        stroke="var(--color-champagne)"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

function MutedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="var(--color-offwhite)" opacity="0.75" />
      <path
        d="M16 9l4.5 6M20.5 9L16 15"
        stroke="var(--color-offwhite)"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}
