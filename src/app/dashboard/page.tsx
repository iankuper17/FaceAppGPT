import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("display_name, is_premium").eq("id", user.id).single();

  const { data: analyses } = await supabase
    .from("analyses")
    .select("id, face_score, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <main className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-neutral-400 text-sm">
            {profile?.display_name || user.email}
            {profile?.is_premium && (
              <span className="ml-2 text-amber-400">Premium</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/analyze"
            className="rounded-lg bg-white text-black px-4 py-2 text-sm font-semibold hover:bg-neutral-200"
          >
            New analysis
          </Link>
          <form action="/api/auth/signout" method="POST" className="inline">
            <button
              type="submit"
              className="rounded-lg border border-neutral-600 px-4 py-2 text-sm text-neutral-400 hover:text-white"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <section className="mb-8">
        <h2 className="font-semibold text-white mb-3">Recent analyses</h2>
        {analyses && analyses.length > 0 ? (
          <ul className="space-y-2">
            {analyses.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/result/${a.id}`}
                  className="block rounded-lg border border-neutral-700 bg-neutral-900/50 p-3 hover:border-neutral-600"
                >
                  <span className="font-medium text-white">
                    Score: {Number(a.face_score).toFixed(1)}
                  </span>
                  <span className="text-neutral-500 text-sm ml-2">
                    {new Date(a.created_at).toLocaleDateString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-neutral-500 text-sm">
            No analyses yet.{" "}
            <Link href="/analyze" className="text-white underline">
              Analyze your face
            </Link>
            .
          </p>
        )}
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-white mb-3">Compare with friends</h2>
        <Link
          href="/compare"
          className="block rounded-2xl bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20 p-4 hover:border-rose-500/40 transition"
        >
          <p className="font-semibold text-white">Who is hotter?</p>
          <p className="text-sm text-neutral-400 mt-1">Upload two photos and let the AI decide.</p>
        </Link>
      </section>

      <section>
        <h2 className="font-semibold text-white mb-3">Leaderboard</h2>
        <Link
          href="/leaderboard"
          className="text-neutral-400 hover:text-white text-sm"
        >
          View top scores {"\u2192"}
        </Link>
      </section>
    </main>
  );
}
