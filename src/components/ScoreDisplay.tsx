"use client";

interface ScoreDisplayProps {
  score: number;
  percentile: number | null;
}

export function ScoreDisplay({ score, percentile }: ScoreDisplayProps) {
  return (
    <div className="text-center">
      <p className="text-5xl font-bold text-white">{score.toFixed(1)}</p>
      <p className="text-lg text-neutral-400 mt-1">Face Score</p>
      {percentile != null && (
        <p className="text-sm text-neutral-500 mt-2">Top {100 - percentile}% of users</p>
      )}
    </div>
  );
}
