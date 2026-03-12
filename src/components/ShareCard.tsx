"use client";

import { useState } from "react";

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
    <div className="animate-fade-in-up" style={{ animationDelay: "1.6s", opacity: 0 }}>
      <div className="rounded-2xl bg-white/[0.04] overflow-hidden">
        {/* Preview card */}
        <div className="relative aspect-[1200/630] w-full bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] flex flex-col items-center justify-center p-6">
          <p className="text-xs text-neutral-500 uppercase tracking-[0.3em] mb-2">FaceScore AI</p>
          <p className="text-5xl sm:text-6xl font-extrabold text-gradient">{score.toFixed(1)}</p>
          <p className="text-white font-semibold mt-2">Top {topPercent}% worldwide</p>
          <p className="text-neutral-500 text-sm mt-3">What&apos;s yours?</p>
        </div>

        {/* Actions */}
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { downloadImage(); copyCaption(); }}
              className="rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 text-white py-2.5 text-sm font-semibold hover:opacity-90 transition"
            >
              Share on Instagram
            </button>
            <button
              type="button"
              onClick={() => { downloadImage(); copyCaption(); }}
              className="rounded-xl bg-white text-black py-2.5 text-sm font-semibold hover:bg-neutral-200 transition"
            >
              Share on TikTok
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={shareOnX}
              className="rounded-xl bg-neutral-800 text-white py-2.5 text-sm font-semibold hover:bg-neutral-700 transition"
            >
              Share on X
            </button>
            <button
              type="button"
              onClick={handleNativeShare}
              className="rounded-xl bg-neutral-800 text-white py-2.5 text-sm font-semibold hover:bg-neutral-700 transition"
            >
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
