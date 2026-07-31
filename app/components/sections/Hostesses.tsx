"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/app/lib/language/LanguageContext";
import { useIsMobile } from "@/app/lib/useIsMobile";
import type { Translations } from "@/app/lib/language/translations";
import {
  HOSTESS_DATA,
  HOSTESS_STATUS_CYCLE,
  type HostessRecord,
  type HostessStatus,
} from "@/app/data/hostesses";
import {
  AnimatedNumber,
  Avatar,
  BadgeChips,
  LiveDot,
  LocationIcon,
  STATUS_COLOR,
  StarRating,
  StatsStrip,
  StatusBadge,
  badgesFor,
  statusLabel,
} from "./hostesses-shared";
import HostessCard from "./HostessCard";

// On mobile, only the featured hostess + this many grid cards mount up front —
// each card carries several backdrop-blurred badge/chip elements, and all 10+
// cards mounting unconditionally was the single largest concentration of
// backdrop-filter compositing layers on the page. The rest mount on request.
const MOBILE_INITIAL_GRID_COUNT = 3;

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

export default function Hostesses() {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [hostesses, setHostesses] = useState<HostessRecord[]>(HOSTESS_DATA);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);
  const [now, setNow] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  // Re-collapse to the trimmed mobile view whenever the active filter
  // changes, so "show more" always starts from the same predictable state
  // for whatever list is currently in view. Adjusted during render (React's
  // recommended pattern for state derived from a prop/dep change) rather
  // than in an effect, which would cost an extra render pass.
  const [prevFilter, setPrevFilter] = useState(filter);
  if (filter !== prevFilter) {
    setPrevFilter(filter);
    setMobileExpanded(false);
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

  // Live simulation — periodically nudges one hostess to the next status so
  // the dashboard feels genuinely alive rather than a static snapshot. Also
  // skipped while the tab is backgrounded, for the same reason as the clock.
  // Only the mutated hostess gets a new object reference below, so
  // `HostessCard` (wrapped in `memo`) bails out for every other card instead
  // of the whole grid reconciling on each tick.
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
  const showMoreAvailable = isMobile && !mobileExpanded && gridList.length > MOBILE_INITIAL_GRID_COUNT;
  const visibleGridList =
    isMobile && !mobileExpanded ? gridList.slice(0, MOBILE_INITIAL_GRID_COUNT) : gridList;
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
                {active && (
                  <motion.span
                    layoutId={isMobile ? undefined : "hostess-filter-pill"}
                    className="absolute inset-0 rounded-full"
                    style={{
                      backgroundColor: "var(--color-champagne)",
                      boxShadow: "0 0 22px rgba(232,201,171,0.4)",
                    }}
                    transition={isMobile ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
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
                layout={!isMobile}
                initial={isMobile ? false : { opacity: 0, y: 24 }}
                animate={isMobile ? undefined : { opacity: 1, y: 0 }}
                transition={isMobile ? undefined : { duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
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
                  whileHover={prefersReducedMotion || isMobile ? undefined : { y: -4 }}
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
          layout={!isMobile}
          className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visibleGridList.map((h) => {
            const text = textById.get(h.id);
            if (!text) return null;
            return <HostessCard key={h.id} hostess={h} text={text} onSelect={setSelectedId} />;
          })}
        </motion.div>

        {showMoreAvailable && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setMobileExpanded(true)}
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
