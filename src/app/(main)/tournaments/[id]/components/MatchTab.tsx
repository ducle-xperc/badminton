import { getTournamentMatches, isOrganizer, getTeamStats } from "@/lib/actions/match";
import { getTournament } from "@/lib/actions/tournament";
import { GenerateMatchesButton } from "./GenerateMatchesButton";
import { EndTournamentButton } from "./EndTournamentButton";
import { RoundTabs } from "./RoundTabs";

interface MatchTabProps {
  tournamentId: string;
}

export async function MatchTab({ tournamentId }: MatchTabProps) {
  const [matchesResult, isOrganizerResult, tournamentResult, teamStats] = await Promise.all([
    getTournamentMatches(tournamentId),
    isOrganizer(tournamentId),
    getTournament(tournamentId),
    getTeamStats(tournamentId),
  ]);

  const matches = matchesResult.data || [];
  const tournament = tournamentResult.data;
  const canManage = isOrganizerResult && tournament?.status !== "completed";

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
          {/* Warning for incomplete teams */}
          {!bracketGenerated && teamStats.hasIncompleteTeams && (
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-yellow-400">
                  warning
                </span>
                <div>
                  <p className="text-yellow-400 font-medium">
                    Some teams are incomplete
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {teamStats.partialTeams > 0 &&
                      `${teamStats.partialTeams} teams short of members`}
                    {teamStats.partialTeams > 0 &&
                      teamStats.emptyTeams > 0 &&
                      ", "}
                    {teamStats.emptyTeams > 0 &&
                      `${teamStats.emptyTeams} empty teams`}
                    . You can still arrange the bracket.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!bracketGenerated && (
            <GenerateMatchesButton
              tournamentId={tournamentId}
              isFirstRound={true}
              teamStats={teamStats}
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
          <p className="text-green-400 font-medium">Tournament has ended!</p>
          <p className="text-sm text-gray-400 mt-1">
            View ranking results in the MVP tab
          </p>
        </div>
      )}

      {/* No Matches State */}
      {!hasMatches && (
        <div className="bg-card-dark/50 border border-white/5 rounded-xl p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-gray-500 mb-2">
            sports
          </span>
          <p className="text-gray-400">No matches yet</p>
          {canManage && !bracketGenerated && (
            <p className="text-sm text-gray-500 mt-2">
              Click &quot;Arrange Bracket&quot; to create the schedule
            </p>
          )}
        </div>
      )}

      {/* Matches by Round Tabs */}
      {hasMatches && <RoundTabs matches={matches} canManage={canManage} />}
    </div>
  );
}
