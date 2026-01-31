"use client";

import { mockMatches, getTeamColor } from "../data/mock-data";
import type { TournamentMatch, MatchRound } from "@/types/database";

interface MatchTabProps {
  tournamentId: string;
}

const roundLabels: Record<MatchRound, string> = {
  qualifier: "Qualifiers",
  quarterfinal: "Quarterfinals",
  semifinal: "Semifinals",
  final: "Final",
};

const roundOrder: MatchRound[] = ["qualifier", "quarterfinal", "semifinal", "final"];

export function MatchTab({ tournamentId }: MatchTabProps) {
  // Group matches by round
  const matchesByRound = mockMatches.reduce(
    (acc, match) => {
      if (!acc[match.round]) acc[match.round] = [];
      acc[match.round].push(match);
      return acc;
    },
    {} as Record<MatchRound, TournamentMatch[]>
  );

  const getMatchStatusStyles = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-500/30 bg-green-500/5";
      case "ongoing":
        return "border-primary/50 bg-primary/10";
      default:
        return "border-white/5 bg-card-dark/50";
    }
  };

  const hasMatches = mockMatches.length > 0;

  return (
    <div className="px-6 pb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Matches</h2>
        <span className="text-sm text-gray-400">{mockMatches.length} matches</span>
      </div>

      {!hasMatches ? (
        <div className="bg-card-dark/50 border border-white/5 rounded-xl p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-gray-500 mb-2">
            sports
          </span>
          <p className="text-gray-400">No matches scheduled yet</p>
        </div>
      ) : (
        roundOrder.map((round) => {
          const matches = matchesByRound[round];
          if (!matches?.length) return null;

          return (
            <div key={round} className="mb-6">
              {/* Round Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <h3 className="text-gold-accent font-bold text-sm uppercase tracking-wider">
                  {roundLabels[round]}
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>

              {/* Matches */}
              <div className="space-y-3">
                {matches.map((match) => {
                  const team1Colors = getTeamColor(match.team1_number);
                  const team2Colors = getTeamColor(match.team2_number);

                  return (
                    <div
                      key={match.id}
                      className={`rounded-xl border p-4 ${getMatchStatusStyles(match.status)}`}
                    >
                      <div className="flex items-center justify-between">
                        {/* Team 1 */}
                        <div className="flex-1 text-center">
                          <div className={`size-12 mx-auto mb-2 rounded-full ${team1Colors.bg} border ${team1Colors.border} flex items-center justify-center`}>
                            <span className={`${team1Colors.text} font-bold text-xl`}>
                              {match.team1_number ?? "?"}
                            </span>
                          </div>
                          <p className="text-white font-medium text-sm">
                            Team {match.team1_number ?? "TBD"}
                          </p>
                          {match.team1_score !== null && (
                            <p
                              className={`text-2xl font-bold mt-1 ${
                                match.winner_team_number === match.team1_number
                                  ? "text-green-500"
                                  : "text-gray-400"
                              }`}
                            >
                              {match.team1_score}
                            </p>
                          )}
                        </div>

                        {/* VS Divider */}
                        <div className="px-4">
                          <span className="text-gray-500 font-bold text-sm">VS</span>
                        </div>

                        {/* Team 2 */}
                        <div className="flex-1 text-center">
                          <div className={`size-12 mx-auto mb-2 rounded-full ${team2Colors.bg} border ${team2Colors.border} flex items-center justify-center`}>
                            <span className={`${team2Colors.text} font-bold text-xl`}>
                              {match.team2_number ?? "?"}
                            </span>
                          </div>
                          <p className="text-white font-medium text-sm">
                            Team {match.team2_number ?? "TBD"}
                          </p>
                          {match.team2_score !== null && (
                            <p
                              className={`text-2xl font-bold mt-1 ${
                                match.winner_team_number === match.team2_number
                                  ? "text-green-500"
                                  : "text-gray-400"
                              }`}
                            >
                              {match.team2_score}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Match Info Footer */}
                      {(match.scheduled_at || match.court) && (
                        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                          {match.court && (
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">
                                location_on
                              </span>
                              {match.court}
                            </span>
                          )}
                          {match.scheduled_at && (
                            <span>
                              {new Date(match.scheduled_at).toLocaleString("vi-VN", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
