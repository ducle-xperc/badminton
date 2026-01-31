"use client";

import { useState } from "react";
import { resetTournamentTeams } from "@/lib/actions/tournament";

interface ResetTeamsButtonProps {
  tournamentId: string;
}

export function ResetTeamsButton({ tournamentId }: ResetTeamsButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = async () => {
    setIsLoading(true);
    try {
      const result = await resetTournamentTeams(tournamentId);
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
      <div className="flex items-center gap-2">
        <span className="text-sm text-red-400">Xác nhận reset?</span>
        <button
          onClick={handleReset}
          disabled={isLoading}
          className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? "Đang xử lý..." : "Xác nhận"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isLoading}
          className="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          Hủy
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium rounded-lg transition-colors"
    >
      <span className="material-symbols-outlined text-base">restart_alt</span>
      Reset
    </button>
  );
}
