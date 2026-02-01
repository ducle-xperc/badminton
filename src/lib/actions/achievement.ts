"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { UserAchievement, UserAchievementInsert } from "@/types/database";

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

// ===== Tournament Achievement Management =====

export type AchievementStatusResult = {
  hasAchievements: boolean;
  achievementCount: number;
  error?: string;
};

export async function getTournamentAchievementStatus(
  tournamentId: string
): Promise<AchievementStatusResult> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("user_achievements")
    .select("*", { count: "exact", head: true })
    .eq("tournament_id", tournamentId);

  if (error) {
    return { hasAchievements: false, achievementCount: 0, error: error.message };
  }

  return {
    hasAchievements: (count ?? 0) > 0,
    achievementCount: count ?? 0,
  };
}

export type AwardResult = {
  success?: string;
  error?: string;
  awardedCount?: number;
};

export async function awardTournamentAchievements(
  tournamentId: string
): Promise<AwardResult> {
  const supabase = await createClient();

  // 1. Verify user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in" };
  }

  // 2. Check if user is the organizer
  const { data: tournament } = await supabase
    .from("tournaments")
    .select("organizer_id, status, name")
    .eq("id", tournamentId)
    .single();

  if (!tournament) {
    return { error: "Tournament not found" };
  }

  if (tournament.organizer_id !== user.id) {
    return { error: "Only the tournament organizer can award achievements" };
  }

  if (tournament.status !== "completed") {
    return { error: "Tournament must be completed first" };
  }

  // 3. Check if achievements already exist
  const { count: existingCount } = await supabase
    .from("user_achievements")
    .select("*", { count: "exact", head: true })
    .eq("tournament_id", tournamentId);

  if ((existingCount ?? 0) > 0) {
    return { error: "Achievements already awarded. Revoke first to re-award." };
  }

  // 4. Get rankings
  const { data: rankings } = await supabase
    .from("tournament_rankings")
    .select("*")
    .eq("tournament_id", tournamentId);

  if (!rankings || rankings.length === 0) {
    return { error: "No rankings found for this tournament" };
  }

  // 5. Get achievement tiers
  const { data: tiers } = await supabase
    .from("tournament_achievement_tiers")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("min_position", { ascending: true });

  if (!tiers || tiers.length === 0) {
    return { error: "No achievement tiers configured for this tournament" };
  }

  // 6. Get participants with their user_ids
  const { data: participants } = await supabase
    .from("tournament_participants")
    .select("user_id, team_number")
    .eq("tournament_id", tournamentId);

  if (!participants) {
    return { error: "No participants found" };
  }

  // 7. Create team_number -> user_ids mapping
  const teamToUsers = new Map<number, string[]>();
  participants.forEach((p) => {
    if (p.team_number !== null) {
      const users = teamToUsers.get(p.team_number) || [];
      users.push(p.user_id);
      teamToUsers.set(p.team_number, users);
    }
  });

  // 8. Create achievements for each ranking (ALL matching tiers)
  const achievements: UserAchievementInsert[] = [];

  for (const ranking of rankings) {
    const position = ranking.position;
    const matchingTiers = tiers.filter(
      (t) => position >= t.min_position && position <= t.max_position
    );

    if (matchingTiers.length === 0) continue;

    const userIds = teamToUsers.get(ranking.team_number) || [];

    for (const tier of matchingTiers) {
      for (const userId of userIds) {
        achievements.push({
          user_id: userId,
          tournament_id: tournamentId,
          tier_id: tier.id,
          title: tier.title,
          color: tier.color,
          icon: tier.icon,
          position: position,
          tournament_name: tournament.name,
          earned_at: new Date().toISOString(),
        });
      }
    }
  }

  if (achievements.length === 0) {
    return { error: "No achievements to award (check tier configuration)" };
  }

  // 9. Insert achievements (upsert to handle duplicates per tier)
  const { error: insertError } = await supabase
    .from("user_achievements")
    .upsert(achievements, { onConflict: "user_id,tournament_id,tier_id" });

  if (insertError) {
    return { error: insertError.message };
  }

  revalidatePath(`/tournaments/${tournamentId}`);
  revalidatePath("/dashboard");

  return {
    success: `Successfully awarded ${achievements.length} achievements`,
    awardedCount: achievements.length,
  };
}

export type RevokeResult = {
  success?: string;
  error?: string;
  revokedCount?: number;
};

export async function revokeAllTournamentAchievements(
  tournamentId: string
): Promise<RevokeResult> {
  const supabase = await createClient();

  // 1. Verify user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in" };
  }

  // 2. Check if user is the organizer
  const { data: tournament } = await supabase
    .from("tournaments")
    .select("organizer_id")
    .eq("id", tournamentId)
    .single();

  if (!tournament) {
    return { error: "Tournament not found" };
  }

  if (tournament.organizer_id !== user.id) {
    return { error: "Only the tournament organizer can revoke achievements" };
  }

  // 3. Count before delete
  const { count } = await supabase
    .from("user_achievements")
    .select("*", { count: "exact", head: true })
    .eq("tournament_id", tournamentId);

  if ((count ?? 0) === 0) {
    return { error: "No achievements to revoke" };
  }

  // 4. Delete all achievements for this tournament
  const { error: deleteError } = await supabase
    .from("user_achievements")
    .delete()
    .eq("tournament_id", tournamentId);

  if (deleteError) {
    return { error: deleteError.message };
  }

  revalidatePath(`/tournaments/${tournamentId}`);
  revalidatePath("/dashboard");

  return {
    success: `Successfully revoked ${count} achievements`,
    revokedCount: count ?? 0,
  };
}
