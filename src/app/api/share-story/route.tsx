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

  // Pick top 4 shareable traits sorted by value descending
  const topTraits = traits
    ? SHAREABLE_TRAITS
        .filter(({ key }) => traits[key] != null)
        .sort((a, b) => (traits[b.key] ?? 0) - (traits[a.key] ?? 0))
        .slice(0, 4)
    : [];

  // Pick up to 3 attractive feature labels
  const highlights = (attractiveFeatures ?? []).slice(0, 3).map((f) => f.label);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#08080c",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background ambient gradient */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            background:
              "radial-gradient(ellipse 80% 50% at 50% 38%, rgba(88,28,135,0.18) 0%, rgba(192,38,211,0.06) 40%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Soft glow behind photo area */}
        <div
          style={{
            position: "absolute",
            top: "120px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "800px",
            background:
              "radial-gradient(circle, rgba(168,85,247,0.12) 0%, rgba(236,72,153,0.06) 35%, rgba(249,115,22,0.03) 55%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Content container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            height: "100%",
            padding: "64px 80px 60px",
            position: "relative",
          }}
        >
          {/* Brand header */}
          <div
            style={{
              fontSize: "30px",
              fontWeight: 500,
              color: "rgba(255,255,255,0.22)",
              letterSpacing: "10px",
              textTransform: "uppercase" as const,
              display: "flex",
            }}
          >
            FaceScore
          </div>

          {/* Profile photo */}
          <div
            style={{
              marginTop: "40px",
              display: "flex",
              position: "relative",
            }}
          >
            {/* Glass card glow ring */}
            <div
              style={{
                position: "absolute",
                top: "-8px",
                left: "-8px",
                right: "-8px",
                bottom: "-8px",
                borderRadius: "56px",
                background:
                  "linear-gradient(145deg, rgba(168,85,247,0.15), rgba(236,72,153,0.1), rgba(249,115,22,0.08))",
                display: "flex",
              }}
            />
            <div
              style={{
                width: "580px",
                height: "700px",
                borderRadius: "48px",
                overflow: "hidden",
                border: "2px solid rgba(255,255,255,0.08)",
                display: "flex",
                position: "relative",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              {selfieDataUrl ? (
                <img
                  src={selfieDataUrl}
                  width={580}
                  height={700}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.02)",
                    fontSize: "120px",
                  }}
                >
                  👤
                </div>
              )}
            </div>
          </div>

          {/* Main score */}
          <div
            style={{
              marginTop: "44px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "156px",
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
            <div
              style={{
                fontSize: "30px",
                color: "rgba(255,255,255,0.55)",
                fontWeight: 400,
                marginTop: "12px",
                display: "flex",
                textAlign: "center",
              }}
            >
              More attractive than {percentile}% of people worldwide
            </div>
          </div>

          {/* Separator */}
          {topTraits.length > 0 && (
            <div
              style={{
                width: "80px",
                height: "2px",
                background:
                  "linear-gradient(90deg, transparent, rgba(168,85,247,0.3), rgba(236,72,153,0.3), transparent)",
                marginTop: "44px",
                display: "flex",
              }}
            />
          )}

          {/* Perception traits */}
          {topTraits.length > 0 && (
            <div
              style={{
                marginTop: "36px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0px",
              }}
            >
              <div
                style={{
                  fontSize: "22px",
                  color: "rgba(255,255,255,0.3)",
                  fontWeight: 400,
                  letterSpacing: "1px",
                  marginBottom: "20px",
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
                  gap: "12px",
                }}
              >
                {topTraits.map(({ key, label }) => (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "10px 28px",
                      borderRadius: "100px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "24px",
                        color: "rgba(255,255,255,0.7)",
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
                marginTop: "32px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {highlights.map((text) => (
                <div
                  key={text}
                  style={{
                    fontSize: "22px",
                    color: "rgba(255,255,255,0.3)",
                    fontWeight: 400,
                    display: "flex",
                  }}
                >
                  {text}
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
            }}
          >
            <div
              style={{
                fontSize: "32px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.35)",
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
