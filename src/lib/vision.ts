import type { AnalysisReport } from "@/types/analysis";

const ANALYSIS_SYSTEM = `You are a brutally honest face analysis assistant. Analyze the face in the image and respond with a single JSON object (no markdown, no code block).

SCORING CALIBRATION — follow this strictly:
- Most people are average (4.5–6.0). The mean score should be around 5.5.
- A 7 means genuinely attractive by universal standards (top ~15%).
- An 8 means model-tier attractiveness (top ~3%). Very rare.
- A 9+ is nearly unheard of (top ~0.5%). Reserve for exceptional beauty.
- Scores below 5 are common and should not be sugar-coated.
- Do NOT inflate scores to be polite. Be harsh but fair.

Use this exact JSON structure:
{
  "face_score": number between 0 and 10 (one decimal),
  "attractive_features": [
    { "label": "short human-friendly name", "description": "one sentence why this is attractive" }
  ],
  "improvement_areas": [
    { "label": "short human-friendly name", "description": "one sentence on what holds the score back" }
  ],
  "facial_structure": { "jawline": 0-10, "eye_symmetry": 0-10, "facial_balance": 0-10 },
  "skin_analysis": { "clarity": 0-10, "texture": 0-10, "tone_balance": 0-10 },
  "expression_impact": { "smile_boost": number (e.g. 0.5), "neutral_rating": 0-10 },
  "perceived_traits": { "confidence": 0-100, "trustworthiness": 0-100, "dominance": 0-100, "approachability": 0-100, "intelligence": 0-100 },
  "life_predictions": { "estimated_age": number, "personality": "short description", "likely_hobbies": ["hobby1", "hobby2", "hobby3"], "vibe": "one sentence overall vibe" }
}

Rules:
- attractive_features: list 2-4 genuinely positive traits in human-friendly language (e.g. "Strong jawline", "Warm eyes", "Clear skin"). Only list what is truly above average.
- improvement_areas: list 2-3 specific, honest weaknesses (e.g. "Under-eye hollows reduce freshness", "Asymmetric nose bridge"). Be direct but not cruel.
- perceived_traits: percentages representing how strangers would perceive this person at first glance.
- life_predictions: your best guess at age, personality, hobbies, and overall vibe based purely on appearance.
- If no face is clearly visible, return face_score 0 and explain in a short "error" field.`;

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
      max_tokens: 1200,
      messages: [
        { role: "system", content: ANALYSIS_SYSTEM },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this face. Be brutally honest. Return only the JSON object." },
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
    const parsed = JSON.parse(content);
    if (parsed.error) return { error: String(parsed.error) };

    const score: number = typeof parsed.face_score === "number" ? Math.min(10, Math.max(0, parsed.face_score)) : 5.5;

    const traits = parsed.perceived_traits as Record<string, unknown> | undefined;
    const life = parsed.life_predictions as Record<string, unknown> | undefined;

    const report: AnalysisReport = {
      facial_structure: parsed.facial_structure ?? { jawline: 5, eye_symmetry: 5, facial_balance: 5 },
      skin_analysis: parsed.skin_analysis ?? { clarity: 5, texture: 5, tone_balance: 5 },
      expression_impact: parsed.expression_impact ?? { smile_boost: 0.3, neutral_rating: 5 },
      attractive_features: Array.isArray(parsed.attractive_features) ? parsed.attractive_features : [],
      improvement_areas: Array.isArray(parsed.improvement_areas) ? parsed.improvement_areas : [],
      perceived_traits: traits
        ? {
            confidence: Number(traits.confidence) || 50,
            trustworthiness: Number(traits.trustworthiness) || 50,
            dominance: Number(traits.dominance) || 50,
            approachability: Number(traits.approachability) || 50,
            intelligence: Number(traits.intelligence) || 50,
          }
        : undefined,
      life_predictions: life
        ? {
            estimated_age: Number(life.estimated_age) || 25,
            personality: String(life.personality ?? ""),
            likely_hobbies: Array.isArray(life.likely_hobbies)
              ? (life.likely_hobbies as string[]).map(String)
              : [],
            vibe: String(life.vibe ?? ""),
          }
        : undefined,
    };

    return { report, score };
  } catch {
    return { error: "Could not parse analysis response." };
  }
}
