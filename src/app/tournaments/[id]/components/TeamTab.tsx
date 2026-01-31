"use client";

import { mockParticipants, groupParticipantsByTeam, getTeamColor } from "../data/mock-data";

interface TeamTabProps {
  tournamentId: string;
}

export function TeamTab({ tournamentId }: TeamTabProps) {
  const teams = groupParticipantsByTeam(mockParticipants);

  return (
    <div className="px-6 pb-8 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Teams</h2>
        <span className="text-sm text-gray-400">{teams.length} teams</span>
      </div>

      {teams.length === 0 ? (
        <div className="bg-card-dark/50 border border-white/5 rounded-xl p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-gray-500 mb-2">
            group_off
          </span>
          <p className="text-gray-400">No teams formed yet</p>
        </div>
      ) : (
        teams.map((team) => {
          const colors = getTeamColor(team.team_number);
          return (
            <div
              key={team.team_number}
              className="bg-card-dark/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden"
            >
              {/* Team Header */}
              <div className={`${colors.bg} border-b border-white/5 px-5 py-3 flex items-center gap-3`}>
                <div className={`size-10 rounded-full ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                  <span className={`${colors.text} font-bold text-lg`}>{team.team_number}</span>
                </div>
                <div>
                  <h3 className="text-white font-bold">Team {team.team_number}</h3>
                  <p className="text-xs text-gray-400">{team.members.length} members</p>
                </div>
              </div>

              {/* Team Members */}
              <div className="p-4 space-y-3">
                {team.members.map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-card-dark flex items-center justify-center overflow-hidden">
                      {member.user.avatar_url ? (
                        <img
                          src={member.user.avatar_url}
                          alt={member.user.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-gray-400 text-xl">
                          person
                        </span>
                      )}
                    </div>
                    <span className="text-white text-sm">{member.user.name}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
