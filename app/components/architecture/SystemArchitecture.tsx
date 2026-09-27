"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

// Architecture node data
const NODES = [
  {
    id: "client",
    label: "Client Layer",
    tech: ["Next.js 16", "TanStack Query", "React 19"],
    detail: "Optimistic UI updates with intelligent cache invalidation",
    latency: "< 50ms",
  },
  {
    id: "gateway",
    label: "API Gateway",
    tech: ["Nest.js", "JWT Auth", "RBAC"],
    detail: "Centralized auth & rate limiting with role-based access",
    latency: "< 10ms",
  },
  {
    id: "engine",
    label: "Calculation Engine",
    tech: ["TypeScript", "Web Workers", "SharedArrayBuffer"],
    detail: "F&I calculations with sub-50ms deterministic results",
    latency: "< 50ms",
  },
  {
    id: "bus",
    label: "Message Bus",
    tech: ["Redis Pub/Sub", "Webhooks", "Event Sourcing"],
    detail: "Async communication with guaranteed delivery",
    latency: "< 100ms",
  },
  {
    id: "database",
    label: "Database",
    tech: ["MongoDB", "Compound Indexes", "ACID"],
    detail: "Normalized schema with optimized read/write patterns",
    latency: "< 20ms",
  },
];

interface NodeData {
  id: string;
  label: string;
  tech: string[];
  detail: string;
  latency: string;
}

export function SystemArchitecture() {
  const [activeNode, setActiveNode] = useState<NodeData | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <section className="relative py-24 px-4 md:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            System <span className="text-accent-cyan">Architecture</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            High-concurrency microservices designed for scale
          </p>
        </motion.div>

        {/* SVG Container */}
        <div className="relative w-full overflow-x-auto pb-8">
          <svg
            viewBox="0 0 900 280"
            className="w-full min-w-[800px] h-auto"
            aria-label="System architecture flow diagram"
          >
            {/* Connection Lines */}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Animated connection paths */}
            {NODES.slice(0, -1).map((node, i) => {
              const x1 = 110 + i * 180;
              const x2 = 190 + i * 180;
              return (
                <g key={`path-${node.id}`}>
                  {/* Static line */}
                  <line
                    x1={x1}
                    y1="140"
                    x2={x2}
                    y2="140"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    strokeOpacity="0.3"
                  />
                  {/* Animated pulse */}
                  <motion.line
                    x1={x1}
                    y1="140"
                    x2={x2}
                    y2="140"
                    stroke="#06b6d4"
                    strokeWidth="3"
                    filter="url(#glow)"
                    initial={{ x1: x1, opacity: 0 }}
                    animate={{
                      x1: [x1, x2],
                      x2: [x1 + 40, x2 + 40],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "linear",
                    }}
                  />
                </g>
              );
            })}

            {/* Nodes */}
            {NODES.map((node, index) => {
              const x = 50 + index * 180;
              const isHovered = hoveredNode === node.id;
              const isActive = activeNode?.id === node.id;

              return (
                <g
                  key={node.id}
                  className="cursor-pointer"
                  onClick={() => setActiveNode(activeNode?.id === node.id ? null : node)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Node background */}
                  <motion.rect
                    x={x}
                    y="80"
                    width="120"
                    height="120"
                    rx="12"
                    fill="#18181b"
                    stroke={isHovered || isActive ? "#06b6d4" : "#27272a"}
                    strokeWidth={isHovered || isActive ? 2 : 1}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    animate={{
                      filter: isHovered ? "url(#glow)" : "none",
                    }}
                  />

                  {/* Node icon area */}
                  <circle
                    cx={x + 60}
                    cy="115"
                    r="20"
                    fill={isHovered || isActive ? "#06b6d4" : "#27272a"}
                    opacity="0.5"
                  />

                  {/* Node label */}
                  <text
                    x={x + 60}
                    y="165"
                    textAnchor="middle"
                    className="fill-zinc-300 text-xs font-medium"
                  >
                    {node.label}
                  </text>

                  {/* Latency badge */}
                  <g>
                    <rect
                      x={x + 25}
                      y="175"
                      width="70"
                      height="18"
                      rx="9"
                      fill={isHovered || isActive ? "#06b6d4" : "#27272a"}
                      opacity="0.8"
                    />
                    <text
                      x={x + 60}
                      y="187"
                      textAnchor="middle"
                      className="fill-zinc-300 text-[10px] font-mono"
                    >
                      {node.latency}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detail Card */}
        <AnimatePresence>
          {activeNode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="max-w-2xl mx-auto mt-8 p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-accent-cyan">
                  {activeNode.label}
                </h3>
                <span className="font-mono text-sm text-zinc-500">
                  {activeNode.latency}
                </span>
              </div>
              <p className="text-zinc-300 mb-4">{activeNode.detail}</p>
              <div className="flex flex-wrap gap-2">
                {activeNode.tech.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 text-xs rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
