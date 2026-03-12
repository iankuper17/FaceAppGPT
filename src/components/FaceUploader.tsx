"use client";

import { useState, useRef } from "react";
import { validateImageFile } from "@/lib/validators";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "selfies";

interface FaceUploaderProps {
  onSuccess: (imagePath: string) => void;
  onError: (message: string) => void;
}

export function FaceUploader({ onSuccess, onError }: FaceUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.ok) {
      onError(validation.error);
      return;
    }

    setUploading(true);
    onError("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      onError("You must be signed in.");
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
      onError(uploadError.message);
      return;
    }

    setAnalyzing(true);
    const imagePath = path;

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_path: imagePath }),
      });
      const data = await res.json();
      if (!res.ok) {
        onError(data.error ?? "Analysis failed");
        return;
      }
      onSuccess(data.id);
    } catch {
      onError("Request failed");
    } finally {
      setAnalyzing(false);
    }
  }

  const busy = uploading || analyzing;

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="rounded-lg border-2 border-dashed border-neutral-600 px-8 py-12 text-neutral-400 hover:border-neutral-500 hover:text-white disabled:opacity-50 transition"
      >
        {busy ? (analyzing ? "Analyzing..." : "Uploading...") : "Choose a selfie (JPEG, PNG or WebP, max 5 MB)"}
      </button>
    </div>
  );
}
