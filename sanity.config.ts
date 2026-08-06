import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { withUniqueFeaturedPublish } from "./sanity/lib/uniqueFeaturedPublish";

// Studio is embedded in the Next.js app at /studio (see
// app/studio/[[...tool]]/page.tsx) rather than deployed separately.
//
// Built for a non-technical editor: no Vision (GROQ query) tool — that's a
// developer tool with no place in a simplified editing experience — and a
// single-item sidebar (see sanity/structure.ts) instead of the generic
// multi-type content browser.
export default defineConfig({
  name: "elite-one-spa",
  title: "Elite One Spa — Hostesses",
  basePath: "/studio",
  projectId, 
  dataset,
  schema: { types: schemaTypes },
  plugins: [structureTool({ structure })],
  document: {
    // Scoped to `hostess` only — every other document type keeps Studio's
    // default actions untouched. See uniqueFeaturedPublish.ts for why this
    // is what guarantees only one hostess can ever be featured at once.
    actions: (prev, context) =>
      context.schemaType === "hostess"
        ? prev.map((action) =>
            action.action === "publish" ? withUniqueFeaturedPublish(action) : action
          )
        : prev,
  },
});
