"use client";

import { useState, useMemo } from "react";
import type { TournamentMatch, BracketType } from "@/types/database";
import { MatchCard } from "./MatchCard";

interface RoundTabsProps {
  matches: TournamentMatch[];
  canManage: boolean;
  teamMembersMap: Map<number, string[]>;
}

interface RoundInfo {
  id: string;
  label: string;
  bracket: BracketType;
  round: number;
  matches: TournamentMatch[];
}

interface BracketInfo {
  bracket: BracketType;
  label: string;
  icon: string;
  rounds: RoundInfo[];
  completedRounds: number;
  totalRounds: number;
}

const BRACKET_CONFIG: Record<
  BracketType,
  { label: string; icon: string; order: number }
> = {
  winners: { label: "Winner's Bracket", icon: "trophy", order: 0 },
  losers: { label: "Loser's Bracket", icon: "sports", order: 1 },
  grand_final: { label: "Grand Final", icon: "emoji_events", order: 2 },
};

function getRoundLabel(
  bracket: BracketType,
  round: number,
  isResetMatch: boolean
): string {
  if (bracket === "grand_final") {
    return isResetMatch ? "Reset" : "Final";
  }
  return `R${round}`;
}

function groupByBracket(matches: TournamentMatch[]): BracketInfo[] {
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

  const allRounds = Array.from(roundsMap.values());

  // Group rounds by bracket
  const bracketMap = new Map<BracketType, RoundInfo[]>();
  allRounds.forEach((round) => {
    if (!bracketMap.has(round.bracket)) {
      bracketMap.set(round.bracket, []);
    }
    bracketMap.get(round.bracket)!.push(round);
  });

  // Sort rounds within each bracket
  bracketMap.forEach((rounds) => {
    rounds.sort((a, b) => a.round - b.round);
  });

  // Create bracket info array
  const brackets: BracketInfo[] = [];
  (["winners", "losers", "grand_final"] as BracketType[]).forEach((bracket) => {
    const rounds = bracketMap.get(bracket) || [];
    if (rounds.length > 0) {
      const completedRounds = rounds.filter((r) =>
        r.matches.every((m) => m.status === "completed")
      ).length;

      brackets.push({
        bracket,
        label: BRACKET_CONFIG[bracket].label,
        icon: BRACKET_CONFIG[bracket].icon,
        rounds,
        completedRounds,
        totalRounds: rounds.length,
      });
    }
  });

  return brackets;
}

function findDefaultExpanded(brackets: BracketInfo[]): BracketType | null {
  // Find bracket with first incomplete round
  for (const b of brackets) {
    const hasIncomplete = b.rounds.some((r) =>
      r.matches.some((m) => m.status !== "completed")
    );
    if (hasIncomplete) return b.bracket;
  }
  // If all completed, show last bracket
  return brackets.length > 0 ? brackets[brackets.length - 1].bracket : null;
}

function findDefaultRound(brackets: BracketInfo[]): string | null {
  // Find first incomplete round across all brackets
  for (const b of brackets) {
    for (const r of b.rounds) {
      if (r.matches.some((m) => m.status !== "completed")) {
        return r.id;
      }
    }
  }
  // If all completed, show last round
  const lastBracket = brackets[brackets.length - 1];
  if (lastBracket) {
    return lastBracket.rounds[lastBracket.rounds.length - 1]?.id ?? null;
  }
  return null;
}

interface BracketSectionProps {
  bracketInfo: BracketInfo;
  isExpanded: boolean;
  onToggle: () => void;
  activeRoundId: string | null;
  onRoundSelect: (roundId: string) => void;
  canManage: boolean;
  teamMembersMap: Map<number, string[]>;
}

