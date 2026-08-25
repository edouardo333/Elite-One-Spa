"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/app/lib/language/LanguageContext";
import { useIsMobile } from "@/app/lib/useIsMobile";
import type { Translations } from "@/app/lib/language/translations";
import type { HostessRecord, HostessStatus } from "@/app/data/hostesses";
import { FALLBACK_HOSTESS_DATA, FALLBACK_HOSTESS_TEXT } from "@/app/data/hostessesFallback";
import type { HostessCardText } from "@/sanity/lib/getHostesses";
import {
  AnimatedNumber,
  Avatar,
  BadgePill,
  LiveDot,
  LocationIcon,
  STATUS_COLOR,
  StarRating,
  StatsStrip,
  StatusBadge,
  badgesFor,
  splitPriorityBadge,
  statusLabel,
} from "./hostesses-shared";
import HostessCard from "./HostessCard";
import MobileHostessCard from "./MobileHostessCard";

// Mobile renders a flat, paginated list — no separate large "featured" hero
// card (that markup is desktop-only, see `featured` below), just compact
// cards mounted 2 at a time. Each "Show more" tap mounts exactly
// MOBILE_LOAD_MORE_COUNT more; it never reveals the rest of the list in one
// shot, which is what used to make a single tap mount/decode a dozen images
// concurrently — a major contributor to the iOS Safari lag/crash.
const MOBILE_INITIAL_GRID_COUNT = 2;
const MOBILE_LOAD_MORE_COUNT = 2;

// Modal-only code (focus trap, body scroll lock, gallery markup) never needs
// to be in the initial bundle — it mounts on click, well after first paint.
const HostessProfileModal = dynamic(() => import("./HostessProfileModal"), {
  ssr: false,
  loading: () => (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center"
      style={{ backgroundColor: "rgba(5,4,5,0.86)", backdropFilter: "blur(6px)" }}
      aria-hidden="true"
    />
  ),
});

type FilterKey = "all" | "available" | "soon" | "off" | "premium" | "new";

const FILTER_KEYS: FilterKey[] = ["all", "available", "soon", "off", "premium", "new"];

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

