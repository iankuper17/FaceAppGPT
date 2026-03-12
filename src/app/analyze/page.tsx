"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaceUploader } from "@/components/FaceUploader";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { ProgressCapsule } from "@/components/ui/ProgressCapsule";

export default function AnalyzePage() {
  const [error, setError] = useState("");
  const [resultId, setResultId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (resultId) {
    window.location.href = `/result/${resultId}`;
    return (
      <main className="min-h-[100dvh] flex flex-col items-center justify-center gap-6">
        <ProgressCapsule label="Loading your results..." />
      </main>
    );
  }

  if (isAnalyzing) {
    return (
      <main className="relative min-h-[100dvh] flex flex-col items-center justify-center px-5">
        <AmbientBackground intensity="medium" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center"
        >
          <div className="mb-8">
            <motion.div
              className="w-24 h-24 mx-auto rounded-full bg-gradient-ig-subtle flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-ig-magenta">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </motion.div>
          </div>
          <ProgressCapsule label="Analyzing your features..." />
          <p className="text-micro text-white/20 mt-8">This usually takes about 10 seconds</p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="relative min-h-[100dvh] flex flex-col items-center justify-center px-5">
      <AmbientBackground intensity="low" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md text-center"
      >
        <h1 className="text-display-sm text-white mb-2">Analyze my face</h1>
        <p className="text-caption text-white/40 mb-8">
          Use a clear selfie with good lighting, no heavy sunglasses.
        </p>

        <FaceUploader
          onSuccess={(id) => setResultId(id)}
          onError={(msg) => setError(msg)}
          onAnalyzing={(v) => setIsAnalyzing(v)}
        />

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 text-caption text-red-400"
            role="alert"
          >
            {error}
          </motion.p>
        )}

        <p className="mt-8 text-micro text-white/20">
          Beauty is subjective. This is for fun and guidance only.
        </p>

        <Link
          href="/dashboard"
          className="inline-block mt-6 text-micro text-white/25 hover:text-white/50 transition"
        >
          Back to dashboard
        </Link>
      </motion.div>
    </main>
  );
}
