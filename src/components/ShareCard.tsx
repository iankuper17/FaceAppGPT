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

  const pct = percentile ?? Math.round(score * 10);
  const caption = `My FaceScore: ${score.toFixed(1)} — More attractive than ${pct}% of people. What's yours?`;
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
      const file = new File([blob], `facescore-${score.toFixed(1)}.png`, {
        type: "image/png",
      });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "FaceScore",
          text: caption,
          files: [file],
        });
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
        {/* Story preview */}
        <div className="relative w-full flex justify-center p-5 pb-3">
          <div className="relative aspect-[9/16] w-44 rounded-2xl overflow-hidden bg-[#08080c] flex flex-col items-center justify-center shadow-glass-lg">
            {/* Ambient glow */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 80% 40% at 50% 35%, rgba(88,28,135,0.2) 0%, transparent 70%)",
              }}
            />

            {/* Mini content */}
            <div className="relative z-10 flex flex-col items-center px-3">
              <p className="text-[7px] text-white/20 uppercase tracking-[0.15em] mb-2">
                FaceScore
              </p>

              {/* Photo placeholder */}
              <div className="w-16 h-20 rounded-xl bg-white/[0.04] border border-white/[0.06] mb-3" />

              {/* Score */}
              <p className="text-[28px] leading-none font-extrabold text-gradient-ig">
                {score.toFixed(1)}
              </p>
              <p className="text-[7px] text-white/40 mt-1 text-center">
                More attractive than {pct}%
              </p>

              {/* Trait pills */}
              <div className="flex flex-wrap justify-center gap-[3px] mt-2.5">
                {["Approachable", "Confident", "Trustworthy"].map((t) => (
                  <span
                    key={t}
                    className="text-[5px] text-white/40 px-1.5 py-[2px] rounded-full bg-white/[0.04] border border-white/[0.06]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <p className="text-[6px] text-white/15 mt-3">
                What&apos;s your score?
              </p>
            </div>
          </div>
        </div>

        <p className="text-micro text-white/25 text-center px-5 mb-4">
          Download your story to share on Instagram or TikTok
        </p>

        {/* Actions */}
        <div className="p-5 pt-0 space-y-3">
          <GlassButton
            variant="gradient"
            size="md"
            className="w-full"
            onClick={() => {
              void downloadStoryImage();
              copyCaption();
            }}
            disabled={downloading}
          >
            {downloading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Download Story
              </span>
            )}
          </GlassButton>

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
