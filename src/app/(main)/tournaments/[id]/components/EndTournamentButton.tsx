"use client";

import { useState, useTransition } from "react";
import { endTournament } from "@/lib/actions/match";

interface EndTournamentButtonProps {
  tournamentId: string;
}

export function EndTournamentButton({ tournamentId }: EndTournamentButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleEnd = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await endTournament(tournamentId);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else if (result.success) {
        setMessage({ type: "success", text: result.success });
      }
      setShowConfirm(false);
    });
  };

  if (showConfirm) {
    return (
      <div className="flex flex-col gap-2 rounded-lg border border-yellow-600/50 bg-yellow-900/20 p-3">
        <p className="text-sm text-yellow-200">
          Are you sure you want to end the tournament? This action cannot be undone.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleEnd}
            disabled={isPending}
            className="flex-1 rounded bg-yellow-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-yellow-700 disabled:opacity-50"
          >
            {isPending ? "Processing..." : "Confirm"}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isPending}
            className="flex-1 rounded border border-zinc-700 px-3 py-1.5 text-sm text-zinc-400 hover:border-zinc-600"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center justify-center gap-2 rounded-lg border border-yellow-600 bg-yellow-600/10 px-4 py-2 text-sm font-medium text-yellow-400 transition-colors hover:bg-yellow-600/20"
      >
        <span className="material-symbols-outlined text-lg">flag</span>
        End Tournament
      </button>

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
