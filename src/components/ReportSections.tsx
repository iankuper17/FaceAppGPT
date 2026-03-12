"use client";

import type { AnalysisReport } from "@/types/analysis";

interface ReportSectionsProps {
  report: AnalysisReport;
}

export function ReportSections({ report }: ReportSectionsProps) {
  const { attractive_features, improvement_areas, skin_analysis } = report;

  return (
    <div className="space-y-8">
      {attractive_features && attractive_features.length > 0 && (
        <section className="animate-fade-in-up" style={{ animationDelay: "0.5s", opacity: 0 }}>
          <h3 className="text-xl font-bold text-white mb-4">What makes your face attractive</h3>
          <div className="space-y-3">
            {attractive_features.map((feat, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-2xl bg-white/[0.04] p-4"
              >
                <span className="mt-0.5 text-green-400 text-lg shrink-0">{"\u2713"}</span>
                <div>
                  <p className="font-semibold text-white">{feat.label}</p>
                  <p className="text-sm text-neutral-400 mt-0.5">{feat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {improvement_areas && improvement_areas.length > 0 && (
        <section className="animate-fade-in-up" style={{ animationDelay: "0.7s", opacity: 0 }}>
          <h3 className="text-xl font-bold text-white mb-4">What&apos;s holding you back</h3>
          <div className="space-y-3">
            {improvement_areas.map((area, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-2xl bg-white/[0.04] p-4"
              >
                <span className="mt-0.5 text-amber-400 text-lg shrink-0">{"\u2193"}</span>
                <div>
                  <p className="font-semibold text-white">{area.label}</p>
                  <p className="text-sm text-neutral-400 mt-0.5">{area.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {skin_analysis && (
        <section className="animate-fade-in-up" style={{ animationDelay: "0.9s", opacity: 0 }}>
          <h3 className="text-lg font-semibold text-neutral-300 mb-3">Skin details</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Clarity", value: skin_analysis.clarity },
              { label: "Texture", value: skin_analysis.texture },
              { label: "Tone", value: skin_analysis.tone_balance },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-2xl bg-white/[0.04] p-4 text-center"
              >
                <p className="text-2xl font-bold text-white">{value.toFixed(1)}</p>
                <p className="text-xs text-neutral-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
