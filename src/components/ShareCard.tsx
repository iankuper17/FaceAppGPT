"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

interface ShareCardProps {
  score: number;
  percentile: number | null;
}

export function ShareCard({ score, percentile }: ShareCardProps) {
  const [copied, setCopied] = useState(false);

  const topPercent = Math.max(1, 100 - (percentile ?? Math.round(score * 10)));
  const caption = `My Face Score: ${score.toFixed(1)} — Top ${topPercent}% worldwide. What's yours?`;
  const shareUrl = typeof window !== "undefined" ? window.location.origin : "";
  const ogImageUrl = `${shareUrl}/api/og?score=${score.toFixed(1)}&percentile=${percentile ?? Math.round(score * 10)}`;

  function downloadImage() {
    const link = document.createElement("a");
    link.href = ogImageUrl;
    link.download = `facescore-${score.toFixed(1)}.png`;
    link.click();
  }

  function copyCaption() {
    void navigator.clipboard.writeText(`${caption}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareOnX() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "noopener");
  }

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: "FaceScore AI", text: caption, url: shareUrl });
      } catch (err) {
        if ((err as Error).name !== "AbortError") copyCaption();
      }
    } else {
      copyCaption();
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <h3 className="text-title text-white mb-4">Share your score</h3>

      <GlassCard className="overflow-hidden">
        {/* Preview card */}
        <div className="relative aspect-[1200/630] w-full bg-gradient-to-br from-graphite-950 via-plum-800 to-graphite-950 flex flex-col items-center justify-center p-6">
          <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 50% 40%, rgba(192,38,211,0.4) 0%, transparent 60%)" }} />
          <p className="text-micro text-white/30 uppercase tracking-[0.3em] mb-3 relative z-10">FaceScore AI</p>
          <p className="text-5xl sm:text-6xl font-bold text-gradient-ig relative z-10">{score.toFixed(1)}</p>
          <p className="text-body font-semibold text-white mt-2 relative z-10">Top {topPercent}% worldwide</p>
          <p className="text-caption text-white/30 mt-3 relative z-10">What&apos;s yours?</p>
        </div>

        {/* Actions */}
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <GlassButton
              variant="gradient"
              size="sm"
              className="w-full"
              onClick={() => { downloadImage(); copyCaption(); }}
            >
              Instagram
            </GlassButton>
            <GlassButton
              variant="glass"
              size="sm"
              className="w-full"
              onClick={() => { downloadImage(); copyCaption(); }}
            >
              TikTok
            </GlassButton>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <GlassButton
              variant="glass"
              size="sm"
              className="w-full"
              onClick={shareOnX}
            >
              X / Twitter
            </GlassButton>
            <GlassButton
              variant="glass"
              size="sm"
              className="w-full"
              onClick={handleNativeShare}
            >
              {copied ? "Copied!" : "Share"}
            </GlassButton>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
