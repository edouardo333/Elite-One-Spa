"use client";

import { useEffect, useRef, useState, type TouchEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/app/lib/language/LanguageContext";
import { useBodyScrollLock } from "@/app/lib/useBodyScrollLock";
import { useModalFocusTrap } from "@/app/lib/useModalFocusTrap";
import { CloseIcon } from "./hostesses-shared";

// Minimum horizontal drag (px) before a touch gesture counts as a swipe
// rather than a tap/scroll wobble.
const SWIPE_THRESHOLD_PX = 40;

function ChevronIcon({ direction, className }: { direction: "left" | "right"; className?: string }) {
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
      <path d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}

/**
 * Full-screen lightbox for the profile modal's gallery. Rendered as a sibling
 * of the modal's (transformed, via framer-motion) card rather than a child of
 * it — a `transform` on an ancestor turns `position: fixed` descendants into
 * something positioned relative to that ancestor instead of the viewport, so
 * this has to sit outside the card to actually cover the full screen.
 */
export default function HostessGalleryLightbox({
  images,
  initialIndex,
  name,
  onClose,
}: {
  images: string[];
  initialIndex: number;
  name: string;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(initialIndex);
  const touchStartX = useRef<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const hasMultiple = images.length > 1;

  useBodyScrollLock(true);
  useModalFocusTrap(dialogRef, true);

  function goPrev() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }
  function goNext() {
    setIndex((i) => (i + 1) % images.length);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (!hasMultiple) return;
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onClose/hasMultiple are stable for the component's lifetime.
  }, []);

  function onTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0].clientX;
  }
  function onTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const startX = touchStartX.current;
    touchStartX.current = null;
    if (startX === null || !hasMultiple) return;
    const delta = event.changedTouches[0].clientX - startX;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    if (delta > 0) goPrev();
    else goNext();
  }

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${name} — ${t.hostesses.modal.galleryLabel}`}
      tabIndex={-1}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        style={{ backgroundColor: "rgba(5,4,5,0.92)", backdropFilter: "blur(8px)" }}
      />

      <button
        type="button"
        onClick={onClose}
        aria-label={t.hostesses.modal.closeAria}
        className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md transition-colors duration-300 hover:border-[rgba(232,201,171,0.5)]"
        style={{ borderColor: "rgba(244,239,232,0.2)", backgroundColor: "rgba(10,9,11,0.6)" }}
      >
        <CloseIcon className="h-4 w-4 text-[var(--color-offwhite)]" />
      </button>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label={t.hostesses.modal.lightboxPreviousAria}
            className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-md transition-colors duration-300 hover:border-[rgba(232,201,171,0.5)] sm:left-4"
            style={{ borderColor: "rgba(244,239,232,0.2)", backgroundColor: "rgba(10,9,11,0.6)" }}
          >
            <ChevronIcon direction="left" className="h-5 w-5 text-[var(--color-offwhite)]" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label={t.hostesses.modal.lightboxNextAria}
            className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-md transition-colors duration-300 hover:border-[rgba(232,201,171,0.5)] sm:right-4"
            style={{ borderColor: "rgba(244,239,232,0.2)", backgroundColor: "rgba(10,9,11,0.6)" }}
          >
            <ChevronIcon direction="right" className="h-5 w-5 text-[var(--color-offwhite)]" />
          </button>
        </>
      )}

      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex max-h-[85vh] max-w-[92vw] items-center justify-center"
      >
        {/* Plain <img>, not next/image: the lightbox needs to render each
            photo at its natural aspect ratio without a pre-known width/height
            (the source is already a fixed-width Sanity URL), which next/image
            can't do without either distorting the ratio or a fixed box. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[index]}
          alt={`${name} — ${t.hostesses.modal.galleryLabel} ${index + 1}`}
          className="max-h-[85vh] w-auto max-w-[92vw] rounded-[var(--radius-md)] object-contain"
        />
      </motion.div>

      {hasMultiple && (
        <div
          className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-[0.68rem] uppercase tracking-[0.14em] text-[var(--color-text-muted)]"
          aria-hidden="true"
        >
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
