"use server";

import { randomInt } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type {
  TournamentMatch,
  TournamentMatchInsert,
  TournamentRanking,
  TournamentRankingInsert,
  BracketType,
  UserAchievementInsert,
} from "@/types/database";

// ============================================
// RESULT TYPES
// ============================================

export type MatchResult = {
  error?: string;
  success?: string;
  data?: TournamentMatch;
};

export type MatchesResult = {
  error?: string;
  data?: TournamentMatch[];
};

export type RankingsResult = {
  error?: string;
  data?: TournamentRanking[];
};

export type GenerateResult = {
  error?: string;
  success?: string;
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Fisher-Yates shuffle with crypto.randomInt
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Calculate points based on final position
function calculatePoints(position: number): number {
  switch (position) {
    case 1: return 100;
    case 2: return 75;
    case 3: return 50;
    case 4: return 40;
    case 5:
    case 6: return 30;
    case 7:
    case 8: return 20;
    default: return 10;
  }
}

// ============================================
// QUERY FUNCTIONS
// ============================================

export async function getTournamentMatches(
  tournamentId: string
): Promise<MatchesResult> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tournament_matches")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("bracket", { ascending: true })
    .order("round", { ascending: true })
    .order("match_number", { ascending: true });

  if (error) {
    return { error: error.message };
  }

  return { data: data as TournamentMatch[] };
}

export async function getTournamentRankings(
  tournamentId: string
): Promise<RankingsResult> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tournament_rankings")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("position", { ascending: true });

  if (error) {
    return { error: error.message };
  }

  // Fetch team members for each ranking
  const { data: participants } = await supabase
    .from("tournament_participants")
    .select("*, profile:profiles(id, nickname, email)")
    .eq("tournament_id", tournamentId)
    .not("team_number", "is", null);

  // Group participants by team
  const teamMembers = new Map<number, typeof participants>();
  participants?.forEach((p) => {
    if (p.team_number !== null) {
      const members = teamMembers.get(p.team_number) || [];
      members.push(p);
      teamMembers.set(p.team_number, members);
    }
  });

  // Merge members into rankings
  const rankingsWithMembers = (data || []).map((r) => ({
    ...r,
    members: teamMembers.get(r.team_number) || [],
  }));

  return { data: rankingsWithMembers as TournamentRanking[] };
}

// ============================================
// MATCH GENERATION - First Round (WB Round 1)
// ============================================

export async function generateFirstRound(
  tournamentId: string
): Promise<GenerateResult> {
  const supabase = await createClient();

  // Verify user is organizer
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You need to login" };
  }

  const { data: tournament } = await supabase
    .from("tournaments")
    .select("organizer_id, bracket_generated, status")
    .eq("id", tournamentId)
    .single();

  if (tournament?.organizer_id !== user.id) {
    return { error: "Only organizers can arrange matches" };
  }

  if (tournament?.bracket_generated) {
    return { error: "Bracket already created" };
  }

  if (tournament?.status === "completed") {
    return { error: "Tournament has ended" };
  }

  // Get all teams (including partial/empty teams)
  const { data: teams } = await supabase
    .from("tournament_teams")
    .select("team_number")
    .eq("tournament_id", tournamentId)
    .order("team_number", { ascending: true });

  if (!teams || teams.length < 2) {
    return { error: "Need at least 2 teams to arrange matches" };
  }

  const teamNumbers = teams.map((t) => t.team_number);
  const teamCount = teamNumbers.length;

  // Shuffle teams for random pairing
  const shuffledTeams = shuffleArray(teamNumbers);

  // NEW: All teams play in Round 1, only 1 bye if odd number
  const isOdd = teamCount % 2 === 1;
  const byeTeam = isOdd ? shuffledTeams[shuffledTeams.length - 1] : null;
  const playingTeams = isOdd ? shuffledTeams.slice(0, -1) : shuffledTeams;

  // Create WB Round 1 matches
  const matchesToInsert: TournamentMatchInsert[] = [];
  for (let i = 0; i < playingTeams.length; i += 2) {
    matchesToInsert.push({
      tournament_id: tournamentId,
      bracket: "winners",
      round: 1,
      match_number: Math.floor(i / 2) + 1,
      team1_number: playingTeams[i],
      team2_number: playingTeams[i + 1],
      team1_score: null,
      team2_score: null,
      winner_team_number: null,
      scheduled_at: null,
      court: null,
      status: "upcoming",
      is_reset_match: false,
    });
  }

  // If odd number, create a bye match (team auto-advances)
  if (byeTeam !== null) {
    matchesToInsert.push({
      tournament_id: tournamentId,
      bracket: "winners",
      round: 1,
      match_number: Math.floor(playingTeams.length / 2) + 1,
      team1_number: byeTeam,
      team2_number: null,
      team1_score: null,
      team2_score: null,
      winner_team_number: byeTeam,
      scheduled_at: null,
      court: null,
      status: "completed",
      is_reset_match: false,
    });
  }

  // Insert matches
  const { error: insertError } = await supabase
    .from("tournament_matches")
    .insert(matchesToInsert);

  if (insertError) {
    return { error: insertError.message };
  }

  // Update tournament
  await supabase
    .from("tournaments")
    .update({
      bracket_generated: true,
      current_wb_round: 1,
      current_lb_round: null,
      status: "ongoing",
    })
    .eq("id", tournamentId);

  revalidatePath(`/tournaments/${tournamentId}`);

  const byeMessage = byeTeam !== null
    ? ` (Team ${byeTeam} gets bye)`
    : "";

  return {
    success: `Created ${matchesToInsert.length} matches for Winners Bracket Round 1${byeMessage}`,
  };
}

