import type {
  TournamentParticipant,
  TournamentMatch,
  TournamentRanking,
  TournamentTeam,
} from "@/types/database";

export const mockParticipants: TournamentParticipant[] = [
  // Team 1 (A)
  {
    id: "p1",
    user_id: "u1",
    tournament_id: "t1",
    team_number: 1,
    registered_at: "2025-01-15T10:00:00Z",
    user: {
      id: "u1",
      name: "Nguyen Van A",
      avatar_url: null,
      email: "a@example.com",
    },
  },
  {
    id: "p2",
    user_id: "u2",
    tournament_id: "t1",
    team_number: 1,
    registered_at: "2025-01-15T10:05:00Z",
    user: {
      id: "u2",
      name: "Tran Thi B",
      avatar_url: null,
      email: "b@example.com",
    },
  },
  // Team 2 (B)
  {
    id: "p3",
    user_id: "u3",
    tournament_id: "t1",
    team_number: 2,
    registered_at: "2025-01-15T11:00:00Z",
    user: {
      id: "u3",
      name: "Le Van C",
      avatar_url: null,
      email: "c@example.com",
    },
  },
  {
    id: "p4",
    user_id: "u4",
    tournament_id: "t1",
    team_number: 2,
    registered_at: "2025-01-15T11:05:00Z",
    user: {
      id: "u4",
      name: "Pham Thi D",
      avatar_url: null,
      email: "d@example.com",
    },
  },
  // Team 3 (C)
  {
    id: "p5",
    user_id: "u5",
    tournament_id: "t1",
    team_number: 3,
    registered_at: "2025-01-16T09:00:00Z",
    user: {
      id: "u5",
      name: "Hoang Van E",
      avatar_url: null,
      email: "e@example.com",
    },
  },
  {
    id: "p6",
    user_id: "u6",
    tournament_id: "t1",
    team_number: 3,
    registered_at: "2025-01-16T09:05:00Z",
    user: {
      id: "u6",
      name: "Vu Thi F",
      avatar_url: null,
      email: "f@example.com",
    },
  },
  // Team 4 (D)
  {
    id: "p7",
    user_id: "u7",
    tournament_id: "t1",
    team_number: 4,
    registered_at: "2025-01-16T10:00:00Z",
    user: {
      id: "u7",
      name: "Dao Van G",
      avatar_url: null,
      email: "g@example.com",
    },
  },
  {
    id: "p8",
    user_id: "u8",
    tournament_id: "t1",
    team_number: 4,
    registered_at: "2025-01-16T10:05:00Z",
    user: {
      id: "u8",
      name: "Bui Thi H",
      avatar_url: null,
      email: "h@example.com",
    },
  },
];

export const mockMatches: TournamentMatch[] = [
  // Semifinals
  {
    id: "m1",
    tournament_id: "t1",
    round: "semifinal",
    round_number: 1,
    team1_number: 1,
    team2_number: 4,
    team1_score: 21,
    team2_score: 18,
    winner_team_number: 1,
    scheduled_at: "2025-02-01T09:00:00Z",
    status: "completed",
    court: "Court 1",
  },
  {
    id: "m2",
    tournament_id: "t1",
    round: "semifinal",
    round_number: 2,
    team1_number: 2,
    team2_number: 3,
    team1_score: 21,
    team2_score: 19,
    winner_team_number: 2,
    scheduled_at: "2025-02-01T10:30:00Z",
    status: "completed",
    court: "Court 2",
  },
  // Final
  {
    id: "m3",
    tournament_id: "t1",
    round: "final",
    round_number: 1,
    team1_number: 1,
    team2_number: 2,
    team1_score: null,
    team2_score: null,
    winner_team_number: null,
    scheduled_at: "2025-02-02T14:00:00Z",
    status: "upcoming",
    court: "Center Court",
  },
];

export const mockRankings: TournamentRanking[] = [
  {
    position: 1,
    team_number: 1,
    team_letter: "A",
    members: [],
    points: 100,
    wins: 2,
    losses: 0,
  },
  {
    position: 2,
    team_number: 2,
    team_letter: "B",
    members: [],
    points: 75,
    wins: 1,
    losses: 1,
  },
  {
    position: 3,
    team_number: 3,
    team_letter: "C",
    members: [],
    points: 50,
    wins: 0,
    losses: 1,
  },
  {
    position: 4,
    team_number: 4,
    team_letter: "D",
    members: [],
    points: 25,
    wins: 0,
    losses: 1,
  },
];

export function groupParticipantsByTeam(
  participants: TournamentParticipant[]
): TournamentTeam[] {
  const teamMap = new Map<number, TournamentParticipant[]>();

  participants.forEach((p) => {
    const existing = teamMap.get(p.team_number) || [];
    teamMap.set(p.team_number, [...existing, p]);
  });

  return Array.from(teamMap.entries())
    .map(([team_number, members]) => ({
      team_number,
      team_letter: String.fromCharCode(64 + team_number), // 1=A, 2=B, etc.
      members,
    }))
    .sort((a, b) => a.team_number - b.team_number);
}

export function getTeamLetter(teamNumber: number | null): string {
  if (!teamNumber) return "TBD";
  return String.fromCharCode(64 + teamNumber);
}
