// Only active hostesses, ordered for display: every "Popular Today" hostess
// first (sorted by Position on the Page among themselves), then everyone
// else, also by Position on the Page. Driven entirely by the popularToday
// and displayOrder fields — nothing about ordering is hardcoded client-side,
// so this single query drives the featured hostess, the grid, and every
// filter. Inactive documents are excluded here rather than filtered
// client-side, so they never ship to the browser at all.
export const ACTIVE_HOSTESSES_QUERY = /* groq */ `
  *[_type == "hostess" && active == true] | order(popularToday desc, displayOrder asc)
`;
