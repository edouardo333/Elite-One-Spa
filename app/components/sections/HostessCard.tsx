"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/app/lib/language/LanguageContext";
import { useIsMobile } from "@/app/lib/useIsMobile";
import type { HostessRecord } from "@/app/data/hostesses";
import {
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
  type HostessText,
} from "./hostesses-shared";

// Extracted from the grid `.map()` and memoized so that re-filtering or
// re-ordering the grid only re-renders cards whose props actually changed,
// instead of reconciling the whole grid — each card carries several
// backdrop-blur layers, so that adds up fast across 10+ cards.
function HostessCard({
  hostess,
  text,
  onSelect,
}: {
  hostess: HostessRecord;
  text: HostessText;
  onSelect: (id: string) => void;
}) {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  // No-collision rule: at most one marketing badge may ever sit over the
  // photo (bottom-left); any others move down near the name as compact
  // pills instead of competing with the availability badge (top-right).
  const { priority: priorityChip, rest: secondaryChips } = splitPriorityBadge(badgesFor(hostess, t));

  // Mobile: no `layout` (FLIP repositioning) and a lighter, opacity-only
  // mount transition instead of opacity+y+scale. On every filter switch this
  // ran for every visible card simultaneously; combined with the shared
  // filter-pill projection (see Hostesses.tsx) that's what turned filter
  // taps into a full-tree reflow/animation burst on mobile. Desktop keeps
  // the original motion — its frame budget already handles it fine.
  const mountTransition = isMobile
    ? { opacity: { duration: 0.18 } }
    : { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <motion.div
      layout={!isMobile}
      initial={isMobile ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.97 }}
      animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      exit={isMobile ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
      transition={mountTransition}
      whileHover={prefersReducedMotion || isMobile ? undefined : { y: -6 }}
      onClick={() => onSelect(hostess.id)}
      className="group relative cursor-pointer overflow-hidden rounded-[var(--radius-md)] border backdrop-blur-xl transition-[border-color,box-shadow] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] hover:shadow-[0_0_40px_rgba(232,120,150,0.18)]"
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "rgba(244,239,232,0.03)",
      }}
    >
      <div className="relative">
        <Avatar name={text.name} photo={hostess.photo} gradient={hostess.gradient} />
        {/* Status top-right, single priority marketing badge bottom-left —
            opposite corners, so they can never share a row/area at any
            width, down to 320px. */}
        <StatusBadge status={hostess.status} label={statusLabel(t, hostess.status)} />
        {priorityChip && <BadgePill chip={priorityChip} className="absolute bottom-3 left-3 z-10" />}
      </div>
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-medium text-[var(--color-offwhite)]">{text.name}</h4>
            {secondaryChips.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {secondaryChips.map((chip) => (
                  <BadgePill key={chip.key} chip={chip} variant="inline" />
                ))}
              </div>
            )}
          </div>
          <StarRating rating={hostess.rating} label={t.hostesses.ratingLabel} />
        </div>

        <StatsStrip hostess={hostess} stats={t.hostesses.stats} dense />

        <div className="flex flex-col gap-1.5 text-[0.74rem] text-[var(--color-text-muted)]">
          <span className="inline-flex items-center gap-2">
            <LiveDot size={6} color={STATUS_COLOR[hostess.status]} />
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
            onSelect(hostess.id);
          }}
          aria-label={t.hostesses.viewProfileAria.replace("{name}", text.name)}
          className="btn btn-secondary mt-2 w-full !py-3 text-[0.64rem] xl:!py-2.5"
        >
          {t.hostesses.viewProfile}
        </button>
      </div>
    </motion.div>
  );
}

export default memo(HostessCard);
