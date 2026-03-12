import { createClient } from "@/lib/supabase/server";
import { analyzeFaceWithVision } from "@/lib/vision";
import { NextResponse } from "next/server";

export const maxDuration = 60;

/** Normal CDF approximation (Abramowitz & Stegun) */
function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);
  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX / 2);
  return 0.5 * (1.0 + sign * y);
}

/** Map face_score to a realistic percentile using a bell curve (mean=5.5, sd=1.5) */
function scoreToPercentile(score: number): number {
  const z = (score - 5.5) / 1.5;
  const raw = Math.round(normalCDF(z) * 100);
  return Math.min(99, Math.max(1, raw));
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const imagePath = typeof body?.image_path === "string" ? body.image_path.trim() : null;
    if (!imagePath || !imagePath.startsWith(`${user.id}/`)) {
      return NextResponse.json({ error: "Invalid image_path" }, { status: 400 });
    }

    const { data: signData, error: signError } = await supabase.storage
      .from("selfies")
      .createSignedUrl(imagePath, 60);
    if (signError || !signData?.signedUrl) {
      return NextResponse.json({ error: "Could not access image" }, { status: 400 });
    }

    const result = await analyzeFaceWithVision(signData.signedUrl);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    const { report, score } = result;
    const percentile = scoreToPercentile(score);

    const { data: analysis, error: insertError } = await supabase
      .from("analyses")
      .insert({
        user_id: user.id,
        image_path: imagePath,
        face_score: Math.round(score * 10) / 10,
        report: report as unknown as Record<string, unknown>,
        percentile,
      })
      .select("id")
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const { count } = await supabase
      .from("analyses")
      .select("*", { count: "exact", head: true });

    const totalUsers = Math.max(count ?? 50000, 50000);
    const globalRank = Math.max(1, Math.round(totalUsers * (1 - percentile / 100)));

    return NextResponse.json({ id: analysis.id, global_rank: globalRank });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
