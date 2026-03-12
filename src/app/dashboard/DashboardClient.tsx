"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassTabBar } from "@/components/ui/GlassTabBar";
import { PremiumBadge } from "@/components/ui/PremiumBadge";

interface Analysis {
  id: string;
  face_score: number;
  created_at: string;
}

interface DashboardClientProps {
  email: string;
  displayName: string | null;
  isPremium: boolean;
  analyses: Analysis[];
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export function DashboardClient({ email, displayName, isPremium, analyses }: DashboardClientProps) {
  return (
    <main className="min-h-[100dvh] px-5 pt-8 pb-28 max-w-2xl mx-auto">
      <motion.div initial="hidden" animate="visible" variants={stagger}>
        {/* Header */}
        <motion.header variants={fadeUp} className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-display-sm text-white">Dashboard</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-caption text-white/40">
                {displayName || email}
              </p>
              {isPremium && <PremiumBadge />}
            </div>
          </div>
          <form action="/api/auth/signout" method="POST">
            <GlassButton type="submit" variant="ghost" size="sm">
              Sign out
            </GlassButton>
          </form>
        </motion.header>

        {/* Recent analyses */}
        <motion.section variants={fadeUp} className="mb-10">
          <h2 className="text-title text-white mb-4">Recent analyses</h2>
          {analyses.length > 0 ? (
            <div className="space-y-3">
              {analyses.map((a) => (
                <Link key={a.id} href={`/result/${a.id}`}>
                  <GlassCard hover className="p-5 flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-ig-subtle flex items-center justify-center">
                        <span className="text-lg font-bold text-gradient-ig">
                          {Number(a.face_score).toFixed(1)}
                        </span>
                      </div>
                      <div>
                        <p className="text-body text-white font-medium">
                          Score: {Number(a.face_score).toFixed(1)}
                        </p>
                        <p className="text-micro text-white/30">
                          {new Date(a.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-white/20">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </GlassCard>
                </Link>
              ))}
            </div>
          ) : (
            <GlassCard className="p-8 text-center">
              <p className="text-white/40 mb-4">No analyses yet.</p>
              <Link href="/analyze">
                <GlassButton variant="gradient" size="sm">
                  Analyze your face
                </GlassButton>
              </Link>
            </GlassCard>
          )}
        </motion.section>

        {/* Quick links */}
        <motion.section variants={fadeUp} className="grid grid-cols-2 gap-3 mb-10">
          <Link href="/compare">
            <GlassCard hover className="p-5 h-full">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-ig-coral/20 to-ig-pink/20 flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-ig-pink">
                  <circle cx="9" cy="7" r="4" />
                  <circle cx="15" cy="7" r="4" />
                  <path d="M3 21v-2a4 4 0 014-4h4" />
                  <path d="M21 21v-2a4 4 0 00-4-4h-4" />
                </svg>
              </div>
              <p className="text-body font-semibold text-white">Compare</p>
              <p className="text-micro text-white/30 mt-0.5">Who is hotter?</p>
            </GlassCard>
          </Link>

          <Link href="/leaderboard">
            <GlassCard hover className="p-5 h-full">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-ig-gold/20 to-ig-orange/20 flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-ig-gold">
                  <path d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M6 9v10a1 1 0 001 1h10a1 1 0 001-1V9M6 9h12" />
                </svg>
              </div>
              <p className="text-body font-semibold text-white">Leaderboard</p>
              <p className="text-micro text-white/30 mt-0.5">Top scores</p>
            </GlassCard>
          </Link>
        </motion.section>
      </motion.div>

      {/* Floating CTA */}
      <div className="fixed bottom-24 right-5 sm:right-8 z-30">
        <Link href="/analyze">
          <GlassButton variant="gradient" size="md" className="shadow-ig-glow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New analysis
          </GlassButton>
        </Link>
      </div>

      <GlassTabBar />
    </main>
  );
}
