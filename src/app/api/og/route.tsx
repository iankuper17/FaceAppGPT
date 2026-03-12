import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const score = searchParams.get("score") ?? "5.5";
  const percentile = searchParams.get("percentile") ?? "50";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "32px",
              color: "#a3a3a3",
              letterSpacing: "4px",
              textTransform: "uppercase" as const,
            }}
          >
            FaceScore AI
          </div>
          <div
            style={{
              fontSize: "120px",
              fontWeight: 800,
              background: "linear-gradient(135deg, #ff6b35, #f7c948)",
              backgroundClip: "text",
              color: "transparent",
              lineHeight: 1,
            }}
          >
            {score}
          </div>
          <div
            style={{
              fontSize: "36px",
              color: "#ffffff",
              fontWeight: 600,
            }}
          >
            Top {Math.max(1, 100 - Number(percentile))}% worldwide
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#a3a3a3",
              marginTop: "24px",
            }}
          >
            What&apos;s yours?
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
