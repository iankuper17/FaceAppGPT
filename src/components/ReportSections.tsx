"use client";

import type { AnalysisReport } from "@/types/analysis";

interface ReportSectionsProps {
  report: AnalysisReport;
}

function Section({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: number | string }[];
}) {
  return (
    <section className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
      <h3 className="font-semibold text-white mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map(({ label, value }) => (
          <li key={label} className="flex justify-between text-sm">
            <span className="text-neutral-400">{label}</span>
            <span className="text-white">{typeof value === "number" ? value.toFixed(1) : value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ReportSections({ report }: ReportSectionsProps) {
  const { facial_structure, skin_analysis, expression_impact, perceived_traits } = report;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Section
        title="Facial Structure"
        items={[
          { label: "Jawline", value: facial_structure.jawline },
          { label: "Eye symmetry", value: facial_structure.eye_symmetry },
          { label: "Facial balance", value: facial_structure.facial_balance },
        ]}
      />
      <Section
        title="Skin Analysis"
        items={[
          { label: "Clarity", value: skin_analysis.clarity },
          { label: "Texture", value: skin_analysis.texture },
          { label: "Tone balance", value: skin_analysis.tone_balance },
        ]}
      />
      <Section
        title="Expression Impact"
        items={[
          { label: "Smile boost", value: `+${expression_impact.smile_boost.toFixed(1)}` },
          { label: "Neutral rating", value: expression_impact.neutral_rating },
        ]}
      />
      {perceived_traits && (
        <Section
          title="How people might perceive you"
          items={[
            { label: "Confidence", value: perceived_traits.confidence },
            { label: "Approachability", value: perceived_traits.approachability },
            { label: "Dominance", value: perceived_traits.dominance },
          ]}
        />
      )}
    </div>
  );
}
