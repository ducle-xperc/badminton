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

function nextPowerOf2(n: number): number {
  let power = 1;
  while (power < n) power *= 2;
  return power;
}

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
    return { error: "Bạn cần đăng nhập" };
  }

  const { data: tournament } = await supabase
    .from("tournaments")
    .select("organizer_id, bracket_generated, status")
    .eq("id", tournamentId)
    .single();

  if (tournament?.organizer_id !== user.id) {
    return { error: "Chỉ BTC mới có thể sắp xếp trận đấu" };
  }

  if (tournament?.bracket_generated) {
    return { error: "Bracket đã được tạo rồi" };
  }

  if (tournament?.status === "completed") {
    return { error: "Giải đấu đã kết thúc" };
  }

  // Get all full teams
  const { data: teams } = await supabase
    .from("tournament_teams")
    .select("team_number")
    .eq("tournament_id", tournamentId)
    .eq("is_full", true)
    .order("team_number", { ascending: true });

  if (!teams || teams.length < 2) {
    return { error: "Cần ít nhất 2 đội đủ người để sắp xếp trận đấu" };
  }

  const teamNumbers = teams.map((t) => t.team_number);
  const teamCount = teamNumbers.length;
  const targetSize = nextPowerOf2(teamCount);
  const byeCount = targetSize - teamCount;

  // Shuffle teams for random pairing
  const shuffledTeams = shuffleArray(teamNumbers);

  // Teams getting byes (first byeCount teams advance automatically to WB Round 2)
  const byeTeams = shuffledTeams.slice(0, byeCount);
  const playingTeams = shuffledTeams.slice(byeCount);

  // Create WB Round 1 matches
  const matchesToInsert: TournamentMatchInsert[] = [];
  for (let i = 0; i < playingTeams.length; i += 2) {
    matchesToInsert.push({
      tournament_id: tournamentId,
      bracket: "winners",
      round: 1,
      match_number: Math.floor(i / 2) + 1,
      team1_number: playingTeams[i],
      team2_number: playingTeams[i + 1] ?? null,
      team1_score: null,
      team2_score: null,
      winner_team_number: null,
      scheduled_at: null,
      court: null,
      status: "upcoming",
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

  const byeMessage = byeCount > 0
    ? ` (${byeCount} đội được bye: Team ${byeTeams.join(", ")})`
    : "";

  return {
    success: `Đã tạo ${matchesToInsert.length} trận đấu cho Winners Bracket Round 1${byeMessage}`,
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
    return { error: "Bạn cần đăng nhập" };
  }

  const { data: tournament } = await supabase
    .from("tournaments")
    .select("organizer_id, current_wb_round, current_lb_round, status, bracket_generated")
    .eq("id", tournamentId)
    .single();

  if (tournament?.organizer_id !== user.id) {
    return { error: "Chỉ BTC mới có thể tạo vòng tiếp theo" };
  }

  if (!tournament?.bracket_generated) {
    return { error: "Chưa tạo bracket. Hãy sắp xếp đội hình trước" };
  }

  if (tournament?.status === "completed") {
    return { error: "Giải đấu đã kết thúc" };
  }

  // Get all matches
  const { data: allMatches } = await supabase
    .from("tournament_matches")
    .select("*")
    .eq("tournament_id", tournamentId);

  if (!allMatches) {
    return { error: "Không tìm thấy trận đấu nào" };
  }

  // Check if there are pending matches
  const pendingMatches = allMatches.filter((m) => m.status !== "completed");
  if (pendingMatches.length > 0) {
    return { error: `Còn ${pendingMatches.length} trận chưa hoàn thành` };
  }

  // Get current state
  const currentWBRound = tournament.current_wb_round || 1;
  const currentLBRound = tournament.current_lb_round || 0;

  // Get WB matches from current round
  const wbCurrentRoundMatches = allMatches.filter(
    (m) => m.bracket === "winners" && m.round === currentWBRound
  );
  const wbWinners = wbCurrentRoundMatches
    .filter((m) => m.winner_team_number !== null)
    .map((m) => m.winner_team_number as number);
  const wbLosers = wbCurrentRoundMatches
    .filter((m) => m.winner_team_number !== null)
    .map((m) =>
      m.team1_number === m.winner_team_number ? m.team2_number : m.team1_number
    )
    .filter((n): n is number => n !== null);

  // Get bye teams (teams that didn't play in WB Round 1)
  const { data: allTeams } = await supabase
    .from("tournament_teams")
    .select("team_number")
    .eq("tournament_id", tournamentId)
    .eq("is_full", true);

  const allTeamNumbers = allTeams?.map((t) => t.team_number) || [];
  const teamsInMatches = new Set(
    allMatches.flatMap((m) => [m.team1_number, m.team2_number].filter(Boolean))
  );

  // Bye teams are those who haven't played yet
  const byeTeams = currentWBRound === 1
    ? allTeamNumbers.filter((t) => !teamsInMatches.has(t))
    : [];

  // Get LB winners from current LB round
  const lbCurrentRoundMatches = allMatches.filter(
    (m) => m.bracket === "losers" && m.round === currentLBRound
  );
  const lbWinners = lbCurrentRoundMatches
    .filter((m) => m.winner_team_number !== null)
    .map((m) => m.winner_team_number as number);

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
      lbWinners.includes(grandFinalCompleted.winner_team_number);

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
        return { error: "Tất cả trận đấu đã hoàn thành. Hãy kết thúc giải đấu." };
      }
    } else {
      return { error: "Tất cả trận đấu đã hoàn thành. Hãy kết thúc giải đấu." };
    }
  } else if (!grandFinalExists && wbWinners.length === 1 && lbWinners.length === 1) {
    // Create grand final
    matchesToInsert.push({
      tournament_id: tournamentId,
      bracket: "grand_final",
      round: 1,
      match_number: 1,
      team1_number: wbWinners[0], // WB champion
      team2_number: lbWinners[0], // LB champion
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
      for (let i = 0; i < allWBTeamsForNextRound.length; i += 2) {
        if (allWBTeamsForNextRound[i + 1] !== undefined) {
          matchesToInsert.push({
            tournament_id: tournamentId,
            bracket: "winners",
            round: nextWBRound,
            match_number: Math.floor(i / 2) + 1,
            team1_number: allWBTeamsForNextRound[i],
            team2_number: allWBTeamsForNextRound[i + 1],
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
    }

    // Generate LB round
    // LB teams come from: previous LB winners + WB losers
    const lbTeamsForNextRound = [...lbWinners, ...wbLosers];
    if (lbTeamsForNextRound.length >= 2) {
      nextLBRound = currentLBRound + 1;
      // Shuffle to randomize pairings
      const shuffledLBTeams = shuffleArray(lbTeamsForNextRound);
      for (let i = 0; i < shuffledLBTeams.length; i += 2) {
        if (shuffledLBTeams[i + 1] !== undefined) {
          matchesToInsert.push({
            tournament_id: tournamentId,
            bracket: "losers",
            round: nextLBRound,
            match_number: Math.floor(i / 2) + 1,
            team1_number: shuffledLBTeams[i],
            team2_number: shuffledLBTeams[i + 1],
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
    return { error: "Không có trận đấu nào để tạo" };
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

  let message = "Đã tạo";
  if (wbCount > 0) message += ` ${wbCount} trận WB Round ${nextWBRound}`;
  if (lbCount > 0) message += ` ${lbCount} trận LB Round ${nextLBRound}`;
  if (gfCount > 0) message += ` trận Chung kết`;

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
    return { error: "Bạn cần đăng nhập" };
  }

  // Get match and verify organizer
  const { data: match } = await supabase
    .from("tournament_matches")
    .select("*, tournament:tournaments(organizer_id)")
    .eq("id", matchId)
    .single();

  if (!match) {
    return { error: "Không tìm thấy trận đấu" };
  }

  if ((match.tournament as { organizer_id: string }).organizer_id !== user.id) {
    return { error: "Chỉ BTC mới có thể cập nhật điểm" };
  }

  // Validate scores
  if (team1Score < 0 || team2Score < 0) {
    return { error: "Điểm không được âm" };
  }

  if (team1Score === team2Score) {
    return { error: "Không được hòa. Cần có đội thắng" };
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
    success: "Đã cập nhật kết quả",
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
    return { error: "Bạn cần đăng nhập" };
  }

  const { data: tournament } = await supabase
    .from("tournaments")
    .select("organizer_id, status")
    .eq("id", tournamentId)
    .single();

  if (tournament?.organizer_id !== user.id) {
    return { error: "Chỉ BTC mới có thể kết thúc giải đấu" };
  }

  if (tournament?.status === "completed") {
    return { error: "Giải đấu đã kết thúc rồi" };
  }

  // Get all matches
  const { data: allMatches } = await supabase
    .from("tournament_matches")
    .select("*")
    .eq("tournament_id", tournamentId);

  // Check if there are pending matches
  const pendingMatches = allMatches?.filter((m) => m.status !== "completed");
  if (pendingMatches && pendingMatches.length > 0) {
    return { error: `Còn ${pendingMatches.length} trận chưa hoàn thành` };
  }

  // Check if grand final completed
  const grandFinal = allMatches?.find(
    (m) => m.bracket === "grand_final" && m.status === "completed"
  );
  if (!grandFinal) {
    return { error: "Trận chung kết chưa hoàn thành" };
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
  return { success: "Đã kết thúc giải đấu và tính xếp hạng" };
}

async function calculateFinalRankings(
  supabase: Awaited<ReturnType<typeof createClient>>,
  tournamentId: string,
  matches: TournamentMatch[]
): Promise<TournamentRankingInsert[]> {
  // Get all teams
  const { data: teams } = await supabase
    .from("tournament_teams")
    .select("team_number")
    .eq("tournament_id", tournamentId)
    .eq("is_full", true);

  const teamNumbers = teams?.map((t) => t.team_number) || [];

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
    const stats = teamStats.get(champion)!;
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

  // 2nd - Runner-up
  if (runnerUp) {
    const stats = teamStats.get(runnerUp)!;
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

  // 3rd - LB Final loser
  if (thirdPlace && !rankedTeams.has(thirdPlace)) {
    const stats = teamStats.get(thirdPlace)!;
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

  // Remaining teams - sorted by LB elimination round (later = better)
  const remainingTeams = teamNumbers.filter((num) => !rankedTeams.has(num));

  remainingTeams.sort((a, b) => {
    const aStats = teamStats.get(a)!;
    const bStats = teamStats.get(b)!;

    // First by elimination round (higher = better, so reverse)
    if (aStats.eliminatedInRound !== bStats.eliminatedInRound) {
      return bStats.eliminatedInRound - aStats.eliminatedInRound;
    }

    // Then by wins (more = better)
    return bStats.wins - aStats.wins;
  });

  remainingTeams.forEach((teamNum) => {
    const stats = teamStats.get(teamNum)!;
    rankings.push({
      tournament_id: tournamentId,
      team_number: teamNum,
      position: position,
      points: calculatePoints(position),
      wins: stats.wins,
      losses: stats.losses,
    });
    position++;
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
