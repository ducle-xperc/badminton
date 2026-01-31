export type TournamentStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export type Gender = "male" | "female" | "other";

export interface Profile {
  id: string;
  nickname: string | null;
  email: string | null;
  gender: Gender | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tournament {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string | null;
  banner_url: string | null;
  start_date: string;
  end_date: string;
  registration_deadline: string | null;
  location: string;
  max_participants: number;
  current_participants: number;
  entry_fee: number;
  prize_pool: string | null;
  status: TournamentStatus;
  organizer_id: string | null;
  categories: string[];
  team_size: number; // 1 for singles, 2 for doubles
  // Double elimination bracket tracking
  current_wb_round: number | null;
  current_lb_round: number | null;
  bracket_generated: boolean;
}

export type TournamentInsert = Omit<
  Tournament,
  "id" | "created_at" | "updated_at" | "current_participants" | "current_wb_round" | "current_lb_round" | "bracket_generated"
>;

export type TournamentUpdate = Partial<TournamentInsert>;

// Participant registered for a tournament
export interface TournamentParticipant {
  id: string;
  created_at: string;
  tournament_id: string;
  user_id: string;
  team_id: string | null;
  team_number: number | null;
  profile?: {
    id: string;
    nickname: string;
    email: string;
  };
}

// Team in a tournament
export interface TournamentTeam {
  id: string;
  created_at: string;
  updated_at: string;
  tournament_id: string;
  team_number: number;
  is_full: boolean;
  members?: TournamentParticipant[];
}

// Match bracket types for double elimination
export type BracketType = "winners" | "losers" | "grand_final";
export type MatchStatus = "upcoming" | "ongoing" | "completed";

// Match between teams (double elimination)
export interface TournamentMatch {
  id: string;
  created_at: string;
  updated_at: string;
  tournament_id: string;
  bracket: BracketType;
  round: number; // Round number within the bracket
  match_number: number; // Match number within the round
  team1_number: number | null;
  team2_number: number | null;
  team1_score: number | null;
  team2_score: number | null;
  winner_team_number: number | null;
  scheduled_at: string | null;
  court: string | null;
  status: MatchStatus;
  is_reset_match: boolean;
}

export type TournamentMatchInsert = Omit<
  TournamentMatch,
  "id" | "created_at" | "updated_at"
>;

export type TournamentMatchUpdate = Partial<
  Omit<TournamentMatch, "id" | "created_at" | "updated_at" | "tournament_id">
>;

// MVP/Ranking
export interface TournamentRanking {
  id: string;
  created_at: string;
  tournament_id: string;
  team_number: number;
  position: number;
  points: number;
  wins: number;
  losses: number;
  members?: TournamentParticipant[];
}

export type TournamentRankingInsert = Omit<
  TournamentRanking,
  "id" | "created_at" | "members"
>;
