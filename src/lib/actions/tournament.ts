"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Tournament, TournamentStatus } from "@/types/database";
import type { TournamentInput } from "@/lib/validations/tournament";

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

export async function createTournament(input: TournamentInput): Promise<TournamentResult> {
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

  revalidatePath("/tournaments");
  redirect(`/tournaments/${data.id}`);
}

export async function updateTournament(
  id: string,
  input: Partial<TournamentInput>
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
