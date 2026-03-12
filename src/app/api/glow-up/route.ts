import { createClient } from "@/lib/supabase/server";
import { generateGlowUpImage } from "@/lib/gemini-image";
import { NextResponse } from "next/server";

export const maxDuration = 60;

const GLOW_UP_PROMPT =
  "Realistic glow-up of the same person. Keep identical identity, pose, expression and background. Reduce facial fat to create a leaner face with sharper jawline and defined cheekbones, model-like facial definition. Add a subtle healthy sun tan, improve skin clarity and tone, enhance lighting and natural contrast. Photorealistic, natural, more attractive version of the same person. Do not change identity.";

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
    const analysisId = typeof body?.analysis_id === "string" ? body.analysis_id.trim() : null;
    if (!analysisId) {
      return NextResponse.json({ error: "analysis_id required" }, { status: 400 });
    }

    const { data: analysis, error: analysisError } = await supabase
      .from("analyses")
      .select("id, image_path")
      .eq("id", analysisId)
      .eq("user_id", user.id)
      .single();

    if (analysisError || !analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }

    // Download the original image as base64
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("selfies")
      .download(analysis.image_path);

    if (downloadError || !fileData) {
      return NextResponse.json({ error: "Could not download image" }, { status: 400 });
    }

    const arrayBuffer = await fileData.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = fileData.type || "image/jpeg";

    // Call Gemini to generate glow-up
    console.log("[glow-up] Calling Gemini for glow-up...");
    const result = await generateGlowUpImage(base64, mimeType, GLOW_UP_PROMPT);

    if ("error" in result) {
      console.error("[glow-up] Gemini failed:", result.error);
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    // Upload result image to storage
    const ext = result.mimeType.includes("png") ? "png" : "jpg";
    const storagePath = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const imageBuffer = Buffer.from(result.imageBase64, "base64");

    const { error: uploadError } = await supabase.storage
      .from("results")
      .upload(storagePath, imageBuffer, {
        contentType: result.mimeType,
        upsert: false,
      });

    if (uploadError) {
      console.error("[glow-up] Upload failed:", uploadError.message);
      return NextResponse.json({ error: "Failed to save result image" }, { status: 500 });
    }

    // Save glow_up record
    await supabase.from("glow_ups").insert({
      analysis_id: analysisId,
      user_id: user.id,
      task_id: null,
      result_image_path: storagePath,
      prompt_used: GLOW_UP_PROMPT,
      status: "success",
    });

    // Return signed URL for the result
    const { data: signedData } = await supabase.storage
      .from("results")
      .createSignedUrl(storagePath, 3600);

    return NextResponse.json({
      status: "success",
      image_url: signedData?.signedUrl ?? null,
    });
  } catch (e) {
    console.error("[glow-up] Unexpected error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
