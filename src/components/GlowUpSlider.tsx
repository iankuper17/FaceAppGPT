"use client";

import { ImageComparisonSlider } from "@/components/ui/ImageComparisonSlider";

interface GlowUpSliderProps {
  beforeUrl: string;
  afterUrl: string;
}

export function GlowUpSlider({ beforeUrl, afterUrl }: GlowUpSliderProps) {
  return (
    <ImageComparisonSlider
      beforeUrl={beforeUrl}
      afterUrl={afterUrl}
      className="shadow-glass-lg"
    />
  );
}
