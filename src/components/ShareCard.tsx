"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

interface ShareCardProps {
  analysisId: string;
  score: number;
  percentile: number | null;
}

export function ShareCard({ analysisId, score, percentile }: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const topPercent = Math.max(1, 100 - (percentile ?? Math.round(score * 10)));
  const caption = `My Face Score: ${score.toFixed(1)} — Top ${topPercent}% worldwide. What's yours?`;
  const shareUrl = typeof window !== "undefined" ? window.location.origin : "";
  const storyImageUrl = `/api/share-story?analysis_id=${analysisId}`;

  async function downloadStoryImage() {
    setDownloading(true);
    try {
      const res = await fetch(storyImageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `facescore-${score.toFixed(1)}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab
      window.open(storyImageUrl, "_blank");
    } finally {
      setDownloading(false);
    }
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
    try {
      const res = await fetch(storyImageUrl);
      const blob = await res.blob();
      const file = new File([blob], `facescore-${score.toFixed(1)}.png`, { type: "image/png" });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: "FaceScore AI", text: caption, files: [file] });
        return;
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
    }

    copyCaption();
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
        {/* Vertical story preview */}
        <div className="relative w-full flex justify-center p-5 pb-3">
          <div className="relative aspect-[9/16] w-48 rounded-2xl overflow-hidden shadow-glass-lg bg-gradient-to-b from-graphite-950 via-plum-800/40 to-graphite-950 flex flex-col items-center justify-center">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background:
                  "radial-gradient(circle at 50% 30%, rgba(192,38,211,0.4) 0%, transparent 60%)",
              }}
            />
            <p className="text-[8px] text-white/25 uppercase tracking-[0.2em] mb-2 relative z-10">
              FaceScore AI
            </p>
            <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 mb-2 relative z-10" />
            <p className="text-2xl font-bold text-gradient-ig relative z-10">
              {score.toFixed(1)}
            </p>
            <p className="text-[9px] font-semibold text-white mt-0.5 relative z-10">
              Top {topPercent}%
            </p>
            <div className="mt-2 space-y-1 w-[70%] relative z-10">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className="h-[3px] flex-1 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-ig-violet to-ig-pink"
                      style={{ width: `${60 + Math.random() * 30}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[7px] text-white/15 mt-3 relative z-10">
              What&apos;s yours?
            </p>
          </div>
        </div>

        <p className="text-micro text-white/25 text-center px-5 mb-4">
          Download your story card for Instagram or TikTok
        </p>

        {/* Actions */}
        <div className="p-5 pt-0 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <GlassButton
              variant="gradient"
              size="sm"
              className="w-full"
              onClick={() => {
                void downloadStoryImage();
                copyCaption();
              }}
              disabled={downloading}
            >
              {downloading ? "Generating..." : "Instagram"}
            </GlassButton>
            <GlassButton
              variant="glass"
              size="sm"
              className="w-full"
              onClick={() => {
                void downloadStoryImage();
                copyCaption();
              }}
              disabled={downloading}
            >
              {downloading ? "Generating..." : "TikTok"}
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
