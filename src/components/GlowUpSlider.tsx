"use client";

import { useState } from "react";

interface GlowUpSliderProps {
  beforeUrl: string;
  afterUrl: string;
}

export function GlowUpSlider({ beforeUrl, afterUrl }: GlowUpSliderProps) {
  const [position, setPosition] = useState(50);

  return (
    <div className="relative w-full aspect-[3/4] max-h-96 rounded-lg overflow-hidden bg-neutral-800">
      <img
        src={afterUrl}
        alt="Glow up"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0 w-full h-full"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          src={beforeUrl}
          alt="Original"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className="absolute bottom-4 left-4 right-4 h-2 rounded-full appearance-none bg-neutral-600 accent-white"
      />
      <div className="absolute top-2 left-2 text-xs text-white/80">Before</div>
      <div className="absolute top-2 right-2 text-xs text-white/80">After</div>
    </div>
  );
}
