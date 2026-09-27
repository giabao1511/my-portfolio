"use client";

import { useEffect, useRef, useState } from "react";

export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const prevPosition = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      // Normalized -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;

      // Calculate velocity
      velocity.current.x = e.clientX - prevPosition.current.x;
      velocity.current.y = e.clientY - prevPosition.current.y;
      prevPosition.current.x = e.clientX;
      prevPosition.current.y = e.clientY;

      setPosition({ x, y });
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return {
    x: position.x,
    y: position.y,
    vx: velocity.current.x,
    vy: velocity.current.y,
  };
}
