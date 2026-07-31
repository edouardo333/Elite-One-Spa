"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/app/lib/language/LanguageContext";
import { useBodyScrollLock } from "@/app/lib/useBodyScrollLock";
import { useModalFocusTrap } from "@/app/lib/useModalFocusTrap";
import type { HostessRecord } from "@/app/data/hostesses";
import {
  Avatar,
  ChipList,
  CloseIcon,
  LiveDot,
  LocationIcon,
  STATUS_COLOR,
  SilhouetteIcon,
  StarRating,
  StatsStrip,
  StatusBadge,
  badgesFor,
  statusLabel,
  type HostessText,
} from "./hostesses-shared";

export default function HostessProfileModal({
  hostess,
  text,
  onClose,
}: {
  hostess: HostessRecord;
  text: HostessText;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const [status, setStatus] = useState<"open" | "closing">("open");
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = `hostess-modal-title-${hostess.id}`;

  useBodyScrollLock(true);
  useModalFocusTrap(dialogRef, true);

  useEffect(() => {
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  // Fades out via CSS transition before unmounting, rather than relying on
  // framer-motion's AnimatePresence exit tracking (which needs the tab to be
  // actively compositing frames to fire its completion callback).
  const requestClose = () => {
    setStatus("closing");
    const delay = prefersReducedMotion ? 0 : 400;
    closeTimeout.current = setTimeout(onClose, delay);
  };

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") requestClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- requestClose only reads refs/state setters and the stable onClose/prefersReducedMotion values.
  }, []);

  const galleryTiles = hostess.gallery && hostess.gallery.length > 0 ? hostess.gallery : [0, 1, 2];

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      className="fixed inset-0 z-[95] flex overflow-y-auto p-4 transition-opacity ease-[cubic-bezier(0.19,1,0.22,1)] sm:p-8"
      style={{
        transitionDuration: `${prefersReducedMotion ? 0 : 400}ms`,
        opacity: status === "closing" ? 0 : 1,
      }}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={requestClose}
        className="absolute inset-0 cursor-default"
        style={{ backgroundColor: "rgba(5,4,5,0.86)", backdropFilter: "blur(6px)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 m-auto grid w-full max-w-3xl shrink-0 grid-cols-1 overflow-hidden rounded-[var(--radius-lg)] border backdrop-blur-2xl sm:max-h-[84vh] sm:grid-cols-[minmax(0,300px)_1fr]"
        style={{
          borderColor: "rgba(232,120,150,0.28)",
          backgroundColor: "rgba(16,13,15,0.88)",
          boxShadow: "0 40px 100px rgba(5,4,5,0.6), 0 0 70px rgba(232,120,150,0.16)",
        }}
      >
        <button
          type="button"
          onClick={requestClose}
          aria-label={t.hostesses.modal.closeAria}
          className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md transition-colors duration-300 hover:border-[rgba(232,201,171,0.5)] sm:h-9 sm:w-9"
          style={{ borderColor: "rgba(244,239,232,0.2)", backgroundColor: "rgba(10,9,11,0.6)" }}
        >
          <CloseIcon className="h-4 w-4 text-[var(--color-offwhite)]" />
        </button>

        {/* Left column — portrait + gallery */}
        <div className="relative flex flex-col gap-3 overflow-y-auto p-4 sm:p-5">
          <div className="relative overflow-hidden rounded-[var(--radius-md)]">
            <Avatar name={text.name} photo={hostess.photo} gradient={hostess.gradient} size="lg" />
            <div className="absolute left-3 top-3 z-10">
              <StatusBadge status={hostess.status} label={statusLabel(t, hostess.status)} />
            </div>
          </div>
          <p className="text-center text-[0.6rem] font-medium uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            {t.hostesses.modal.galleryLabel}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {galleryTiles.map((tile, index) => (
              <div
                key={typeof tile === "string" ? tile : index}
                className="relative aspect-square overflow-hidden rounded-[var(--radius-sm)] border"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundImage: `linear-gradient(155deg, ${hostess.gradient[0]} 0%, ${hostess.gradient[1]} 100%)`,
                }}
              >
                {typeof tile === "string" ? (
                  <Image
                    src={tile}
                    alt={`${text.name} — ${t.hostesses.modal.galleryLabel} ${index + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                ) : (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <SilhouetteIcon
                      className="h-5 w-5 opacity-50"
                      style={{ color: "rgba(244,239,232,0.7)" }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          {!hostess.gallery?.length && (
            <p className="text-center text-[0.58rem] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
              {t.hostesses.modal.galleryComingSoon}
            </p>
          )}
        </div>

        {/* Right column — details */}
        <div className="overflow-y-auto p-6 sm:p-8">
          <div className="flex flex-wrap gap-1.5">
            {badgesFor(hostess, t).map((chip) => (
              <span
                key={chip.key}
                className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.58rem] font-medium uppercase tracking-[0.1em]"
                style={{ borderColor: "var(--color-border)", color: "var(--color-champagne-soft)" }}
              >
                <span aria-hidden="true">{chip.icon}</span>
                {chip.label}
              </span>
            ))}
          </div>

          <h3 id={titleId} className="mt-4 text-2xl sm:text-3xl">
            {text.name}
          </h3>
          <div className="mt-2">
            <StarRating rating={hostess.rating} label={t.hostesses.ratingLabel} />
          </div>

          <div className="mt-5">
            <StatsStrip hostess={hostess} stats={t.hostesses.stats} />
          </div>

          <div className="mt-6">
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.14em] text-[var(--color-champagne-soft)]">
              {t.hostesses.modal.descriptionLabel}
            </p>
            <p className="mt-2 text-sm leading-[1.85] text-[var(--color-offwhite)] sm:text-[0.95rem]">
              {text.bio}
            </p>
          </div>

          <div className="mt-6">
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.14em] text-[var(--color-champagne-soft)]">
              {t.hostesses.modal.languagesLabel}
            </p>
            <div className="mt-2.5">
              <ChipList items={text.languages} />
            </div>
          </div>

          <div className="mt-6">
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.14em] text-[var(--color-champagne-soft)]">
              {t.hostesses.modal.servicesLabel}
            </p>
            <div className="mt-2.5">
              <ChipList items={text.services} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.78rem] text-[var(--color-text-muted)]">
            <span className="inline-flex items-center gap-2">
              <LiveDot size={6} color={STATUS_COLOR[hostess.status]} />
              {text.schedule}
            </span>
            <span className="inline-flex items-center gap-2">
              <LocationIcon className="h-3.5 w-3.5" />
              {text.location}
            </span>
          </div>

          <a
            href="tel:+15145438344"
            onClick={requestClose}
            aria-label={t.hostesses.modal.bookAppointmentAria.replace("{name}", text.name)}
            className="btn btn-primary mt-8 w-full sm:w-fit"
          >
            {t.hostesses.modal.bookAppointment}
          </a>
        </div>
      </motion.div>
    </div>
  );
}
