import type { HostessRecord } from "./hostesses";
import type { HostessCardText } from "@/sanity/lib/getHostesses";
import type { Locale } from "@/app/lib/language/translations";

/**
 * Local recovery data for the "Who's Available Now" roster.
 *
 * Sanity is still the single source of truth (see sanity/lib/getHostesses.ts)
 * — this file only exists so the section keeps working when Sanity auth is
 * broken or the dataset is temporarily empty. It's the last 10 hostesses
 * that ever shipped from this repo's static data (recovered from commit
 * cb6cf02, the last commit before the Sanity CMS migration in 7bcb213 wiped
 * app/data/hostesses.ts down to just the type definitions). No 11th/12th
 * hostess has ever existed in this repo's Git history or translations —
 * only these 10 ids.
 *
 * No `photo`/`gallery` is set here either, matching that same commit: this
 * roster never had real portraits checked in, so cards fall back to the
 * existing silhouette placeholder, exactly as before.
 */
export const FALLBACK_HOSTESS_DATA: HostessRecord[] = [
  {
    id: "sofia",
    status: "available",
    rating: 5,
    premium: true,
    popular: true,
    displayOrder: 0,
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
    displayOrder: 10,
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
    displayOrder: 20,
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
    displayOrder: 30,
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
    displayOrder: 40,
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
    displayOrder: 50,
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
    displayOrder: 60,
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
    displayOrder: 70,
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
    displayOrder: 80,
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
    displayOrder: 90,
    gradient: ["#2a1420", "#e87896"],
    age: 26,
    heightCm: 164,
    weightLb: 117,
    measurements: "32C",
  },
];

// Bio/schedule/languages/services text, recovered from the same pre-Sanity
// commit's app/lib/language/translations.ts (fr + en `hostesses.list`
// blocks). "location" is intentionally absent here — Hostesses.tsx already
// merges it in from t.hostesses.location for every source, Sanity or local.
const FALLBACK_HOSTESS_TEXT_FR: Record<string, HostessCardText> = {
  sofia: {
    id: "sofia",
    name: "Sofia",
    bio: "Un accueil tout en grâce, empreint de chaleur sincère et d’une élégance naturelle qui donne le ton à votre visite.",
    schedule: "Disponible jusqu’à 23h00",
    languages: ["Français", "Anglais"],
    services: ["Massage suédois", "Massage aux pierres chaudes", "Massage en duo"],
  },
  amara: {
    id: "amara",
    name: "Amara",
    bio: "Une présence lumineuse et attentive, portée par une douceur qui met immédiatement à l’aise.",
    schedule: "Disponible jusqu’à 22h00",
    languages: ["Français", "Anglais", "Espagnol"],
    services: ["Massage suédois", "Aromathérapie", "Soin du corps à l’huile chaude"],
  },
  valentina: {
    id: "valentina",
    name: "Valentina",
    bio: "Reconnue pour son écoute et son raffinement, elle incarne l’excellence du service Elite One.",
    schedule: "Disponible jusqu’à minuit",
    languages: ["Français", "Anglais", "Espagnol"],
    services: ["Massage tantrique", "Massage en duo", "Massage aux pierres chaudes"],
  },
  camille: {
    id: "camille",
    name: "Camille",
    bio: "Discrète et posée, elle offre une présence apaisante qui invite au lâcher-prise.",
    schedule: "Disponible jusqu’à 21h30",
    languages: ["Français", "Anglais"],
    services: ["Massage suédois", "Aromathérapie", "Soin du corps à l’huile chaude"],
  },
  ines: {
    id: "ines",
    name: "Inès",
    bio: "Une élégance tranquille et une attention sincère, pensées pour un moment entièrement dédié à vous.",
    schedule: "Disponible jusqu’à 23h30",
    languages: ["Français", "Anglais"],
    services: ["Massage aux pierres chaudes", "Massage tantrique", "Aromathérapie"],
  },
  jade: {
    id: "jade",
    name: "Jade",
    bio: "Fraîcheur et sensibilité se rencontrent dans une présence chaleureuse et résolument attentionnée.",
    schedule: "Disponible jusqu’à 22h30",
    languages: ["Français", "Anglais"],
    services: ["Massage suédois", "Massage en duo", "Aromathérapie"],
  },
  nora: {
    id: "nora",
    name: "Nora",
    bio: "Grâce naturelle et sourire sincère — elle rejoint le service en fin de journée.",
    schedule: "Disponible dès 18h00",
    languages: ["Français", "Anglais"],
    services: ["Massage suédois", "Soin du corps à l’huile chaude", "Massage aux pierres chaudes"],
  },
  lea: {
    id: "lea",
    name: "Léa",
    bio: "Une nouvelle venue à la présence délicate, impatiente de vous accueillir bientôt.",
    schedule: "Disponible dès 19h00",
    languages: ["Français", "Anglais"],
    services: ["Massage suédois", "Aromathérapie", "Massage en duo"],
  },
  maya: {
    id: "maya",
    name: "Maya",
    bio: "Coup de cœur de l’équipe, elle sera de retour dès demain pour vous accueillir.",
    schedule: "Absente aujourd’hui — retour demain",
    languages: ["Français", "Anglais", "Espagnol"],
    services: ["Massage tantrique", "Massage aux pierres chaudes", "Massage en duo"],
  },
  chloe: {
    id: "chloe",
    name: "Chloé",
    bio: "Une présence tout en douceur, actuellement en repos pour la journée.",
    schedule: "Absente aujourd’hui",
    languages: ["Français", "Anglais"],
    services: ["Massage suédois", "Aromathérapie", "Soin du corps à l’huile chaude"],
  },
};

