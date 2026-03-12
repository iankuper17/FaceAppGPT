"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlowUpSlider } from "./GlowUpSlider";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { ProgressCapsule } from "@/components/ui/ProgressCapsule";

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
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h3 className="text-title text-white mb-4">Your 9/10 Version</h3>
        <GlowUpSlider beforeUrl={originalImageUrl} afterUrl={resultImageUrl} />
      </motion.div>
    );
  }

  if (loading) {
    return (
      <GlassCard className="p-8 text-center">
        <div className="mb-4">
          <motion.div
            className="w-16 h-16 mx-auto rounded-2xl bg-gradient-ig-subtle flex items-center justify-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-ig-magenta">
              <path d="M12 3v3M12 18v3M5.636 5.636l2.121 2.121M16.243 16.243l2.121 2.121M3 12h3M18 12h3M5.636 18.364l2.121-2.121M16.243 7.757l2.121-2.121" />
            </svg>
          </motion.div>
        </div>
        <ProgressCapsule label="Generating your glow up..." />
        <p className="text-micro text-white/20 mt-4">This takes about 15 seconds</p>
      </GlassCard>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlassCard className="p-8 text-center bg-gradient-ig-subtle">
        <h3 className="text-title text-white mb-2">See your 9/10 version</h3>
        <p className="text-caption text-white/40 mb-6 max-w-sm mx-auto">
          AI enhances your look: better skin, optimized hairstyle, sharper features. Same you, elevated.
        </p>
        <GlassButton
          variant="gradient"
          size="md"
          onClick={handleGlowUp}
          disabled={loading}
        >
          Generate my glow up
        </GlassButton>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-caption text-red-400"
          >
            {error}
          </motion.p>
        )}
      </GlassCard>
    </motion.div>
  );
}
