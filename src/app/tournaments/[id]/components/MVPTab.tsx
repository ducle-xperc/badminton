"use client";

import { mockRankings, mockParticipants, groupParticipantsByTeam, getTeamColor } from "../data/mock-data";

interface MVPTabProps {
  tournamentId: string;
}

export function MVPTab({ tournamentId }: MVPTabProps) {
  const teams = groupParticipantsByTeam(mockParticipants);
  const rankings = mockRankings.map((r) => ({
    ...r,
    members: teams.find((t) => t.team_number === r.team_number)?.members || [],
  }));

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 1:
        return { icon: "emoji_events", color: "text-gold-accent" };
      case 2:
        return { icon: "emoji_events", color: "text-gray-300" };
      case 3:
        return { icon: "emoji_events", color: "text-amber-600" };
      default:
        return { icon: "military_tech", color: "text-gray-500" };
    }
  };

  const getPositionStyles = (position: number) => {
    switch (position) {
      case 1:
        return "bg-gold-accent/20 border-gold-accent/50";
      case 2:
        return "bg-gray-300/10 border-gray-300/30";
      case 3:
        return "bg-amber-600/10 border-amber-600/30";
      default:
        return "bg-card-dark/50 border-white/5";
    }
  };

  if (rankings.length === 0) {
    return (
      <div className="px-6 pb-8">
        <h2 className="text-lg font-bold text-white mb-4">MVP Rankings</h2>
        <div className="bg-card-dark/50 border border-white/5 rounded-xl p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-gray-500 mb-2">
            leaderboard
          </span>
          <p className="text-gray-400">Rankings will be available after matches</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pb-8">
      {/* Podium for top 3 */}
      <div className="flex items-end justify-center gap-3 mb-8 h-52 mt-8">
        {/* 2nd Place */}
        {rankings[1] && (
          <div className="flex flex-col items-center">
            <div className="size-14 rounded-full bg-gray-300/20 border-2 border-gray-300 flex items-center justify-center mb-2">
              <span className="text-gray-300 font-bold text-xl">
                {rankings[1].team_number}
              </span>
            </div>
            <div className="w-20 h-24 bg-gradient-to-t from-gray-300/30 to-gray-300/10 rounded-t-lg flex flex-col items-center justify-center border-t border-x border-gray-300/30">
              <span className="text-2xl font-bold text-gray-300">2</span>
              <span className="text-xs text-gray-400">Silver</span>
            </div>
          </div>
        )}

        {/* 1st Place */}
        {rankings[0] && (
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-4xl text-gold-accent mb-1">
              emoji_events
            </span>
            <div className="size-16 rounded-full bg-gold-accent/30 border-2 border-gold-accent flex items-center justify-center mb-2">
              <span className="text-gold-accent font-bold text-2xl">
                {rankings[0].team_number}
              </span>
            </div>
            <div className="w-24 h-32 bg-gradient-to-t from-gold-accent/30 to-gold-accent/10 rounded-t-lg flex flex-col items-center justify-center border-t border-x border-gold-accent/30">
              <span className="text-3xl font-bold text-gold-accent">1</span>
              <span className="text-xs text-gold-accent">Champion</span>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {rankings[2] && (
          <div className="flex flex-col items-center">
            <div className="size-14 rounded-full bg-amber-600/20 border-2 border-amber-600 flex items-center justify-center mb-2">
              <span className="text-amber-600 font-bold text-xl">
                {rankings[2].team_number}
              </span>
            </div>
            <div className="w-20 h-20 bg-gradient-to-t from-amber-600/30 to-amber-600/10 rounded-t-lg flex flex-col items-center justify-center border-t border-x border-amber-600/30">
              <span className="text-2xl font-bold text-amber-600">3</span>
              <span className="text-xs text-amber-500">Bronze</span>
            </div>
          </div>
        )}
      </div>

      {/* Full Rankings List */}
      <div className="space-y-3">
        <h3 className="text-white font-bold mb-4">Full Rankings</h3>
        {rankings.map((ranking) => {
          const medal = getMedalIcon(ranking.position);
          const colors = getTeamColor(ranking.team_number);
          return (
            <div
              key={ranking.position}
              className={`rounded-xl border p-4 flex items-center gap-4 ${getPositionStyles(
                ranking.position
              )}`}
            >
              {/* Position */}
              <div className="w-8 text-center">
                <span className={`material-symbols-outlined text-2xl ${medal.color}`}>
                  {medal.icon}
                </span>
              </div>

              {/* Team Badge */}
              <div className={`size-12 rounded-full ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                <span className={`${colors.text} font-bold text-xl`}>{ranking.team_number}</span>
              </div>

              {/* Team Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold">Team {ranking.team_number}</p>
                <p className="text-xs text-gray-500 truncate">
                  {ranking.members.map((m) => m.user.name).join(", ") || "No members"}
                </p>
              </div>

              {/* Stats */}
              <div className="text-right flex-shrink-0">
                <p className="text-white font-bold">{ranking.points} pts</p>
                <p className="text-xs text-gray-500">
                  {ranking.wins}W / {ranking.losses}L
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
