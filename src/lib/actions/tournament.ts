"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Tournament, TournamentStatus, TournamentAchievementTierInsert } from "@/types/database";
import type { TournamentInput, AchievementTierInput } from "@/lib/validations/tournament";

export type TournamentResult = {
  error?: string;
  success?: string;
  data?: Tournament;
};

export type TournamentsResult = {
  error?: string;
  data?: Tournament[];
};

export async function getTournaments(status?: TournamentStatus): Promise<TournamentsResult> {
  const supabase = await createClient();

  let query = supabase
    .from("tournaments")
    .select("*")
    .order("start_date", { ascending: true });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return { error: error.message };
  }

  return { data: data as Tournament[] };
}

export async function getTournament(id: string): Promise<TournamentResult> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tournaments")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data: data as Tournament };
}

export async function createTournament(
  input: TournamentInput,
  achievementTiers?: AchievementTierInput[]
): Promise<TournamentResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to create a tournament" };
  }

  const { data, error } = await supabase
    .from("tournaments")
    .insert({
      ...input,
      organizer_id: user.id,
      banner_url: input.banner_url || null,
      description: input.description || null,
      registration_deadline: input.registration_deadline || null,
      prize_pool: input.prize_pool || null,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Insert achievement tiers if provided
  if (achievementTiers && achievementTiers.length > 0) {
    const tiersToInsert: TournamentAchievementTierInsert[] = achievementTiers.map(
      (tier, index) => ({
        tournament_id: data.id,
        min_position: tier.min_position,
        max_position: tier.max_position,
        title: tier.title,
        color: tier.color,
        icon: tier.icon || null,
        display_order: tier.display_order ?? index,
      })
    );

    const { error: tiersError } = await supabase
      .from("tournament_achievement_tiers")
      .insert(tiersToInsert);

    if (tiersError) {
      console.error("Error inserting achievement tiers:", tiersError);
    }
  }

  revalidatePath("/tournaments");
  redirect(`/tournaments/${data.id}`);
}

export async function updateTournament(
  id: string,
  input: Partial<TournamentInput>,
  achievementTiers?: AchievementTierInput[]
): Promise<TournamentResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to update a tournament" };
  }

  // Check if user is the organizer
  const { data: existing } = await supabase
    .from("tournaments")
    .select("organizer_id")
    .eq("id", id)
    .single();

  if (existing?.organizer_id !== user.id) {
    return { error: "You can only update tournaments you created" };
  }

  const { error } = await supabase
    .from("tournaments")
    .update({
      ...input,
      banner_url: input.banner_url || null,
      description: input.description || null,
      registration_deadline: input.registration_deadline || null,
      prize_pool: input.prize_pool || null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Update achievement tiers if provided
  if (achievementTiers !== undefined) {
    // Delete existing tiers
    await supabase
      .from("tournament_achievement_tiers")
      .delete()
      .eq("tournament_id", id);

    // Insert new tiers if any
    if (achievementTiers.length > 0) {
      const tiersToInsert: TournamentAchievementTierInsert[] = achievementTiers.map(
        (tier, index) => ({
          tournament_id: id,
          min_position: tier.min_position,
          max_position: tier.max_position,
          title: tier.title,
          color: tier.color,
          icon: tier.icon || null,
          display_order: tier.display_order ?? index,
        })
      );

      const { error: tiersError } = await supabase
        .from("tournament_achievement_tiers")
        .insert(tiersToInsert);

      if (tiersError) {
        console.error("Error updating achievement tiers:", tiersError);
      }
    }
  }

  revalidatePath("/tournaments");
  revalidatePath(`/tournaments/${id}`);
  redirect(`/tournaments/${id}`);
}

export async function deleteTournament(id: string): Promise<TournamentResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to delete a tournament" };
  }

  // Check if user is the organizer
  const { data: existing } = await supabase
    .from("tournaments")
    .select("organizer_id")
    .eq("id", id)
    .single();

  if (existing?.organizer_id !== user.id) {
    return { error: "You can only delete tournaments you created" };
  }

  const { error } = await supabase.from("tournaments").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/tournaments");
  redirect("/tournaments");
}


export async function resetTournamentTeams(id: string): Promise<TournamentResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to reset tournament teams" };
  }

  // Check if user is the organizer
  const { data: tournament } = await supabase
    .from("tournaments")
    .select("organizer_id, max_participants, team_size")
    .eq("id", id)
    .single();

  if (tournament?.organizer_id !== user.id) {
    return { error: "You can only reset tournaments you created" };
  }

  // Delete all participants first (this will trigger update_team_full_status)
  const { error: participantsError } = await supabase
    .from("tournament_participants")
    .delete()
    .eq("tournament_id", id);

  if (participantsError) {
    return { error: participantsError.message };
  }

  // Delete all existing teams
  const { error: teamsDeleteError } = await supabase
    .from("tournament_teams")
    .delete()
    .eq("tournament_id", id);

  if (teamsDeleteError) {
    return { error: teamsDeleteError.message };
  }

  // Recreate teams based on max_participants and team_size
  const numTeams = Math.floor(tournament.max_participants / (tournament.team_size || 2));
  const teamsToInsert = Array.from({ length: numTeams }, (_, i) => ({
    tournament_id: id,
    team_number: i + 1,
    is_full: false,
  }));

  const { error: teamsInsertError } = await supabase
    .from("tournament_teams")
    .insert(teamsToInsert);

  if (teamsInsertError) {
    return { error: teamsInsertError.message };
  }

  // Reset current_participants count to 0
  const { error: updateError } = await supabase
    .from("tournaments")
    .update({ current_participants: 0 })
    .eq("id", id);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath(`/tournaments/${id}`);
  return { success: "Tournament teams and participants have been reset" };
}

export async function isOrganizer(tournamentId: string): Promise<boolean> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data: tournament } = await supabase
    .from("tournaments")
    .select("organizer_id")
    .eq("id", tournamentId)
    .single();

  return tournament?.organizer_id === user.id;
}

export async function getTournamentAchievementTiers(
  tournamentId: string
): Promise<AchievementTierInput[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("tournament_achievement_tiers")
    .select("min_position, max_position, title, color, icon, display_order")
    .eq("tournament_id", tournamentId)
    .order("display_order", { ascending: true });

  return (data || []).map((tier) => ({
    min_position: tier.min_position,
    max_position: tier.max_position,
    title: tier.title,
    color: tier.color,
    icon: tier.icon || undefined,
    display_order: tier.display_order,
  }));
}
