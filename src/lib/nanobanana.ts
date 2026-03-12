const NANO_BANANA_BASE = "https://api.defapi.org";

export interface ImageGenRequest {
  model: string;
  prompt: string;
  images?: string[];
  callback_url?: string;
}

export interface ImageGenResponse {
  code: number;
  message: string;
  data?: { task_id: string };
}

export interface TaskQueryResponse {
  code: number;
  message: string;
  data?: {
    status: string;
    result?: Array<{ image: string }>;
  };
}

export async function createImageTask(
  params: ImageGenRequest
): Promise<{ task_id: string } | { error: string }> {
  const apiKey = process.env.NANO_BANANA_PRO_API_KEY;
  if (!apiKey) {
    return { error: "NANO_BANANA_PRO_API_KEY is not set." };
  }

  try {
    const res = await fetch(`${NANO_BANANA_BASE}/api/image/gen`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: params.model ?? "google/gempix2",
        prompt: params.prompt,
        images: params.images,
        callback_url: params.callback_url,
      }),
    });

    const text = await res.text();

    if (!res.ok) {
      console.error("[nanobanana] createImageTask HTTP error:", res.status, text);
      return { error: `Image API HTTP ${res.status}: ${text.slice(0, 200)}` };
    }

    let data: ImageGenResponse;
    try {
      data = JSON.parse(text) as ImageGenResponse;
    } catch {
      console.error("[nanobanana] createImageTask non-JSON response:", text.slice(0, 500));
      return { error: "Image API returned non-JSON response" };
    }

    if (data.code !== 0 || !data.data?.task_id) {
      console.error("[nanobanana] createImageTask API error:", JSON.stringify(data));
      return { error: data.message ?? `Image API error code ${data.code}` };
    }

    return { task_id: data.data.task_id };
  } catch (e) {
    console.error("[nanobanana] createImageTask fetch error:", e);
    return { error: `Image API network error: ${e instanceof Error ? e.message : String(e)}` };
  }
}

export async function getTaskStatus(
  taskId: string
): Promise<{ status: string; imageUrl?: string } | { error: string }> {
  const apiKey = process.env.NANO_BANANA_PRO_API_KEY;
  if (!apiKey) {
    return { error: "NANO_BANANA_PRO_API_KEY is not set." };
  }

  try {
    const res = await fetch(
      `${NANO_BANANA_BASE}/api/task/query?task_id=${encodeURIComponent(taskId)}`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      }
    );

    const text = await res.text();

    if (!res.ok) {
      console.error("[nanobanana] getTaskStatus HTTP error:", res.status, text);
      return { error: `Task query HTTP ${res.status}` };
    }

    let data: TaskQueryResponse;
    try {
      data = JSON.parse(text) as TaskQueryResponse;
    } catch {
      console.error("[nanobanana] getTaskStatus non-JSON response:", text.slice(0, 500));
      return { error: "Task query returned non-JSON response" };
    }

    if (data.code !== 0) {
      console.error("[nanobanana] getTaskStatus API error:", JSON.stringify(data));
      return { error: data.message ?? `Task query error code ${data.code}` };
    }

    const status = data.data?.status ?? "pending";
    const imageUrl = data.data?.result?.[0]?.image;
    return { status, imageUrl };
  } catch (e) {
    console.error("[nanobanana] getTaskStatus fetch error:", e);
    return { error: `Task query network error: ${e instanceof Error ? e.message : String(e)}` };
  }
}
