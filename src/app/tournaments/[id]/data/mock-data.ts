import type {
  TournamentMatch,
  TournamentRanking,
} from "@/types/database";

// Local mock types for display (not tied to database structure)
export interface MockParticipant {
  id: string;
  user_id: string;
  tournament_id: string;
  team_number: number;
  registered_at: string;
  user: {
    id: string;
    name: string;
    avatar_url: string | null;
    email: string;
  };
}

export interface MockTeam {
  team_number: number;
  members: MockParticipant[];
}

// 50 distinct team colors - each has bg (background with opacity), text, and border colors
export const TEAM_COLORS: { bg: string; text: string; border: string }[] = [
  { bg: "bg-red-500/20", text: "text-red-500", border: "border-red-500/30" },
  { bg: "bg-blue-500/20", text: "text-blue-500", border: "border-blue-500/30" },
  { bg: "bg-green-500/20", text: "text-green-500", border: "border-green-500/30" },
  { bg: "bg-yellow-500/20", text: "text-yellow-500", border: "border-yellow-500/30" },
  { bg: "bg-purple-500/20", text: "text-purple-500", border: "border-purple-500/30" },
  { bg: "bg-pink-500/20", text: "text-pink-500", border: "border-pink-500/30" },
  { bg: "bg-indigo-500/20", text: "text-indigo-500", border: "border-indigo-500/30" },
  { bg: "bg-cyan-500/20", text: "text-cyan-500", border: "border-cyan-500/30" },
  { bg: "bg-orange-500/20", text: "text-orange-500", border: "border-orange-500/30" },
  { bg: "bg-teal-500/20", text: "text-teal-500", border: "border-teal-500/30" },
  { bg: "bg-lime-500/20", text: "text-lime-500", border: "border-lime-500/30" },
  { bg: "bg-emerald-500/20", text: "text-emerald-500", border: "border-emerald-500/30" },
  { bg: "bg-violet-500/20", text: "text-violet-500", border: "border-violet-500/30" },
  { bg: "bg-fuchsia-500/20", text: "text-fuchsia-500", border: "border-fuchsia-500/30" },
  { bg: "bg-rose-500/20", text: "text-rose-500", border: "border-rose-500/30" },
  { bg: "bg-sky-500/20", text: "text-sky-500", border: "border-sky-500/30" },
  { bg: "bg-amber-500/20", text: "text-amber-500", border: "border-amber-500/30" },
  { bg: "bg-red-600/20", text: "text-red-600", border: "border-red-600/30" },
  { bg: "bg-blue-600/20", text: "text-blue-600", border: "border-blue-600/30" },
  { bg: "bg-green-600/20", text: "text-green-600", border: "border-green-600/30" },
  { bg: "bg-yellow-600/20", text: "text-yellow-600", border: "border-yellow-600/30" },
  { bg: "bg-purple-600/20", text: "text-purple-600", border: "border-purple-600/30" },
  { bg: "bg-pink-600/20", text: "text-pink-600", border: "border-pink-600/30" },
  { bg: "bg-indigo-600/20", text: "text-indigo-600", border: "border-indigo-600/30" },
  { bg: "bg-cyan-600/20", text: "text-cyan-600", border: "border-cyan-600/30" },
  { bg: "bg-orange-600/20", text: "text-orange-600", border: "border-orange-600/30" },
  { bg: "bg-teal-600/20", text: "text-teal-600", border: "border-teal-600/30" },
  { bg: "bg-lime-600/20", text: "text-lime-600", border: "border-lime-600/30" },
  { bg: "bg-emerald-600/20", text: "text-emerald-600", border: "border-emerald-600/30" },
  { bg: "bg-violet-600/20", text: "text-violet-600", border: "border-violet-600/30" },
  { bg: "bg-fuchsia-600/20", text: "text-fuchsia-600", border: "border-fuchsia-600/30" },
  { bg: "bg-rose-600/20", text: "text-rose-600", border: "border-rose-600/30" },
  { bg: "bg-sky-600/20", text: "text-sky-600", border: "border-sky-600/30" },
  { bg: "bg-amber-600/20", text: "text-amber-600", border: "border-amber-600/30" },
  { bg: "bg-red-400/20", text: "text-red-400", border: "border-red-400/30" },
  { bg: "bg-blue-400/20", text: "text-blue-400", border: "border-blue-400/30" },
  { bg: "bg-green-400/20", text: "text-green-400", border: "border-green-400/30" },
  { bg: "bg-yellow-400/20", text: "text-yellow-400", border: "border-yellow-400/30" },
  { bg: "bg-purple-400/20", text: "text-purple-400", border: "border-purple-400/30" },
  { bg: "bg-pink-400/20", text: "text-pink-400", border: "border-pink-400/30" },
  { bg: "bg-indigo-400/20", text: "text-indigo-400", border: "border-indigo-400/30" },
  { bg: "bg-cyan-400/20", text: "text-cyan-400", border: "border-cyan-400/30" },
  { bg: "bg-orange-400/20", text: "text-orange-400", border: "border-orange-400/30" },
  { bg: "bg-teal-400/20", text: "text-teal-400", border: "border-teal-400/30" },
  { bg: "bg-lime-400/20", text: "text-lime-400", border: "border-lime-400/30" },
  { bg: "bg-emerald-400/20", text: "text-emerald-400", border: "border-emerald-400/30" },
  { bg: "bg-violet-400/20", text: "text-violet-400", border: "border-violet-400/30" },
  { bg: "bg-fuchsia-400/20", text: "text-fuchsia-400", border: "border-fuchsia-400/30" },
  { bg: "bg-rose-400/20", text: "text-rose-400", border: "border-rose-400/30" },
  { bg: "bg-sky-400/20", text: "text-sky-400", border: "border-sky-400/30" },
];

export function getTeamColor(teamNumber: number | null): { bg: string; text: string; border: string } {
  if (!teamNumber || teamNumber < 1) {
    return { bg: "bg-gray-500/20", text: "text-gray-500", border: "border-gray-500/30" };
  }
  // Use modulo to cycle through colors if team number exceeds 50
  const index = (teamNumber - 1) % TEAM_COLORS.length;
  return TEAM_COLORS[index];
}

export const mockParticipants: MockParticipant[] = [
  // Team 1
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
  // Team 2
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
  // Team 3
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
  // Team 4
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
    members: [],
    points: 100,
    wins: 2,
    losses: 0,
  },
  {
    position: 2,
    team_number: 2,
    members: [],
    points: 75,
    wins: 1,
    losses: 1,
  },
  {
    position: 3,
    team_number: 3,
    members: [],
    points: 50,
    wins: 0,
    losses: 1,
  },
  {
    position: 4,
    team_number: 4,
    members: [],
    points: 25,
    wins: 0,
    losses: 1,
  },
];

export function groupParticipantsByTeam(
  participants: MockParticipant[]
): MockTeam[] {
  const teamMap = new Map<number, MockParticipant[]>();

  participants.forEach((p) => {
    const existing = teamMap.get(p.team_number) || [];
    teamMap.set(p.team_number, [...existing, p]);
  });

  return Array.from(teamMap.entries())
    .map(([team_number, members]) => ({
      team_number,
      members,
    }))
    .sort((a, b) => a.team_number - b.team_number);
}
