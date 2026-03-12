import { ImageResponse } from "next/og";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { AnalysisReport, PerceivedTraits } from "@/types/analysis";

const SHAREABLE_TRAITS: { key: keyof PerceivedTraits; label: string }[] = [
  { key: "approachability", label: "Approachable" },
  { key: "trustworthiness", label: "Trustworthy" },
  { key: "confidence", label: "Confident" },
  { key: "intelligence", label: "Intelligent" },
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
  const report = analysis.report as AnalysisReport | null;
  const traits = report?.perceived_traits;
  const attractiveFeatures = report?.attractive_features;

  const topTraits = traits
    ? SHAREABLE_TRAITS.filter(({ key }) => traits[key] != null)
        .sort((a, b) => (traits[b.key] ?? 0) - (traits[a.key] ?? 0))
        .slice(0, 4)
    : [];

  const highlights = (attractiveFeatures ?? []).slice(0, 3).map((f) => f.label);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#08080c",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── Photo section ── */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "1060px",
            display: "flex",
            flexShrink: 0,
          }}
        >
          {selfieDataUrl ? (
            <img
              src={selfieDataUrl}
              width={1080}
              height={1060}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "rgba(255,255,255,0.02)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "140px",
              }}
            >
              👤
            </div>
          )}

          {/* Top gradient + branding */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "200px",
              background:
                "linear-gradient(to bottom, rgba(8,8,12,0.65) 0%, transparent 100%)",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              paddingTop: "54px",
            }}
          >
            <div
              style={{
                fontSize: "26px",
                fontWeight: 500,
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "8px",
                textTransform: "uppercase" as const,
                display: "flex",
              }}
            >
              FaceScore
            </div>
          </div>

          {/* Bottom gradient fade */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "420px",
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(8,8,12,0.4) 30%, rgba(8,8,12,0.85) 65%, #08080c 100%)",
              display: "flex",
            }}
          />

          {/* Left vignette */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: "100px",
              background:
                "linear-gradient(to right, rgba(8,8,12,0.35), transparent)",
              display: "flex",
            }}
          />
          {/* Right vignette */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "100px",
              background:
                "linear-gradient(to left, rgba(8,8,12,0.35), transparent)",
              display: "flex",
            }}
          />

          {/* Colored glow behind photo center */}
          <div
            style={{
              position: "absolute",
              top: "200px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "700px",
              height: "700px",
              background:
                "radial-gradient(circle, rgba(168,85,247,0.08) 0%, rgba(236,72,153,0.04) 40%, transparent 70%)",
              display: "flex",
            }}
          />
        </div>

        {/* ── Content section ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flex: 1,
            padding: "0 80px",
            marginTop: "-50px",
            position: "relative",
          }}
        >
          {/* Score */}
          <div
            style={{
              fontSize: "168px",
              fontWeight: 800,
              background:
                "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)",
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
              fontSize: "28px",
              color: "rgba(255,255,255,0.5)",
              fontWeight: 400,
              marginTop: "10px",
              display: "flex",
              textAlign: "center",
            }}
          >
            More attractive than {percentile}% of people worldwide
          </div>

          {/* Separator */}
          {topTraits.length > 0 && (
            <div
              style={{
                width: "60px",
                height: "2px",
                background:
                  "linear-gradient(90deg, transparent, rgba(168,85,247,0.35), rgba(236,72,153,0.25), transparent)",
                marginTop: "38px",
                display: "flex",
              }}
            />
          )}

          {/* Traits */}
          {topTraits.length > 0 && (
            <div
              style={{
                marginTop: "30px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "20px",
                  color: "rgba(255,255,255,0.25)",
                  fontWeight: 400,
                  letterSpacing: "0.5px",
                  marginBottom: "16px",
                  display: "flex",
                }}
              >
                People perceive you as
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {topTraits.map(({ key, label }) => (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      padding: "10px 28px",
                      borderRadius: "100px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "22px",
                        color: "rgba(255,255,255,0.65)",
                        fontWeight: 500,
                        display: "flex",
                      }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key attributes */}
          {highlights.length > 0 && (
            <div
              style={{
                marginTop: "28px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {highlights.map((text, i) => (
                <div
                  key={text}
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  {i > 0 && (
                    <div
                      style={{
                        fontSize: "20px",
                        color: "rgba(255,255,255,0.12)",
                        display: "flex",
                      }}
                    >
                      ·
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: "21px",
                      color: "rgba(255,255,255,0.3)",
                      fontWeight: 400,
                      display: "flex",
                    }}
                  >
                    {text}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Spacer */}
          <div style={{ flex: 1, display: "flex" }} />

          {/* CTA */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              marginBottom: "48px",
            }}
          >
            <div
              style={{
                fontSize: "30px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.3)",
                display: "flex",
              }}
            >
              What&apos;s your score?
            </div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: 500,
                background:
                  "linear-gradient(90deg, #a855f7, #ec4899, #f97316)",
                backgroundClip: "text",
                color: "transparent",
                display: "flex",
              }}
            >
              facescore.ai
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1920,
    },
  );
}
