"use client";

import { memo } from "react";
import Image from "next/image";
import { useLanguage } from "@/app/lib/language/LanguageContext";
import type { HostessRecord } from "@/app/data/hostesses";
import {
  STATUS_COLOR,
  STATUS_EMOJI,
  SilhouetteIcon,
  StarRating,
  badgesFor,
  splitPriorityBadge,
  statusLabel,
  type HostessText,
} from "./hostesses-shared";

// Tablet + mobile counterpart to the desktop hero card in Hostesses.tsx
// (the large `lg:grid-cols-[minmax(0,340px)_1fr]` block). That markup stays
// desktop-only — it leans on a big blurred halo + backdrop-blur-xl, both
// real paint costs on iOS Safari. This is a purpose-built sibling, same
// spirit as `MobileHostessCard`: no framer-motion instance, no
// backdrop-filter, flat scrim + solid badges. The only device branching is
// plain CSS (`sm:` = ~640px+, so it also covers the 768px tablet check) —
// stacked photo-over-info on a phone, side-by-side once there's room. This
// keeps it visually heavier than a normal card (pink accent border, hairline
// top highlight, primary CTA) without the desktop card's size or cost.
function FeaturedHostessCard({
  hostess,
  text,
  onSelect,
}: {
  hostess: HostessRecord;
  text: HostessText;
  onSelect: (id: string) => void;
}) {
  const { t } = useLanguage();
  const { priority: priorityChip } = splitPriorityBadge(badgesFor(hostess, t));

  return (
    <div
      className="relative w-full cursor-pointer overflow-hidden rounded-[var(--radius-md)] border"
      style={{ borderColor: "rgba(232,120,150,0.34)", backgroundColor: "rgba(244,239,232,0.03)" }}
      onClick={() => onSelect(hostess.id)}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent, rgba(232,201,171,0.5) 50%, transparent)",
        }}
      />
      <div className="flex flex-col sm:flex-row">
        {/* Image block — fixed height range on phone (matches
            MobileHostessCard), a proportioned fixed-width column once the
            layout goes side-by-side on tablet. */}
        <div
          className="relative w-full shrink-0 overflow-hidden sm:w-[42%]"
          style={{
            height: "clamp(280px, 68vw, 360px)",
            backgroundImage: `linear-gradient(155deg, ${hostess.gradient[0]} 0%, ${hostess.gradient[1]} 100%)`,
          }}
        >
          {hostess.photo ? (
            <Image
              src={hostess.photo}
              alt={text.name}
              fill
              sizes="(max-width: 640px) 90vw, 320px"
              loading="lazy"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <SilhouetteIcon className="h-12 w-12" style={{ color: "rgba(244,239,232,0.55)" }} />
            </div>
          )}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-14"
            style={{ backgroundImage: "linear-gradient(to top, rgba(5,4,5,0.5), transparent)" }}
          />
          <span
            className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[0.58rem] font-medium uppercase tracking-[0.1em]"
            style={{
              borderColor: hostess.status === "off" ? "rgba(244,239,232,0.18)" : "rgba(232,201,171,0.32)",
              backgroundColor:
                hostess.status === "available" ? "rgba(20,60,40,0.82)" : "rgba(10,9,11,0.82)",
              color: hostess.status === "off" ? "var(--color-text-muted)" : "var(--color-offwhite)",
            }}
          >
            <span aria-hidden="true">{STATUS_EMOJI[hostess.status]}</span>
            {statusLabel(t, hostess.status)}
          </span>
          {priorityChip && (
            <span
              className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[0.58rem] font-medium uppercase tracking-[0.1em]"
              style={{
                borderColor: "rgba(244,239,232,0.18)",
                backgroundColor: "rgba(10,9,11,0.82)",
                color: "var(--color-champagne-soft)",
              }}
            >
              <span aria-hidden="true">{priorityChip.icon}</span>
              {priorityChip.label}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col gap-3 p-4 sm:justify-center sm:p-6">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-lg font-medium leading-tight text-[var(--color-offwhite)] sm:text-xl">
              {text.name}
            </h4>
            <StarRating rating={hostess.rating} label={t.hostesses.ratingLabel} />
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] text-[var(--color-text-muted)]">
            <span>
              {hostess.age} {t.hostesses.stats.ageUnit}
            </span>
            <span>{hostess.heightCm} cm</span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-[6px] w-[6px] rounded-full"
                style={{ backgroundColor: STATUS_COLOR[hostess.status] }}
                aria-hidden="true"
              />
              {text.schedule}
            </span>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onSelect(hostess.id);
            }}
            aria-label={t.hostesses.viewProfileAria.replace("{name}", text.name)}
            className="btn btn-primary mt-1 w-full !py-2.5 text-[0.62rem] sm:mt-2"
          >
            {t.hostesses.viewProfile}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(FeaturedHostessCard);
