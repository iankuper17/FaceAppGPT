"use client";

import type { PerceivedTraits as PerceivedTraitsType } from "@/types/analysis";

interface PerceivedTraitsProps {
  traits: PerceivedTraitsType;
}

const TRAIT_CONFIG: { key: keyof PerceivedTraitsType; label: string; color: string }[] = [
  { key: "confidence", label: "Confidence", color: "bg-amber-500" },
  { key: "trustworthiness", label: "Trustworthiness", color: "bg-emerald-500" },
  { key: "approachability", label: "Approachability", color: "bg-sky-500" },
  { key: "intelligence", label: "Intelligence", color: "bg-violet-500" },
  { key: "dominance", label: "Dominance", color: "bg-rose-500" },
];

export function PerceivedTraits({ traits }: PerceivedTraitsProps) {
  return (
    <section className="animate-fade-in-up" style={{ animationDelay: "1s", opacity: 0 }}>
      <h3 className="text-xl font-bold text-white mb-1">
        What strangers think when they see you
      </h3>
      <p className="text-sm text-neutral-500 mb-5">First-impression perception scores</p>

      <div className="space-y-4">
        {TRAIT_CONFIG.map(({ key, label, color }) => {
          const value = traits[key];
          return (
            <div key={key}>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-sm font-medium text-neutral-300">{label}</span>
                <span className="text-sm font-bold text-white">{value}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className={`h-full rounded-full progress-bar ${color}`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
