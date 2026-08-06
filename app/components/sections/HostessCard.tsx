"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/app/lib/language/LanguageContext";
import { useIsMobile } from "@/app/lib/useIsMobile";
import type { HostessRecord } from "@/app/data/hostesses";
import {
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
  const chips = badgesFor(hostess, t);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
        <StatusBadge status={hostess.status} label={statusLabel(t, hostess.status)} />
        <BadgeChips chips={chips} />
      </div>
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-lg font-medium text-[var(--color-offwhite)]">{text.name}</h4>
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
