"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassInput } from "@/components/ui/GlassInput";
import { GlassButton } from "@/components/ui/GlassButton";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }
    setMessage({ type: "ok", text: "Check your email to confirm your account, then sign in." });
  }

  return (
    <main className="relative min-h-[100dvh] flex items-center justify-center px-5">
      <AmbientBackground intensity="low" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm relative z-10"
      >
        <GlassCard className="p-8">
          <h1 className="text-display-sm text-white text-center mb-8">Create account</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <GlassInput
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <GlassInput
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />

            <div className="pt-2">
              <GlassButton
                type="submit"
                variant="gradient"
                size="md"
                disabled={loading}
                className="w-full"
              >
                {loading ? "Creating account..." : "Sign up"}
              </GlassButton>
            </div>
          </form>

          {message && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 text-caption text-center ${
                message.type === "error" ? "text-red-400" : "text-emerald-400"
              }`}
            >
              {message.text}
            </motion.p>
          )}

          <p className="text-center text-caption text-white/30 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-white/60 hover:text-white transition">
              Sign in
            </Link>
          </p>
        </GlassCard>

        <p className="text-center mt-6">
          <Link href="/" className="text-micro text-white/25 hover:text-white/50 transition">
            Back home
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
