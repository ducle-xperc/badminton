"use client";

import { mockParticipants, getTeamColor } from "../data/mock-data";

interface ParticipantTabProps {
  tournamentId: string;
}

export function ParticipantTab({ tournamentId }: ParticipantTabProps) {
  // In future: fetch from API using tournamentId
  const participants = mockParticipants;

  return (
    <div className="px-6 pb-8 space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Participants</h2>
        <span className="text-sm text-gray-400">{participants.length} registered</span>
      </div>

      {participants.length === 0 ? (
        <div className="bg-card-dark/50 border border-white/5 rounded-xl p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-gray-500 mb-2">
            person_off
          </span>
          <p className="text-gray-400">No participants yet</p>
        </div>
      ) : (
        participants.map((participant) => {
          const colors = getTeamColor(participant.team_number);
          return (
            <div
              key={participant.id}
              className="bg-card-dark/50 border border-white/5 rounded-xl p-4 flex items-center gap-4"
            >
              {/* Avatar */}
              <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                {participant.user.avatar_url ? (
                  <img
                    src={participant.user.avatar_url}
                    alt={participant.user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-primary">person</span>
                )}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{participant.user.name}</p>
                <p className="text-xs text-gray-500 truncate">{participant.user.email}</p>
              </div>

              {/* Team Badge */}
              <div className={`px-3 py-1.5 rounded-full ${colors.bg} border ${colors.border} flex-shrink-0`}>
                <span className={`${colors.text} text-sm font-bold`}>
                  Team {participant.team_number}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
