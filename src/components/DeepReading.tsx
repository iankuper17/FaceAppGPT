"use client";

import { motion } from "framer-motion";
import type { DeepReading as DeepReadingType } from "@/types/analysis";
import { GlassCard } from "@/components/ui/GlassCard";

interface DeepReadingProps {
  reading: DeepReadingType;
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function SectionDivider() {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="w-1 h-1 rounded-full bg-white/10" />
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </div>
  );
}

export function DeepReading({ reading }: DeepReadingProps) {
  return (
    <div className="space-y-14">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <p className="text-micro uppercase tracking-[0.2em] text-ig-purple/70 mb-2">
          AI Deep Reading
        </p>
        <h2 className="text-2xl font-bold text-white">
          Beyond the surface
        </h2>
        <p className="text-caption text-white/30 mt-2 max-w-xs mx-auto">
          An interpretation of your energy, presence, and personality signals
        </p>
      </motion.div>

      {/* MODULE 1 — Personality Signals */}
      {reading.personality_signals.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <h3 className="text-title text-white mb-1">
              Personality signals your face might be giving off
            </h3>
            <p className="text-caption text-white/30 mb-5">
              Subtle cues from your expression and presence
            </p>
          </motion.div>
          <div className="space-y-2.5">
            {reading.personality_signals.map((signal, i) => (
              <motion.div key={i} variants={fadeUp}>
                <GlassCard className="p-4 flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-ig-purple/15 flex items-center justify-center shrink-0 mt-0.5">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="text-ig-purple"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </svg>
                  </div>
                  <p className="text-body text-white/70 leading-relaxed">
                    {signal}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      <SectionDivider />

      {/* MODULE 2 — Social Role */}
      {reading.social_role.role && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <h3 className="text-title text-white mb-5">
              What role you naturally play in groups
            </h3>
          </motion.div>
          <motion.div variants={fadeUp}>
            <GlassCard className="p-6 text-center">
              <span className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-ig-violet/20 to-ig-magenta/20 border border-ig-violet/20 text-white font-semibold text-lg mb-4">
                {reading.social_role.role}
              </span>
              {reading.social_role.explanation && (
                <p className="text-body text-white/50 leading-relaxed max-w-sm mx-auto">
                  {reading.social_role.explanation}
                </p>
              )}
            </GlassCard>
          </motion.div>
        </motion.section>
      )}

      <SectionDivider />

      {/* MODULE 3 — Conversation Style */}
      {reading.conversation_style.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <h3 className="text-title text-white mb-1">
              How you probably communicate
            </h3>
            <p className="text-caption text-white/30 mb-5">
              Your likely conversation patterns
            </p>
          </motion.div>
          <div className="space-y-2.5">
            {reading.conversation_style.map((style, i) => (
              <motion.div key={i} variants={fadeUp}>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-sky-500/15 flex items-center justify-center shrink-0 mt-0.5">
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-sky-400"
                    >
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                  </div>
                  <p className="text-body text-white/60 leading-relaxed">
                    {style}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      <SectionDivider />

      {/* MODULE 4 — Mental Energy */}
      {reading.mental_energy.profile && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <h3 className="text-title text-white mb-5">
              Your mental energy profile
            </h3>
          </motion.div>
          <motion.div variants={fadeUp}>
            <GlassCard glow className="p-6">
              <p className="text-lg font-semibold text-white mb-2">
                {reading.mental_energy.profile}
              </p>
              {reading.mental_energy.description && (
                <p className="text-body text-white/45 leading-relaxed">
                  {reading.mental_energy.description}
                </p>
              )}
            </GlassCard>
          </motion.div>
        </motion.section>
      )}

      <SectionDivider />

      {/* MODULE 5 — Hidden Strengths */}
      {reading.hidden_strengths.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <h3 className="text-title text-white mb-1">
              Potential hidden strengths
            </h3>
            <p className="text-caption text-white/30 mb-5">
              What lies beneath the surface
            </p>
          </motion.div>
          <div className="grid grid-cols-1 gap-3">
            {reading.hidden_strengths.map((item, i) => (
              <motion.div key={i} variants={fadeUp}>
                <GlassCard className="p-5 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0 mt-0.5">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-emerald-400"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-body font-semibold text-white">
                      {item.strength}
                    </p>
                    {item.explanation && (
                      <p className="text-caption text-white/40 mt-0.5">
                        {item.explanation}
                      </p>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      <SectionDivider />

      {/* MODULE 6 — Internet Vibe */}
      {reading.internet_vibe.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <h3 className="text-title text-white mb-1">
              Internet vibe analysis
            </h3>
            <p className="text-caption text-white/30 mb-5">
              If your face had a Twitter bio
            </p>
          </motion.div>
          <div className="space-y-2.5">
            {reading.internet_vibe.map((vibe, i) => (
              <motion.div key={i} variants={fadeUp}>
                <GlassCard
                  variant="subtle"
                  className="p-4 flex items-start gap-3"
                >
                  <span className="text-ig-orange shrink-0 mt-0.5 text-sm">
                    &#x2727;
                  </span>
                  <p className="text-body text-white/60 leading-relaxed">
                    {vibe}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      <SectionDivider />

      {/* MODULE 7 — Life Trajectory */}
      {reading.life_trajectory && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <h3 className="text-title text-white mb-5">
              Signals about your life direction
            </h3>
          </motion.div>
          <motion.div variants={fadeUp}>
            <GlassCard variant="heavy" className="p-7">
              <p className="text-body text-white/55 leading-[1.8] italic">
                {reading.life_trajectory}
              </p>
            </GlassCard>
          </motion.div>
        </motion.section>
      )}

      <SectionDivider />

      {/* MODULE 8 — Cosmic Message */}
      {reading.cosmic_message && (
        <motion.section
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center py-4"
        >
          <p className="text-micro uppercase tracking-[0.2em] text-ig-magenta/50 mb-4">
            A message for you
          </p>
          <p className="text-xl font-medium leading-relaxed text-gradient-ig max-w-md mx-auto">
            &ldquo;{reading.cosmic_message}&rdquo;
          </p>
        </motion.section>
      )}

      <SectionDivider />

      {/* MODULE 9 — Life Hints */}
      {reading.life_hints.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <h3 className="text-title text-white mb-5">
              Small life hints
            </h3>
          </motion.div>
          <motion.div variants={fadeUp}>
            <GlassCard className="p-5 divide-y divide-white/[0.05]">
              {reading.life_hints.map((hint, i) => (
                <div
                  key={i}
                  className="flex items-baseline gap-3.5 py-3.5 first:pt-0 last:pb-0"
                >
                  <span className="text-micro font-bold text-white/20 tabular-nums shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-body text-white/55 leading-relaxed">
                    {hint}
                  </p>
                </div>
              ))}
            </GlassCard>
          </motion.div>
        </motion.section>
      )}

      <SectionDivider />

      {/* MODULE 10 — Curious Observations */}
      {reading.curious_observations.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <h3 className="text-title text-white mb-1">
              Curious observations
            </h3>
            <p className="text-caption text-white/30 mb-5">
              Things we noticed about you
            </p>
          </motion.div>
          <div className="space-y-2">
            {reading.curious_observations.map((obs, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex items-start gap-3 py-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white/15 shrink-0 mt-2" />
                <p className="text-body text-white/50 leading-relaxed">
                  {obs}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}
