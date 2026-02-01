"use server";

import { randomInt } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type {
  TournamentParticipant,
  TournamentTeam,
} from "@/types/database";

export type ParticipantResult = {
  error?: string;
  data?: TournamentParticipant | null;
};

export type TeamsResult = {
  error?: string;
  data?: TournamentTeam[];
};

export type DrawResult = {
  success: boolean;
  team_number: number | null;
  error?: string;
};

// Check if user is already registered for a tournament
export async function getParticipantRegistration(
  tournamentId: string
): Promise<ParticipantResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { data: null };
  }

  const { data, error } = await supabase
    .from("tournament_participants")
    .select("*")
    .eq("tournament_id", tournamentId)
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = not found
    return { error: error.message };
  }

  return { data: data as TournamentParticipant | null };
}

// Register user for tournament (without team assignment)
export async function registerForTournament(
  tournamentId: string
): Promise<ParticipantResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You need to login to register" };
  }

  // Check if tournament exists and is valid
  const { data: tournament } = await supabase
    .from("tournaments")
    .select(
      "max_participants, current_participants, registration_deadline, status"
    )
    .eq("id", tournamentId)
    .single();

  if (!tournament) {
    return { error: "Tournament not found" };
  }

  if (tournament.status === "cancelled") {
    return { error: "Tournament cancelled" };
  }

  if (tournament.status !== "upcoming") {
    return { error: "Tournament registration closed" };
  }

  if (tournament.current_participants >= tournament.max_participants) {
    return { error: "Tournament is full" };
  }

  if (
    tournament.registration_deadline &&
    new Date(tournament.registration_deadline) < new Date()
  ) {
    return { error: "Registration deadline passed" };
  }

  // Insert participant (trigger updates current_participants)
  const { data, error } = await supabase
    .from("tournament_participants")
    .insert({
      tournament_id: tournamentId,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      // Unique violation
      return { error: "You already registered for this tournament" };
    }
    return { error: error.message };
  }

  revalidatePath(`/tournaments/${tournamentId}`);
  revalidatePath(`/draw/${tournamentId}`);
  return { data: data as TournamentParticipant };
}

// Get available teams (not full)
export async function getAvailableTeams(
  tournamentId: string
): Promise<TeamsResult> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tournament_teams")
    .select("*")
    .eq("tournament_id", tournamentId)
    .eq("is_full", false)
    .order("team_number", { ascending: true });

  if (error) {
    return { error: error.message };
  }

  return { data: data as TournamentTeam[] };
}

export async function getTotalTeamsCount(
  tournamentId: string
): Promise<{ error?: string; data?: number }> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("tournament_teams")
    .select("*", { count: "exact", head: true })
    .eq("tournament_id", tournamentId);

  if (error) {
    return { error: error.message };
  }

  return { data: count ?? 0 };
}

// Perform the draw - randomly assign user to a team
export async function performDraw(
  tournamentId: string
): Promise<{ error?: string; data?: DrawResult }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You need to login" };
  }

  // Check if user is registered
  const { data: participant } = await supabase
    .from("tournament_participants")
    .select("id, team_id, team_number")
    .eq("tournament_id", tournamentId)
    .eq("user_id", user.id)
    .single();

  if (!participant) {
    return { error: "You need to register first" };
  }

  // Check if already drawn
  if (participant.team_id) {
    return {
      data: {
        success: true,
        team_number: participant.team_number,
        error: "You've already been assigned to a team",
      },
    };
  }

  // Get available teams
  const { data: availableTeams, error: teamsError } = await supabase
    .from("tournament_teams")
    .select("id, team_number")
    .eq("tournament_id", tournamentId)
    .eq("is_full", false);

  if (teamsError || !availableTeams || availableTeams.length === 0) {
    return { error: "No empty teams available" };
  }

  // Cryptographically secure random selection
  const randomIndex = randomInt(availableTeams.length);
  const selectedTeam = availableTeams[randomIndex];

  // Assign user to team
  const { error: updateError } = await supabase
    .from("tournament_participants")
    .update({
      team_id: selectedTeam.id,
      team_number: selectedTeam.team_number,
    })
    .eq("id", participant.id);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath(`/draw/${tournamentId}`);
  revalidatePath(`/tournaments/${tournamentId}`);

  return {
    data: {
      success: true,
      team_number: selectedTeam.team_number,
    },
  };
}

// Get all participants for a tournament

