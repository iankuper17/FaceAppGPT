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
    const imagePath = typeof body?.image_path === "string" ? body.image_path.trim() : null;
    if (!imagePath || !imagePath.startsWith(`selfies/${user.id}/`)) {
      return NextResponse.json({ error: "Invalid image_path" }, { status: 400 });
    }

    const {
      data: { signedUrl },
      error: signError,
    } = await supabase.storage.from("selfies").createSignedUrl(imagePath, 60);
    if (signError || !signedUrl) {
      return NextResponse.json({ error: "Could not access image" }, { status: 400 });
    }

    const result = await analyzeFaceWithVision(signedUrl);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    const { report, score } = result;
    const percentile = Math.min(99, Math.max(1, Math.round(score * 10)));

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

    return NextResponse.json({ id: analysis.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
