"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  function GlassInput({ label, className = "", ...props }, ref) {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-caption text-white/50 pl-1">{label}</label>
        )}
        <input
          ref={ref}
          className={`w-full rounded-2xl bg-white/[0.05] border border-white/[0.08] px-5 py-3.5 text-white placeholder:text-white/25 outline-none transition-all duration-300 focus:border-ig-magenta/40 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(192,38,211,0.1)] backdrop-blur-glass ${className}`}
          {...props}
        />
      </div>
    );
  }
);
