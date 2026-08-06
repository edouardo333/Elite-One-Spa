import StudioClient from "../StudioClient";

// Studio manages its own client-side routing/rendering entirely; nothing
// here depends on request data, so it can be served statically.
export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <StudioClient />;
}
