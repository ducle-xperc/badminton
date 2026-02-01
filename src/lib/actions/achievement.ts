"use server";

import { createClient } from "@/lib/supabase/server";
import type { UserAchievement } from "@/types/database";

export type AchievementsResult = {
  data?: UserAchievement[];
  error?: string;
};

export type AchievementStats = {
  totalAchievements: number;
  championshipCount: number;
};

export async function getUserAchievements(): Promise<AchievementsResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("user_achievements")
    .select("*")
    .eq("user_id", user.id)
    .order("earned_at", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { data: data as UserAchievement[] };
}

export async function getUserAchievementStats(): Promise<AchievementStats> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { totalAchievements: 0, championshipCount: 0 };
  }

  const { data } = await supabase
    .from("user_achievements")
    .select("position")
    .eq("user_id", user.id);

  const total = data?.length || 0;
  const championships = data?.filter((a) => a.position === 1).length || 0;

  return { totalAchievements: total, championshipCount: championships };
}


export type AchievementTier = {
  id: string;
  tournament_id: string;
  min_position: number;
  max_position: number;
  title: string;
  color: string;
  icon: string | null;
  display_order: number;
};

export type AchievementTiersResult = {
  data?: AchievementTier[];
  error?: string;
};

export async function getTournamentAchievementTiers(
  tournamentId: string
): Promise<AchievementTiersResult> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tournament_achievement_tiers")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("display_order", { ascending: true });

  if (error) {
    return { error: error.message };
  }

  return { data: data as AchievementTier[] };
}
