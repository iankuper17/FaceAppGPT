import { createClient } from "@/lib/supabase/server";
import { createImageTask, getTaskStatus } from "@/lib/nanobanana";
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

    const { data: profile } = await supabase.from("profiles").select("is_premium").eq("id", user.id).single();
    if (!profile?.is_premium) {
      return NextResponse.json({ error: "Premium required" }, { status: 403 });
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

    const { data: signData, error: signError } = await supabase.storage
      .from("selfies")
      .createSignedUrl(analysis.image_path, 300);
    if (signError || !signData?.signedUrl) {
      return NextResponse.json({ error: "Could not access image" }, { status: 400 });
    }
    const signedUrl = signData.signedUrl;

    const prompt =
      "Same person, same pose and expression. Improve appearance: better hairstyle, clearer and healthier skin, subtle enhancement. Keep identity and face recognizable. Photorealistic, natural lighting.";
    const result = await createImageTask({
      model: "google/gempix2",
      prompt,
      images: [signedUrl],
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    const { data: glowUp, error: insertError } = await supabase
      .from("glow_ups")
      .insert({
        analysis_id: analysisId,
        user_id: user.id,
        task_id: result.task_id,
        prompt_used: prompt,
        status: "processing",
      })
      .select("id, task_id")
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ task_id: glowUp.task_id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("task_id");
    if (!taskId) {
      return NextResponse.json({ error: "task_id required" }, { status: 400 });
    }

    const { data: glowUp, error: rowError } = await supabase
      .from("glow_ups")
      .select("id, status, result_image_path")
      .eq("task_id", taskId)
      .eq("user_id", user.id)
      .single();

    if (rowError || !glowUp) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (glowUp.status === "success" && glowUp.result_image_path) {
      const { data: sd1 } = await supabase.storage
        .from("results")
        .createSignedUrl(glowUp.result_image_path, 3600);
      return NextResponse.json({ status: "success", image_url: sd1?.signedUrl ?? undefined });
    }

    const apiStatus = await getTaskStatus(taskId);
    if ("error" in apiStatus) {
      return NextResponse.json({ status: glowUp.status, error: apiStatus.error });
    }

    if (apiStatus.status === "success" && apiStatus.imageUrl) {
      const res = await fetch(apiStatus.imageUrl);
      const blob = await res.blob();
      const ext = "png";
      const storagePath = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("results")
        .upload(storagePath, blob, { contentType: "image/png", upsert: false });

      if (!uploadError) {
        await supabase
          .from("glow_ups")
          .update({ status: "success", result_image_path: storagePath })
          .eq("id", glowUp.id);
      }

      const { data: sd2 } = await supabase.storage
        .from("results")
        .createSignedUrl(storagePath, 3600);
      return NextResponse.json({ status: "success", image_url: sd2?.signedUrl ?? undefined });
    }

    if (apiStatus.status === "failed") {
      await supabase.from("glow_ups").update({ status: "failed" }).eq("id", glowUp.id);
      return NextResponse.json({ status: "failed" });
    }

    return NextResponse.json({ status: apiStatus.status });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
