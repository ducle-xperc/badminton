"use client";

import { useState } from "react";
import type { TournamentMatch, BracketType } from "@/types/database";
import { MatchCard } from "./MatchCard";

interface RoundTabsProps {
  matches: TournamentMatch[];
  canManage: boolean;
}

interface RoundInfo {
  id: string;
  label: string;
  bracket: BracketType;
  round: number;
  matches: TournamentMatch[];
}

function getRoundLabel(bracket: BracketType, round: number, isResetMatch: boolean): string {
  if (bracket === "grand_final") {
    return isResetMatch ? "Reset Match" : "Grand Final";
  }
  const prefix = bracket === "winners" ? "WB" : "LB";
  return `${prefix} R${round}`;
}

function getAllRounds(matches: TournamentMatch[]): RoundInfo[] {
  const roundsMap = new Map<string, RoundInfo>();

  matches.forEach((match) => {
    const isResetMatch = match.is_reset_match;
    const label = getRoundLabel(match.bracket, match.round, isResetMatch);
    const id = `${match.bracket}-${match.round}${isResetMatch ? "-reset" : ""}`;

    if (!roundsMap.has(id)) {
      roundsMap.set(id, {
        id,
        label,
        bracket: match.bracket,
        round: match.round,
        matches: [],
      });
    }
    roundsMap.get(id)!.matches.push(match);
  });

  // Sort: WB rounds first, then LB, then Grand Final
  const bracketOrder: Record<BracketType, number> = {
    winners: 0,
    losers: 1,
    grand_final: 2,
  };

  return Array.from(roundsMap.values()).sort((a, b) => {
    // First by bracket
    const bracketDiff = bracketOrder[a.bracket] - bracketOrder[b.bracket];
    if (bracketDiff !== 0) return bracketDiff;
    // Then by round number
    return a.round - b.round;
  });
}

export function RoundTabs({ matches, canManage }: RoundTabsProps) {
  const allRounds = getAllRounds(matches);
  const [activeRoundId, setActiveRoundId] = useState(
    allRounds.length > 0 ? allRounds[allRounds.length - 1].id : ""
  );

  const activeRound = allRounds.find((r) => r.id === activeRoundId);

  if (allRounds.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Round Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 border-b border-white/10 scrollbar-hide">
        {allRounds.map((round) => {
          const isActive = activeRoundId === round.id;
          const completedCount = round.matches.filter(
            (m) => m.status === "completed"
          ).length;
          const allCompleted = completedCount === round.matches.length;

          return (
            <button
              key={round.id}
              onClick={() => setActiveRoundId(round.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                isActive
                  ? round.bracket === "winners"
                    ? "bg-blue-500 text-white"
                    : round.bracket === "losers"
                      ? "bg-orange-500 text-white"
                      : "bg-gold-accent text-black"
                  : "bg-card-dark text-gray-400 hover:bg-card-dark/80"
              }`}
            >
              {round.label}
              {allCompleted && (
                <span className="material-symbols-outlined text-sm">
                  check_circle
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Round Matches */}
      {activeRound && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">
              {activeRound.matches.length} matches
            </p>
            <p className="text-xs text-gray-500">
              {activeRound.matches.filter((m) => m.status === "completed").length}/
              {activeRound.matches.length} completed
            </p>
          </div>
          {activeRound.matches
            .sort((a, b) => a.match_number - b.match_number)
            .map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                canEdit={canManage}
              />
            ))}
        </div>
      )}
    </div>
  );
}
