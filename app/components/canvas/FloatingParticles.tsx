"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleConfig {
  scale: number;
  speed: number;
  phase: number;
}

// Seeded random number generator for deterministic particle positions
function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

export function FloatingParticles({ count = 800 }: { count?: number }) {
  // Generate all data once with useMemo
  const { geometry, configs, sizeAttr } = useMemo(() => {
    const random = seededRandom(42);
    const particleConfigs: ParticleConfig[] = [];
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Store config for animation
      particleConfigs.push({
        scale: random() * 0.03 + 0.01,
        speed: 0.1 + random() * 0.2,
        phase: random() * Math.PI * 2,
      });

      // Generate sphere position
      const radius = 8 + random() * 4;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

    const sizeAttr = new THREE.BufferAttribute(new Float32Array(count), 1);
    geo.setAttribute("aSize", sizeAttr);

    return { geometry: geo, configs: particleConfigs, sizeAttr };
  }, [count]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const config = configs[i];
      const twinkle = Math.sin(time * config.speed + config.phase) * 0.5 + 0.5;
      sizeAttr.array[i] = config.scale * (0.5 + twinkle * 0.5);
    }
    sizeAttr.needsUpdate = true;
  });

  return (
    <points>
      <primitive object={geometry} />
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
