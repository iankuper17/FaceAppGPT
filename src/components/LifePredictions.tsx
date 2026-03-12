"use client";

import { motion } from "framer-motion";
import type { LifePredictions as LifePredictionsType } from "@/types/analysis";
import { GlassCard } from "@/components/ui/GlassCard";

interface LifePredictionsProps {
  predictions: LifePredictionsType;
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export function LifePredictions({ predictions }: LifePredictionsProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={stagger}
    >
      <motion.div variants={fadeUp}>
        <h3 className="text-title text-white mb-1">AI Guess My Life</h3>
        <p className="text-caption text-white/30 mb-6">
          What the AI thinks about you based on your face alone
        </p>
      </motion.div>

      <div className="space-y-4">
        <motion.div variants={fadeUp}>
          <GlassCard className="p-6 flex items-center gap-5">
            <div className="text-center shrink-0">
              <p className="text-4xl font-bold text-white">{predictions.estimated_age}</p>
              <p className="text-micro text-white/30 mt-1 uppercase tracking-wider">Est. Age</p>
            </div>
            <div className="h-12 w-px bg-white/[0.08]" />
            <div className="flex-1 min-w-0">
              <p className="text-body text-white font-medium">{predictions.personality}</p>
              {predictions.vibe && (
                <p className="text-caption text-white/40 italic mt-1 truncate">
                  &ldquo;{predictions.vibe}&rdquo;
                </p>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {predictions.likely_hobbies.length > 0 && (
          <motion.div variants={fadeUp}>
            <p className="text-caption text-white/40 mb-3">Likely hobbies</p>
            <div className="flex flex-wrap gap-2">
              {predictions.likely_hobbies.map((hobby, i) => (
                <span
                  key={i}
                  className="glass rounded-full px-4 py-2 text-caption text-white/70"
                >
                  {hobby}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
