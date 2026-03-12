"use client";

import { motion } from "framer-motion";
import { ScoreRing } from "@/components/ui/ScoreRing";

interface ScoreDisplayProps {
  score: number;
  percentile: number | null;
  globalRank: number | null;
}

function formatRank(rank: number): string {
  return "#" + rank.toLocaleString("en-US");
}

export function ScoreDisplay({ score, percentile, globalRank }: ScoreDisplayProps) {
  const attractivePercent = percentile ?? Math.round(score * 10);

  return (
    <div className="text-center space-y-8 py-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        className="flex justify-center"
      >
        <ScoreRing score={score} size={220} strokeWidth={6} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-title text-white/80">
          More attractive than{" "}
          <span className="text-gradient-ig font-bold">{attractivePercent}%</span>{" "}
          of people.
        </p>
      </motion.div>

      {globalRank != null && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-3"
        >
          <span className="text-micro uppercase tracking-[0.2em] text-white/30">Global Rank</span>
          <span className="text-title text-white font-bold">{formatRank(globalRank)}</span>
        </motion.div>
      )}
    </div>
  );
}
