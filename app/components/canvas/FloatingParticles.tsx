"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleData {
  position: THREE.Vector3;
  scale: number;
  speed: number;
  phase: number;
}

export function FloatingParticles({ count = 800 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particlesData = useRef<ParticleData[]>([]);

  const { positions, sizes, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Random position in a sphere
      const radius = 8 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      sizes[i] = Math.random() * 0.03 + 0.01;
      phases[i] = Math.random() * Math.PI * 2;

      particlesData.current.push({
        position: new THREE.Vector3(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]),
        scale: sizes[i],
        speed: 0.1 + Math.random() * 0.2,
        phase: phases[i],
      });
    }

    return { positions: pos, sizes, phases };
  }, [count]);

  const positionAttribute = useMemo(
    () => new THREE.BufferAttribute(positions, 3),
    [positions]
  );

  const sizeAttribute = useMemo(
    () => new THREE.BufferAttribute(new Float32Array(count), 1),
    [count]
  );

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.elapsedTime;

    // Slowly rotate particles
    pointsRef.current.rotation.y = time * 0.02;
    pointsRef.current.rotation.x = Math.sin(time * 0.01) * 0.1;

    // Twinkle effect - modulate size
    const sizeAttr = pointsRef.current.geometry.attributes.aSize as THREE.BufferAttribute;
    if (sizeAttr) {
      for (let i = 0; i < count; i++) {
        const p = particlesData.current[i];
        if (p) {
          const twinkle = Math.sin(time * p.speed + p.phase) * 0.5 + 0.5;
          sizeAttr.array[i] = p.scale * (0.5 + twinkle * 0.5);
        }
      }
      sizeAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <primitive attach="attributes-position" object={positionAttribute} />
        <primitive attach="attributes-aSize" object={sizeAttribute} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#06b6d4"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
