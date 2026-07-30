import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutHostessesScene from "./components/sections/AboutHostessesScene";
import Hiring from "./components/sections/Hiring";
import Contact from "./components/sections/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <Navbar />
      <Hero />
      <AboutHostessesScene />
      <Hiring />
      <Contact />
      <Footer />
    </main>
  );
}
