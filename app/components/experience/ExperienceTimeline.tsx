"use client";

import { ExperienceCard } from "./ExperienceCard";
import { EXPERIENCE } from "../../lib/constants";

export function ExperienceTimeline() {
  return (
    <div className="relative">
      {/* Timeline vertical line */}
      <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-accent-cyan/50 via-accent-violet/50 to-accent-emerald/50" />

      {/* Desktop: 2-column grid */}
      <div className="hidden lg:block">
        <div className="space-y-12">
          {EXPERIENCE.map((exp, index) => (
            <div key={exp.id} className="relative pl-12">
              <ExperienceCard
                company={exp.company}
                period={exp.period}
                role={exp.role}
                color={exp.color}
                achievements={exp.achievements}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: vertical stack */}
      <div className="lg:hidden space-y-8 pl-8">
        {EXPERIENCE.map((exp, index) => (
          <ExperienceCard
            key={exp.id}
            company={exp.company}
            period={exp.period}
            role={exp.role}
            color={exp.color}
            achievements={exp.achievements}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
