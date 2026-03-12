"use client";

interface ScoreDisplayProps {
  score: number;
  percentile: number | null;
  globalRank: number | null;
}

function formatRank(rank: number): string {
  return "#" + rank.toLocaleString("en-US");
}

function getScoreEmoji(score: number): string {
  if (score >= 8) return "\u{1F525}";
  if (score >= 7) return "\u2728";
  if (score >= 5.5) return "\u{1F44D}";
  return "\u{1F611}";
}

export function ScoreDisplay({ score, percentile, globalRank }: ScoreDisplayProps) {
  const attractivePercent = percentile ?? Math.round(score * 10);

  return (
    <div className="text-center space-y-6 py-4">
      <div className="animate-count-up">
        <span className="text-4xl">{getScoreEmoji(score)}</span>
        <p className="text-7xl sm:text-8xl font-extrabold text-gradient mt-2 tracking-tight">
          {score.toFixed(1)}
        </p>
        <p className="text-lg text-neutral-400 mt-2 font-medium tracking-wide uppercase">
          Face Score
        </p>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
        <p className="text-xl sm:text-2xl text-white font-semibold">
          You are more attractive than{" "}
          <span className="text-gradient">{attractivePercent}%</span> of people.
        </p>
      </div>

      {globalRank != null && (
        <div className="animate-fade-in-up" style={{ animationDelay: "0.4s", opacity: 0 }}>
          <p className="text-sm text-neutral-500 uppercase tracking-widest mb-1">Global Rank</p>
          <p className="text-3xl font-bold text-white">{formatRank(globalRank)}</p>
        </div>
      )}
    </div>
  );
}
