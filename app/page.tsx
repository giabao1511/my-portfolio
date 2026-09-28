import { HeroSection } from "./components/hero/HeroSection";
import { Cursor } from "./components/effects/Cursor";
import { Scene } from "./components/canvas/Scene";
import { ExperienceSection } from "./components/experience/ExperienceSection";
import { TechArsenalSection } from "./components/tech/TechArsenalSection";
import { AboutSection } from "./components/about/AboutSection";
import { ContactSection } from "./components/contact/ContactSection";
import { Footer } from "./components/footer/Footer";
import { TerminalProvider } from "./components/terminal";
import { RecruiterModeToggle } from "./components/ui/RecruiterModeToggle";
import { BentoStats } from "./components/hero/BentoStats";
import { EngineeringHUD } from "./components/hud/EngineeringHUD";
import { SystemArchitecture } from "./components/architecture/SystemArchitecture";
import { useRecruiterMode } from "./contexts/RecruiterModeContext";

// Recruiter mode clean layout component
function RecruiterModeView() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Chau Gia Bao
        </h1>
        <p className="text-xl text-accent-cyan mb-8">
          Software Engineer
        </p>
        <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
          Building high-performance web platforms with TypeScript, Next.js, and distributed systems architecture.
        </p>
        <a
          href="/resume.pdf"
          download
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-cyan text-background font-semibold hover:bg-accent-cyan/90 transition-colors"
        >
          Download Resume
        </a>
      </div>
    </div>
  );
}

// Main page component
export default function Home() {
  const { isEnabled: isRecruiterMode } = useRecruiterMode();

  return (
    <TerminalProvider>
      {isRecruiterMode ? (
        <RecruiterModeView />
      ) : (
        <>
          <Scene />
          <main>
            <Cursor />
            <HeroSection />
            <BentoStats />
            <EngineeringHUD />
            <SystemArchitecture />
            <ExperienceSection />
            <TechArsenalSection />
            <AboutSection />
            <ContactSection />
          </main>
          <Footer />
        </>
      )}
      <RecruiterModeToggle />
    </TerminalProvider>
  );
}
