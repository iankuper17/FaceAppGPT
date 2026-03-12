"use client";

import type { LifePredictions as LifePredictionsType } from "@/types/analysis";

interface LifePredictionsProps {
  predictions: LifePredictionsType;
}

export function LifePredictions({ predictions }: LifePredictionsProps) {
  return (
    <section className="animate-fade-in-up" style={{ animationDelay: "1.2s", opacity: 0 }}>
      <h3 className="text-xl font-bold text-white mb-1">AI Guess My Life</h3>
      <p className="text-sm text-neutral-500 mb-5">
        What the AI thinks about you, based on your face alone
      </p>

      <div className="space-y-5">
        <div className="flex items-center gap-4 rounded-2xl bg-white/[0.04] p-5">
          <div className="text-center">
            <p className="text-4xl font-extrabold text-white">{predictions.estimated_age}</p>
            <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wide">Est. Age</p>
          </div>
          <div className="h-12 w-px bg-white/10" />
          <div className="flex-1">
            <p className="text-white font-medium">{predictions.personality}</p>
            {predictions.vibe && (
              <p className="text-sm text-neutral-400 italic mt-1">
                &ldquo;{predictions.vibe}&rdquo;
              </p>
            )}
          </div>
        </div>

        {predictions.likely_hobbies.length > 0 && (
          <div>
            <p className="text-sm text-neutral-400 mb-2">Likely hobbies</p>
            <div className="flex flex-wrap gap-2">
              {predictions.likely_hobbies.map((hobby, i) => (
                <span
                  key={i}
                  className="rounded-full bg-white/[0.07] px-4 py-1.5 text-sm text-neutral-200"
                >
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
