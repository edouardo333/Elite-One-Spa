import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/sections/About";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Navbar />
      <Hero />
      <About />
    </main>
  );
}
