"use client";

import { useState, useTransition } from "react";
import {
  awardTournamentAchievements,
  revokeAllTournamentAchievements,
} from "@/lib/actions/achievement";

interface AchievementActionsProps {
  tournamentId: string;
  hasAchievements: boolean;
  achievementCount: number;
}

export function AchievementActions({
  tournamentId,
  hasAchievements,
  achievementCount,
}: AchievementActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentHasAchievements, setCurrentHasAchievements] =
    useState(hasAchievements);
  const [currentCount, setCurrentCount] = useState(achievementCount);

  const handleAward = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await awardTournamentAchievements(tournamentId);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else if (result.success) {
        setMessage({ type: "success", text: result.success });
        setCurrentHasAchievements(true);
        setCurrentCount(result.awardedCount ?? 0);
      }
    });
  };

  const handleRevoke = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await revokeAllTournamentAchievements(tournamentId);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else if (result.success) {
        setMessage({ type: "success", text: result.success });
        setCurrentHasAchievements(false);
        setCurrentCount(0);
      }
      setShowConfirm(false);
    });
  };

  // Revoke confirmation dialog
  if (showConfirm) {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
        <p className="text-sm text-red-200">
          Are you sure you want to revoke {currentCount} achievements? Users
          will lose their earned medals.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleRevoke}
            disabled={isPending}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {isPending ? "Revoking..." : "Confirm Revoke"}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isPending}
            className="flex-1 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 hover:border-white/20 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Show revoke button if achievements exist
  if (currentHasAchievements) {
    return (
      <div className="flex flex-col gap-3">
        {/* Status indicator */}
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <span className="material-symbols-outlined text-lg">verified</span>
          {currentCount} achievements awarded
        </div>

        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
        >
          <span className="material-symbols-outlined text-lg">delete</span>
          Revoke All Achievements
        </button>

        {message && (
          <p
            className={`text-sm ${message.type === "error" ? "text-red-400" : "text-green-400"}`}
          >
            {message.text}
          </p>
        )}
      </div>
    );
  }

  // Show award button
  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleAward}
        disabled={isPending}
        className="flex items-center justify-center gap-2 rounded-xl border border-gold-accent/50 bg-gold-accent/20 px-4 py-3 text-sm font-medium text-gold-accent transition-colors hover:bg-gold-accent/30 disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-lg">emoji_events</span>
        {isPending ? "Awarding..." : "Award Achievements"}
      </button>

      {message && (
        <p
          className={`text-sm ${message.type === "error" ? "text-red-400" : "text-green-400"}`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
