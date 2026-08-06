import type { Image } from "sanity";
import { client } from "./client";
import { urlForImage } from "./image";
import { ACTIVE_HOSTESSES_QUERY } from "./queries";
import type { HostessRecord, HostessStatus } from "@/app/data/hostesses";

// No webhooks yet — freshness is purely time-based. Lower this if the spa
// needs Studio edits to appear faster; raise it to cut API calls further.
const REVALIDATE_SECONDS = 60;

// The bio/languages/services/etc. text Sanity now owns for a hostess. Not
// localized (single Sanity field per hostess, not a fr/en pair) — see the
// Phase 4 summary for why. `location` is intentionally absent: it isn't part
// of the agreed schema, so it keeps coming from the untouched, still-
// bilingual translations.ts, merged in by the Hostesses component itself.
export interface HostessCardText {
  id: string;
  name: string;
  bio: string;
  schedule: string;
  languages: string[];
  services: string[];
}

interface SanityHostessDoc {
  _id: string;
  name: string;
  status: "available" | "comingSoon" | "offToday";
  mainPhoto?: Image;
  gallery?: Image[];
  age: number;
  height: number;
  weight: number;
  measurements: string;
  shortDescription: string;
  languages?: string[];
  services?: string[];
  availableUntil: string;
  rating: number;
  gradientFrom: string;
  gradientTo: string;
  premium?: boolean;
  popularToday?: boolean;
  newArrival?: boolean;
  staffFavorite?: boolean;
  displayOrder: number;
}

const STATUS_FROM_SANITY: Record<SanityHostessDoc["status"], HostessStatus> = {
  available: "available",
  comingSoon: "soon",
  offToday: "off",
};

// Studio documents are seeded as "hostess-<id>" (see scripts/seed-hostesses.ts)
// so the site keeps using the same short ids it always has (routing,
// selectedId state, React keys). Documents created directly in Studio without
// that prefix just fall back to their raw _id.
function slugFromId(sanityId: string) {
  return sanityId.startsWith("hostess-") ? sanityId.slice("hostess-".length) : sanityId;
}

function toHostessRecord(doc: SanityHostessDoc): HostessRecord {
  return {
    id: slugFromId(doc._id),
    status: STATUS_FROM_SANITY[doc.status],
    rating: doc.rating,
    premium: doc.premium,
    newArrival: doc.newArrival,
    staffFavorite: doc.staffFavorite,
    popular: doc.popularToday,
    gradient: [doc.gradientFrom, doc.gradientTo],
    age: doc.age,
    heightCm: doc.height,
    weightLb: doc.weight,
    measurements: doc.measurements,
    photo: doc.mainPhoto ? urlForImage(doc.mainPhoto).width(800).fit("crop").url() : undefined,
    gallery: doc.gallery?.length
      ? doc.gallery.map((img) => urlForImage(img).width(600).fit("crop").url())
      : undefined,
  };
}

function toHostessText(doc: SanityHostessDoc): HostessCardText {
  return {
    id: slugFromId(doc._id),
    name: doc.name,
    bio: doc.shortDescription,
    schedule: doc.availableUntil,
    languages: doc.languages ?? [],
    services: doc.services ?? [],
  };
}

/**
 * Fetches the active "Who's Available Now" roster from Sanity, sorted by
 * displayOrder. This is the sole source of truth for the section — there is
 * no static fallback, so an empty/misconfigured dataset simply renders an
 * empty roster rather than masking the problem with placeholder hostesses.
 */
export async function getHostesses(): Promise<{
  hostesses: HostessRecord[];
  hostessText: Record<string, HostessCardText>;
}> {
  try {
    const docs = await client.fetch<SanityHostessDoc[]>(
      ACTIVE_HOSTESSES_QUERY,
      {},
      { next: { revalidate: REVALIDATE_SECONDS } }
    );
    const hostesses = (docs ?? []).map(toHostessRecord);
    const hostessText = Object.fromEntries(
      (docs ?? []).map((doc) => [slugFromId(doc._id), toHostessText(doc)])
    );
    return { hostesses, hostessText };
  } catch (error) {
    console.warn(
      "[sanity] Failed to fetch hostesses:",
      error instanceof Error ? error.message : error
    );
    return { hostesses: [], hostessText: {} };
  }
}
