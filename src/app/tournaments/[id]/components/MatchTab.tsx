import { getTournamentMatches, isOrganizer } from "@/lib/actions/match";
import { getTournament } from "@/lib/actions/tournament";
import { getTeamColor } from "../data/mock-data";
import type { TournamentMatch, BracketType } from "@/types/database";
import { GenerateMatchesButton } from "./GenerateMatchesButton";
import { EndTournamentButton } from "./EndTournamentButton";
import { MatchCard } from "./MatchCard";

interface MatchTabProps {
  tournamentId: string;
}

const bracketLabels: Record<BracketType, string> = {
  winners: "Winners Bracket",
  losers: "Losers Bracket",
  grand_final: "Grand Final",
};

const bracketOrder: BracketType[] = ["winners", "losers", "grand_final"];

export async function MatchTab({ tournamentId }: MatchTabProps) {
  const [matchesResult, isOrganizerResult, tournamentResult] = await Promise.all([
    getTournamentMatches(tournamentId),
    isOrganizer(tournamentId),
    getTournament(tournamentId),
  ]);

  const matches = matchesResult.data || [];
  const tournament = tournamentResult.data;
  const canManage = isOrganizerResult && tournament?.status !== "completed";

  // Group matches by bracket and round
  const matchesByBracket = matches.reduce(
    (acc, match) => {
      if (!acc[match.bracket]) acc[match.bracket] = {};
      if (!acc[match.bracket][match.round]) acc[match.bracket][match.round] = [];
      acc[match.bracket][match.round].push(match);
      return acc;
    },
    {} as Record<BracketType, Record<number, TournamentMatch[]>>
  );

  // Check tournament state
  const hasMatches = matches.length > 0;
  const bracketGenerated = tournament?.bracket_generated ?? false;
  const allMatchesCompleted = matches.length > 0 && matches.every((m) => m.status === "completed");
  const grandFinalCompleted = matches.some(
    (m) => m.bracket === "grand_final" && m.status === "completed"
  );

  // Show end tournament button only when grand final is completed
  const canEndTournament = canManage && grandFinalCompleted;

  // Show generate next round button when all current matches are completed but not at end
  const canGenerateNext = canManage && allMatchesCompleted && !grandFinalCompleted;

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

  return (
    <div className="px-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Matches</h2>
        <span className="text-sm text-gray-400">{matches.length} matches</span>
      </div>

      {/* Organizer Actions */}
      {canManage && (
        <div className="mb-6 space-y-3">
          {!bracketGenerated && (
            <GenerateMatchesButton
              tournamentId={tournamentId}
              isFirstRound={true}
            />
          )}

          {canGenerateNext && (
            <GenerateMatchesButton
              tournamentId={tournamentId}
              isFirstRound={false}
            />
          )}

          {canEndTournament && (
            <EndTournamentButton tournamentId={tournamentId} />
          )}
        </div>
      )}

      {/* Tournament Completed Banner */}
      {tournament?.status === "completed" && (
        <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-center">
          <span className="material-symbols-outlined text-3xl text-green-400 mb-2">
            emoji_events
          </span>
          <p className="text-green-400 font-medium">Giải đấu đã kết thúc!</p>
          <p className="text-sm text-gray-400 mt-1">
            Xem kết quả xếp hạng tại tab MVP
          </p>
        </div>
      )}

      {/* No Matches State */}
      {!hasMatches && (
        <div className="bg-card-dark/50 border border-white/5 rounded-xl p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-gray-500 mb-2">
            sports
          </span>
          <p className="text-gray-400">Chưa có trận đấu nào</p>
          {canManage && !bracketGenerated && (
            <p className="text-sm text-gray-500 mt-2">
              Nhấn &quot;Sắp xếp đội hình&quot; để tạo bracket
            </p>
          )}
        </div>
      )}

      {/* Matches by Bracket */}
      {hasMatches &&
        bracketOrder.map((bracket) => {
          const roundsMap = matchesByBracket[bracket];
          if (!roundsMap) return null;

          const rounds = Object.keys(roundsMap)
            .map(Number)
            .sort((a, b) => a - b);

          return (
            <div key={bracket} className="mb-8">
              {/* Bracket Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <h3
                  className={`font-bold text-sm uppercase tracking-wider ${
                    bracket === "winners"
                      ? "text-blue-400"
                      : bracket === "losers"
                        ? "text-orange-400"
                        : "text-gold-accent"
                  }`}
                >
                  {bracketLabels[bracket]}
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>

              {/* Rounds */}
              {rounds.map((round) => {
                const roundMatches = roundsMap[round];
                const isResetMatch = roundMatches.some((m) => m.is_reset_match);

                return (
                  <div key={`${bracket}-${round}`} className="mb-4">
                    {/* Round Label */}
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                      {bracket === "grand_final"
                        ? isResetMatch
                          ? "Reset Match"
                          : "Grand Final"
                        : `Round ${round}`}
                    </p>

                    {/* Matches */}
                    <div className="space-y-3">
                      {roundMatches.map((match) => (
                        <MatchCard
                          key={match.id}
                          match={match}
                          canEdit={canManage && match.status !== "completed"}
                          getTeamColor={getTeamColor}
                          getMatchStatusStyles={getMatchStatusStyles}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
    </div>
  );
}
