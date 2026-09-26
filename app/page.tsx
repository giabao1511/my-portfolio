import { HeroSection } from "./components/hero/HeroSection";
import { MagneticCursor } from "./components/ui/MagneticCursor";
import { ExperienceSection } from "./components/experience/ExperienceSection";
import { TerminalProvider, TerminalOpener } from "./components/terminal";

export default function Home() {
  return (
    <TerminalProvider>
      <main>
        <MagneticCursor />
        <HeroSection />
        <ExperienceSection />

        {/* Contact Section */}
        <section id="contact" className="py-24 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-zinc-50 mb-4">
              Get In Touch
            </h2>
            <p className="text-zinc-400 mb-8">
              Interested in working together? Let&apos;s connect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:giabao712411@gmail.com"
                className="px-8 py-3 rounded-full bg-accent-cyan text-zinc-950 font-medium hover:shadow-glow-cyan transition-all"
              >
                Email Me
              </a>
              <TerminalOpener />
            </div>
          </div>
        </section>
      </main>
    </TerminalProvider>
  );
}
