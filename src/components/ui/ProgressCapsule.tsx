"use client";

import { motion } from "framer-motion";

interface ProgressCapsuleProps {
  label?: string;
  className?: string;
}

export function ProgressCapsule({
  label = "Analyzing your features...",
  className = "",
}: ProgressCapsuleProps) {
  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      <div className="relative w-64 h-2 rounded-full overflow-hidden bg-white/[0.06]">
        <motion.div
          className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-ig"
          animate={{ x: ["-100%", "300%"] }}
          transition={{
            repeat: Infinity,
            duration: 1.8,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.p
        className="text-caption text-white/40"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
      >
        {label}
      </motion.p>
    </div>
  );
}