const FALLBACK_HOSTESS_TEXT_EN: Record<string, HostessCardText> = {
  sofia: {
    id: "sofia",
    name: "Sofia",
    bio: "A graceful welcome, warm and genuine — her natural elegance sets the tone for your visit.",
    schedule: "Available until 11:00 PM",
    languages: ["French", "English"],
    services: ["Swedish Massage", "Hot Stone Massage", "Duo Massage"],
  },
  amara: {
    id: "amara",
    name: "Amara",
    bio: "A bright, attentive presence, carried by a gentle warmth that puts you at ease from the first moment.",
    schedule: "Available until 10:00 PM",
    languages: ["French", "English", "Spanish"],
    services: ["Swedish Massage", "Aromatherapy", "Hot Oil Body Treatment"],
  },
  valentina: {
    id: "valentina",
    name: "Valentina",
    bio: "Known for her attentiveness and refinement, she embodies the Elite One standard of service.",
    schedule: "Available until midnight",
    languages: ["French", "English", "Spanish"],
    services: ["Tantric Massage", "Duo Massage", "Hot Stone Massage"],
  },
  camille: {
    id: "camille",
    name: "Camille",
    bio: "Composed and discreet, her calming presence invites you to simply let go.",
    schedule: "Available until 9:30 PM",
    languages: ["French", "English"],
    services: ["Swedish Massage", "Aromatherapy", "Hot Oil Body Treatment"],
  },
  ines: {
    id: "ines",
    name: "Inès",
    bio: "Quiet elegance and genuine care, devoted entirely to your moment of escape.",
    schedule: "Available until 11:30 PM",
    languages: ["French", "English"],
    services: ["Hot Stone Massage", "Tantric Massage", "Aromatherapy"],
  },
  jade: {
    id: "jade",
    name: "Jade",
    bio: "Freshness and sensitivity meet in a warm, deeply attentive presence.",
    schedule: "Available until 10:30 PM",
    languages: ["French", "English"],
    services: ["Swedish Massage", "Duo Massage", "Aromatherapy"],
  },
  nora: {
    id: "nora",
    name: "Nora",
    bio: "Natural grace and a genuine smile — she joins the floor later today.",
    schedule: "Available from 6:00 PM",
    languages: ["French", "English"],
    services: ["Swedish Massage", "Hot Oil Body Treatment", "Hot Stone Massage"],
  },
  lea: {
    id: "lea",
    name: "Léa",
    bio: "A delicate new presence, looking forward to welcoming you soon.",
    schedule: "Available from 7:00 PM",
    languages: ["French", "English"],
    services: ["Swedish Massage", "Aromatherapy", "Duo Massage"],
  },
  maya: {
    id: "maya",
    name: "Maya",
    bio: "A team favorite, she’ll be back tomorrow to welcome you.",
    schedule: "Off today — back tomorrow",
    languages: ["French", "English", "Spanish"],
    services: ["Tantric Massage", "Hot Stone Massage", "Duo Massage"],
  },
  chloe: {
    id: "chloe",
    name: "Chloé",
    bio: "A gentle, soothing presence, currently resting for the day.",
    schedule: "Off today",
    languages: ["French", "English"],
    services: ["Swedish Massage", "Aromatherapy", "Hot Oil Body Treatment"],
  },
};

export const FALLBACK_HOSTESS_TEXT: Record<Locale, Record<string, HostessCardText>> = {
  fr: FALLBACK_HOSTESS_TEXT_FR,
  en: FALLBACK_HOSTESS_TEXT_EN,
};
