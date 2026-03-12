const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta";
const MODEL = "gemini-2.5-flash-image";

export async function generateGlowUpImage(
  imageBase64: string,
  mimeType: string,
  prompt: string,
): Promise<{ imageBase64: string; mimeType: string } | { error: string }> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    return { error: "GOOGLE_AI_API_KEY is not set." };
  }

  try {
    const res = await fetch(
      `${GEMINI_BASE}/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                { inlineData: { mimeType, data: imageBase64 } },
              ],
            },
          ],
        }),
      },
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("[gemini-image] HTTP error:", res.status, errText.slice(0, 500));
      if (res.status === 400 && errText.includes("API_KEY")) {
        return { error: "Google AI API key is invalid. Check GOOGLE_AI_API_KEY." };
      }
      return { error: `Gemini API error: ${res.status}` };
    }

    const data = await res.json();
    const parts = data?.candidates?.[0]?.content?.parts;
    if (!Array.isArray(parts)) {
      console.error("[gemini-image] Unexpected response shape:", JSON.stringify(data).slice(0, 500));
      return { error: "Unexpected response from Gemini API." };
    }

    const imagePart = parts.find(
      (p: Record<string, unknown>) => p.inlineData || p.inline_data,
    );
    const inlineData = (imagePart?.inlineData ?? imagePart?.inline_data) as Record<string, unknown> | undefined;
    if (!inlineData?.data) {
      console.error("[gemini-image] No image in response parts:", JSON.stringify(parts.map((p: Record<string, unknown>) => Object.keys(p))));
      return { error: "Gemini did not return an image. Try again." };
    }

    return {
      imageBase64: inlineData.data as string,
      mimeType: (inlineData.mimeType as string) || (inlineData.mime_type as string) || "image/png",
    };
  } catch (e) {
    console.error("[gemini-image] fetch error:", e);
    return { error: `Network error: ${e instanceof Error ? e.message : String(e)}` };
  }
}
