import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, is_premium")
    .eq("id", user.id)
    .single();

  const { data: analyses } = await supabase
    .from("analyses")
    .select("id, face_score, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <DashboardClient
      email={user.email ?? ""}
      displayName={profile?.display_name ?? null}
      isPremium={profile?.is_premium ?? false}
      analyses={analyses ?? []}
    />
  );
}
