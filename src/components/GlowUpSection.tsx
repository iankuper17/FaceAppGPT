"use client";

import { useState } from "react";
import { GlowUpSlider } from "./GlowUpSlider";

interface GlowUpSectionProps {
  analysisId: string;
  originalImageUrl: string | null;
}

export function GlowUpSection({ analysisId, originalImageUrl }: GlowUpSectionProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);

  async function handleGlowUp() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/glow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis_id: analysisId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to generate glow up");
        return;
      }
      if (data.image_url) {
        setResultImageUrl(data.image_url);
      } else {
        setError("No image was returned. Try again.");
      }
    } catch {
      setError("Request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (resultImageUrl && originalImageUrl) {
    return (
      <div className="rounded-2xl bg-white/[0.04] p-6">
        <h3 className="text-xl font-bold text-white mb-4">Your 9/10 Version</h3>
        <GlowUpSlider beforeUrl={originalImageUrl} afterUrl={resultImageUrl} />
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-6 text-center animate-fade-in-up"
      style={{
        animationDelay: "1.4s",
        opacity: 0,
        background: "linear-gradient(135deg, rgba(255,107,53,0.08) 0%, rgba(247,201,72,0.08) 100%)",
      }}
    >
      <h3 className="text-xl font-bold text-white mb-2">See your 9/10 version</h3>
      <p className="text-sm text-neutral-400 mb-5 max-w-sm mx-auto">
        AI enhances your look: better skin, optimized hairstyle, sharper features. Same you, elevated.
      </p>
      <button
        type="button"
        onClick={handleGlowUp}
        disabled={loading}
        className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 font-semibold hover:opacity-90 disabled:opacity-50 transition"
      >
        {loading ? "Generating (this takes ~15s)..." : "Generate my glow up"}
      </button>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </div>
  );
}
