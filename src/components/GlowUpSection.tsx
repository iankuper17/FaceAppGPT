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
        setError(data.error ?? "Failed to start glow up");
        return;
      }
      const taskId = data.task_id;
      if (!taskId) {
        setError("No task ID returned");
        return;
      }
      const interval = setInterval(async () => {
        const statusRes = await fetch(`/api/glow-up?task_id=${encodeURIComponent(taskId)}`);
        const statusData = await statusRes.json();
        if (statusData.status === "success" && statusData.image_url) {
          clearInterval(interval);
          setResultImageUrl(statusData.image_url);
        } else if (statusData.status === "failed") {
          clearInterval(interval);
          setError("Glow up failed");
        }
      }, 3000);
      setTimeout(() => clearInterval(interval), 120000);
    } catch {
      setError("Request failed");
    } finally {
      setLoading(false);
    }
  }

  if (resultImageUrl && originalImageUrl) {
    return (
      <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-4">
        <h3 className="font-semibold text-white mb-4">Glow Up Simulation</h3>
        <GlowUpSlider beforeUrl={originalImageUrl} afterUrl={resultImageUrl} />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-4">
      <h3 className="font-semibold text-white mb-2">Glow Up Simulation</h3>
      <p className="text-sm text-neutral-400 mb-4">
        Generate an improved version: better hairstyle, clearer skin, optimized look.
      </p>
      <button
        type="button"
        onClick={handleGlowUp}
        disabled={loading}
        className="rounded-lg bg-white text-black px-4 py-2 font-semibold hover:bg-neutral-200 disabled:opacity-50"
      >
        {loading ? "Generating..." : "Simulate glow up"}
      </button>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
