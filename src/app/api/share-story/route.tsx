import { ImageResponse } from "next/og";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { AnalysisReport } from "@/types/analysis";

const TRAIT_CONFIG: { key: keyof NonNullable<AnalysisReport["perceived_traits"]>; label: string; colors: [string, string] }[] = [
  { key: "confidence", label: "Confidence", colors: ["#f59e0b", "#f97316"] },
  { key: "trustworthiness", label: "Trustworthy", colors: ["#34d399", "#14b8a6"] },
  { key: "approachability", label: "Approachable", colors: ["#38bdf8", "#3b82f6"] },
  { key: "intelligence", label: "Intelligence", colors: ["#8b5cf6", "#a855f7"] },
  { key: "dominance", label: "Dominance", colors: ["#fb7185", "#ec4899"] },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const analysisId = searchParams.get("analysis_id");

  if (!analysisId) {
    return NextResponse.json({ error: "Missing analysis_id" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: analysis } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", analysisId)
    .eq("user_id", user.id)
    .single();

  if (!analysis) {
    return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
  }

  let selfieDataUrl: string | null = null;
  const { data: signData } = await supabase.storage
    .from("selfies")
    .createSignedUrl(analysis.image_path, 300);

  if (signData?.signedUrl) {
    try {
      const imgRes = await fetch(signData.signedUrl);
      const imgBuffer = await imgRes.arrayBuffer();
      const base64 = Buffer.from(imgBuffer).toString("base64");
      const contentType = imgRes.headers.get("content-type") || "image/jpeg";
      selfieDataUrl = `data:${contentType};base64,${base64}`;
    } catch {
      // Continue without selfie
    }
  }

  const score = Number(analysis.face_score);
  const percentile = analysis.percentile ?? Math.round(score * 10);
  const topPercent = Math.max(1, 100 - percentile);
  const report = analysis.report as AnalysisReport | null;
  const traits = report?.perceived_traits;
  const predictions = report?.life_predictions;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "linear-gradient(180deg, #08080c 0%, #110e1d 25%, #1a1230 50%, #110e1d 75%, #08080c 100%)",
          fontFamily: "sans-serif",
          padding: "70px 60px",
          position: "relative",
        }}
      >
        {/* Ambient glow behind selfie */}
        <div
          style={{
            position: "absolute",
            top: "180px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.18) 0%, rgba(192,38,211,0.1) 40%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Branding */}
        <div
          style={{
            fontSize: "26px",
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "8px",
            textTransform: "uppercase" as const,
            marginBottom: "50px",
            display: "flex",
          }}
        >
          FaceScore AI
        </div>

        {/* Selfie */}
        {selfieDataUrl ? (
          <div
            style={{
              width: "320px",
              height: "320px",
              borderRadius: "40px",
              overflow: "hidden",
              border: "3px solid rgba(255,255,255,0.1)",
              display: "flex",
              marginBottom: "44px",
            }}
          >
            <img
              src={selfieDataUrl}
              width={320}
              height={320}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </div>
        ) : (
          <div
            style={{
              width: "320px",
              height: "320px",
              borderRadius: "40px",
              background: "rgba(255,255,255,0.05)",
              border: "3px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "44px",
              fontSize: "80px",
            }}
          >
            👤
          </div>
        )}

        {/* Score */}
        <div
          style={{
            fontSize: "130px",
            fontWeight: 800,
            background: "linear-gradient(135deg, #8b5cf6, #c026d3, #ec4899, #f97316)",
            backgroundClip: "text",
            color: "transparent",
            lineHeight: 1,
            display: "flex",
          }}
        >
          {score.toFixed(1)}
        </div>

        {/* Percentile */}
        <div
          style={{
            fontSize: "34px",
            color: "#ffffff",
            fontWeight: 600,
            marginTop: "8px",
            marginBottom: "50px",
            display: "flex",
          }}
        >
          Top {topPercent}% worldwide
        </div>

        {/* Traits */}
        {traits && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: "18px",
              marginBottom: "40px",
            }}
          >
            {TRAIT_CONFIG.map(({ key, label, colors }) => {
              const value = traits[key];
              if (value == null) return null;
              return (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "210px",
                      fontSize: "22px",
                      color: "rgba(255,255,255,0.5)",
                      display: "flex",
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      height: "14px",
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: "7px",
                      display: "flex",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${value}%`,
                        height: "100%",
                        background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`,
                        borderRadius: "7px",
                        display: "flex",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      width: "60px",
                      fontSize: "22px",
                      color: "rgba(255,255,255,0.7)",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    {value}%
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Life predictions */}
        {predictions && (
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            {predictions.estimated_age != null && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "18px 32px",
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: "24px",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  style={{
                    fontSize: "34px",
                    color: "#ffffff",
                    fontWeight: 700,
                    display: "flex",
                  }}
                >
                  {predictions.estimated_age}
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    color: "rgba(255,255,255,0.35)",
                    display: "flex",
                  }}
                >
                  Est. Age
                </div>
              </div>
            )}
            {predictions.vibe && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "18px 32px",
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: "24px",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  style={{
                    fontSize: "26px",
                    color: "#ffffff",
                    fontWeight: 600,
                    display: "flex",
                    textAlign: "center",
                  }}
                >
                  {predictions.vibe}
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    color: "rgba(255,255,255,0.35)",
                    display: "flex",
                  }}
                >
                  Vibe
                </div>
              </div>
            )}
          </div>
        )}

        {/* Spacer pushes CTA to bottom */}
        <div style={{ flex: 1, display: "flex" }} />

        {/* CTA */}
        <div
          style={{
            fontSize: "28px",
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "2px",
            display: "flex",
          }}
        >
          What&apos;s yours?
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1920,
    },
  );
}
