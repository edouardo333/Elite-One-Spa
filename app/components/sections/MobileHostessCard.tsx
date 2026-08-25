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

// Purpose-built mobile card — not a variant of the desktop `HostessCard`.
// No framer-motion instance, no `backdrop-filter` (the badges below use a
// solid, near-opaque background instead of frosted glass), no gradient
// vignette/grain layers over the photo, no continuous transforms. Only the
// fields called out as "essential" render; weight/measurements/bio stay on
// the full profile modal. Filtering swaps which of these are mounted in
// Hostesses.tsx — this component itself never animates in/out or resizes.
function MobileHostessCard({
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
      className="relative cursor-pointer overflow-hidden rounded-[var(--radius-md)] border"
      style={{ borderColor: "var(--color-border)", backgroundColor: "rgba(244,239,232,0.03)" }}
      onClick={() => onSelect(hostess.id)}
    >
      {/* Image block — fixed height range (not aspect-ratio) so it never
          balloons to near-full-screen on a tall phone. `fill` + `cover`
          means Next/Image only ever decodes what this box actually shows. */}
      <div
        className="relative w-full overflow-hidden"
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
            // The card sits in a `max-w-md` column inset by the site's
            // `.container` padding (20px/side at narrow widths) — never
            // actually 100vw. `100vw` was true to the container's *class*
            // but not its real rendered width, so the browser picked the
            // largest srcset candidate (up to 3840w) for a ~330px-wide box,
            // decoding several times more pixels than ever get painted —
            // real memory pressure per card on iOS Safari.
            sizes="(max-width: 480px) 90vw, 420px"
            loading="lazy"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <SilhouetteIcon className="h-12 w-12" style={{ color: "rgba(244,239,232,0.55)" }} />
          </div>
        )}
        {/* Single flat scrim, no blur, just enough for badge legibility. */}
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

      <div className="flex flex-col gap-2.5 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-[0.95rem] font-medium leading-tight text-[var(--color-offwhite)]">
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
          className="btn btn-secondary mt-1 w-full !py-2.5 text-[0.62rem]"
        >
          {t.hostesses.viewProfile}
        </button>
      </div>
    </div>
  );
}

export default memo(MobileHostessCard);
