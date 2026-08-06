"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../sanity.config";

// Isolated behind "use client" on purpose: sanity.config.ts pulls in the
// full Studio internals (which use client-only hooks). Importing it
// directly from the Server Component page.tsx drags that graph into the
// server bundle and breaks (swr's "react-server" export condition doesn't
// expose the hooks Studio needs). Keeping the import inside this client
// boundary keeps it out of the server graph entirely.
export default function StudioClient() {
  return <NextStudio config={config} />;
}
