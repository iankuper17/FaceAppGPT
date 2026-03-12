"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassTabBar } from "@/components/ui/GlassTabBar";

interface LeaderboardEntry {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  avg_score: number;
  analyses_count: number;
}

interface LeaderboardClientProps {
  entries: LeaderboardEntry[];
  isLoggedIn: boolean;
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

function getRankDisplay(index: number) {
  if (index < 3) {
    const styles = [
      "bg-gradient-to-br from-ig-gold/30 to-ig-orange/30 text-ig-gold",
      "bg-white/[0.08] text-white/50",
      "bg-gradient-to-br from-amber-700/30 to-amber-900/30 text-amber-600",
    ];
    return (
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${styles[index]}`}>
        {index + 1}
      </div>
    );
  }
  return <span className="text-caption text-white/25 w-7 text-center">#{index + 1}</span>;
}

export function LeaderboardClient({ entries, isLoggedIn }: LeaderboardClientProps) {
  return (
    <main className="min-h-[100dvh] px-5 pt-8 pb-28 max-w-2xl mx-auto">
      <header className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-1.5 text-micro text-white/30 hover:text-white/60 transition mb-6">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Dashboard
        </Link>
        <h1 className="text-display-sm text-white mb-1">Leaderboard</h1>
        <p className="text-caption text-white/30">
          Top scores from users who opted in.
        </p>
      </header>

      {entries.length > 0 ? (
        <motion.ol
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="space-y-3"
        >
          {entries.map((entry, i) => (
            <motion.li key={entry.id} variants={fadeUp}>
              <GlassCard
                className={`p-4 flex items-center gap-4 ${
                  i < 3 ? "border-white/[0.12]" : ""
                }`}
                glow={i === 0}
              >
                {getRankDisplay(i)}

                {entry.avatar_url ? (
                  <img
                    src={entry.avatar_url}
                    alt=""
                    className="h-10 w-10 rounded-2xl object-cover ring-1 ring-white/10"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-2xl bg-white/[0.06] flex items-center justify-center">
                    <span className="text-micro text-white/25">
                      {(entry.display_name || "A")[0].toUpperCase()}
                    </span>
                  </div>
                )}

                <span className="text-body text-white flex-1 truncate">
                  {entry.display_name || "Anonymous"}
                </span>

                <div className="text-right">
                  <span className={`text-body font-bold ${i < 3 ? "text-gradient-ig" : "text-white"}`}>
                    {Number(entry.avg_score).toFixed(1)}
                  </span>
                  <p className="text-micro text-white/20">
                    {entry.analyses_count} {entry.analyses_count === 1 ? "analysis" : "analyses"}
                  </p>
                </div>
              </GlassCard>
            </motion.li>
          ))}
        </motion.ol>
      ) : (
        <GlassCard className="p-8 text-center">
          <p className="text-caption text-white/40">No one on the leaderboard yet.</p>
        </GlassCard>
      )}

      {isLoggedIn && (
        <p className="mt-8 text-micro text-white/20 text-center">
          Opt in from your profile to appear here.
        </p>
      )}

      <GlassTabBar />
    </main>
  );
}
