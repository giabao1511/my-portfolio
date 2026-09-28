"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

interface ParticleSphereProps {
  mousePosition: { x: number; y: number };
}

function ParticleSphere({ mousePosition }: ParticleSphereProps) {
  const meshRef = useRef<THREE.Points>(null);
  const mouseTarget = useRef({ x: 0, y: 0 });

  const { viewport } = useThree();

  // Generate sphere geometry
  const particles = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Fibonacci sphere distribution
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const radius = 2;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Color gradient: cyan to violet
      const t = (i / count) * 0.5 + 0.25;
      colors[i * 3] = 0.024 + t * 0.525; // R: 0.024 → 0.549
      colors[i * 3 + 1] = 0.714 - t * 0.471; // G: 0.714 → 0.243
      colors[i * 3 + 2] = 0.831; // B: constant 0.831
    }

    return { positions, colors, count };
  }, []);

  // Create buffer attributes with useMemo
  const positionAttribute = useMemo(() => {
    return new THREE.BufferAttribute(particles.positions, 3);
  }, [particles.positions]);

  const colorAttribute = useMemo(() => {
    return new THREE.BufferAttribute(particles.colors, 3);
  }, [particles.colors]);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;

    // Cap delta to prevent jumps
    const cappedDelta = Math.min(delta, 0.05);

    // Lerp mouse position for smooth trailing
    mouseTarget.current.x +=
      (mousePosition.x * viewport.width * 0.3 - mouseTarget.current.x) * 0.05;
    mouseTarget.current.y +=
      (mousePosition.y * viewport.height * 0.3 - mouseTarget.current.y) * 0.05;

    // Rotate based on time and mouse
    meshRef.current.rotation.y += cappedDelta * 0.2;
    meshRef.current.rotation.x = mouseTarget.current.y * 0.3;
    meshRef.current.rotation.z = mouseTarget.current.x * 0.1;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <points ref={meshRef}>
        <bufferGeometry>
          <primitive attach="attributes-position" object={positionAttribute} />
          <primitive attach="attributes-color" object={colorAttribute} />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </Float>
  );
}

export function Hero3DCanvas({
  mousePosition,
}: {
  mousePosition: { x: number; y: number };
}) {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#09090b"]} />
        <ParticleSphere mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
}
