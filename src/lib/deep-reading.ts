import type { DeepReading } from "@/types/analysis";

const DEEP_READING_SYSTEM = `You are an intuitive face-reading AI. You interpret subtle signals in a person's portrait — expression softness, gaze direction, facial tension, posture, calmness, and overall energy — to produce a rich personality reading.

This is NOT a scientific claim. It is a creative, insightful interpretation meant to feel like a surprisingly accurate personality profile.

CRITICAL RULES:
- Do NOT mention facial structure scores, skin metrics, symmetry, jawline, or any quantitative facial measurements.
- Do NOT repeat standard attractiveness analysis. This is about personality, energy, and presence.
- The tone must be: intelligent, respectful, curious, insightful, slightly playful, thoughtful, and engaging.
- Be specific to what you observe in the image. Avoid generic filler.
- The "internet_vibe" section should be genuinely funny and relatable.
- The "cosmic_message" should feel poetic and slightly mystical.

Respond with a single JSON object (no markdown, no code block) using this exact structure:

{
  "personality_signals": [
    "3-5 short observations about personality signals the face gives off, e.g. 'seems observant rather than impulsive', 'gives relaxed but attentive energy'"
  ],
  "social_role": {
    "role": "a short label like 'the quiet observer' or 'the warm connector'",
    "explanation": "2-3 sentences explaining what social role this person naturally plays in groups"
  },
  "conversation_style": [
    "3-5 short insights about how this person probably communicates, e.g. 'likely listens more than speaks', 'probably asks thoughtful questions'"
  ],
  "mental_energy": {
    "profile": "a short label like 'analytical thinker' or 'reflective mindset'",
    "description": "2-3 sentences describing their mental energy and cognitive style"
  },
  "hidden_strengths": [
    { "strength": "short label like 'emotional awareness'", "explanation": "one sentence why this is a strength" },
    { "strength": "another strength", "explanation": "one sentence explanation" }
  ],
  "internet_vibe": [
    "5 short funny observations about their internet/daily life vibe, e.g. 'looks like someone with oddly specific knowledge', 'probably has a playlist for every mood'"
  ],
  "life_trajectory": "A short reflective paragraph (3-4 sentences) about signals in their life direction — growth patterns, independence, long-term thinking",
  "cosmic_message": "1-2 poetic, reflective sentences that feel like a message they might need right now",
  "life_hints": [
    "4-6 short life suggestions inspired by the reading, e.g. 'trust your intuition more often', 'protect your focus'"
  ],
  "curious_observations": [
    "5 short intriguing observations, e.g. 'looks like someone who enjoys understanding how things work', 'probably notices patterns others miss'"
  ]
}

Rules for each section:
- personality_signals: 3-5 items. Read like thoughtful observations about expression softness, gaze, and calmness.
- social_role: One role with a short explanation. Think about what type of social presence they project.
- conversation_style: 3-5 items. Guess their communication patterns.
- mental_energy: One profile label with a brief description of their cognitive style.
- hidden_strengths: 3-5 items with short explanations. Focus on non-obvious strengths.
- internet_vibe: Exactly 5 items. Humorous but clever. Should feel like a meme-literate friend wrote them.
- life_trajectory: One paragraph, reflective tone. About direction, not appearance.
- cosmic_message: 1-2 sentences max. Poetic and slightly mystical.
- life_hints: 4-6 items. Concise, actionable, inspired by the overall reading.
- curious_observations: Exactly 5 items. Intriguing and specific to the person.`;

export async function generateDeepReading(
  imageUrl: string
): Promise<{ deepReading: DeepReading } | { error: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { error: "Deep reading is not configured (OPENAI_API_KEY missing)." };
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: 3000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: DEEP_READING_SYSTEM },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Read this person's face. Interpret their energy, presence, and personality signals. Return only the JSON object.",
            },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("[deep-reading] OpenAI API error:", response.status, err.slice(0, 300));
    return { error: `Deep reading API error: ${response.status}` };
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string }; finish_reason?: string }>;
  };
  const rawContent = data.choices?.[0]?.message?.content?.trim();

  if (!rawContent) {
    console.error("[deep-reading] Empty response");
    return { error: "Empty response from deep reading API." };
  }

  let jsonStr = rawContent;
  const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    jsonStr = fenceMatch[1].trim();
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    console.error("[deep-reading] JSON parse failed:", rawContent.slice(0, 500));
    return { error: "Could not parse deep reading response." };
  }

  const deepReading: DeepReading = {
    personality_signals: Array.isArray(parsed.personality_signals)
      ? (parsed.personality_signals as string[]).map(String)
      : [],
    social_role: parsed.social_role &&
      typeof (parsed.social_role as Record<string, unknown>).role === "string"
      ? {
          role: String((parsed.social_role as Record<string, unknown>).role),
          explanation: String((parsed.social_role as Record<string, unknown>).explanation ?? ""),
        }
      : { role: "the quiet observer", explanation: "" },
    conversation_style: Array.isArray(parsed.conversation_style)
      ? (parsed.conversation_style as string[]).map(String)
      : [],
    mental_energy: parsed.mental_energy &&
      typeof (parsed.mental_energy as Record<string, unknown>).profile === "string"
      ? {
          profile: String((parsed.mental_energy as Record<string, unknown>).profile),
          description: String((parsed.mental_energy as Record<string, unknown>).description ?? ""),
        }
      : { profile: "reflective mindset", description: "" },
    hidden_strengths: Array.isArray(parsed.hidden_strengths)
      ? (parsed.hidden_strengths as Array<Record<string, unknown>>).map((s) => ({
          strength: String(s.strength ?? ""),
          explanation: String(s.explanation ?? ""),
        }))
      : [],
    internet_vibe: Array.isArray(parsed.internet_vibe)
      ? (parsed.internet_vibe as string[]).map(String)
      : [],
    life_trajectory: typeof parsed.life_trajectory === "string" ? parsed.life_trajectory : "",
    cosmic_message: typeof parsed.cosmic_message === "string" ? parsed.cosmic_message : "",
    life_hints: Array.isArray(parsed.life_hints)
      ? (parsed.life_hints as string[]).map(String)
      : [],
    curious_observations: Array.isArray(parsed.curious_observations)
      ? (parsed.curious_observations as string[]).map(String)
      : [],
  };

  return { deepReading };
}
