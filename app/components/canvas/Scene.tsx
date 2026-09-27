"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import Canvas with SSR disabled for WebGL compatibility
const Canvas = dynamic(
  () => import("@react-three/fiber").then((mod) => mod.Canvas),
  { ssr: false }
);

import { ShaderPlane } from "./ShaderPlane";
import { FloatingParticles } from "./FloatingParticles";

function SceneContent() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      frameloop="always"
    >
      <color attach="background" args={["#09090b"]} />
      <ShaderPlane />
      <FloatingParticles count={600} />
    </Canvas>
  );
}

export function Scene() {
  return (
    <div
      className="fixed inset-0 z-0"
      style={{ pointerEvents: "none" }}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </div>
  );
}
