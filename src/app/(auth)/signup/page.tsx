"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center">Sign up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-white placeholder:text-neutral-500"
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-white placeholder:text-neutral-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white text-black py-2 font-semibold hover:bg-neutral-200 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>
        {message && (
          <p className={message.type === "error" ? "text-red-400 text-sm" : "text-green-400 text-sm"}>
            {message.text}
          </p>
        )}
        <p className="text-center text-sm text-neutral-500">
          Already have an account? <Link href="/login" className="text-white underline">Sign in</Link>
        </p>
        <p className="text-center">
          <Link href="/" className="text-neutral-400 hover:text-white">Back home</Link>
        </p>
      </div>
    </main>
  );
}
