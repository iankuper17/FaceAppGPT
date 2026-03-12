"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

interface ScoreRingProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ScoreRing({
  score,
  maxScore = 10,
  size = 200,
  strokeWidth = 8,
  className = "",
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(score / maxScore, 1);
  const gradientId = `score-gradient-${Math.random().toString(36).slice(2)}`;

  const motionProgress = useMotionValue(0);
  const strokeDashoffset = useTransform(
    motionProgress,
    (v) => circumference * (1 - v)
  );

  const displayScore = useMotionValue(0);
  const scoreRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(motionProgress, progress, {
      duration: 1.5,
      ease: [0.34, 1.56, 0.64, 1],
    });

    const scoreControls = animate(displayScore, score, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (scoreRef.current) {
          scoreRef.current.textContent = v.toFixed(1);
        }
      },
    });

    return () => {
      controls.stop();
      scoreControls.stop();
    };
  }, [score, progress, motionProgress, displayScore]);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <div
        className="absolute rounded-full blur-3xl opacity-30"
        style={{
          width: size * 0.8,
          height: size * 0.8,
          background: "radial-gradient(circle, rgba(192,38,211,0.4) 0%, rgba(124,58,237,0.2) 50%, transparent 100%)",
        }}
      />

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="25%" stopColor="#9333ea" />
            <stop offset="50%" stopColor="#c026d3" />
            <stop offset="75%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />

        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          ref={scoreRef}
          className="text-5xl sm:text-6xl font-bold text-white tracking-tight"
        >
          0.0
        </span>
        <span className="text-micro uppercase tracking-[0.2em] text-white/40 mt-1">
          Face Score
        </span>
      </div>
    </div>
  );
}
