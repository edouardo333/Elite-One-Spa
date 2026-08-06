export type HostessStatus = "available" | "soon" | "off";

export interface HostessRecord {
  id: string;
  status: HostessStatus;
  rating: number;
  premium?: boolean;
  newArrival?: boolean;
  staffFavorite?: boolean;
  popular?: boolean;
  gradient: [string, string];
  age: number;
  heightCm: number;
  weightLb: number;
  measurements: string;
  /** Real portrait, when management has approved one. Falls back to the premium placeholder when absent. */
  photo?: string;
  gallery?: string[];
}
