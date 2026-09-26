"use client";

import { TechCard } from "./TechCard";
import { TECH_STACK } from "../../lib/constants";

export function TechArsenalGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {TECH_STACK.map((tech, index) => (
        <TechCard
          key={tech.name}
          name={tech.name}
          category={tech.category}
          rating={tech.rating}
          years={tech.years}
          color={tech.color}
          index={index}
        />
      ))}
    </div>
  );
}
