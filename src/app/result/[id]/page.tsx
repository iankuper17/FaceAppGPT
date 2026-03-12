import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { ReportSections } from "@/components/ReportSections";
import { PerceivedTraits } from "@/components/PerceivedTraits";
import { LifePredictions } from "@/components/LifePredictions";
import { GlowUpSection } from "@/components/GlowUpSection";
import { ShareCard } from "@/components/ShareCard";
import { notFound } from "next/navigation";
import type { AnalysisReport } from "@/types/analysis";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ResultPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: analysis, error } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !analysis) notFound();

  let imageUrl: string | null = null;
  const { data: signData } = await supabase.storage
    .from("selfies")
    .createSignedUrl(analysis.image_path, 3600);
  if (signData?.signedUrl) imageUrl = signData.signedUrl;

  const { count } = await supabase
    .from("analyses")
    .select("*", { count: "exact", head: true });

  const totalUsers = Math.max(count ?? 50000, 50000);
  const percentile = analysis.percentile ?? Math.round(Number(analysis.face_score) * 10);
  const globalRank = Math.max(1, Math.round(totalUsers * (1 - percentile / 100)));

  const report = analysis.report as AnalysisReport | null;

  return (
    <main className="min-h-screen px-4 py-10 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <Link href="/dashboard" className="text-neutral-500 hover:text-white text-sm transition">
          {"\u2190"} Dashboard
        </Link>
        <Link href="/analyze" className="text-neutral-500 hover:text-white text-sm transition">
          New analysis {"\u2192"}
        </Link>
      </div>

      {/* 1. Hero Result */}
      <div className="mb-12">
        <ScoreDisplay
          score={Number(analysis.face_score)}
          percentile={analysis.percentile}
          globalRank={globalRank}
        />
      </div>

      {/* Selfie preview */}
      {imageUrl && (
        <div className="flex justify-center mb-12">
          <img
            src={imageUrl}
            alt="Your selfie"
            className="rounded-2xl max-h-72 object-cover shadow-2xl shadow-white/5"
          />
        </div>
      )}

      {/* 2. What makes your face attractive + What's holding you back */}
      {report && (
        <div className="mb-12">
          <ReportSections report={report} />
        </div>
      )}

      {/* 3. What strangers think when they see you */}
      {report?.perceived_traits && (
        <div className="mb-12">
          <PerceivedTraits traits={report.perceived_traits} />
        </div>
      )}

      {/* 4. AI Guess My Life */}
      {report?.life_predictions && (
        <div className="mb-12">
          <LifePredictions predictions={report.life_predictions} />
        </div>
      )}

      {/* 5. Glow Up (for everyone) */}
      <div className="mb-12">
        <GlowUpSection analysisId={analysis.id} originalImageUrl={imageUrl} />
      </div>

      {/* 6. Share card */}
      <div className="mb-12">
        <ShareCard score={Number(analysis.face_score)} percentile={analysis.percentile} />
      </div>

      <p className="text-xs text-neutral-600 text-center pb-6">
        Beauty is subjective. This result is for fun and guidance only.
      </p>
    </main>
  );
}
