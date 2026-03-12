import { createClient } from "@/lib/supabase/server";
import { analyzeFaceWithVision } from "@/lib/vision";
import { NextResponse } from "next/server";

export const maxDuration = 60;

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
    const imagePathA = typeof body?.image_path_a === "string" ? body.image_path_a.trim() : null;
    const imagePathB = typeof body?.image_path_b === "string" ? body.image_path_b.trim() : null;

    if (!imagePathA || !imagePathB) {
      return NextResponse.json({ error: "Two image paths required" }, { status: 400 });
    }

    if (!imagePathA.startsWith(`${user.id}/`) || !imagePathB.startsWith(`${user.id}/`)) {
      return NextResponse.json({ error: "Invalid image paths" }, { status: 400 });
    }

    const [signA, signB] = await Promise.all([
      supabase.storage.from("selfies").createSignedUrl(imagePathA, 300),
      supabase.storage.from("selfies").createSignedUrl(imagePathB, 300),
    ]);

    if (!signA.data?.signedUrl || !signB.data?.signedUrl) {
      return NextResponse.json({ error: "Could not access images" }, { status: 400 });
    }

    // Run sequentially to avoid OpenAI rate limits and reduce timeout risk
    console.log("[compare] Analyzing face A...");
    const resultA = await analyzeFaceWithVision(signA.data.signedUrl);
    if ("error" in resultA) {
      console.error("[compare] Face A analysis failed:", resultA.error);
      return NextResponse.json({ error: `Face A: ${resultA.error}` }, { status: 502 });
    }

    console.log("[compare] Analyzing face B...");
    const resultB = await analyzeFaceWithVision(signB.data.signedUrl);
    if ("error" in resultB) {
      console.error("[compare] Face B analysis failed:", resultB.error);
      return NextResponse.json({ error: `Face B: ${resultB.error}` }, { status: 502 });
    }

    const scoreA = resultA.score;
    const scoreB = resultB.score;
    const total = scoreA + scoreB;
    const probabilityA = total > 0 ? Math.round((scoreA / total) * 100) : 50;

    return NextResponse.json({
      score_a: Math.round(scoreA * 10) / 10,
      score_b: Math.round(scoreB * 10) / 10,
      winner: scoreA >= scoreB ? "a" : "b",
      probability: scoreA >= scoreB ? probabilityA : 100 - probabilityA,
    });
  } catch (e) {
    console.error("[compare] Unexpected error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
