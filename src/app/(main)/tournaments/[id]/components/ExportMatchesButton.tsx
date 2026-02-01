"use client";

import { useState } from "react";
import { TournamentMatch } from "@/types/database";

interface ExportMatchesButtonProps {
  matches: TournamentMatch[];
  tournamentName?: string;
}

type BracketType = "winners" | "losers" | "grand_final";

const BRACKET_LABELS: Record<BracketType, string> = {
  winners: "Winner's Bracket",
  losers: "Loser's Bracket",
  grand_final: "Grand Final",
};

export function ExportMatchesButton({ matches, tournamentName = "Tournament" }: ExportMatchesButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = () => {
    setIsExporting(true);

    try {
      // Group matches by bracket and round
      const groupedMatches = matches.reduce((acc, match) => {
        const bracket = match.bracket as BracketType;
        const round = match.round;
        const key = `${bracket}-${round}`;
        
        if (!acc[key]) {
          acc[key] = {
            bracket,
            round,
            matches: [],
          };
        }
        acc[key].matches.push(match);
        return acc;
      }, {} as Record<string, { bracket: BracketType; round: number; matches: TournamentMatch[] }>);

      // Sort groups by bracket order then round
      const bracketOrder: BracketType[] = ["winners", "losers", "grand_final"];
      const sortedGroups = Object.values(groupedMatches).sort((a, b) => {
        const orderA = bracketOrder.indexOf(a.bracket);
        const orderB = bracketOrder.indexOf(b.bracket);
        if (orderA !== orderB) return orderA - orderB;
        return a.round - b.round;
      });

      // Build CSV content
      const csvRows: string[] = [];
      
      // Header
      csvRows.push("Bracket,Round,Match,Team 1,Team 2,Score,Winner,Status,Type");

      for (const group of sortedGroups) {
        const bracketLabel = BRACKET_LABELS[group.bracket];
        
        // Sort matches by match_number
        const sortedMatches = group.matches.sort((a, b) => a.match_number - b.match_number);

        for (const match of sortedMatches) {
          const isBye = match.team2_number === null;
          const team1 = `Team ${match.team1_number}`;
          const team2 = isBye ? "BYE" : `Team ${match.team2_number}`;
          
          let score = "";
          if (!isBye && match.team1_score !== null && match.team2_score !== null) {
            score = `${match.team1_score} - ${match.team2_score}`;
          } else if (isBye) {
            score = "N/A";
          }

          const winner = match.winner_team_number 
            ? `Team ${match.winner_team_number}` 
            : "";
          
          const status = match.status === "completed"
            ? "Completed"
            : match.status === "ongoing"
              ? "In Progress"
              : "Upcoming";

          const matchType = isBye 
            ? "Bye" 
            : match.is_reset_match 
              ? "Reset Match" 
              : "Regular";

          csvRows.push(
            `"${bracketLabel}","Round ${group.round}","Match ${match.match_number}","${team1}","${team2}","${score}","${winner}","${status}","${matchType}"`
          );
        }
      }

      // Create and download file
      const csvContent = csvRows.join("\n");
      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${tournamentName.replace(/[^a-zA-Z0-9]/g, "_")}_matches.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  if (matches.length === 0) {
    return null;
  }

  return (
    <button
      onClick={exportToCSV}
      disabled={isExporting}
      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors disabled:opacity-50"
    >
      <span className="material-symbols-outlined text-base">download</span>
      Export CSV
    </button>
  );
}
