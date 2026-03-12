"use client";

interface AmbientBackgroundProps {
  intensity?: "low" | "medium" | "high";
  className?: string;
}

export function AmbientBackground({
  intensity = "medium",
  className = "",
}: AmbientBackgroundProps) {
  const opacityMap = { low: "opacity-20", medium: "opacity-30", high: "opacity-40" };

  return (
    <div
      className={`fixed inset-0 overflow-hidden pointer-events-none -z-10 ${className}`}
      aria-hidden
    >
      <div
        className={`absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] animate-ambient-float ${opacityMap[intensity]}`}
        style={{ background: "radial-gradient(circle, #7c3aed 0%, #9333ea 40%, transparent 70%)" }}
      />
      <div
        className={`absolute top-[10%] right-[-15%] w-[50vw] h-[50vw] rounded-full blur-[100px] animate-ambient-float-delay ${opacityMap[intensity]}`}
        style={{ background: "radial-gradient(circle, #c026d3 0%, #ec4899 40%, transparent 70%)" }}
      />
      <div
        className={`absolute bottom-[-10%] left-[20%] w-[45vw] h-[45vw] rounded-full blur-[100px] animate-ambient-float-slow ${opacityMap[intensity]}`}
        style={{ background: "radial-gradient(circle, #f97316 0%, #f43f5e 40%, transparent 70%)" }}
      />
    </div>
  );
}
