"use client";

import { motion } from "framer-motion";
import type { PerceivedTraits as PerceivedTraitsType } from "@/types/analysis";

interface PerceivedTraitsProps {
  traits: PerceivedTraitsType;
}

const TRAIT_CONFIG: { key: keyof PerceivedTraitsType; label: string; gradient: string }[] = [
  { key: "confidence", label: "Confidence", gradient: "from-ig-gold to-ig-orange" },
  { key: "trustworthiness", label: "Trustworthiness", gradient: "from-emerald-400 to-teal-500" },
  { key: "approachability", label: "Approachability", gradient: "from-sky-400 to-blue-500" },
  { key: "intelligence", label: "Intelligence", gradient: "from-ig-violet to-ig-purple" },
  { key: "dominance", label: "Dominance", gradient: "from-ig-coral to-ig-pink" },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export function PerceivedTraits({ traits }: PerceivedTraitsProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={stagger}
    >
      <motion.div variants={fadeUp}>
        <h3 className="text-title text-white mb-1">
          What strangers think when they see you
        </h3>
        <p className="text-caption text-white/30 mb-6">First-impression perception scores</p>
      </motion.div>

      <div className="space-y-5">
        {TRAIT_CONFIG.map(({ key, label, gradient }) => {
          const value = traits[key];
          return (
            <motion.div key={key} variants={fadeUp}>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-caption font-medium text-white/60">{label}</span>
                <span className="text-caption font-bold text-white">{value}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
