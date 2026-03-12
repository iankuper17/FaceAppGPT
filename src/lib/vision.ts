import type { AnalysisReport } from "@/types/analysis";

const ANALYSIS_SYSTEM = `You are a face analysis assistant. Analyze the face in the image and respond with a single JSON object (no markdown, no code block). Use this exact structure:
{
  "face_score": number between 0 and 10 (one decimal),
  "facial_structure": { "jawline": 0-10, "eye_symmetry": 0-10, "facial_balance": 0-10 },
  "skin_analysis": { "clarity": 0-10, "texture": 0-10, "tone_balance": 0-10 },
  "expression_impact": { "smile_boost": number (e.g. 0.5), "neutral_rating": 0-10 },
  "perceived_traits": { "confidence": "High"|"Medium"|"Low", "approachability": "High"|"Medium"|"Low", "dominance": "High"|"Medium"|"Low" }
}
If no face is clearly visible, return face_score 0 and explain in a short "error" field. Be concise and objective.`;

export async function analyzeFaceWithVision(imageUrl: string): Promise<{ report: AnalysisReport; score: number } | { error: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { error: "Face analysis is not configured (OPENAI_API_KEY missing)." };
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: 800,
      messages: [
        { role: "system", content: ANALYSIS_SYSTEM },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this face and return only the JSON object." },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return { error: `Vision API error: ${response.status} ${err}` };
  }

  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) return { error: "Empty response from vision API." };

  try {
    const parsed = JSON.parse(content) as AnalysisReport & { face_score?: number; error?: string };
    if (parsed.error) return { error: parsed.error };
    const score = typeof parsed.face_score === "number" ? Math.min(10, Math.max(0, parsed.face_score)) : 7;
    const report: AnalysisReport = {
      facial_structure: parsed.facial_structure ?? { jawline: 7, eye_symmetry: 7, facial_balance: 7 },
      skin_analysis: parsed.skin_analysis ?? { clarity: 7, texture: 7, tone_balance: 7 },
      expression_impact: parsed.expression_impact ?? { smile_boost: 0.5, neutral_rating: 7 },
      perceived_traits: parsed.perceived_traits,
    };
    return { report, score };
  } catch {
    return { error: "Could not parse analysis response." };
  }
}
