"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { validateImageFile } from "@/lib/validators";
import { createClient } from "@/lib/supabase/client";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { ProgressCapsule } from "@/components/ui/ProgressCapsule";

const BUCKET = "selfies";

interface CompareResult {
  score_a: number;
  score_b: number;
  winner: "a" | "b";
  probability: number;
}

export default function ComparePage() {
  const [previewA, setPreviewA] = useState<string | null>(null);
  const [previewB, setPreviewB] = useState<string | null>(null);
  const [pathA, setPathA] = useState<string | null>(null);
  const [pathB, setPathB] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CompareResult | null>(null);
  const inputARef = useRef<HTMLInputElement>(null);
  const inputBRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File, side: "a" | "b") {
    const validation = validateImageFile(file);
    if (!validation.ok) {
      setError(validation.error);
      return;
    }

    setError("");
    setUploading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("You must be signed in.");
      setUploading(false);
      return;
    }

    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

    setUploading(false);
    if (uploadError) {
      setError(uploadError.message);
      return;
    }

    const preview = URL.createObjectURL(file);
    if (side === "a") {
      setPathA(path);
      setPreviewA(preview);
    } else {
      setPathB(path);
      setPreviewB(preview);
    }
  }

  async function handleCompare() {
    if (!pathA || !pathB) return;
    setError("");
    setComparing(true);
    setResult(null);

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_path_a: pathA, image_path_b: pathB }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Comparison failed");
        return;
      }
      setResult(data);
    } catch {
      setError("Request failed");
    } finally {
      setComparing(false);
    }
  }

  const busy = uploading || comparing;

  function UploadPanel({ side, preview, inputRef }: {
    side: "a" | "b";
    preview: string | null;
    inputRef: React.RefObject<HTMLInputElement | null>;
  }) {
    const score = result ? (side === "a" ? result.score_a : result.score_b) : null;
    const isWinner = result?.winner === side;

    return (
      <div className="flex flex-col items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) uploadFile(f, side);
          }}
        />
        <motion.button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className={`w-full aspect-[3/4] rounded-glass overflow-hidden transition-all duration-300 ${
            isWinner ? "ring-2 ring-ig-magenta/60 shadow-ig-glow-sm" : ""
          }`}
          whileHover={busy ? undefined : { scale: 1.02 }}
          whileTap={busy ? undefined : { scale: 0.98 }}
        >
          <GlassCard className="w-full h-full flex items-center justify-center p-0 !rounded-glass">
            {preview ? (
              <img src={preview} alt={`Face ${side.toUpperCase()}`} className="w-full h-full object-cover rounded-glass" />
            ) : (
              <div className="flex flex-col items-center gap-3 px-4">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-white/25">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                <p className="text-micro text-white/25 text-center">
                  Face {side.toUpperCase()}
                </p>
              </div>
            )}
          </GlassCard>
        </motion.button>

        <AnimatePresence>
          {score != null && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className={`text-2xl font-bold ${isWinner ? "text-gradient-ig" : "text-white/40"}`}>
                {score.toFixed(1)}
              </p>
              {isWinner && (
                <p className="text-micro font-semibold text-ig-magenta mt-0.5">
                  WINNER &bull; {result!.probability}%
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <main className="relative min-h-[100dvh] px-5 py-8 max-w-2xl mx-auto">
      <AmbientBackground intensity="low" />

      <header className="relative z-10 mb-10">
        <Link href="/dashboard" className="flex items-center gap-1.5 text-micro text-white/30 hover:text-white/60 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Dashboard
        </Link>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-display-sm text-white mb-2">Who is hotter?</h1>
          <p className="text-caption text-white/40">Upload two photos and let the AI decide.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <UploadPanel side="a" preview={previewA} inputRef={inputARef} />
          <UploadPanel side="b" preview={previewB} inputRef={inputBRef} />
        </div>

        {/* Compare button or loading */}
        <div className="text-center">
          {comparing ? (
            <ProgressCapsule label="Analyzing both faces..." />
          ) : previewA && previewB && !result ? (
            <GlassButton
              variant="gradient"
              size="lg"
              onClick={handleCompare}
              disabled={busy}
            >
              Compare
            </GlassButton>
          ) : null}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-caption text-red-400 text-center"
            role="alert"
          >
            {error}
          </motion.p>
        )}

        <p className="mt-10 text-micro text-white/15 text-center">
          For fun only. Beauty is subjective.
        </p>
      </motion.div>
    </main>
  );
}
