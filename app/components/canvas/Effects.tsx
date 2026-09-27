"use client";

import { Bloom, ChromaticAberration, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";

export function Effects() {
  return (
    <>
      <Bloom
        luminanceThreshold={0.6}
        luminanceSmoothing={0.9}
        intensity={0.8}
        blendFunction={BlendFunction.ADD}
      />
      <ChromaticAberration
        offset={new Vector2(0.002, 0.002)}
        blendFunction={BlendFunction.NORMAL}
      />
      <Noise opacity={0.02} blendFunction={BlendFunction.OVERLAY} />
      <Vignette darkness={0.4} offset={0.2} />
    </>
  );
}
