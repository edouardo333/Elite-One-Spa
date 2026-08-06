import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

// Read-only client for the public website. No token: the "Who's Available
// Now" content is public marketing data, so an unauthenticated read is
// sufficient — Studio writes use Sanity's own authenticated session instead.
//
// useCdn is false on purpose: freshness here is driven by Next.js's own
// fetch-level revalidation (see sanity/lib/getHostesses.ts), which only
// takes effect when requests bypass Sanity's separate CDN cache layer.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});