// Helper function to calculate global stats for users (matchCount and achievementCount)
async function getUsersGlobalStats(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userIds: string[]
): Promise<Map<string, { matchCount: number; achievementCount: number }>> {
  if (userIds.length === 0) return new Map();

  const [participantsResult, achievementsResult, matchesResult] = await Promise.all([
    supabase
      .from("tournament_participants")
      .select("user_id, tournament_id, team_number")
      .in("user_id", userIds),
    supabase.from("user_achievements").select("user_id").in("user_id", userIds),
    supabase
      .from("tournament_matches")
      .select("tournament_id, team1_number, team2_number")
      .eq("status", "completed"),
  ]);

  // Build team number map: userId -> (tournamentId -> teamNumber)
  const teamNumberMap = new Map<string, Map<string, number>>();
  for (const p of participantsResult.data || []) {
    if (p.team_number !== null) {
      if (!teamNumberMap.has(p.user_id)) {
        teamNumberMap.set(p.user_id, new Map());
      }
      teamNumberMap.get(p.user_id)!.set(p.tournament_id, p.team_number);
    }
  }

  // Count achievements per user
  const achievementCountMap = new Map<string, number>();
  for (const a of achievementsResult.data || []) {
    achievementCountMap.set(a.user_id, (achievementCountMap.get(a.user_id) || 0) + 1);
  }

  // Count matches per user
  const matchCountMap = new Map<string, number>();
  for (const m of matchesResult.data || []) {
    for (const userId of userIds) {
      const teamNumber = teamNumberMap.get(userId)?.get(m.tournament_id);
      if (
        teamNumber !== undefined &&
        (m.team1_number === teamNumber || m.team2_number === teamNumber)
      ) {
        matchCountMap.set(userId, (matchCountMap.get(userId) || 0) + 1);
      }
    }
  }

  // Combine into single stats map
  const statsMap = new Map<string, { matchCount: number; achievementCount: number }>();
  for (const userId of userIds) {
    statsMap.set(userId, {
      matchCount: matchCountMap.get(userId) || 0,
      achievementCount: achievementCountMap.get(userId) || 0,
    });
  }

  return statsMap;
}

export async function getTournamentParticipants(
  tournamentId: string
): Promise<{ error?: string; data?: TournamentParticipant[] }> {
  const supabase = await createClient();

  // Fetch participants
  const { data: participants, error } = await supabase
    .from("tournament_participants")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("team_number", { ascending: true, nullsFirst: false });

  if (error) {
    return { error: error.message };
  }

  if (!participants || participants.length === 0) {
    return { data: [] };
  }

  // Fetch profiles for all participants
  const userIds = participants.map((p) => p.user_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, nickname, email, status")
    .in("id", userIds);

  // Fetch global stats (matchCount, achievementCount) for all participants
  const statsMap = await getUsersGlobalStats(supabase, userIds);

  // Merge profiles and stats into participants
  const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
  const participantsWithProfiles = participants.map((p) => ({
    ...p,
    profile: profileMap.get(p.user_id),
    matchCount: statsMap.get(p.user_id)?.matchCount || 0,
    achievementCount: statsMap.get(p.user_id)?.achievementCount || 0,
  }));

  return { data: participantsWithProfiles as TournamentParticipant[] };
}

// Get all teams with members for a tournament
export async function getTournamentTeams(
  tournamentId: string
): Promise<TeamsResult> {
  const supabase = await createClient();

  const { data: teams, error: teamsError } = await supabase
    .from("tournament_teams")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("team_number", { ascending: true });

  if (teamsError) {
    return { error: teamsError.message };
  }

  // Get all participants with team assigned
  const { data: participants, error: participantsError } = await supabase
    .from("tournament_participants")
    .select("*")
    .eq("tournament_id", tournamentId)
    .not("team_id", "is", null);

  if (participantsError) {
    return { error: participantsError.message };
  }

  // Fetch profiles for all participants
  const userIds = participants?.map((p) => p.user_id) || [];
  const { data: profiles } = userIds.length > 0
    ? await supabase.from("profiles")
        .select("id, nickname, email, status")
        .in("id", userIds)
    : { data: [] };

  // Fetch global stats (matchCount, achievementCount) for all participants
  const statsMap = await getUsersGlobalStats(supabase, userIds);

  // Create profile map
  const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

  // Group participants by team with profile info and stats
  const teamsWithMembers = teams.map((team) => ({
    ...team,
    members: (participants || [])
      .filter((p) => p.team_id === team.id)
      .map((p) => ({
        ...p,
        profile: profileMap.get(p.user_id),
        matchCount: statsMap.get(p.user_id)?.matchCount || 0,
        achievementCount: statsMap.get(p.user_id)?.achievementCount || 0,
      })),
  }));

  return { data: teamsWithMembers as TournamentTeam[] };
}
