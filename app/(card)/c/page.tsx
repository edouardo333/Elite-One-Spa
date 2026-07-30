import type { Metadata } from "next";
import { redirect } from "next/navigation";

// /c is the short QR-code target; it has no content of its own, so it's
// kept out of search results while /business-card (the real destination)
// stays indexable.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default function ShortLinkRedirect() {
  redirect("/business-card");
}
