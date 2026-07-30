import type { Metadata } from "next";
import BusinessCardPlaceholder from "./BusinessCardPlaceholder";

export const metadata: Metadata = {
  alternates: {
    canonical: "/business-card",
  },
};

export default function BusinessCardPage() {
  return <BusinessCardPlaceholder />;
}
