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

  const data = (await res.json()) as ImageGenResponse;
  if (data.code !== 0 || !data.data?.task_id) {
    return { error: data.message ?? `HTTP ${res.status}` };
  }
  return { task_id: data.data.task_id };
}

export async function getTaskStatus(
  taskId: string
): Promise<{ status: string; imageUrl?: string } | { error: string }> {
  const apiKey = process.env.NANO_BANANA_PRO_API_KEY;
  if (!apiKey) {
    return { error: "NANO_BANANA_PRO_API_KEY is not set." };
  }

  const res = await fetch(
    `${NANO_BANANA_BASE}/api/task/query?task_id=${encodeURIComponent(taskId)}`,
    {
      headers: { Authorization: `Bearer ${apiKey}` },
    }
  );

  const data = (await res.json()) as TaskQueryResponse;
  if (data.code !== 0) {
    return { error: data.message ?? `HTTP ${res.status}` };
  }

  const status = data.data?.status ?? "pending";
  const imageUrl = data.data?.result?.[0]?.image;
  return { status, imageUrl };
}
