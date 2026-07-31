"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { animate, motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/app/lib/language/LanguageContext";
import { useIsMobile } from "@/app/lib/useIsMobile";
import type { Translations } from "@/app/lib/language/translations";
import type { HostessRecord, HostessStatus } from "@/app/data/hostesses";

export type HostessText = Translations["hostesses"]["list"][number];

export const STATUS_COLOR: Record<HostessStatus, string> = {
  available: "#6fe3a0",
  soon: "var(--color-champagne)",
  off: "rgba(244,239,232,0.4)",
};

const STATUS_EMOJI: Record<HostessStatus, string> = {
  available: "🟢",
  soon: "🟠",
  off: "⚫",
};

export function statusLabel(t: Translations, status: HostessStatus) {
  switch (status) {
    case "available":
      return t.hostesses.status.available;
    case "soon":
      return t.hostesses.status.comingSoon;
    case "off":
      return t.hostesses.status.off;
  }
}

export function badgesFor(h: HostessRecord, t: Translations) {
  const chips: { key: string; label: string; icon: string }[] = [];
  if (h.popular) chips.push({ key: "popular", label: t.hostesses.badges.popular, icon: "🔥" });
  if (h.newArrival)
    chips.push({ key: "newArrival", label: t.hostesses.badges.newArrival, icon: "✨" });
  if (h.staffFavorite)
    chips.push({ key: "staffFavorite", label: t.hostesses.badges.staffFavorite, icon: "⭐" });
  if (h.premium) chips.push({ key: "premium", label: t.hostesses.badges.premium, icon: "💎" });
  return chips;
}

export function AnimatedNumber({ value }: { value: number }) {
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

export function LiveDot({ size = 8, color = "#6fe3a0" }: { size?: number; color?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <span
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
      />
      {/* The ping ring is skipped on mobile: this dot renders once per hostess
          card, so a full grid can mean a dozen-plus concurrent Infinity loops
          — a real contributor to scroll jank on mobile GPUs. */}
      {!prefersReducedMotion && !isMobile && (
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

export function StarRating({ rating, label }: { rating: number; label: string }) {
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

export function SilhouetteIcon({ className, style }: { className?: string; style?: CSSProperties }) {
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

export function CloseIcon({ className }: { className?: string }) {
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

export function Avatar({
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

export function BadgeChips({ chips }: { chips: { key: string; label: string; icon: string }[] }) {
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

export function StatusBadge({ status, label }: { status: HostessStatus; label: string }) {
  const isMobile = useIsMobile();
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
        initial={isMobile ? false : { opacity: 0, y: 3 }}
        animate={isMobile ? undefined : { opacity: 1, y: 0 }}
        transition={isMobile ? undefined : { duration: 0.35, ease: "easeOut" }}
      >
        {label}
      </motion.span>
    </span>
  );
}

export function StatsStrip({
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

export function ChipList({ items }: { items: string[] }) {
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

export function LocationIcon({ className }: { className?: string }) {
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
