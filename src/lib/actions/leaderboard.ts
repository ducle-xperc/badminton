"use server";

import { createClient } from "@/lib/supabase/server";

export interface LeaderboardEntry {
  id: string;
  nickname: string;
  gender: string | null;
  avatar_url: string | null;
  tournamentsParticipated: number;
  matchesPlayed: number;
  goldCount: number;
  silverCount: number;
  bronzeCount: number;
  totalAchievements: number;
}

export type SortOption = "achievements" | "tournaments" | "matches" | "gold";

export type LeaderboardResult = {
  data?: LeaderboardEntry[];
  error?: string;
};

export async function getLeaderboard(
  sortBy: SortOption = "achievements"
): Promise<LeaderboardResult> {
  const supabase = await createClient();

  // Fetch all data in parallel to avoid N+1 queries
  const [profilesResult, participantsResult, achievementsResult, matchesResult] =
    await Promise.all([
      supabase.from("profiles").select("id, nickname, gender, avatar_url"),
      supabase
        .from("tournament_participants")
        .select("user_id, tournament_id, team_number"),
      supabase.from("user_achievements").select("user_id, position"),
      supabase
        .from("tournament_matches")
        .select("tournament_id, team1_number, team2_number, status")
        .eq("status", "completed"),
    ]);

  if (profilesResult.error) {
    return { error: profilesResult.error.message };
  }

  const profiles = profilesResult.data || [];
  const participants = participantsResult.data || [];
  const achievements = achievementsResult.data || [];
  const matches = matchesResult.data || [];

  // Build aggregation maps
  const tournamentCountMap = new Map<string, Set<string>>();
  const teamNumberMap = new Map<string, Map<string, number>>(); // userId -> (tournamentId -> teamNumber)

  for (const p of participants) {
    // Count unique tournaments per user
    if (!tournamentCountMap.has(p.user_id)) {
      tournamentCountMap.set(p.user_id, new Set());
    }
    tournamentCountMap.get(p.user_id)!.add(p.tournament_id);

    // Track team numbers for match counting
    if (p.team_number !== null) {
      if (!teamNumberMap.has(p.user_id)) {
        teamNumberMap.set(p.user_id, new Map());
      }
      teamNumberMap.get(p.user_id)!.set(p.tournament_id, p.team_number);
    }
  }

  // Count achievements by position
  const achievementCountMap = new Map<
    string,
    { gold: number; silver: number; bronze: number; total: number }
  >();
  for (const a of achievements) {
    if (!achievementCountMap.has(a.user_id)) {
      achievementCountMap.set(a.user_id, { gold: 0, silver: 0, bronze: 0, total: 0 });
    }
    const counts = achievementCountMap.get(a.user_id)!;
    counts.total++;
    if (a.position === 1) counts.gold++;
    else if (a.position === 2) counts.silver++;
    else if (a.position === 3) counts.bronze++;
  }

  // Count matches per user
  const matchCountMap = new Map<string, number>();
  for (const m of matches) {
    // Find all users who played in this match
    for (const [userId, tournaments] of teamNumberMap) {
      const teamNumber = tournaments.get(m.tournament_id);
      if (
        teamNumber !== undefined &&
        (m.team1_number === teamNumber || m.team2_number === teamNumber)
      ) {
        matchCountMap.set(userId, (matchCountMap.get(userId) || 0) + 1);
      }
    }
  }

  // Build leaderboard entries
  const entries: LeaderboardEntry[] = profiles
    .map((profile) => {
      const achievementCounts = achievementCountMap.get(profile.id) || {
        gold: 0,
        silver: 0,
        bronze: 0,
        total: 0,
      };

      return {
        id: profile.id,
        nickname: profile.nickname || "Unknown Player",
        gender: profile.gender,
        avatar_url: profile.avatar_url,
        tournamentsParticipated: tournamentCountMap.get(profile.id)?.size || 0,
        matchesPlayed: matchCountMap.get(profile.id) || 0,
        goldCount: achievementCounts.gold,
        silverCount: achievementCounts.silver,
        bronzeCount: achievementCounts.bronze,
        totalAchievements: achievementCounts.total,
      };
    })
    .filter(
      (entry) =>
        entry.tournamentsParticipated > 0 || entry.totalAchievements > 0
    );

  // Sort based on sortBy parameter
  entries.sort((a, b) => {
    switch (sortBy) {
      case "gold":
        return (
          b.goldCount - a.goldCount ||
          b.silverCount - a.silverCount ||
          b.bronzeCount - a.bronzeCount ||
          b.tournamentsParticipated - a.tournamentsParticipated
        );
      case "tournaments":
        return (
          b.tournamentsParticipated - a.tournamentsParticipated ||
          b.goldCount - a.goldCount ||
          b.silverCount - a.silverCount
        );
      case "matches":
        return (
          b.matchesPlayed - a.matchesPlayed ||
          b.tournamentsParticipated - a.tournamentsParticipated ||
          b.goldCount - a.goldCount
        );
      case "achievements":
      default:
        return (
          b.goldCount - a.goldCount ||
          b.silverCount - a.silverCount ||
          b.bronzeCount - a.bronzeCount ||
          b.tournamentsParticipated - a.tournamentsParticipated
        );
    }
  });

  return { data: entries };
}
