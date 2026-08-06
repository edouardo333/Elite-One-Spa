export type HostessStatus = "available" | "soon" | "off";

export interface HostessRecord {
  id: string;
  status: HostessStatus;
  rating: number;
  premium?: boolean;
  newArrival?: boolean;
  staffFavorite?: boolean;
  popular?: boolean;
  /** Set on at most one hostess at a time — see sanity/lib/uniqueFeaturedPublish.ts. Drives the homepage's large featured card. */
  featured?: boolean;
  /** "Position on the Page" in Studio — also the tiebreaker/fallback ordering for the featured card when nobody is explicitly featured. */
  displayOrder: number;
  gradient: [string, string];
  age: number;
  heightCm: number;
  weightLb: number;
  measurements: string;
  /** Real portrait, when management has approved one. Falls back to the premium placeholder when absent. */
  photo?: string;
  gallery?: string[];
}
