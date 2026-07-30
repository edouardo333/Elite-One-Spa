"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { animate, motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/app/lib/language/LanguageContext";
import { useBodyScrollLock } from "@/app/lib/useBodyScrollLock";
import { useModalFocusTrap } from "@/app/lib/useModalFocusTrap";
import type { Translations } from "@/app/lib/language/translations";
import {
  HOSTESS_DATA,
  HOSTESS_STATUS_CYCLE,
  type HostessRecord,
  type HostessStatus,
} from "@/app/data/hostesses";

type FilterKey = "all" | "available" | "soon" | "off" | "premium" | "new";
type HostessText = Translations["hostesses"]["list"][number];

const FILTER_KEYS: FilterKey[] = ["all", "available", "soon", "off", "premium", "new"];

const STATUS_COLOR: Record<HostessStatus, string> = {
  available: "#6fe3a0",
  soon: "var(--color-champagne)",
  off: "rgba(244,239,232,0.4)",
};

const STATUS_EMOJI: Record<HostessStatus, string> = {
  available: "🟢",
  soon: "🟠",
  off: "⚫",
};

const SIMULATION_INTERVAL_MS = 28_000;
const CLOCK_TICK_MS = 30_000;

function filterLabel(t: Translations, key: FilterKey) {
  switch (key) {
    case "all":
      return t.hostesses.filters.all;
    case "available":
      return t.hostesses.filters.available;
    case "soon":
      return t.hostesses.filters.comingSoon;
    case "off":
      return t.hostesses.filters.offToday;
    case "premium":
      return t.hostesses.filters.premium;
    case "new":
      return t.hostesses.filters.newArrival;
  }
}

function statusLabel(t: Translations, status: HostessStatus) {
  switch (status) {
    case "available":
      return t.hostesses.status.available;
    case "soon":
      return t.hostesses.status.comingSoon;
    case "off":
      return t.hostesses.status.off;
  }
}

function badgesFor(h: HostessRecord, t: Translations) {
  const chips: { key: string; label: string; icon: string }[] = [];
  if (h.popular) chips.push({ key: "popular", label: t.hostesses.badges.popular, icon: "🔥" });
  if (h.newArrival)
    chips.push({ key: "newArrival", label: t.hostesses.badges.newArrival, icon: "✨" });
  if (h.staffFavorite)
    chips.push({ key: "staffFavorite", label: t.hostesses.badges.staffFavorite, icon: "⭐" });
  if (h.premium) chips.push({ key: "premium", label: t.hostesses.badges.premium, icon: "💎" });
  return chips;
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const displayRef = useRef(value);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      displayRef.current = value;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reduced-motion path skips the tween and must sync immediately.
      setDisplay(value);
      return;
    }
    const controls = animate(displayRef.current, value, {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        displayRef.current = v;
        setDisplay(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [value, prefersReducedMotion]);

  return <>{display}</>;
}

function LiveDot({ size = 8, color = "#6fe3a0" }: { size?: number; color?: string }) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <span
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
      />
      {!prefersReducedMotion && (
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: color }}
          animate={{ scale: [1, 2.4, 1], opacity: [0.55, 0, 0.55] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </span>
  );
}

function StarRating({ rating, label }: { rating: number; label: string }) {
  const percent = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="relative inline-flex text-[0.85rem] leading-none tracking-[0.1em]" aria-hidden="true">
        <span style={{ color: "rgba(244,239,232,0.22)" }}>★★★★★</span>
        <span
          className="absolute inset-0 overflow-hidden whitespace-nowrap"
          style={{ width: `${percent}%`, color: "var(--color-champagne)" }}
        >
          ★★★★★
        </span>
      </div>
      <span className="text-[0.7rem] text-[var(--color-text-muted)]">{rating.toFixed(1)}</span>
      <span className="sr-only">{`${rating.toFixed(1)} ${label}`}</span>
    </div>
  );
}

function SilhouetteIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} style={style} aria-hidden="true">
      <circle cx="32" cy="19" r="11" fill="currentColor" />
      <path
        d="M10 57c0-13.5 9.85-24.5 22-24.5S54 43.5 54 57"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
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
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function PlaceholderPortrait({
  title,
  subtitle,
  size,
}: {
  title: string;
  subtitle: string;
  size: "md" | "lg";
}) {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
      <div
        className={`flex items-center justify-center rounded-full border backdrop-blur-md ${
          size === "lg" ? "h-20 w-20" : "h-14 w-14"
        }`}
        style={{ borderColor: "rgba(244,239,232,0.24)", backgroundColor: "rgba(244,239,232,0.08)" }}
      >
        <SilhouetteIcon
          className={size === "lg" ? "h-10 w-10" : "h-7 w-7"}
          style={{ color: "rgba(244,239,232,0.78)" }}
        />
      </div>
      <div>
        <p
          className={`font-medium uppercase tracking-[0.1em] text-[var(--color-champagne-soft)] ${
            size === "lg" ? "text-[0.72rem]" : "text-[0.62rem]"
          }`}
        >
          {title}
        </p>
        <p
          className={`mx-auto mt-1.5 max-w-[22ch] leading-snug text-[var(--color-text-muted)] ${
            size === "lg" ? "text-[0.68rem]" : "text-[0.58rem]"
          }`}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function Avatar({
  name,
  photo,
  gradient,
  size = "md",
}: {
  name: string;
  photo?: string;
  gradient: [string, string];
  size?: "md" | "lg";
}) {
  const { t } = useLanguage();
  return (
    <div
      className={`group/avatar relative overflow-hidden rounded-[var(--radius-md)] ${
        size === "lg" ? "aspect-[4/5]" : "aspect-square"
      }`}
      style={{
        backgroundImage: `linear-gradient(155deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
      }}
    >
      {/* Soft vignette so the portrait or monogram sits with depth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 90% 70% at 50% 30%, rgba(255,255,255,0.16), transparent 60%), radial-gradient(ellipse 100% 60% at 50% 110%, rgba(5,4,5,0.55), transparent 60%)",
        }}
      />
      {/* Fine grain texture matching the rest of the site */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")",
        }}
      />
      {photo ? (
        <Image
          src={photo}
          alt={name}
          fill
          sizes={size === "lg" ? "(min-width: 1024px) 340px, 90vw" : "(min-width: 640px) 33vw, 90vw"}
          className="object-cover"
        />
      ) : (
        <PlaceholderPortrait
          title={t.hostesses.placeholder.title}
          subtitle={t.hostesses.placeholder.subtitle}
          size={size}
        />
      )}
      {/* Shimmer sweep on hover */}
      <div
        className="pointer-events-none absolute inset-0 -translate-x-full opacity-0 transition-[transform,opacity] duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover/avatar:translate-x-full group-hover/avatar:opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(100deg, transparent, rgba(255,255,255,0.22) 45%, transparent 60%)",
        }}
      />
    </div>
  );
}

function BadgeChips({ chips }: { chips: { key: string; label: string; icon: string }[] }) {
  if (chips.length === 0) return null;
  return (
    <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-[0.1em] backdrop-blur-md"
          style={{
            backgroundColor: "rgba(10,9,11,0.55)",
            borderColor: "rgba(244,239,232,0.18)",
            color: "var(--color-champagne-soft)",
          }}
        >
          <span aria-hidden="true">{chip.icon}</span>
          {chip.label}
        </span>
      ))}
    </div>
  );
}

function StatusBadge({ status, label }: { status: HostessStatus; label: string }) {
  return (
    <span
      className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[0.6rem] font-medium uppercase tracking-[0.12em] backdrop-blur-md"
      style={{
        borderColor: status === "off" ? "rgba(244,239,232,0.18)" : "rgba(232,201,171,0.32)",
        backgroundColor:
          status === "available" ? "rgba(111,227,160,0.14)" : "rgba(10,9,11,0.6)",
        color: status === "off" ? "var(--color-text-muted)" : "var(--color-offwhite)",
      }}
    >
      <LiveDot size={6} color={STATUS_COLOR[status]} />
      <span aria-hidden="true">{STATUS_EMOJI[status]}</span>
      <motion.span
        key={status}
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {label}
      </motion.span>
    </span>
  );
}

function StatsStrip({
  hostess,
  stats,
  dense = false,
}: {
  hostess: HostessRecord;
  stats: Translations["hostesses"]["stats"];
  dense?: boolean;
}) {
  const items = [
    { label: stats.age, value: String(hostess.age), unit: stats.ageUnit },
    { label: stats.height, value: String(hostess.heightCm), unit: "cm" },
    { label: stats.weight, value: String(hostess.weightLb), unit: "lb" },
    { label: stats.measurements, value: hostess.measurements, unit: "" },
  ];
  return (
    <div
      className="grid grid-cols-4 divide-x divide-[rgba(244,239,232,0.12)] overflow-hidden rounded-[var(--radius-sm)] border"
      style={{ borderColor: "var(--color-border)", backgroundColor: "rgba(244,239,232,0.03)" }}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className={`flex flex-col items-center justify-center gap-1 text-center ${
            dense ? "px-1 py-2.5" : "px-2 py-3.5"
          }`}
        >
          <span className="text-[0.56rem] font-medium uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
            {item.label}
          </span>
          <span
            className={`font-[var(--font-heading)] leading-none text-[var(--color-offwhite)] ${
              dense ? "text-[0.88rem]" : "text-[1.05rem]"
            }`}
          >
            {item.value}
            {item.unit && (
              <span className="ml-0.5 text-[0.6rem] font-sans text-[var(--color-text-muted)]">
                {item.unit}
              </span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

function ChipList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border px-3 py-1.5 text-[0.7rem] text-[var(--color-offwhite)]"
          style={{ borderColor: "var(--color-border)", backgroundColor: "rgba(244,239,232,0.04)" }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function LocationIcon({ className }: { className?: string }) {
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
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function HostessProfileModal({
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

export default function Hostesses() {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [hostesses, setHostesses] = useState<HostessRecord[]>(HOSTESS_DATA);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);
  const [now, setNow] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Clock — establishes the "updated X min ago" reference only after mount,
  // so the very first server/client render stays identical (no hydration mismatch).
  // Skips its tick while the tab is backgrounded (document.hidden) — the label
  // isn't visible to anyone, so there's no reason to re-render for it.
  useEffect(() => {
    const start = Date.now();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-off clock init post-mount, mirrors LanguageContext's hydration-safe pattern.
    setLastUpdatedAt(start);
    setNow(start);
    const tick = window.setInterval(() => {
      if (document.hidden) return;
      setNow(Date.now());
    }, CLOCK_TICK_MS);
    return () => window.clearInterval(tick);
  }, []);

  // Live simulation — periodically nudges one hostess to the next status so
  // the dashboard feels genuinely alive rather than a static snapshot. Also
  // skipped while the tab is backgrounded, for the same reason as the clock.
  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = window.setInterval(() => {
      if (document.hidden) return;
      setHostesses((prev) => {
        const index = Math.floor(Math.random() * prev.length);
        return prev.map((h, i) =>
          i === index ? { ...h, status: HOSTESS_STATUS_CYCLE[h.status] } : h
        );
      });
      setLastUpdatedAt(Date.now());
      setNow(Date.now());
    }, SIMULATION_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

  const textById = useMemo(
    () => new Map(t.hostesses.list.map((entry) => [entry.id, entry])),
    [t]
  );

  const counts = useMemo(
    () =>
      hostesses.reduce(
        (acc, h) => {
          acc[h.status] += 1;
          return acc;
        },
        { available: 0, soon: 0, off: 0 } as Record<HostessStatus, number>
      ),
    [hostesses]
  );

  const minutesAgo =
    lastUpdatedAt && now ? Math.max(0, Math.floor((now - lastUpdatedAt) / 60000)) : 0;
  const updatedText =
    minutesAgo <= 0
      ? t.hostesses.statusBar.updatedJustNow
      : t.hostesses.statusBar.updatedMinutesAgo.replace("{n}", String(minutesAgo));

  const filtered = useMemo(() => {
    switch (filter) {
      case "available":
        return hostesses.filter((h) => h.status === "available");
      case "soon":
        return hostesses.filter((h) => h.status === "soon");
      case "off":
        return hostesses.filter((h) => h.status === "off");
      case "premium":
        return hostesses.filter((h) => h.premium);
      case "new":
        return hostesses.filter((h) => h.newArrival);
      default:
        return hostesses;
    }
  }, [hostesses, filter]);

  const featured = filter === "all" ? hostesses.find((h) => h.status === "available") : null;
  const gridList = featured ? filtered.filter((h) => h.id !== featured.id) : filtered;
  const selected = selectedId ? hostesses.find((h) => h.id === selectedId) ?? null : null;
  const selectedText = selected ? textById.get(selected.id) ?? null : null;

  return (
    <section id="hotesses" className="relative py-14 sm:py-18">
      <div className="container relative z-10">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="eyebrow mb-6"
          >
            {t.hostesses.eyebrow}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-balance"
          >
            {t.hostesses.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 flex items-center justify-center gap-2.5 text-sm text-[var(--color-text-muted)]"
          >
            <LiveDot size={7} />
            {t.hostesses.subtitle}
          </motion.p>
        </div>

        {/* Live status bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto mt-14 max-w-4xl overflow-hidden rounded-[var(--radius-lg)] border backdrop-blur-xl"
          style={{
            borderColor: "rgba(232,120,150,0.24)",
            backgroundColor: "rgba(20,11,16,0.55)",
            boxShadow: "0 0 46px rgba(232,120,150,0.14), inset 0 0 30px rgba(150,45,80,0.06)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              backgroundImage:
                "linear-gradient(90deg, transparent, rgba(232,201,171,0.4) 50%, transparent)",
            }}
          />
          <div className="flex flex-col gap-6 px-6 py-7 sm:px-10 sm:py-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <LiveDot size={10} />
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-champagne-soft)]">
                {t.hostesses.statusBar.live}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              <div className="flex items-baseline gap-2">
                <span
                  className="font-[var(--font-heading)] text-2xl font-medium"
                  style={{ color: "#6fe3a0" }}
                >
                  <AnimatedNumber value={counts.available} />
                </span>
                <span className="text-[0.68rem] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                  {t.hostesses.statusBar.available}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-[var(--font-heading)] text-2xl font-medium text-[var(--color-champagne)]">
                  <AnimatedNumber value={counts.soon} />
                </span>
                <span className="text-[0.68rem] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                  {t.hostesses.statusBar.comingSoon}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-[var(--font-heading)] text-2xl font-medium text-[var(--color-text-muted)]">
                  <AnimatedNumber value={counts.off} />
                </span>
                <span className="text-[0.68rem] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                  {t.hostesses.statusBar.offToday}
                </span>
              </div>
            </div>

            <span className="text-center text-[0.66rem] uppercase tracking-[0.14em] text-[var(--color-text-muted)] md:text-right">
              {updatedText}
            </span>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-10 flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-full border p-1.5"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "rgba(244,239,232,0.03)",
            width: "fit-content",
          }}
        >
          {FILTER_KEYS.map((key) => {
            const active = filter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                aria-pressed={active}
                className="relative rounded-full px-4 py-3.5 text-[0.64rem] font-medium uppercase tracking-[0.14em] transition-colors duration-500 sm:px-5 xl:py-2.5"
                style={{ color: active ? "var(--color-black)" : "var(--color-offwhite)" }}
              >
                {active && (
                  <motion.span
                    layoutId="hostess-filter-pill"
                    className="absolute inset-0 rounded-full"
                    style={{
                      backgroundColor: "var(--color-champagne)",
                      boxShadow: "0 0 22px rgba(232,201,171,0.4)",
                    }}
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{filterLabel(t, key)}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Featured hostess */}
        {featured &&
          (() => {
            const featuredText = textById.get(featured.id);
            if (!featuredText) return null;
            return (
              <motion.div
                key={featured.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative mx-auto mt-16 max-w-5xl"
              >
                <div
                  className="pointer-events-none absolute -inset-8 -z-10 opacity-80 blur-[60px]"
                  style={{
                    backgroundImage:
                      "radial-gradient(ellipse 70% 70% at 30% 40%, rgba(232,120,150,0.28), transparent 70%)",
                  }}
                />
                <motion.div
                  whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  onClick={() => setSelectedId(featured.id)}
                  className="grid cursor-pointer gap-8 overflow-hidden rounded-[var(--radius-lg)] border p-5 backdrop-blur-xl sm:p-8 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-10"
                  style={{
                    borderColor: "rgba(232,120,150,0.3)",
                    backgroundColor: "rgba(20,11,16,0.6)",
                    boxShadow:
                      "0 30px 80px rgba(5,4,5,0.5), 0 0 60px rgba(232,120,150,0.16), inset 0 0 30px rgba(150,45,80,0.06)",
                  }}
                >
                  <div className="relative mx-auto w-full max-w-[320px] lg:mx-0">
                    <div className="group/avatar relative">
                      <Avatar
                        name={featuredText.name}
                        photo={featured.photo}
                        gradient={featured.gradient}
                        size="lg"
                      />
                    </div>
                    <StatusBadge status={featured.status} label={statusLabel(t, featured.status)} />
                    <BadgeChips
                      chips={badgesFor(featured, t).filter((c) => c.key !== "popular")}
                    />
                  </div>

                  <div className="flex flex-col justify-center">
                    {badgesFor(featured, t).some((c) => c.key === "popular") && (
                      <span
                        className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-[0.62rem] font-medium uppercase tracking-[0.12em]"
                        style={{
                          borderColor: "rgba(232,201,171,0.32)",
                          color: "var(--color-champagne-soft)",
                        }}
                      >
                        🔥 {t.hostesses.badges.popular}
                      </span>
                    )}
                    <h3 className="text-3xl sm:text-4xl">{featuredText.name}</h3>
                    <div className="mt-3">
                      <StarRating rating={featured.rating} label={t.hostesses.ratingLabel} />
                    </div>
                    <p className="mt-5 max-w-[48ch] text-sm leading-[1.9] sm:text-base">
                      {featuredText.bio}
                    </p>

                    <div className="mt-6 max-w-md">
                      <StatsStrip hostess={featured} stats={t.hostesses.stats} />
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.75rem] text-[var(--color-text-muted)]">
                      <span className="inline-flex items-center gap-2">
                        <LiveDot size={6} color={STATUS_COLOR[featured.status]} />
                        {featuredText.schedule}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <LocationIcon className="h-3.5 w-3.5" />
                        {featuredText.location}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedId(featured.id);
                      }}
                      aria-label={t.hostesses.viewProfileAria.replace("{name}", featuredText.name)}
                      className="btn btn-primary mt-8 w-fit"
                    >
                      {t.hostesses.viewProfile}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            );
          })()}

        {/* Grid */}
        <motion.div
          layout
          className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {gridList.map((h) => {
              const text = textById.get(h.id);
              if (!text) return null;
              const chips = badgesFor(h, t).slice(0, 2);
              return (
                <motion.div
                  key={h.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={prefersReducedMotion ? undefined : { y: -6 }}
                  onClick={() => setSelectedId(h.id)}
                  className="group relative cursor-pointer overflow-hidden rounded-[var(--radius-md)] border backdrop-blur-xl transition-[border-color,box-shadow] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] hover:shadow-[0_0_40px_rgba(232,120,150,0.18)]"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "rgba(244,239,232,0.03)",
                  }}
                >
                  <div className="relative">
                    <Avatar name={text.name} photo={h.photo} gradient={h.gradient} />
                    <StatusBadge status={h.status} label={statusLabel(t, h.status)} />
                    <BadgeChips chips={chips} />
                  </div>
                  <div className="flex flex-col gap-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-lg font-medium text-[var(--color-offwhite)]">
                        {text.name}
                      </h4>
                      <StarRating rating={h.rating} label={t.hostesses.ratingLabel} />
                    </div>

                    <StatsStrip hostess={h} stats={t.hostesses.stats} dense />

                    <div className="flex flex-col gap-1.5 text-[0.74rem] text-[var(--color-text-muted)]">
                      <span className="inline-flex items-center gap-2">
                        <LiveDot size={6} color={STATUS_COLOR[h.status]} />
                        {text.schedule}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <LocationIcon className="h-3.5 w-3.5 shrink-0" />
                        {text.location}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedId(h.id);
                      }}
                      aria-label={t.hostesses.viewProfileAria.replace("{name}", text.name)}
                      className="btn btn-secondary mt-2 w-full !py-3 text-[0.64rem] xl:!py-2.5"
                    >
                      {t.hostesses.viewProfile}
                    </button>
                  </div>
                </motion.div>
              );
            })}
        </motion.div>
      </div>

      {selected && selectedText && (
        <HostessProfileModal
          key={selected.id}
          hostess={selected}
          text={selectedText}
          onClose={() => setSelectedId(null)}
        />
      )}
    </section>
  );
}
