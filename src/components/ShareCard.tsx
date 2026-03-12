"use client";

interface ShareCardProps {
  score: number;
  imageUrl?: string | null;
}

export function ShareCard({ score, imageUrl }: ShareCardProps) {
  const text = `My Face Score: ${score.toFixed(1)}. What's yours?`;
  const shareUrl = typeof window !== "undefined" ? window.location.origin : "";

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "FaceScore AI",
          text,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  }

  function copyToClipboard() {
    const t = `${text}\n${shareUrl}`;
    void navigator.clipboard.writeText(t);
    alert("Copied to clipboard!");
  }

  return (
    <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-6 text-center">
      {imageUrl && (
        <div className="mb-4 flex justify-center">
          <img
            src={imageUrl}
            alt="Your selfie"
            className="h-32 w-32 rounded-full object-cover"
          />
        </div>
      )}
      <p className="text-2xl font-bold text-white">My Face Score: {score.toFixed(1)}</p>
      <p className="text-neutral-400 mt-1">What&apos;s yours?</p>
      <button
        type="button"
        onClick={handleShare}
        className="mt-4 rounded-lg bg-white text-black px-4 py-2 text-sm font-semibold hover:bg-neutral-200"
      >
        Share
      </button>
    </div>
  );
}
