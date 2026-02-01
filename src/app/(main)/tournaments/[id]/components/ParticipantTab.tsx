import { getTournamentParticipants } from "@/lib/actions/draw";
import { getTeamColor } from "../data/mock-data";

interface ParticipantTabProps {
  tournamentId: string;
}

export async function ParticipantTab({ tournamentId }: ParticipantTabProps) {
  const { data: participants, error } = await getTournamentParticipants(tournamentId);

  if (error) {
    return (
      <div className="px-6 pb-8">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <p className="text-red-400">Could not load list: {error}</p>
        </div>
      </div>
    );
  }

  const participantList = participants || [];

  return (
    <div className="px-6 pb-8 space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Participants</h2>
        <span className="text-sm text-gray-400">{participantList.length} registered</span>
      </div>

      {participantList.length === 0 ? (
        <div className="bg-card-dark/50 border border-white/5 rounded-xl p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-gray-500 mb-2">
            person_off
          </span>
          <p className="text-gray-400">No participants yet</p>
        </div>
      ) : (
        participantList.map((participant) => {
          const hasTeam = participant.team_number !== null;
          const colors = hasTeam
            ? getTeamColor(participant.team_number)
            : { bg: "bg-gray-500/20", text: "text-gray-400", border: "border-gray-500/30" };
          const displayName = participant.profile?.nickname || participant.profile?.email || "Unknown";

          return (
            <div
              key={participant.id}
              className="bg-card-dark/50 border border-white/5 rounded-xl p-4 flex items-center gap-4"
            >
              {/* Avatar */}
              <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                <span className="material-symbols-outlined text-primary">person</span>
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{displayName}</p>
                <p className="text-xs text-gray-500 truncate">{participant.profile?.email}</p>
              </div>

              {/* Team Badge */}
              <div className={`px-3 py-1.5 rounded-full ${colors.bg} border ${colors.border} flex-shrink-0`}>
                <span className={`${colors.text} text-sm font-bold`}>
                  {hasTeam ? `Team ${participant.team_number}` : "No team"}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
