import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: entries } = await supabase.from("leaderboard").select("*");

  return (
    <main className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="text-neutral-400 hover:text-white text-sm">
          ← Dashboard
        </Link>
      </header>
      <h1 className="text-2xl font-bold mb-2">Top Meme Brains</h1>
      <p className="text-neutral-400 text-sm mb-6">
        Users who opted in to the leaderboard, by average face score.
      </p>
      {entries && entries.length > 0 ? (
        <ol className="space-y-2">
          {entries.map((entry, i) => (
            <li
              key={entry.id}
              className="flex items-center gap-4 rounded-lg border border-neutral-700 bg-neutral-900/50 p-3"
            >
              <span className="text-neutral-500 w-6">#{i + 1}</span>
              {entry.avatar_url ? (
                <img
                  src={entry.avatar_url}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-neutral-700" />
              )}
              <span className="text-white flex-1">
                {entry.display_name || "Anonymous"}
              </span>
              <span className="font-semibold text-white">
                {Number(entry.avg_score).toFixed(1)}
              </span>
              <span className="text-neutral-500 text-sm">
                {entry.analyses_count} analyses
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-neutral-500 text-sm">No one on the leaderboard yet.</p>
      )}
      {user && (
        <p className="mt-6 text-sm text-neutral-500">
          Opt in from your profile to appear here.
        </p>
      )}
    </main>
  );
}
