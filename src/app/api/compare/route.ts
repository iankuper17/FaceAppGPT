import { createClient } from "@/lib/supabase/server";
import { analyzeFaceWithVision } from "@/lib/vision";
import { NextResponse } from "next/server";

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
      supabase.storage.from("selfies").createSignedUrl(imagePathA, 60),
      supabase.storage.from("selfies").createSignedUrl(imagePathB, 60),
    ]);

    if (!signA.data?.signedUrl || !signB.data?.signedUrl) {
      return NextResponse.json({ error: "Could not access images" }, { status: 400 });
    }

    const [resultA, resultB] = await Promise.all([
      analyzeFaceWithVision(signA.data.signedUrl),
      analyzeFaceWithVision(signB.data.signedUrl),
    ]);

    if ("error" in resultA) {
      return NextResponse.json({ error: `Face A: ${resultA.error}` }, { status: 502 });
    }
    if ("error" in resultB) {
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
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
