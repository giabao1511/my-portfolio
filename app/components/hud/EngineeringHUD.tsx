"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Activity, Zap, CheckCircle, Server } from "lucide-react";

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  subValue?: string;
  trend?: "up" | "down" | "stable";
  isLive?: boolean;
  index: number;
}

function Sparkline({ positive = true }: { positive?: boolean }) {
  const points = [
    "0,20",
    "5,18",
    "10,22",
    "15,15",
    "20,17",
    "25,12",
    "30,14",
    "35,10",
    "40,8",
    "45,12",
    "50,6",
  ].join(" ");

  return (
    <svg viewBox="0 0 50 25" className="w-12 h-6">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "#10b981" : "#f59e0b"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  subValue,
  isLive,
  index,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative p-4 rounded-xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 hover:border-accent-cyan/30 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-accent-cyan" />
          </div>
          <span className="text-sm text-zinc-400">{label}</span>
        </div>
        {isLive && (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-emerald opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-emerald"></span>
            </span>
            <span className="text-[10px] font-mono text-accent-emerald">
              LIVE
            </span>
          </div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <span className="text-2xl font-mono font-bold text-zinc-50">
            {value}
          </span>
          {subValue && (
            <span className="ml-2 text-sm text-zinc-500">{subValue}</span>
          )}
        </div>
        <Sparkline positive={index < 3} />
      </div>
    </motion.div>
  );
}

export function EngineeringHUD() {
  const [latency, setLatency] = useState(42);
  const [lcp, setLcp] = useState(1.8);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate live metrics
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setLatency((prev) => {
        const delta = (Math.random() - 0.5) * 10;
        return Math.max(20, Math.min(60, prev + delta));
      });
      setLcp((prev) => {
        const delta = (Math.random() - 0.5) * 0.3;
        return Math.max(1.2, Math.min(2.8, prev + delta));
      });
    }, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const metrics = [
    {
      icon: Zap,
      label: "Client Latency",
      value: `< ${Math.round(latency)}ms`,
      isLive: true,
    },
    {
      icon: Activity,
      label: "LCP",
      value: `${lcp.toFixed(1)}s`,
      subValue: "< 2.5s",
      isLive: true,
    },
    {
      icon: CheckCircle,
      label: "E2E Tests",
      value: "100%",
      subValue: "48 passing",
      isLive: true,
    },
    {
      icon: Server,
      label: "Deployments",
      value: "Active",
      subValue: "0 rollbacks",
      isLive: true,
    },
  ];

  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Engineering <span className="text-accent-violet">Metrics</span>
          </h2>
          <p className="text-zinc-400 text-sm">
            Real-time performance indicators
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <MetricCard key={metric.label} {...metric} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
