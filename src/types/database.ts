export type TournamentStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

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
}

export type TournamentInsert = Omit<
  Tournament,
  "id" | "created_at" | "updated_at" | "current_participants"
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

// Match between teams
export type MatchRound = "qualifier" | "quarterfinal" | "semifinal" | "final";
export type MatchStatus = "upcoming" | "ongoing" | "completed";

export interface TournamentMatch {
  id: string;
  tournament_id: string;
  round: MatchRound;
  round_number: number;
  team1_number: number | null;
  team2_number: number | null;
  team1_score: number | null;
  team2_score: number | null;
  winner_team_number: number | null;
  scheduled_at: string | null;
  status: MatchStatus;
  court: string | null;
}

// MVP/Ranking
export interface TournamentRanking {
  position: number;
  team_number: number;
  members: TournamentParticipant[];
  points: number;
  wins: number;
  losses: number;
}
