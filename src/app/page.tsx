"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassCard } from "@/components/ui/GlassCard";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function HomePage() {
  return (
    <main className="relative min-h-[100dvh] flex flex-col overflow-hidden">
      <AmbientBackground intensity="high" />

      {/* Top bar */}
      <header className="relative z-10 flex justify-end items-center p-5 sm:p-8">
        <Link href="/login">
          <GlassButton variant="glass" size="sm">
            Sign in
          </GlassButton>
        </Link>
      </header>

      {/* Hero */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <motion.div
          className="max-w-2xl text-center"
          initial="hidden"
          animate="visible"
        >
          <motion.p
            custom={0}
            variants={fadeUp}
            className="text-micro uppercase tracking-[0.3em] text-white/40 mb-6"
          >
            AI-Powered Face Analysis
          </motion.p>

          <motion.h1
            custom={1}
            variants={fadeUp}
            className="text-display-xl text-white text-balance mb-6"
          >
            Discover how the world{" "}
            <span className="text-gradient-ig">really sees</span>{" "}
            your face.
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            className="text-body-lg text-white/50 max-w-md mx-auto mb-10"
          >
            Upload a selfie. Get an honest score, personalized insights,
            and your AI-enhanced glow up.
          </motion.p>

          <motion.div custom={3} variants={fadeUp}>
            <Link href="/analyze">
              <GlassButton variant="gradient" size="lg">
                Analyze my face
              </GlassButton>
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating preview cards */}
        <motion.div
          className="mt-16 flex gap-4 items-end"
          initial="hidden"
          animate="visible"
        >
          <motion.div custom={4} variants={fadeUp}>
            <GlassCard className="p-4 w-32">
              <p className="text-3xl font-bold text-gradient-ig text-center">8.7</p>
              <p className="text-[10px] text-white/30 text-center mt-1 uppercase tracking-widest">Score</p>
            </GlassCard>
          </motion.div>
          <motion.div custom={4.5} variants={fadeUp}>
            <GlassCard className="p-4 w-36">
              <p className="text-lg font-semibold text-white text-center">Top 5%</p>
              <p className="text-[10px] text-white/30 text-center mt-1 uppercase tracking-widest">Worldwide</p>
            </GlassCard>
          </motion.div>
          <motion.div custom={5} variants={fadeUp}>
            <GlassCard className="p-4 w-32">
              <div className="flex items-center justify-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <p className="text-sm font-medium text-white/80">Glow Up</p>
              </div>
              <p className="text-[10px] text-white/30 text-center mt-1 uppercase tracking-widest">Ready</p>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom trust line */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="relative z-10 text-center text-micro text-white/20 pb-8"
      >
        Beauty is subjective. This is for fun and guidance only.
      </motion.p>
    </main>
  );
}
