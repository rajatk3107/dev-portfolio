import { useCallback, useState } from "react";
import { useLenis } from "./motion/useLenis";
import { ScrollTrigger } from "./motion/gsap";
import { Preloader } from "./scenes/Preloader";
import { Hero } from "./scenes/Hero";
import { About } from "./scenes/About";
import { CaseStudies } from "./scenes/CaseStudies";
import { Experience } from "./scenes/Experience";
import { Contact } from "./scenes/Contact";
import { Cursor } from "./ui/Cursor";
import { ScrollProgress } from "./ui/ScrollProgress";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const handleLoaded = useCallback(() => {
    setLoaded(true);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);
  useLenis();

  return (
    <>
      <Preloader onComplete={handleLoaded} />
      <Cursor />
      <ScrollProgress />
      <main>
        <Hero ready={loaded} />
        <About />
        <CaseStudies />
        <Experience />
        <Contact />
      </main>
    </>
  );
}
