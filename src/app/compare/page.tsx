"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { validateImageFile } from "@/lib/validators";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "selfies";

interface CompareResult {
  score_a: number;
  score_b: number;
  winner: "a" | "b";
  probability: number;
}

export default function ComparePage() {
  const [previewA, setPreviewA] = useState<string | null>(null);
  const [previewB, setPreviewB] = useState<string | null>(null);
  const [pathA, setPathA] = useState<string | null>(null);
  const [pathB, setPathB] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CompareResult | null>(null);
  const inputARef = useRef<HTMLInputElement>(null);
  const inputBRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File, side: "a" | "b") {
    const validation = validateImageFile(file);
    if (!validation.ok) {
      setError(validation.error);
      return;
    }

    setError("");
    setUploading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("You must be signed in.");
      setUploading(false);
      return;
    }

    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

    setUploading(false);
    if (uploadError) {
      setError(uploadError.message);
      return;
    }

    const preview = URL.createObjectURL(file);
    if (side === "a") {
      setPathA(path);
      setPreviewA(preview);
    } else {
      setPathB(path);
      setPreviewB(preview);
    }
  }

  async function handleCompare() {
    if (!pathA || !pathB) return;
    setError("");
    setComparing(true);
    setResult(null);

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_path_a: pathA, image_path_b: pathB }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Comparison failed");
        return;
      }
      setResult(data);
    } catch {
      setError("Request failed");
    } finally {
      setComparing(false);
    }
  }

  const busy = uploading || comparing;

  return (
    <main className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <header className="flex items-center gap-4 mb-10">
        <Link href="/dashboard" className="text-neutral-400 hover:text-white text-sm">
          {"\u2190"} Dashboard
        </Link>
      </header>

      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          Who is hotter?
        </h1>
        <p className="text-neutral-400">Upload two photos and let the AI decide.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Face A */}
        <div>
          <input
            ref={inputARef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadFile(f, "a");
            }}
          />
          <button
            type="button"
            onClick={() => inputARef.current?.click()}
            disabled={busy}
            className="w-full aspect-[3/4] rounded-2xl border-2 border-dashed border-neutral-700 hover:border-neutral-500 flex items-center justify-center overflow-hidden transition disabled:opacity-50"
          >
            {previewA ? (
              <img src={previewA} alt="Face A" className="w-full h-full object-cover" />
            ) : (
              <span className="text-neutral-500 text-sm px-4 text-center">
                Tap to upload<br />Face A
              </span>
            )}
          </button>
          {result && (
            <div className="text-center mt-3">
              <p className={`text-2xl font-bold ${result.winner === "a" ? "text-gradient" : "text-neutral-400"}`}>
                {result.score_a.toFixed(1)}
              </p>
              {result.winner === "a" && (
                <p className="text-xs text-amber-400 font-semibold mt-1">
                  WINNER {"\u2022"} {result.probability}%
                </p>
              )}
            </div>
          )}
        </div>

        {/* Face B */}
        <div>
          <input
            ref={inputBRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadFile(f, "b");
            }}
          />
          <button
            type="button"
            onClick={() => inputBRef.current?.click()}
            disabled={busy}
            className="w-full aspect-[3/4] rounded-2xl border-2 border-dashed border-neutral-700 hover:border-neutral-500 flex items-center justify-center overflow-hidden transition disabled:opacity-50"
          >
            {previewB ? (
              <img src={previewB} alt="Face B" className="w-full h-full object-cover" />
            ) : (
              <span className="text-neutral-500 text-sm px-4 text-center">
                Tap to upload<br />Face B
              </span>
            )}
          </button>
          {result && (
            <div className="text-center mt-3">
              <p className={`text-2xl font-bold ${result.winner === "b" ? "text-gradient" : "text-neutral-400"}`}>
                {result.score_b.toFixed(1)}
              </p>
              {result.winner === "b" && (
                <p className="text-xs text-amber-400 font-semibold mt-1">
                  WINNER {"\u2022"} {result.probability}%
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* VS indicator */}
      {previewA && previewB && !result && (
        <div className="text-center">
          <button
            type="button"
            onClick={handleCompare}
            disabled={busy}
            className="rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white px-10 py-3 font-bold text-lg hover:opacity-90 disabled:opacity-50 transition"
          >
            {comparing ? "Analyzing both faces..." : "Compare"}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-6 text-red-400 text-sm text-center" role="alert">{error}</p>
      )}

      <p className="mt-10 text-xs text-neutral-500 text-center">
        For fun only. Beauty is subjective.
      </p>
    </main>
  );
}
