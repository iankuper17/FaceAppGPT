"use client";

import { useState } from "react";
import Link from "next/link";
import { FaceUploader } from "@/components/FaceUploader";

export default function AnalyzePage() {
  const [error, setError] = useState("");
  const [resultId, setResultId] = useState<string | null>(null);

  if (resultId) {
    window.location.href = `/result/${resultId}`;
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-400">Redirecting to your result...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold mb-2">Analyze my face</h1>
      <p className="text-neutral-400 text-sm mb-6">
        Use a clear selfie, good lighting, no heavy sunglasses.
      </p>
      <FaceUploader
        onSuccess={(id) => setResultId(id)}
        onError={(msg) => setError(msg)}
      />
      {error && (
        <p className="mt-4 text-red-400 text-sm" role="alert">
          {error}
        </p>
      )}
      <p className="mt-6 text-xs text-neutral-500">
        Beauty is subjective. This result is for fun and guidance only.
      </p>
      <Link href="/dashboard" className="mt-4 text-neutral-400 hover:text-white text-sm">
        Back to dashboard
      </Link>
    </main>
  );
}