export default function Hostesses({
  hostesses: initialHostesses,
  hostessText,
}: {
  /** Fetched server-side from Sanity (via getHostesses()), with a static fallback. */
  hostesses: HostessRecord[];
  hostessText: Record<string, HostessCardText>;
}) {
  const { t, locale } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [filter, setFilter] = useState<FilterKey>("all");
  // Sanity is the single source of truth for status, availableUntil, badges,
  // and ordering (the ACTIVE_HOSTESSES_QUERY already sorts by popularToday
  // desc, then displayOrder asc). This list is never mutated client-side —
  // it only changes when an editor publishes a change in Sanity and the
  // server re-fetches. getHostesses() already swallows fetch errors into an
  // empty array, so an empty list here covers both "Sanity is unreachable"
  // and "the dataset is genuinely empty" — either way we fall back to the
  // last known-good local roster rather than showing nothing.
  const usingFallback = initialHostesses.length === 0;
  const hostesses = usingFallback ? FALLBACK_HOSTESS_DATA : initialHostesses;
  const textSource = usingFallback ? FALLBACK_HOSTESS_TEXT[locale] : hostessText;
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);
  const [now, setNow] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileVisibleCount, setMobileVisibleCount] = useState(MOBILE_INITIAL_GRID_COUNT);
  // Reset to the first 2 cards whenever the active filter changes, so
  // "show more" always starts from the same predictable state for whatever
  // list is currently in view. Adjusted during render (React's recommended
  // pattern for state derived from a prop/dep change) rather than in an
  // effect, which would cost an extra render pass.
  const [prevFilter, setPrevFilter] = useState(filter);
  if (filter !== prevFilter) {
    setPrevFilter(filter);
    setMobileVisibleCount(MOBILE_INITIAL_GRID_COUNT);
  }

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

  // Name/bio/languages/services/schedule come from Sanity (not localized —
  // one value per hostess, not a fr/en pair). "location" isn't part of the
  // Sanity schema — every hostess shares the same spa-wide value, so it
  // comes from translations.ts and keeps switching with the language toggle.
  const textById = useMemo(() => {
    return new Map(
      Object.values(textSource).map((text) => [
        text.id,
        { ...text, location: t.hostesses.location },
      ])
    );
  }, [t, textSource]);

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

  // The large featured card reads ONLY from the explicit `featured` flag
  // (guaranteed unique — see sanity/lib/uniqueFeaturedPublish.ts). If no
  // hostess is featured, fall back to the first active hostess ordered by
  // displayOrder, so the card never sits empty and never crashes.
  // Desktop-only: mobile skips this larger hero markup entirely (bigger
  // image, full stats strip, always-mounted bio) and folds every hostess —
  // including whichever one would've been featured — into the same flat,
  // paginated compact-card list below.
  const featured =
    !isMobile && filter === "all"
      ? hostesses.find((h) => h.featured) ??
        [...hostesses].sort((a, b) => a.displayOrder - b.displayOrder)[0] ??
        null
      : null;
  const gridList = featured ? filtered.filter((h) => h.id !== featured.id) : filtered;
  const visibleGridList = isMobile ? gridList.slice(0, mobileVisibleCount) : gridList;
  const showMoreAvailable = isMobile && gridList.length > mobileVisibleCount;
  const selected = selectedId ? hostesses.find((h) => h.id === selectedId) ?? null : null;
  const selectedText = selected ? textById.get(selected.id) ?? null : null;

  return (
    <section id="hotesses" className="relative py-14 sm:py-18">
      <div className="container relative z-10">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            data-reveal
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="eyebrow mb-6"
          >
            {t.hostesses.eyebrow}
          </motion.p>
          <motion.h2
            data-reveal
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-balance"
          >
            {t.hostesses.title}
          </motion.h2>
          <motion.p
            data-reveal
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
          data-reveal
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className={`relative mx-auto mt-14 max-w-4xl overflow-hidden rounded-[var(--radius-lg)] border ${
            isMobile ? "" : "backdrop-blur-xl"
          }`}
          style={{
            borderColor: "rgba(232,120,150,0.24)",
            // `backdrop-blur-xl` needs a translucent background to have
            // anything to blur; on mobile (blur dropped, see className
            // above) the background goes fully opaque instead so the bar
            // still reads solid rather than see-through.
            backgroundColor: isMobile ? "rgba(18,10,15,0.96)" : "rgba(20,11,16,0.55)",
            // Large blurred box-shadows are a real paint cost on iOS Safari;
            // this bar sits above the filters and repaints with the rest of
            // the section on every tap, so it's dropped on mobile. The
            // opaque background + border already carry the look.
            boxShadow: isMobile
              ? "none"
              : "0 0 46px rgba(232,120,150,0.14), inset 0 0 30px rgba(150,45,80,0.06)",
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
          data-reveal
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
                {active && isMobile && (
                  // Mobile: plain CSS pill, no `layoutId`. Shared-layout projection
                  // (layoutId) is Framer Motion's most expensive feature — on every
                  // tap it recalculates layout for every OTHER layout-animated node
                  // in the tree (the grid + every card below), which is what turned
                  // "switch filter" into a full-tree reflow on mobile. The visual
                  // result (solid champagne pill on the active filter) is identical;
                  // only the animated slide-between-buttons and the glow are gone —
                  // this pill repaints on every tap, so no blurred box-shadow on it.
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: "var(--color-champagne)" }}
                  />
                )}
                {active && !isMobile && (
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
            // Same placement philosophy as the grid cards: at most one
            // marketing badge ever sits over the photo (bottom-left,
            // opposite the top-right status badge); the rest render as
            // compact pills near the name, never stacked over the image.
            const { priority: featuredPriorityChip, rest: featuredSecondaryChips } =
              splitPriorityBadge(badgesFor(featured, t));

            const cardBody = (
              <>
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
                  {featuredPriorityChip && (
                    <BadgePill chip={featuredPriorityChip} className="absolute bottom-3 left-3 z-10" />
                  )}
                </div>

                <div className="flex flex-col justify-center">
                  {featuredSecondaryChips.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {featuredSecondaryChips.map((chip) => (
                        <BadgePill key={chip.key} chip={chip} variant="inline" />
                      ))}
                    </div>
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
              </>
            );

            // `featured` is only ever set on desktop (see above) — mobile
            // never reaches this IIFE at all, so this stays the single,
            // unconditional desktop-only render path.
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
                  {cardBody}
                </motion.div>
              </motion.div>
            );
          })()}

        {/* Grid — mobile takes a completely separate path: flat state
            (activeFilter -> filtered array -> slice -> render), plain
            `<div>`s with `MobileHostessCard`, no Framer Motion instance
            anywhere in the tree, so there's nothing to run `layout` (FLIP)
            measurement on for any card on every filter tap, and only the
            currently-visible slice is ever mounted — filtered-out or
            not-yet-revealed profiles (and their images) simply aren't in
            the DOM. Desktop keeps the full grid + `layout` transition on
            every matching card — its frame budget handles it fine. */}
        {isMobile ? (
          // `min-height` keeps a filter tap that matches zero/one hostess
          // (e.g. "Off Today" with a single match) from collapsing this
          // whole block to near-zero height — no section-wide layout jump,
          // no scroll-position kick, on any filter.
          <div className="mx-auto mt-10 flex min-h-[200px] max-w-md flex-col gap-4">
            {visibleGridList.map((h) => {
              const text = textById.get(h.id);
              if (!text) return null;
              return <MobileHostessCard key={h.id} hostess={h} text={text} onSelect={setSelectedId} />;
            })}
            {gridList.length === 0 && (
              <p className="py-10 text-center text-sm text-[var(--color-text-muted)]">
                {t.hostesses.noResults}
              </p>
            )}
          </div>
        ) : (
          <motion.div
            layout
            className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visibleGridList.map((h) => {
              const text = textById.get(h.id);
              if (!text) return null;
              return <HostessCard key={h.id} hostess={h} text={text} onSelect={setSelectedId} />;
            })}
          </motion.div>
        )}

        {showMoreAvailable && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() =>
                setMobileVisibleCount((count) => count + MOBILE_LOAD_MORE_COUNT)
              }
              aria-label={t.hostesses.showMoreAria}
              className="btn btn-secondary !px-8 !py-3 text-[0.68rem]"
            >
              {t.hostesses.showMore}
            </button>
          </div>
        )}
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
