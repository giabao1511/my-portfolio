"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { backgroundVertexShader, backgroundFragmentShader, noiseGLSL } from "../../lib/shaders";
import { useMousePosition } from "../../hooks/useMousePosition";

export function ShaderPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { x, y, vx, vy } = useMousePosition();

  const velocityRef = useRef({ x: 0, y: 0 });
  const smoothVelocity = useRef({ x: 0, y: 0 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uVelocity: { value: new THREE.Vector2(0, 0) },
      uIntensity: { value: 0.5 },
      uColor1: { value: new THREE.Color("#09090b") },
      uColor2: { value: new THREE.Color("#18181b") },
      uColor3: { value: new THREE.Color("#06b6d4") },
    }),
    []
  );

  // Prepend noise functions to vertex shader
  const vertexShader = useMemo(() => noiseGLSL + backgroundVertexShader, []);
  const fragmentShader = useMemo(() => noiseGLSL + backgroundFragmentShader, []);

  useFrame((state) => {
    if (!materialRef.current) return;

    // Smooth velocity
    velocityRef.current.x = vx;
    velocityRef.current.y = vy;
    smoothVelocity.current.x += (velocityRef.current.x - smoothVelocity.current.x) * 0.1;
    smoothVelocity.current.y += (velocityRef.current.y - smoothVelocity.current.y) * 0.1;

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uMouse.value.set(x, y);
    materialRef.current.uniforms.uVelocity.value.set(smoothVelocity.current.x, smoothVelocity.current.y);
  });

  return (
    <mesh rotation={[-Math.PI / 4, 0, 0]} position={[0, 0, -5]}>
      <planeGeometry args={[15, 15, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
