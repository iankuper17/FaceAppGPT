"use client";

import { motion, AnimatePresence } from "framer-motion";
import { type ReactNode, useEffect } from "react";

interface ModalSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function ModalSheet({ open, onClose, children, className = "" }: ModalSheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          <motion.div
            className={`relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto glass-heavy rounded-t-glass-lg sm:rounded-glass-lg p-6 sm:p-8 ${className}`}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-6 sm:hidden" />
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
