"use client";

import { useState, useTransition } from "react";
import { generateFirstRound, generateNextRound } from "@/lib/actions/match";
import type { TeamStats } from "@/lib/actions/match";

interface GenerateMatchesButtonProps {
  tournamentId: string;
  isFirstRound: boolean;
  teamStats?: TeamStats;
}

export function GenerateMatchesButton({
  tournamentId,
  isFirstRound,
  teamStats,
}: GenerateMatchesButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const executeGenerate = () => {
    setShowConfirm(false);
    setMessage(null);
    startTransition(async () => {
      const result = isFirstRound
        ? await generateFirstRound(tournamentId)
        : await generateNextRound(tournamentId);

      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else if (result.success) {
        setMessage({ type: "success", text: result.success });
      }
    });
  };

  const handleClick = () => {
    // If has incomplete teams and is first round, show confirmation
    if (isFirstRound && teamStats?.hasIncompleteTeams && !showConfirm) {
      setShowConfirm(true);
      return;
    }
    executeGenerate();
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleClick}
        disabled={isPending || showConfirm}
        className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-lg">
          {isFirstRound ? "shuffle" : "arrow_forward"}
        </span>
        {isPending
          ? "Processing..."
          : isFirstRound
            ? "Arrange teams"
            : "Create next round"}
      </button>

      {/* Confirmation dialog */}
      {showConfirm && (
        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <p className="text-sm text-yellow-400 mb-3">
            There are {teamStats?.partialTeams || 0} incomplete teams and{" "}
            {teamStats?.emptyTeams || 0} empty teams. Are you sure you want to continue?
          </p>
          <div className="flex gap-2">
            <button
              onClick={executeGenerate}
              disabled={isPending}
              className="px-3 py-1.5 text-sm bg-primary rounded-lg text-white font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {isPending ? "Processing..." : "Continue"}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isPending}
              className="px-3 py-1.5 text-sm bg-gray-700 rounded-lg text-gray-300 font-medium hover:bg-gray-600 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {message && (
        <p
          className={`text-sm ${
            message.type === "error" ? "text-red-400" : "text-green-400"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
