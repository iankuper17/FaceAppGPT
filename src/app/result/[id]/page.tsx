import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { ReportSections } from "@/components/ReportSections";
import { ShareCard } from "@/components/ShareCard";
import { GlowUpSection } from "@/components/GlowUpSection";
import { notFound } from "next/navigation";

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
    .createSignedUrl(analysis.image_path.replace(/^selfies\//, ""), 3600);
  if (signData?.signedUrl) imageUrl = signData.signedUrl;

  const { data: profile } = await supabase.from("profiles").select("is_premium").eq("id", user.id).single();
  const isPremium = profile?.is_premium ?? false;

  const report = analysis.report as Parameters<typeof ReportSections>[0]["report"] | null;

  return (
    <main className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Link href="/dashboard" className="text-neutral-400 hover:text-white text-sm">
          Dashboard
        </Link>
        <Link href="/analyze" className="text-neutral-400 hover:text-white text-sm">
          New analysis
        </Link>
      </div>

      <div className="mb-8">
        <ScoreDisplay score={Number(analysis.face_score)} percentile={analysis.percentile} />
      </div>

      {imageUrl && (
        <div className="flex justify-center mb-6">
          <img
            src={imageUrl}
            alt="Your selfie"
            className="rounded-lg max-h-64 object-cover"
          />
        </div>
      )}

      {report && (
        <div className="mb-8">
          <ReportSections report={report} />
        </div>
      )}

      <div className="mb-8">
        <ShareCard score={Number(analysis.face_score)} imageUrl={imageUrl} />
      </div>

      {isPremium && (
        <GlowUpSection analysisId={analysis.id} originalImageUrl={imageUrl} />
      )}

      <p className="text-xs text-neutral-500 mt-8">
        Beauty is subjective. This result is for fun and guidance only.
      </p>
    </main>
  );
}
