"use client";

import type { ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  variant?: "ig" | "warm" | "cool";
  as?: "span" | "p" | "h1" | "h2" | "h3";
  className?: string;
}

const variantClasses = {
  ig: "text-gradient-ig",
  warm: "text-gradient-warm",
  cool: "text-gradient-cool",
};

export function GradientText({
  children,
  variant = "ig",
  as: Tag = "span",
  className = "",
}: GradientTextProps) {
  return (
    <Tag className={`${variantClasses[variant]} ${className}`}>{children}</Tag>
  );
}
