import { getTournamentTeams } from "@/lib/actions/draw";
import { isOrganizer } from "@/lib/actions/tournament";
import { getTeamColor } from "../data/mock-data";
import { ResetTeamsButton } from "./ResetTeamsButton";

interface TeamTabProps {
  tournamentId: string;
}

export async function TeamTab({ tournamentId }: TeamTabProps) {
  const [{ data: teams, error }, isOwner] = await Promise.all([
    getTournamentTeams(tournamentId),
    isOrganizer(tournamentId),
  ]);

  if (error) {
    return (
      <div className="px-6 pb-8">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <p className="text-red-400">Could not load list: {error}</p>
        </div>
      </div>
    );
  }

  const teamList = teams || [];

  return (
    <div className="px-6 pb-8 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-white">Teams</h2>
          <span className="text-sm text-gray-400">{teamList.length} teams</span>
        </div>
        {isOwner && <ResetTeamsButton tournamentId={tournamentId} />}
      </div>

      {teamList.length === 0 ? (
        <div className="bg-card-dark/50 border border-white/5 rounded-xl p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-gray-500 mb-2">
            group_off
          </span>
          <p className="text-gray-400">No teams yet</p>
        </div>
      ) : (
        teamList.map((team) => {
          const colors = getTeamColor(team.team_number);
          const members = team.members || [];

          return (
            <div
              key={team.id}
              className="bg-card-dark/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden"
            >
              {/* Team Header */}
              <div className={`${colors.bg} border-b border-white/5 px-5 py-3 flex items-center gap-3`}>
                <div className={`size-10 rounded-full ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                  <span className={`${colors.text} font-bold text-lg`}>{team.team_number}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold">Team {team.team_number}</h3>
                  <p className="text-xs text-gray-400">
                    {members.length} members
                    {team.is_full && " • Full"}
                  </p>
                </div>
              </div>

              {/* Team Members */}
              <div className="p-4">
                {members.length === 0 ? (
                  <div className="text-center py-4">
                    <span className="material-symbols-outlined text-2xl text-gray-600 mb-1">
                      person_add
                    </span>
                    <p className="text-sm text-gray-500">No members yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {members.map((member) => {
                      const displayName = member.profile?.nickname || member.profile?.email || "Unknown";
                      return (
                        <div key={member.id} className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-card-dark flex items-center justify-center overflow-hidden">
                            <span className="material-symbols-outlined text-gray-400 text-xl">
                              person
                            </span>
                          </div>
                          <span className="text-white text-sm">{displayName}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