// ============================================
// MATCH GENERATION - Next Round
// ============================================

export async function generateNextRound(
  tournamentId: string
): Promise<GenerateResult> {
  const supabase = await createClient();

  // Verify user is organizer
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You need to login" };
  }

  const { data: tournament } = await supabase
    .from("tournaments")
    .select("organizer_id, current_wb_round, current_lb_round, status, bracket_generated")
    .eq("id", tournamentId)
    .single();

  if (tournament?.organizer_id !== user.id) {
    return { error: "Only organizers can create next round" };
  }

  if (!tournament?.bracket_generated) {
    return { error: "Bracket not created. Please arrange teams first" };
  }

  if (tournament?.status === "completed") {
    return { error: "Tournament has ended" };
  }

  // Get all matches
  const { data: allMatches } = await supabase
    .from("tournament_matches")
    .select("*")
    .eq("tournament_id", tournamentId);

  if (!allMatches) {
    return { error: "No matches found" };
  }

  // Check if there are pending matches
  const pendingMatches = allMatches.filter((m) => m.status !== "completed");
  if (pendingMatches.length > 0) {
    return { error: `${pendingMatches.length} matches still incomplete` };
  }

  // Get current state
  const currentWBRound = tournament.current_wb_round || 1;
  const currentLBRound = tournament.current_lb_round || 0;

  // Get WB matches from current round
  const wbCurrentRoundMatches = allMatches.filter(
    (m) => m.bracket === "winners" && m.round === currentWBRound
  );
  const wbWinners = [...new Set(
    wbCurrentRoundMatches
      .filter((m) => m.winner_team_number !== null)
      .map((m) => m.winner_team_number as number)
  )];
  // Get losers from WB (exclude bye matches where team2 is null)
  const wbLosers = wbCurrentRoundMatches
    .filter((m) => m.winner_team_number !== null && m.team2_number !== null) // Exclude bye matches
    .map((m) =>
      m.team1_number === m.winner_team_number ? m.team2_number : m.team1_number
    )
    .filter((n): n is number => n !== null);

  // Get bye teams (teams that didn't play in WB Round 1) - no longer needed with new logic
  // With new logic, bye teams are already marked as completed matches with team2_number = null
  const byeTeams: number[] = [];

  // Get LB winners from current LB round (exclude bye matches)
  const lbCurrentRoundMatches = allMatches.filter(
    (m) => m.bracket === "losers" && m.round === currentLBRound
  );
  const lbWinners = [...new Set(
    lbCurrentRoundMatches
      .filter((m) => m.winner_team_number !== null && m.team2_number !== null) // Exclude bye matches
      .map((m) => m.winner_team_number as number)
  )];

  // Get LB bye teams (they should also advance)
  const lbByeWinners = [...new Set(
    lbCurrentRoundMatches
      .filter((m) => m.winner_team_number !== null && m.team2_number === null) // Bye matches only
      .map((m) => m.winner_team_number as number)
  )];

  // Combine LB winners with LB bye winners (ensure no duplicates)
  const allLBWinners = [...new Set([...lbWinners, ...lbByeWinners])];

  const matchesToInsert: TournamentMatchInsert[] = [];
  let nextWBRound = currentWBRound;
  let nextLBRound = currentLBRound;

  // Determine if grand final should be created
  const grandFinalExists = allMatches.some((m) => m.bracket === "grand_final" && !m.is_reset_match);
  const grandFinalCompleted = allMatches.find(
    (m) => m.bracket === "grand_final" && !m.is_reset_match && m.status === "completed"
  );

  if (grandFinalCompleted) {
    // Check if reset match needed (LB champion won grand final)
    const lbChampWon = grandFinalCompleted.winner_team_number !== null &&
      allLBWinners.includes(grandFinalCompleted.winner_team_number);

    if (lbChampWon) {
      // Check if reset match exists
      const resetMatchExists = allMatches.some(
        (m) => m.bracket === "grand_final" && m.is_reset_match
      );

      if (!resetMatchExists) {
        // Create reset match
        matchesToInsert.push({
          tournament_id: tournamentId,
          bracket: "grand_final",
          round: 2,
          match_number: 1,
          team1_number: grandFinalCompleted.team1_number,
          team2_number: grandFinalCompleted.team2_number,
          team1_score: null,
          team2_score: null,
          winner_team_number: null,
          scheduled_at: null,
          court: null,
          status: "upcoming",
          is_reset_match: true,
        });
      } else {
        return { error: "All matches completed. Please end tournament." };
      }
    } else {
      return { error: "All matches completed. Please end tournament." };
    }
  } else if (!grandFinalExists && wbWinners.length === 1 && allLBWinners.length === 1) {
    // Create grand final
    matchesToInsert.push({
      tournament_id: tournamentId,
      bracket: "grand_final",
      round: 1,
      match_number: 1,
      team1_number: wbWinners[0], // WB champion
      team2_number: allLBWinners[0], // LB champion
      team1_score: null,
      team2_score: null,
      winner_team_number: null,
      scheduled_at: null,
      court: null,
      status: "upcoming",
      is_reset_match: false,
    });
  } else {
    // Generate next WB round if there are 2+ WB winners
    const allWBTeamsForNextRound = [...wbWinners, ...byeTeams];
    if (allWBTeamsForNextRound.length >= 2) {
      nextWBRound = currentWBRound + 1;

      // Handle bye for odd number of teams
      const wbIsOdd = allWBTeamsForNextRound.length % 2 === 1;
      let wbByeTeam: number | null = null;
      let wbPlayingTeams = allWBTeamsForNextRound;

      if (wbIsOdd) {
        // Random team gets bye
        const byeIndex = Math.floor(Math.random() * allWBTeamsForNextRound.length);
        wbByeTeam = allWBTeamsForNextRound[byeIndex];
        wbPlayingTeams = allWBTeamsForNextRound.filter((_, i) => i !== byeIndex);
      }

      // Create matches for playing teams
      for (let i = 0; i < wbPlayingTeams.length; i += 2) {
        matchesToInsert.push({
          tournament_id: tournamentId,
          bracket: "winners",
          round: nextWBRound,
          match_number: Math.floor(i / 2) + 1,
          team1_number: wbPlayingTeams[i],
          team2_number: wbPlayingTeams[i + 1],
          team1_score: null,
          team2_score: null,
          winner_team_number: null,
          scheduled_at: null,
          court: null,
          status: "upcoming",
          is_reset_match: false,
        });
      }

      // Create bye match if odd
      if (wbByeTeam !== null) {
        matchesToInsert.push({
          tournament_id: tournamentId,
          bracket: "winners",
          round: nextWBRound,
          match_number: Math.floor(wbPlayingTeams.length / 2) + 1,
          team1_number: wbByeTeam,
          team2_number: null,
          team1_score: null,
          team2_score: null,
          winner_team_number: wbByeTeam,
          scheduled_at: null,
          court: null,
          status: "completed",
          is_reset_match: false,
        });
      }
    }

    // Generate LB round
    // LB teams come from: previous LB winners + WB losers
    const lbTeamsForNextRound = [...allLBWinners, ...wbLosers];
    if (lbTeamsForNextRound.length >= 2) {
      nextLBRound = currentLBRound + 1;
      // Shuffle to randomize pairings
      const shuffledLBTeams = shuffleArray(lbTeamsForNextRound);

      // Handle bye for odd number of teams
      const lbIsOdd = shuffledLBTeams.length % 2 === 1;
      let lbByeTeam: number | null = null;
      let lbPlayingTeams = shuffledLBTeams;

      if (lbIsOdd) {
        // Last team gets bye
        lbByeTeam = shuffledLBTeams[shuffledLBTeams.length - 1];
        lbPlayingTeams = shuffledLBTeams.slice(0, -1);
      }

      // Create matches for playing teams
      for (let i = 0; i < lbPlayingTeams.length; i += 2) {
        matchesToInsert.push({
          tournament_id: tournamentId,
          bracket: "losers",
          round: nextLBRound,
          match_number: Math.floor(i / 2) + 1,
          team1_number: lbPlayingTeams[i],
          team2_number: lbPlayingTeams[i + 1],
          team1_score: null,
          team2_score: null,
          winner_team_number: null,
          scheduled_at: null,
          court: null,
          status: "upcoming",
          is_reset_match: false,
        });
      }

      // Create bye match if odd
      if (lbByeTeam !== null) {
        matchesToInsert.push({
          tournament_id: tournamentId,
          bracket: "losers",
          round: nextLBRound,
          match_number: Math.floor(lbPlayingTeams.length / 2) + 1,
          team1_number: lbByeTeam,
          team2_number: null,
          team1_score: null,
          team2_score: null,
          winner_team_number: lbByeTeam,
          scheduled_at: null,
          court: null,
          status: "completed",
          is_reset_match: false,
        });
      }
    } else if (lbTeamsForNextRound.length === 1 && wbWinners.length === 1) {
      // LB has 1 team left, WB has 1 team - create grand final
      matchesToInsert.push({
        tournament_id: tournamentId,
        bracket: "grand_final",
        round: 1,
        match_number: 1,
        team1_number: wbWinners[0],
        team2_number: lbTeamsForNextRound[0],
        team1_score: null,
        team2_score: null,
        winner_team_number: null,
        scheduled_at: null,
        court: null,
        status: "upcoming",
        is_reset_match: false,
      });
    }
  }

  if (matchesToInsert.length === 0) {
    return { error: "No matches to create" };
  }

  // Insert matches
  const { error: insertError } = await supabase
    .from("tournament_matches")
    .insert(matchesToInsert);

  if (insertError) {
    return { error: insertError.message };
  }

  // Update tournament rounds
  await supabase
    .from("tournaments")
    .update({
      current_wb_round: nextWBRound,
      current_lb_round: nextLBRound > 0 ? nextLBRound : null,
    })
    .eq("id", tournamentId);

  revalidatePath(`/tournaments/${tournamentId}`);

  const wbCount = matchesToInsert.filter((m) => m.bracket === "winners").length;
  const lbCount = matchesToInsert.filter((m) => m.bracket === "losers").length;
  const gfCount = matchesToInsert.filter((m) => m.bracket === "grand_final").length;

  let message = "Created";
  if (wbCount > 0) message += ` ${wbCount} WB Round ${nextWBRound} matches`;
  if (lbCount > 0) message += ` ${lbCount} LB Round ${nextLBRound} matches`;
  if (gfCount > 0) message += ` Grand Final match`;

  return { success: message };
}

