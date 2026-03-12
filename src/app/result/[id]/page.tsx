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
    <main className="min-h-[100dvh] px-5 py-10 pb-20 max-w-xl mx-auto">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-12">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-micro text-white/30 hover:text-white/60 transition"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Dashboard
        </Link>
        <Link
          href="/analyze"
          className="flex items-center gap-1.5 text-micro text-white/30 hover:text-white/60 transition"
        >
          New analysis
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      </div>

      {/* Score Hero */}
      <div className="mb-14">
        <ScoreDisplay
          score={Number(analysis.face_score)}
          percentile={analysis.percentile}
          globalRank={globalRank}
        />
      </div>

      {/* Selfie preview */}
      {imageUrl && (
        <div className="flex justify-center mb-14">
          <div className="relative rounded-glass overflow-hidden shadow-glass-lg">
            <img
              src={imageUrl}
              alt="Your selfie"
              className="max-h-72 object-cover"
            />
            <div className="absolute inset-0 rounded-glass ring-1 ring-inset ring-white/10" />
          </div>
        </div>
      )}

      {/* Report sections */}
      {report && (
        <div className="mb-14">
          <ReportSections report={report} />
        </div>
      )}

      {/* Perceived traits */}
      {report?.perceived_traits && (
        <div className="mb-14">
          <PerceivedTraits traits={report.perceived_traits} />
        </div>
      )}

      {/* Life predictions */}
      {report?.life_predictions && (
        <div className="mb-14">
          <LifePredictions predictions={report.life_predictions} />
        </div>
      )}

      {/* Glow Up */}
      <div className="mb-14">
        <GlowUpSection analysisId={analysis.id} originalImageUrl={imageUrl} />
      </div>

      {/* Share */}
      <div className="mb-14">
        <ShareCard analysisId={analysis.id} score={Number(analysis.face_score)} percentile={analysis.percentile} />
      </div>

      <p className="text-micro text-white/15 text-center pb-6">
        Beauty is subjective. This is for fun and guidance only.
      </p>
    </main>
  );
}
