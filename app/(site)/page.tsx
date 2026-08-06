import dynamic from "next/dynamic";
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import ScrollIntentHandler from "@/app/components/ScrollIntentHandler";
import { getHostesses } from "@/sanity/lib/getHostesses";

// Below-the-fold sections are code-split out of the initial JS payload.
// `ssr: true` (the default) still renders their full markup on the server,
// so content stays SEO-visible and there's no loading flash — only the
// client-side hydration work is deferred off the critical first-paint path.
const AboutHostessesScene = dynamic(
  () => import("@/app/components/sections/AboutHostessesScene")
);
const Hiring = dynamic(() => import("@/app/components/sections/Hiring"));
const Contact = dynamic(() => import("@/app/components/sections/Contact"));
const Footer = dynamic(() => import("@/app/components/Footer"));

export default async function Home() {
  // Only the "Who's Available Now" roster is Sanity-backed. Everything else
  // on the page stays static, as before.
  const { hostesses, hostessText } = await getHostesses();

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <ScrollIntentHandler />
      <Navbar />
      <Hero />
      <AboutHostessesScene hostesses={hostesses} hostessText={hostessText} />
      <Hiring />
      <Contact />
      <Footer />
    </main>
  );
}
