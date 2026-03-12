"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { validateImageFile } from "@/lib/validators";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "selfies";

interface FaceUploaderProps {
  onSuccess: (imagePath: string) => void;
  onError: (message: string) => void;
  onAnalyzing?: (analyzing: boolean) => void;
}

export function FaceUploader({ onSuccess, onError, onAnalyzing }: FaceUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function processFile(file: File) {
    const validation = validateImageFile(file);
    if (!validation.ok) {
      onError(validation.error);
      return;
    }

    setPreview(URL.createObjectURL(file));
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

    onAnalyzing?.(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_path: path }),
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
      onAnalyzing?.(false);
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        className="hidden"
      />

      <motion.button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        disabled={uploading}
        className={`relative w-full rounded-glass overflow-hidden transition-all duration-300 ${
          isDragOver ? "border-ig-magenta/60 shadow-ig-glow-sm" : "border-white/[0.08]"
        } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div className="glass-card p-0 border-dashed border-2 border-white/[0.08] hover:border-white/[0.15] rounded-glass">
          <AnimatePresence mode="wait">
            {preview ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative aspect-[4/5] max-h-80"
              >
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-glass"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-glass" />
                <p className="absolute bottom-4 inset-x-0 text-center text-micro text-white/70">
                  {uploading ? "Uploading..." : "Tap to change"}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 px-8 gap-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-ig-subtle flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-ig-magenta">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="M21 15l-3.086-3.086a2 2 0 00-2.828 0L6 21" />
                  </svg>
                </div>
                <div>
                  <p className="text-body font-medium text-white/60">
                    Choose a selfie
                  </p>
                  <p className="text-micro text-white/25 mt-1">
                    JPEG, PNG or WebP, max 5 MB
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>
    </div>
  );
}
