import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.task_id !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const taskId = body.task_id;
  const status = body.status;
  const result = body.result as Array<{ image?: string }> | undefined;
  const imageUrl = result?.[0]?.image;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "Server config missing" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const { data: row } = await supabase
    .from("glow_ups")
    .select("id, user_id")
    .eq("task_id", taskId)
    .single();

  if (!row) {
    return NextResponse.json({ ok: true });
  }

  if (status === "success" && imageUrl && row.user_id) {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const storagePath = `${row.user_id}/${crypto.randomUUID()}.png`;
      const { error: uploadError } = await supabase.storage
        .from("results")
        .upload(storagePath, blob, { contentType: "image/png", upsert: false });

      if (!uploadError) {
        await supabase
          .from("glow_ups")
          .update({ status: "success", result_image_path: storagePath })
          .eq("id", row.id);
      }
    } catch (e) {
      console.error("Webhook: failed to save image", e);
    }
  } else if (status === "failed") {
    await supabase.from("glow_ups").update({ status: "failed" }).eq("id", row.id);
  }

  return NextResponse.json({ ok: true });
}
