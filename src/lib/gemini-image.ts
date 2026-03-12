const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta";
const MODEL = "gemini-2.0-flash-exp";

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
      `${GEMINI_BASE}/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                { inline_data: { mime_type: mimeType, data: imageBase64 } },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ["IMAGE", "TEXT"],
            maxOutputTokens: 8192,
          },
        }),
      },
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("[gemini-image] HTTP error:", res.status, errText.slice(0, 300));
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
      (p: Record<string, unknown>) => p.inline_data,
    );
    if (!imagePart?.inline_data?.data) {
      console.error("[gemini-image] No image in response parts:", parts.map((p: Record<string, unknown>) => Object.keys(p)));
      return { error: "Gemini did not return an image. Try again." };
    }

    return {
      imageBase64: imagePart.inline_data.data as string,
      mimeType: (imagePart.inline_data.mime_type as string) || "image/png",
    };
  } catch (e) {
    console.error("[gemini-image] fetch error:", e);
    return { error: `Network error: ${e instanceof Error ? e.message : String(e)}` };
  }
}
