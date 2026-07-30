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

// Cycle used by the live-availability simulation so status badges
// occasionally shift on their own, giving the section a "live" feel.
export const HOSTESS_STATUS_CYCLE: Record<HostessStatus, HostessStatus> = {
  available: "soon",
  soon: "off",
  off: "available",
};

export const HOSTESS_DATA: HostessRecord[] = [
  {
    id: "sofia",
    status: "available",
    rating: 5,
    premium: true,
    popular: true,
    gradient: ["#4a1626", "#e87896"],
    age: 27,
    heightCm: 168,
    weightLb: 121,
    measurements: "34C",
  },
  {
    id: "amara",
    status: "available",
    rating: 4.9,
    newArrival: true,
    gradient: ["#2a1420", "#c69a72"],
    age: 25,
    heightCm: 165,
    weightLb: 118,
    measurements: "32B",
  },
  {
    id: "valentina",
    status: "available",
    rating: 5,
    staffFavorite: true,
    gradient: ["#4a1626", "#e8c9ab"],
    age: 29,
    heightCm: 170,
    weightLb: 125,
    measurements: "34D",
  },
  {
    id: "camille",
    status: "available",
    rating: 4.7,
    gradient: ["#2a1420", "#e87896"],
    age: 24,
    heightCm: 162,
    weightLb: 114,
    measurements: "32A",
  },
  {
    id: "ines",
    status: "available",
    rating: 4.9,
    premium: true,
    gradient: ["#4a1626", "#c69a72"],
    age: 28,
    heightCm: 167,
    weightLb: 123,
    measurements: "34B",
  },
  {
    id: "jade",
    status: "available",
    rating: 4.8,
    newArrival: true,
    gradient: ["#2a1420", "#f2ddc3"],
    age: 23,
    heightCm: 160,
    weightLb: 112,
    measurements: "32B",
  },
  {
    id: "nora",
    status: "soon",
    rating: 4.9,
    gradient: ["#4a1626", "#e87896"],
    age: 30,
    heightCm: 172,
    weightLb: 128,
    measurements: "36C",
  },
  {
    id: "lea",
    status: "soon",
    rating: 4.6,
    newArrival: true,
    gradient: ["#2a1420", "#c69a72"],
    age: 23,
    heightCm: 160,
    weightLb: 110,
    measurements: "30B",
  },
  {
    id: "maya",
    status: "off",
    rating: 5,
    premium: true,
    staffFavorite: true,
    gradient: ["#4a1626", "#e8c9ab"],
    age: 31,
    heightCm: 169,
    weightLb: 126,
    measurements: "34C",
  },
  {
    id: "chloe",
    status: "off",
    rating: 4.8,
    gradient: ["#2a1420", "#e87896"],
    age: 26,
    heightCm: 164,
    weightLb: 117,
    measurements: "32C",
  },
];
