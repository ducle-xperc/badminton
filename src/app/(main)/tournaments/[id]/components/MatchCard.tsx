"use client";

import type { TournamentMatch } from "@/types/database";
import { ScoreEditForm } from "./ScoreEditForm";
import { getTeamColor } from "../data/mock-data";

interface MatchCardProps {
  match: TournamentMatch;
  canEdit: boolean;
}

function getMatchStatusStyles(status: string, isByeMatch: boolean): string {
  if (isByeMatch) {
    return "border-yellow-500/30 bg-yellow-500/5";
  }
  switch (status) {
    case "completed":
      return "border-green-500/30 bg-green-500/5";
    case "ongoing":
      return "border-primary/50 bg-primary/10";
    default:
      return "border-white/5 bg-card-dark/50";
  }
}

export function MatchCard({ match, canEdit }: MatchCardProps) {
  const team1Colors = getTeamColor(match.team1_number);
  const team2Colors = getTeamColor(match.team2_number);
  const isByeMatch = match.team2_number === null;
  const isCompleted = match.status === "completed";

  return (
    <div
      className={`rounded-xl border p-4 ${getMatchStatusStyles(match.status, isByeMatch)}`}
    >
      {/* BYE Banner */}
      {isByeMatch && (
        <div className="flex items-center justify-center gap-2 mb-3 pb-3 border-b border-yellow-500/20">
          <span className="material-symbols-outlined text-yellow-500 text-sm">
            skip_next
          </span>
          <span className="text-yellow-500 text-xs font-medium uppercase tracking-wide">
            Được miễn đấu vòng này
          </span>
        </div>
      )}

      <div className="flex items-center justify-between">
        {/* Team 1 */}
        <div className="flex-1 text-center">
          <div
            className={`size-12 mx-auto mb-2 rounded-full ${team1Colors.bg} border ${team1Colors.border} flex items-center justify-center`}
          >
            <span className={`${team1Colors.text} font-bold text-xl`}>
              {match.team1_number ?? "?"}
            </span>
          </div>
          <p className="text-white font-medium text-sm">
            Team {match.team1_number ?? "TBD"}
          </p>
          {/* Score display */}
          {match.team1_score !== null && !isByeMatch && (
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
          {/* Bye winner indicator */}
          {isByeMatch && (
            <div className="mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                <span className="material-symbols-outlined text-xs">check_circle</span>
                Thắng
              </span>
            </div>
          )}
        </div>

        {/* VS Divider */}
        <div className="px-4 flex flex-col items-center">
          {isByeMatch ? (
            <div className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-yellow-500 text-2xl">
                double_arrow
              </span>
              <span className="text-yellow-500 font-bold text-xs">BYE</span>
            </div>
          ) : (
            <>
              <span className="text-gray-500 font-bold text-sm">VS</span>
              {isCompleted && match.winner_team_number && (
                <span className="material-symbols-outlined text-green-500 text-sm mt-1">
                  check_circle
                </span>
              )}
            </>
          )}
        </div>

        {/* Team 2 or BYE */}
        <div className="flex-1 text-center">
          {isByeMatch ? (
            <>
              <div className="size-12 mx-auto mb-2 rounded-full bg-gray-800/50 border border-dashed border-gray-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-gray-500 text-xl">
                  block
                </span>
              </div>
              <p className="text-gray-500 font-medium text-sm">Không có đối thủ</p>
            </>
          ) : (
            <>
              <div
                className={`size-12 mx-auto mb-2 rounded-full ${team2Colors.bg} border ${team2Colors.border} flex items-center justify-center`}
              >
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
            </>
          )}
        </div>
      </div>

      {/* Score Edit Form - Now allows editing completed matches too */}
      {canEdit && match.team1_number !== null && match.team2_number !== null && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <ScoreEditForm
            matchId={match.id}
            team1Number={match.team1_number}
            team2Number={match.team2_number}
            initialTeam1Score={match.team1_score}
            initialTeam2Score={match.team2_score}
            isCompleted={isCompleted}
          />
        </div>
      )}

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
}
