import type { StructureResolver } from "sanity/structure";

// Single-item sidebar: "Hostesses" is the only thing a staff editor ever
// needs to see. Plural, friendly label instead of the schema's internal
// singular type name ("hostess").
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Elite One Spa")
    .items([S.documentTypeListItem("hostess").title("Hostesses")]);
