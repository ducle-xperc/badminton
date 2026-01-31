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
}

export type TournamentInsert = Omit<
  Tournament,
  "id" | "created_at" | "updated_at" | "current_participants"
>;

export type TournamentUpdate = Partial<TournamentInsert>;
