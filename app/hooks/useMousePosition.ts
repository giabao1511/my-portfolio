"use client";

import { useEffect, useRef, useState } from "react";

export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const prevPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      // Calculate velocity from movement delta
      const vx = e.clientX - prevPosition.current.x;
      const vy = e.clientY - prevPosition.current.y;

      // Normalized -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;

      prevPosition.current = { x: e.clientX, y: e.clientY };

      setPosition({ x, y });
      setVelocity({ x: vx, y: vy });
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return {
    x: position.x,
    y: position.y,
    vx: velocity.x,
    vy: velocity.y,
  };
}
