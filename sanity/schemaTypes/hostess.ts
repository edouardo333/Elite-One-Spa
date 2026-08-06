import { defineField, defineType } from "sanity";
import { autoDisplayOrder, autoGradientFrom, autoGradientTo } from "./hostessDefaults";

// Backs the "Who's Available Now" section only. Every other page section
// (hero, services, hiring, contact, footer, nav) stays static in
// app/lib/language/translations.ts — intentionally not modeled here.
//
// Built for a non-technical editor: fields are grouped into plain-language
// tabs, every field has a friendly title + description, and anything
// developer-only (internal ids, star rating, avatar gradient colors) is
// hidden entirely with a sensible auto-filled default — see
// hostessDefaults.ts.
export const hostessType = defineType({
  name: "hostess",
  title: "Hostess",
  type: "document",
  groups: [
    { name: "basic", title: "Basic Information", default: true },
    { name: "photo", title: "Photo" },
    { name: "availability", title: "Availability" },
    { name: "services", title: "Services" },
    { name: "languages", title: "Languages" },
    { name: "badges", title: "Badges" },
    { name: "advanced", title: "Advanced (optional)" },
  ],
  fields: [
    // ── 1. Basic Information ────────────────────────────────────────────
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Her name, shown to clients on the website.",
      group: "basic",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featured",
      title: "⭐ Featured Hostess (Large Homepage Card)",
      type: "boolean",
      description:
        "Shows her in the large featured card at the top of the homepage roster. Turning this on and publishing automatically turns it off for every other hostess — only one hostess can ever be featured at a time, so you never need to remember to switch the previous one off.",
      initialValue: false,
      group: "basic",
    }),
    defineField({
      name: "age",
      title: "Age",
      type: "number",
      description: "Her age in years. Must be 18 or older.",
      group: "basic",
      validation: (Rule) => Rule.required().integer().min(18),
    }),
    defineField({
      name: "height",
      title: "Height (cm)",
      type: "number",
      description: "Her height in centimeters — for example, 165.",
      group: "basic",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "weight",
      title: "Weight (lb)",
      type: "number",
      description: "Her weight in pounds — for example, 120.",
      group: "basic",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "measurements",
      title: "Measurements",
      type: "string",
      description: 'Body measurements shown on her profile — for example, "34C".',
      group: "basic",
    }),
    defineField({
      name: "shortDescription",
      title: "Description",
      type: "text",
      rows: 4,
      description:
        "A short, warm description shown on the website. Two or three sentences works best.",
      group: "basic",
    }),

    // ── 2. Photo ─────────────────────────────────────────────────────────
    defineField({
      name: "mainPhoto",
      title: "Main Photo",
      type: "image",
      description: "Her main photo — shown on her card everywhere on the site.",
      options: { hotspot: true },
      group: "photo",
    }),
    defineField({
      name: "gallery",
      title: "Gallery Photos",
      type: "array",
      description: "Extra photos shown when a client opens her full profile. Add as many as you like.",
      of: [{ type: "image", options: { hotspot: true } }],
      group: "photo",
    }),

    // ── 3. Availability ──────────────────────────────────────────────────
    defineField({
      name: "status",
      title: "Availability Status",
      type: "string",
      description:
        "Controls the live badge on her card. Changes appear on the website within about a minute.",
      options: {
        layout: "dropdown",
        list: [
          { title: "Available Now", value: "available" },
          { title: "Coming Soon", value: "comingSoon" },
          { title: "Off Today", value: "offToday" },
        ],
      },
      initialValue: "available",
      group: "availability",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "availableUntil",
      title: "Available Until",
      type: "string",
      description:
        'Short note next to her status — for example, "Tonight until 10 PM" or "Back tomorrow". Optional.',
      group: "availability",
    }),
    defineField({
      name: "active",
      title: "Show on Website",
      type: "boolean",
      description: "Turn this off to temporarily hide her from the website without deleting her profile.",
      initialValue: true,
      group: "availability",
    }),

    // ── 4. Services ──────────────────────────────────────────────────────
    defineField({
      name: "services",
      title: "Services Offered",
      type: "array",
      description: "The services she offers. Type one and press Enter to add it.",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      group: "services",
    }),

    // ── 5. Languages ─────────────────────────────────────────────────────
    defineField({
      name: "languages",
      title: "Languages Spoken",
      type: "array",
      description: "Languages she speaks. Type one and press Enter to add it.",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      group: "languages",
    }),

    // ── 6. Badges ────────────────────────────────────────────────────────
    defineField({
      name: "premium",
      title: "Premium",
      type: "boolean",
      description: "Shows a 💎 Premium badge on her card.",
      initialValue: false,
      group: "badges",
    }),
    defineField({
      name: "popularToday",
      title: "Popular Today",
      type: "boolean",
      description:
        "Shows a 🔥 Popular Today badge on her card. She'll also be pinned above every other hostess in the lists, ordered by Position on the Page among other Popular Today hostesses.",
      initialValue: false,
      group: "badges",
    }),
    defineField({
      name: "newArrival",
      title: "New Arrival",
      type: "boolean",
      description: "Shows a ✨ New Arrival badge on her card.",
      initialValue: false,
      group: "badges",
    }),
    defineField({
      name: "staffFavorite",
      title: "Staff Favorite",
      type: "boolean",
      description: "Shows a ⭐ Staff Favorite badge on her card.",
      initialValue: false,
      group: "badges",
    }),

    // ── Advanced (optional) — everyday edits never need this tab ─────────
    defineField({
      name: "displayOrder",
      title: "Position on the Page",
      type: "number",
      description:
        "Controls her order in the list — lower numbers appear first. New hostesses are placed at the end automatically, so you can usually leave this alone.",
      initialValue: autoDisplayOrder,
      group: "advanced",
    }),

    // ── Hidden — developer-only, never shown to editors ───────────────────
    // Kept in the schema (with automatic defaults) purely so the website's
    // existing card/avatar design keeps working exactly as before.
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      hidden: true,
      initialValue: 5,
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: "gradientFrom",
      title: "Gradient — from",
      type: "string",
      hidden: true,
      initialValue: autoGradientFrom,
    }),
    defineField({
      name: "gradientTo",
      title: "Gradient — to",
      type: "string",
      hidden: true,
      initialValue: autoGradientTo,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "status",
      media: "mainPhoto",
      order: "displayOrder",
      active: "active",
      featured: "featured",
    },
    prepare({ title, subtitle, media, order, active, featured }) {
      const statusLabel =
        subtitle === "comingSoon" ? "Coming soon" : subtitle === "offToday" ? "Off today" : "Available now";
      return {
        title: `${featured ? "⭐ Featured — " : ""}${active === false ? "⚫ Hidden — " : ""}${title ?? "Untitled"}`,
        subtitle: `#${order ?? "?"} — ${statusLabel}`,
        media,
      };
    },
  },
});
