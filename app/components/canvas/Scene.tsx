"use client";

import { Canvas } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { ShaderPlane } from "./ShaderPlane";
import { FloatingParticles } from "./FloatingParticles";
import { Effects } from "./Effects";

export function Scene() {
  return (
    <div
      className="fixed inset-0 z-0"
      style={{ pointerEvents: "none" }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        frameloop="always"
      >
        <color attach="background" args={["#09090b"]} />
        <ShaderPlane />
        <FloatingParticles count={600} />
        <EffectComposer>
          <Effects />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
