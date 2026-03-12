"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  variant?: "default" | "heavy" | "subtle";
  hover?: boolean;
  glow?: boolean;
  className?: string;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  function GlassCard({ children, variant = "default", hover = false, glow = false, className = "", ...props }, ref) {
    const variantClasses = {
      default: "glass-card",
      heavy: "glass-heavy rounded-glass",
      subtle: "bg-white/[0.03] border border-white/[0.06] rounded-glass",
    };

    return (
      <motion.div
        ref={ref}
        className={`${variantClasses[variant]} ${hover ? "glass-interactive" : ""} ${glow ? "glow-ring" : ""} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
