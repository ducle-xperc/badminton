"use client";

import { useState } from "react";
import { resetTournament } from "@/lib/actions/tournament";

interface ResetTournamentButtonProps {
  tournamentId: string;
}

export function ResetTournamentButton({ tournamentId }: ResetTournamentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = async () => {
    setIsLoading(true);
    try {
      const result = await resetTournament(tournamentId);
      if (result.error) {
        alert(result.error);
      }
      setShowConfirm(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
        <p className="text-sm text-red-400 mb-3">
          Are you sure you want to reset the entire tournament? This will delete:
        </p>
        <ul className="text-xs text-red-300/80 mb-4 list-disc list-inside space-y-1">
          <li>All matches</li>
          <li>All participants</li>
          <li>All teams</li>
          <li>Rankings</li>
        </ul>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            disabled={isLoading}
            className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Confirm Reset"}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isLoading}
            className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
    >
      <span className="material-symbols-outlined text-xl">restart_alt</span>
      Reset Tournament
    </button>
  );
}