function BracketSection({
  bracketInfo,
  isExpanded,
  onToggle,
  activeRoundId,
  onRoundSelect,
  canManage,
  teamMembersMap,
}: BracketSectionProps) {
  const { bracket, label, icon, rounds, completedRounds, totalRounds } =
    bracketInfo;

  const activeRound = rounds.find((r) => r.id === activeRoundId);
  const allCompleted = completedRounds === totalRounds;

  const headerStyles: Record<BracketType, string> = {
    winners:
      "bg-gradient-to-r from-blue-500/20 to-blue-500/10 border-blue-500/30",
    losers:
      "bg-gradient-to-r from-orange-500/20 to-orange-500/10 border-orange-500/30",
    grand_final:
      "bg-gradient-to-r from-gold-accent/20 to-gold-accent/10 border-gold-accent/30",
  };

  const iconColors: Record<BracketType, string> = {
    winners: "text-blue-400",
    losers: "text-orange-400",
    grand_final: "text-gold-accent",
  };

  const pillStyles: Record<BracketType, { active: string; inactive: string }> =
    {
      winners: {
        active: "bg-blue-500 text-white",
        inactive:
          "bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20",
      },
      losers: {
        active: "bg-orange-500 text-white",
        inactive:
          "bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500/20",
      },
      grand_final: {
        active: "bg-gold-accent text-black",
        inactive:
          "bg-gold-accent/10 text-gold-accent border border-gold-accent/30 hover:bg-gold-accent/20",
      },
    };

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-all ${headerStyles[bracket]}`}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between"
        aria-expanded={isExpanded}
        aria-controls={`bracket-${bracket}-content`}
      >
        <div className="flex items-center gap-3">
          <span className={`material-symbols-outlined ${iconColors[bracket]}`}>
            {icon}
          </span>
          <span className="font-medium text-white">{label}</span>
          {allCompleted && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
              Completed
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            {completedRounds}/{totalRounds}
          </span>
          <span
            className={`material-symbols-outlined text-gray-400 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            expand_more
          </span>
        </div>
      </button>

      {/* Content */}
      {isExpanded && (
        <div
          id={`bracket-${bracket}-content`}
          className="border-t border-white/10"
        >
          {/* Round Pills */}
          <div className="flex flex-wrap gap-2 p-3 bg-black/20">
            {rounds.map((round) => {
              const isActive = activeRoundId === round.id;
              const roundCompleted = round.matches.every(
                (m) => m.status === "completed"
              );

              return (
                <button
                  key={round.id}
                  onClick={() => onRoundSelect(round.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? pillStyles[bracket].active
                      : pillStyles[bracket].inactive
                  }`}
                >
                  {round.label}
                  {roundCompleted && (
                    <span className="material-symbols-outlined text-xs">
                      check_circle
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Match Cards */}
          {activeRound && (
            <div className="p-3 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <p className="text-gray-400">
                  {activeRound.label} - {activeRound.matches.length} matches
                </p>
                <p className="text-gray-500">
                  {
                    activeRound.matches.filter((m) => m.status === "completed")
                      .length
                  }
                  /{activeRound.matches.length} completed
                </p>
              </div>
              {activeRound.matches
                .sort((a, b) => a.match_number - b.match_number)
                .map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    canEdit={canManage}
                    teamMembersMap={teamMembersMap}
                  />
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function RoundTabs({ matches, canManage, teamMembersMap }: RoundTabsProps) {
  const brackets = useMemo(() => groupByBracket(matches), [matches]);

  const [expandedBracket, setExpandedBracket] = useState<BracketType | null>(
    () => findDefaultExpanded(brackets)
  );

  const [activeRoundId, setActiveRoundId] = useState<string | null>(() =>
    findDefaultRound(brackets)
  );

  if (brackets.length === 0) {
    return null;
  }

  const handleToggle = (bracket: BracketType) => {
    if (expandedBracket === bracket) {
      setExpandedBracket(null);
    } else {
      setExpandedBracket(bracket);
      // Auto-select first round of newly expanded bracket
      const bracketInfo = brackets.find((b) => b.bracket === bracket);
      if (bracketInfo && bracketInfo.rounds.length > 0) {
        // Find first incomplete round in this bracket, or last round
        const firstIncomplete = bracketInfo.rounds.find((r) =>
          r.matches.some((m) => m.status !== "completed")
        );
        setActiveRoundId(
          firstIncomplete?.id ?? bracketInfo.rounds[bracketInfo.rounds.length - 1].id
        );
      }
    }
  };

  const handleRoundSelect = (roundId: string) => {
    setActiveRoundId(roundId);
  };

  return (
    <div className="space-y-3">
      {brackets.map((bracketInfo) => (
        <BracketSection
          key={bracketInfo.bracket}
          bracketInfo={bracketInfo}
          isExpanded={expandedBracket === bracketInfo.bracket}
          onToggle={() => handleToggle(bracketInfo.bracket)}
          activeRoundId={
            expandedBracket === bracketInfo.bracket ? activeRoundId : null
          }
          onRoundSelect={handleRoundSelect}
          canManage={canManage}
          teamMembersMap={teamMembersMap}
        />
      ))}
    </div>
  );
}
