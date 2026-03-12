import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LeaderboardClient } from "./LeaderboardClient";

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: entries } = await supabase.from("leaderboard").select("*");

  return (
    <LeaderboardClient
      entries={entries ?? []}
      isLoggedIn={!!user}
    />
  );
}
