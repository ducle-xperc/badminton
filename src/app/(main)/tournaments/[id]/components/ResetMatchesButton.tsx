"use client";

import { useState, useTransition } from "react";
import { resetAllMatches } from "@/lib/actions/match";

interface ResetMatchesButtonProps {
  tournamentId: string;
}

export function ResetMatchesButton({ tournamentId }: ResetMatchesButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = () => {
    setError(null);
    startTransition(async () => {
      const result = await resetAllMatches(tournamentId);
      if (result.error) {
        setError(result.error);
        setShowConfirm(false);
      } else {
        setShowConfirm(false);
      }
    });
  };

  if (showConfirm) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-red-400">warning</span>
          <div className="flex-1">
            <p className="text-red-400 font-medium">Reset all matches?</p>
            <p className="text-sm text-gray-400 mt-1">
              This will delete all matches and rankings. You can then generate a new bracket.
            </p>
            {error && (
              <p className="text-sm text-red-400 mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span>
                {error}
              </p>
            )}
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleReset}
                disabled={isPending}
                className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white
                  hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                {isPending ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">
                      progress_activity
                    </span>
                    Resetting...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">check</span>
                    Confirm Reset
                  </>
                )}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400
                  hover:border-white/20 hover:text-white disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400
        hover:border-red-500/50 hover:bg-red-500/20 transition-colors w-full justify-center"
    >
      <span className="material-symbols-outlined text-xl">restart_alt</span>
      <span className="font-medium">Reset Matches</span>
    </button>
  );
}
