"use client";

import { motion } from "framer-motion";
import type { AnalysisReport } from "@/types/analysis";
import { GlassCard } from "@/components/ui/GlassCard";

interface ReportSectionsProps {
  report: AnalysisReport;
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export function ReportSections({ report }: ReportSectionsProps) {
  const { attractive_features, improvement_areas, skin_analysis } = report;

  return (
    <div className="space-y-10">
      {attractive_features && attractive_features.length > 0 && (
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.h3 variants={fadeUp} className="text-title text-white mb-4">
            What makes your face attractive
          </motion.h3>
          <div className="space-y-3">
            {attractive_features.map((feat, i) => (
              <motion.div key={i} variants={fadeUp}>
                <GlassCard className="p-5 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-body font-semibold text-white">{feat.label}</p>
                    <p className="text-caption text-white/40 mt-0.5">{feat.description}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {improvement_areas && improvement_areas.length > 0 && (
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.h3 variants={fadeUp} className="text-title text-white mb-4">
            Areas to improve
          </motion.h3>
          <div className="space-y-3">
            {improvement_areas.map((area, i) => (
              <motion.div key={i} variants={fadeUp}>
                <GlassCard className="p-5 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-amber-400">
                      <path d="M12 19V5M5 12l7-7 7 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-body font-semibold text-white">{area.label}</p>
                    <p className="text-caption text-white/40 mt-0.5">{area.description}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {skin_analysis && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.h3 variants={fadeUp} className="text-title text-white/70 mb-4">
            Skin details
          </motion.h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Clarity", value: skin_analysis.clarity },
              { label: "Texture", value: skin_analysis.texture },
              { label: "Tone", value: skin_analysis.tone_balance },
            ].map(({ label, value }) => (
              <motion.div key={label} variants={fadeUp}>
                <GlassCard className="p-5 text-center">
                  <p className="text-2xl font-bold text-white">{value.toFixed(1)}</p>
                  <p className="text-micro text-white/30 mt-1 uppercase tracking-wider">{label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}
