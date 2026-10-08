"use client";

import { Mail, Heart, Code2, Network } from "lucide-react";
import { cn } from "../../lib/utils";

const socialLinks = [
  { name: "GitHub", url: "https://github.com/giabao1511", icon: Code2 },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/bao-chau-gia-a2761a244",
    icon: Network,
  },
  { name: "Email", url: "mailto:giabao712411@gmail.com", icon: Mail },
];

const navLinks = [
  { name: "Experience", href: "#experience" },
  { name: "Tech Arsenal", href: "#tech" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="relative py-12 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-zinc-50 mb-1">
              Chau Gia Bao
            </h3>
            <p className="text-sm text-zinc-500">Software Engineer</p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-zinc-400 hover:text-accent-cyan transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex gap-4">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "w-10 h-10 rounded-full border border-zinc-800",
                    "flex items-center justify-center",
                    "text-zinc-400 hover:text-accent-cyan hover:border-accent-cyan/50",
                    "transition-all duration-300",
                  )}
                  aria-label={link.name}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
          <p className="text-sm text-zinc-500 flex items-center justify-center gap-1">
            Built with
            <Heart className="w-4 h-4 text-accent-cyan" />
            using Next.js + Tailwind CSS
          </p>
          <p className="text-xs text-zinc-600 mt-2">
            © {new Date().getFullYear()} Chau Gia Bao. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
