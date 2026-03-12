"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

interface GlassButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: "gradient" | "glass" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

const sizeClasses = {
  sm: "px-5 py-2 text-sm rounded-xl",
  md: "px-7 py-3 text-base rounded-2xl",
  lg: "px-10 py-4 text-lg rounded-glass",
};

const variantClasses = {
  gradient:
    "bg-gradient-ig text-white font-semibold shadow-ig-glow-sm",
  glass:
    "glass text-white font-medium rounded-2xl",
  ghost:
    "bg-transparent text-white/60 hover:text-white font-medium",
};

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  function GlassButton({ children, variant = "gradient", size = "md", className = "", disabled, ...props }, ref) {
    return (
      <motion.button
        ref={ref}
        className={`${variantClasses[variant]} ${sizeClasses[size]} inline-flex items-center justify-center gap-2 transition-all ${disabled ? "opacity-40 pointer-events-none" : "cursor-pointer"} ${className}`}
        whileHover={disabled ? undefined : { scale: 1.02 }}
        whileTap={disabled ? undefined : { scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        disabled={disabled}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
