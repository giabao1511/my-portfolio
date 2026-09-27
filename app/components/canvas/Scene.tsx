"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { usePerformanceTier, useVisibility } from "./PerformanceOptimizer";
import { Preloader } from "./Preloader";

// Dynamically import Canvas with SSR disabled for WebGL compatibility
const Canvas = dynamic(
  () => import("@react-three/fiber").then((mod) => mod.Canvas),
  { ssr: false },
);

import { ShaderPlane } from "./ShaderPlane";
import { FloatingParticles } from "./FloatingParticles";
import { useRecruiterMode } from "../../contexts/RecruiterModeContext";

function SceneContent() {
  const { isVisible, isTabActive } = useVisibility();
  const tier = usePerformanceTier();
  const { isEnabled: isRecruiterMode } = useRecruiterMode();

  // Determine particle count based on tier
  const particleCount = tier === "high" ? 600 : 300;

  // Pause rendering when not visible or tab inactive
  const shouldRender = isVisible && isTabActive && !isRecruiterMode;

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      dpr={tier === "high" ? [1, 1.5] : [1, 1]}
      gl={{ antialias: tier === "high", alpha: true }}
      frameloop={shouldRender ? "always" : "never"}
      style={{ display: isRecruiterMode ? "none" : "block" }}
    >
      <color attach="background" args={["#09090b"]} />
      <ShaderPlane />
      <FloatingParticles count={particleCount} />
    </Canvas>
  );
}

export function Scene() {
  const { isEnabled: isRecruiterMode } = useRecruiterMode();

  return (
    <div
      className="fixed inset-0 z-0"
      style={{ pointerEvents: "none" }}
      aria-hidden={isRecruiterMode}
    >
      <Suspense fallback={null}>
        <Preloader />
        <SceneContent />
      </Suspense>
    </div>
  );
}