// ============================================
// SCORE UPDATE
// ============================================

export async function updateMatchScore(
  matchId: string,
  team1Score: number,
  team2Score: number
): Promise<MatchResult> {
  const supabase = await createClient();

  // Verify user is organizer
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You need to login" };
  }

  // Get match and verify organizer
  const { data: match } = await supabase
    .from("tournament_matches")
    .select("*, tournament:tournaments(organizer_id)")
    .eq("id", matchId)
    .single();

  if (!match) {
    return { error: "Match not found" };
  }

  if ((match.tournament as { organizer_id: string }).organizer_id !== user.id) {
    return { error: "Only organizers can update scores" };
  }

  // Validate scores
  if (team1Score < 0 || team2Score < 0) {
    return { error: "Score cannot be negative" };
  }

  if (team1Score === team2Score) {
    return { error: "No draws allowed. Need a winner" };
  }

  // Determine winner
  const winnerTeamNumber = team1Score > team2Score
    ? match.team1_number
    : match.team2_number;

  // Update match
  const { data, error } = await supabase
    .from("tournament_matches")
    .update({
      team1_score: team1Score,
      team2_score: team2Score,
      winner_team_number: winnerTeamNumber,
      status: "completed",
    })
    .eq("id", matchId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/tournaments/${match.tournament_id}`);
  return {
    success: "Results updated",
    data: data as TournamentMatch,
  };
}

// ============================================
// END TOURNAMENT & CALCULATE RANKINGS
// ============================================

export async function endTournament(
  tournamentId: string
): Promise<GenerateResult> {
  const supabase = await createClient();

  // Verify organizer
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You need to login" };
  }

  const { data: tournament } = await supabase
    .from("tournaments")
    .select("organizer_id, status")
    .eq("id", tournamentId)
    .single();

  if (tournament?.organizer_id !== user.id) {
    return { error: "Only organizers can end tournament" };
  }

  if (tournament?.status === "completed") {
    return { error: "Tournament already ended" };
  }

  // Get all matches
  const { data: allMatches } = await supabase
    .from("tournament_matches")
    .select("*")
    .eq("tournament_id", tournamentId);

  // Check if there are pending matches
  const pendingMatches = allMatches?.filter((m) => m.status !== "completed");
  if (pendingMatches && pendingMatches.length > 0) {
    return { error: `${pendingMatches.length} matches still incomplete` };
  }

  // Check if grand final completed
  const grandFinal = allMatches?.find(
    (m) => m.bracket === "grand_final" && m.status === "completed"
  );
  if (!grandFinal) {
    return { error: "Grand final not completed" };
  }

  // Calculate rankings
  const rankings = await calculateFinalRankings(supabase, tournamentId, allMatches || []);

  // Delete existing rankings (if any)
  await supabase
    .from("tournament_rankings")
    .delete()
    .eq("tournament_id", tournamentId);

  // Insert rankings
  const { error: rankingsError } = await supabase
    .from("tournament_rankings")
    .insert(rankings);

  if (rankingsError) {
    return { error: rankingsError.message };
  }

  // Assign achievements to users based on rankings
  await assignAchievementsToUsers(supabase, tournamentId, rankings);

  // Update tournament status
  await supabase
    .from("tournaments")
    .update({ status: "completed" })
    .eq("id", tournamentId);

  revalidatePath(`/tournaments/${tournamentId}`);
  return { success: "Tournament ended and rankings calculated" };
}

async function calculateFinalRankings(
  supabase: Awaited<ReturnType<typeof createClient>>,
  tournamentId: string,
  matches: TournamentMatch[]
): Promise<TournamentRankingInsert[]> {
  // Build team list from matches (more reliable than teams table)
  const teamNumbersFromMatches = new Set<number>();
  matches.forEach((match) => {
    if (match.team1_number) teamNumbersFromMatches.add(match.team1_number);
    if (match.team2_number) teamNumbersFromMatches.add(match.team2_number);
  });
  const teamNumbers = Array.from(teamNumbersFromMatches);

  // Track wins/losses and elimination round for each team
  const teamStats = new Map<number, { wins: number; losses: number; eliminatedInBracket: BracketType | null; eliminatedInRound: number }>();
  teamNumbers.forEach((num) => {
    teamStats.set(num, { wins: 0, losses: 0, eliminatedInBracket: null, eliminatedInRound: 0 });
  });

  // Process matches to count wins/losses
  matches.forEach((match) => {
    if (match.winner_team_number && match.team1_number && match.team2_number) {
      const winnerNum = match.winner_team_number;
      const loserNum = match.team1_number === winnerNum ? match.team2_number : match.team1_number;

      const winner = teamStats.get(winnerNum);
      const loser = teamStats.get(loserNum);

      if (winner) winner.wins++;
      if (loser) {
        loser.losses++;
        // Only mark as eliminated if lost in LB or grand final
        if (match.bracket === "losers" || match.bracket === "grand_final") {
          loser.eliminatedInBracket = match.bracket;
          loser.eliminatedInRound = match.round;
        }
      }
    }
  });

  // Find grand final result (use reset match if exists)
  const grandFinalMatches = matches
    .filter((m) => m.bracket === "grand_final" && m.status === "completed")
    .sort((a, b) => b.round - a.round); // Reset match has higher round

  const finalMatch = grandFinalMatches[0];
  const champion = finalMatch?.winner_team_number;
  const runnerUp = finalMatch?.team1_number === champion
    ? finalMatch?.team2_number
    : finalMatch?.team1_number;

  // Find LB final loser (3rd place)
  const lbFinal = matches
    .filter((m) => m.bracket === "losers" && m.status === "completed")
    .sort((a, b) => b.round - a.round)[0];

  const thirdPlace = lbFinal?.team1_number === lbFinal?.winner_team_number
    ? lbFinal?.team2_number
    : lbFinal?.team1_number;

  const rankings: TournamentRankingInsert[] = [];
  let position = 1;
  const rankedTeams = new Set<number>();

  // 1st - Champion
  if (champion) {
    const stats = teamStats.get(champion);
    if (stats) {
      rankings.push({
        tournament_id: tournamentId,
        team_number: champion,
        position: position++,
        points: calculatePoints(1),
        wins: stats.wins,
        losses: stats.losses,
      });
      rankedTeams.add(champion);
    }
  }

  // 2nd - Runner-up
  if (runnerUp) {
    const stats = teamStats.get(runnerUp);
    if (stats) {
      rankings.push({
        tournament_id: tournamentId,
        team_number: runnerUp,
        position: position++,
        points: calculatePoints(2),
        wins: stats.wins,
        losses: stats.losses,
      });
      rankedTeams.add(runnerUp);
    }
  }

  // 3rd - LB Final loser
  if (thirdPlace && !rankedTeams.has(thirdPlace)) {
    const stats = teamStats.get(thirdPlace);
    if (stats) {
      rankings.push({
        tournament_id: tournamentId,
        team_number: thirdPlace,
        position: position++,
        points: calculatePoints(3),
        wins: stats.wins,
        losses: stats.losses,
      });
      rankedTeams.add(thirdPlace);
    }
  }

  // Remaining teams - sorted by LB elimination round (later = better)
  const remainingTeams = teamNumbers.filter((num) => !rankedTeams.has(num));

  remainingTeams.sort((a, b) => {
    const aStats = teamStats.get(a);
    const bStats = teamStats.get(b);

    if (!aStats || !bStats) return 0;

    // First by elimination round (higher = better, so reverse)
    if (aStats.eliminatedInRound !== bStats.eliminatedInRound) {
      return bStats.eliminatedInRound - aStats.eliminatedInRound;
    }

    // Then by wins (more = better)
    return bStats.wins - aStats.wins;
  });

  remainingTeams.forEach((teamNum) => {
    const stats = teamStats.get(teamNum);
    if (stats) {
      rankings.push({
        tournament_id: tournamentId,
        team_number: teamNum,
        position: position,
        points: calculatePoints(position),
        wins: stats.wins,
        losses: stats.losses,
      });
      position++;
    }
  });

  return rankings;
}

// ============================================
// UTILITY - Check if user is organizer
// ============================================

export async function isOrganizer(tournamentId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: tournament } = await supabase
    .from("tournaments")
    .select("organizer_id")
    .eq("id", tournamentId)
    .single();

  return tournament?.organizer_id === user.id;
}


// ============================================
// UTILITY - Get team statistics
// ============================================

export interface TeamStats {
  teamSize: number;
  totalTeams: number;
  fullTeams: number;
  partialTeams: number;
  emptyTeams: number;
  hasIncompleteTeams: boolean;
}

export async function getTeamStats(tournamentId: string): Promise<TeamStats> {
  const supabase = await createClient();

  const { data: tournament } = await supabase
    .from("tournaments")
    .select("team_size")
    .eq("id", tournamentId)
    .single();

  const { data: teams } = await supabase
    .from("tournament_teams")
    .select(`
      team_number,
      is_full,
      members:tournament_participants(id)
    `)
    .eq("tournament_id", tournamentId);

  const teamSize = tournament?.team_size ?? 2;
  const totalTeams = teams?.length ?? 0;
  const fullTeams = teams?.filter((t) => t.is_full).length ?? 0;
  const partialTeams =
    teams?.filter((t) => !t.is_full && (t.members?.length ?? 0) > 0).length ??
    0;
  const emptyTeams =
    teams?.filter((t) => (t.members?.length ?? 0) === 0).length ?? 0;

  return {
    teamSize,
    totalTeams,
    fullTeams,
    partialTeams,
    emptyTeams,
    hasIncompleteTeams: partialTeams > 0 || emptyTeams > 0,
  };
}

// ============================================
// ACHIEVEMENT ASSIGNMENT
// ============================================

async function assignAchievementsToUsers(
  supabase: Awaited<ReturnType<typeof createClient>>,
  tournamentId: string,
  rankings: TournamentRankingInsert[]
): Promise<void> {
  // 1. Get tournament name
  const { data: tournament } = await supabase
    .from("tournaments")
    .select("name")
    .eq("id", tournamentId)
    .single();

  if (!tournament) return;

  // 2. Get achievement tiers for this tournament
  const { data: tiers } = await supabase
    .from("tournament_achievement_tiers")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("min_position", { ascending: true });

  if (!tiers || tiers.length === 0) return; // No achievements configured

  // 3. Get participants with their user_ids
  const { data: participants } = await supabase
    .from("tournament_participants")
    .select("user_id, team_number")
    .eq("tournament_id", tournamentId);

  if (!participants) return;

  // 4. Create team_number -> user_ids mapping
  const teamToUsers = new Map<number, string[]>();
  participants.forEach((p) => {
    if (p.team_number !== null) {
      const users = teamToUsers.get(p.team_number) || [];
      users.push(p.user_id);
      teamToUsers.set(p.team_number, users);
    }
  });

  // 5. For each ranking, find matching tier and create achievements
  const achievements: UserAchievementInsert[] = [];

  for (const ranking of rankings) {
    const position = ranking.position;
    const tier = tiers.find(
      (t) => position >= t.min_position && position <= t.max_position
    );

    if (!tier) continue; // No tier for this position

    const userIds = teamToUsers.get(ranking.team_number) || [];

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

  // 6. Insert achievements (upsert to handle duplicates)
  if (achievements.length > 0) {
    await supabase
      .from("user_achievements")
      .upsert(achievements, { onConflict: "user_id,tournament_id" });
  }
}


// ============================================
// UPCOMING MATCHES FOR USER
// ============================================

export interface UpcomingMatchDisplay {
  id: string;
  tournamentId: string;
  tournamentName: string;
  tournamentLocation: string | null;
  bracket: BracketType;
  round: number;
  scheduledAt: string | null;
  tournamentStartDate: string;
  court: string | null;
  userTeamNumber: number;
  opponentTeamNumber: number | null;
  opponentNames: string[];
}

export type UpcomingMatchesResult = {
  data?: UpcomingMatchDisplay[];
  error?: string;
};

interface TournamentInfo {
  id: string;
  name: string;
  location: string | null;
  start_date: string;
  status: string;
}

export async function getUpcomingMatches(
  limit = 5
): Promise<UpcomingMatchesResult> {
  const supabase = await createClient();

  // 1. Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { data: [] };
  }

  // 2. Get user's tournament participations (with team_number assigned)
  const { data: participations, error: participationsError } = await supabase
    .from("tournament_participants")
    .select(
      `
      tournament_id,
      team_number,
      tournament:tournaments(id, name, location, start_date, status)
    `
    )
    .eq("user_id", user.id)
    .not("team_number", "is", null);

  if (participationsError) {
    return { error: participationsError.message };
  }

  if (!participations || participations.length === 0) {
    return { data: [] };
  }

  // 3. Filter active tournaments and build map
  const userTournaments = new Map<
    string,
    { teamNumber: number; tournament: TournamentInfo }
  >();

  participations.forEach((p) => {
    const tournament = p.tournament as unknown as TournamentInfo | null;
    if (
      p.team_number !== null &&
      tournament &&
      tournament.status !== "completed" &&
      tournament.status !== "cancelled"
    ) {
      userTournaments.set(p.tournament_id, {
        teamNumber: p.team_number,
        tournament,
      });
    }
  });

  if (userTournaments.size === 0) {
    return { data: [] };
  }

  // 4. Get upcoming matches for these tournaments
  const tournamentIds = Array.from(userTournaments.keys());
  const { data: matches, error: matchesError } = await supabase
    .from("tournament_matches")
    .select("*")
    .in("tournament_id", tournamentIds)
    .eq("status", "upcoming")
    .order("scheduled_at", { ascending: true, nullsFirst: false });

  if (matchesError) {
    return { error: matchesError.message };
  }

  if (!matches || matches.length === 0) {
    return { data: [] };
  }

  // 5. Filter matches where user's team is team1 or team2
  const userMatches = matches.filter((m) => {
    const info = userTournaments.get(m.tournament_id);
    if (!info) return false;
    return (
      m.team1_number === info.teamNumber || m.team2_number === info.teamNumber
    );
  });

  if (userMatches.length === 0) {
    return { data: [] };
  }

  // 6. Collect opponent team keys for fetching names
  const opponentTeamKeys = new Set<string>();
  userMatches.forEach((match) => {
    const info = userTournaments.get(match.tournament_id);
    if (!info) return;

    const opponentTeamNumber =
      match.team1_number === info.teamNumber
        ? match.team2_number
        : match.team1_number;

    if (opponentTeamNumber !== null) {
      opponentTeamKeys.add(`${match.tournament_id}:${opponentTeamNumber}`);
    }
  });

  // 7. Fetch opponent participants with profiles
  const opponentNamesMap = new Map<string, string[]>();

  if (opponentTeamKeys.size > 0) {
    const opponentPromises = Array.from(opponentTeamKeys).map((key) => {
      const [tournamentId, teamNumberStr] = key.split(":");
      return supabase
        .from("tournament_participants")
        .select(
          `
          tournament_id,
          team_number,
          profile:profiles(nickname)
        `
        )
        .eq("tournament_id", tournamentId)
        .eq("team_number", parseInt(teamNumberStr, 10));
    });

    const opponentResults = await Promise.all(opponentPromises);

    opponentResults.forEach((result) => {
      if (result.data) {
        result.data.forEach((p) => {
          const key = `${p.tournament_id}:${p.team_number}`;
          const names = opponentNamesMap.get(key) || [];
          const profile = p.profile as unknown as { nickname: string } | null;
          if (profile?.nickname) {
            names.push(profile.nickname);
          }
          opponentNamesMap.set(key, names);
        });
      }
    });
  }

  // 8. Build result array
  const upcomingMatches: UpcomingMatchDisplay[] = userMatches
    .slice(0, limit)
    .map((match) => {
      const info = userTournaments.get(match.tournament_id)!;
      const isUserTeam1 = match.team1_number === info.teamNumber;
      const opponentTeamNumber = isUserTeam1
        ? match.team2_number
        : match.team1_number;

      const opponentKey =
        opponentTeamNumber !== null
          ? `${match.tournament_id}:${opponentTeamNumber}`
          : null;
      const opponentNames = opponentKey
        ? opponentNamesMap.get(opponentKey) || []
        : [];

      return {
        id: match.id,
        tournamentId: match.tournament_id,
        tournamentName: info.tournament.name,
        tournamentLocation: info.tournament.location,
        bracket: match.bracket as BracketType,
        round: match.round,
        scheduledAt: match.scheduled_at,
        tournamentStartDate: info.tournament.start_date,
        court: match.court,
        userTeamNumber: info.teamNumber,
        opponentTeamNumber,
        opponentNames,
      };
    });

  // 9. Sort: matches with scheduled_at first, then by tournament start_date
  upcomingMatches.sort((a, b) => {
    const dateA = a.scheduledAt || a.tournamentStartDate;
    const dateB = b.scheduledAt || b.tournamentStartDate;
    return new Date(dateA).getTime() - new Date(dateB).getTime();
  });

  return { data: upcomingMatches };
}
