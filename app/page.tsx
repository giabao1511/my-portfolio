import { HeroSection } from "./components/hero/HeroSection";
import { MagneticCursor } from "./components/ui/MagneticCursor";
import { ExperienceSection } from "./components/experience/ExperienceSection";
import { TechArsenalSection } from "./components/tech/TechArsenalSection";
import { AboutSection } from "./components/about/AboutSection";
import { ContactSection } from "./components/contact/ContactSection";
import { Footer } from "./components/footer/Footer";
import { TerminalProvider } from "./components/terminal";

export default function Home() {
  return (
    <TerminalProvider>
      <main>
        <MagneticCursor />
        <HeroSection />
        <ExperienceSection />
        <TechArsenalSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </TerminalProvider>
  );
}
