import type { Metadata } from "next";
import BusinessCard from "./BusinessCard";

export const metadata: Metadata = {
  alternates: {
    canonical: "/business-card",
  },
};

export default function BusinessCardPage() {
  return <BusinessCard />;
}
