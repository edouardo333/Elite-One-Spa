import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import AboutHostessesScene from "@/app/components/sections/AboutHostessesScene";
import Hiring from "@/app/components/sections/Hiring";
import Contact from "@/app/components/sections/Contact";
import Footer from "@/app/components/Footer";
import ScrollIntentHandler from "@/app/components/ScrollIntentHandler";

export default function Home() {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <ScrollIntentHandler />
      <Navbar />
      <Hero />
      <AboutHostessesScene />
      <Hiring />
      <Contact />
      <Footer />
    </main>
  );
}
