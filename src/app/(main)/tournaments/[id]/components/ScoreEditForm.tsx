"use client";

import { useState, useTransition } from "react";
import { updateMatchScore } from "@/lib/actions/match";
import { getTeamColor } from "../data/mock-data";

interface ScoreEditFormProps {
  matchId: string;
  team1Number: number;
  team2Number: number;
  initialTeam1Score: number | null;
  initialTeam2Score: number | null;
  isCompleted?: boolean;
  onSuccess?: () => void;
}

export function ScoreEditForm({
  matchId,
  team1Number,
  team2Number,
  initialTeam1Score,
  initialTeam2Score,
  isCompleted = false,
  onSuccess,
}: ScoreEditFormProps) {
  const [isPending, startTransition] = useTransition();
  const [team1Score, setTeam1Score] = useState(initialTeam1Score?.toString() ?? "");
  const [team2Score, setTeam2Score] = useState(initialTeam2Score?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const team1Colors = getTeamColor(team1Number);
  const team2Colors = getTeamColor(team2Number);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const score1 = parseInt(team1Score, 10);
    const score2 = parseInt(team2Score, 10);

    if (isNaN(score1) || isNaN(score2)) {
      setError("Vui lòng nhập điểm hợp lệ");
      return;
    }

    if (score1 < 0 || score2 < 0) {
      setError("Điểm không thể âm");
      return;
    }

    if (score1 === score2) {
      setError("Không được hòa");
      return;
    }

    startTransition(async () => {
      const result = await updateMatchScore(matchId, score1, score2);
      if (result.error) {
        setError(result.error);
      } else {
        setIsEditing(false);
        onSuccess?.();
      }
    });
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className={`flex items-center gap-2 text-sm transition-colors mx-auto ${
          isCompleted
            ? "text-gray-400 hover:text-white"
            : "text-primary hover:text-primary/80"
        }`}
      >
        <span className="material-symbols-outlined text-base">
          {isCompleted ? "edit" : "add_circle"}
        </span>
        {isCompleted ? "Sửa điểm" : "Nhập điểm"}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Score Inputs */}
      <div className="flex items-center justify-center gap-4">
        {/* Team 1 Score */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={`size-8 rounded-full ${team1Colors.bg} border ${team1Colors.border} flex items-center justify-center`}
          >
            <span className={`${team1Colors.text} font-bold text-sm`}>
              {team1Number}
            </span>
          </div>
          <input
            type="number"
            min="0"
            value={team1Score}
            onChange={(e) => setTeam1Score(e.target.value)}
            className={`w-16 h-12 rounded-xl border-2 bg-card-dark text-center text-xl font-bold text-white
              focus:outline-none transition-colors
              ${team1Score && team2Score && parseInt(team1Score) > parseInt(team2Score)
                ? "border-green-500 bg-green-500/10"
                : "border-white/10 focus:border-primary"
              }`}
            placeholder="0"
          />
        </div>

        {/* Divider */}
        <div className="flex flex-col items-center">
          <span className="text-gray-500 font-bold text-lg">:</span>
        </div>

        {/* Team 2 Score */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={`size-8 rounded-full ${team2Colors.bg} border ${team2Colors.border} flex items-center justify-center`}
          >
            <span className={`${team2Colors.text} font-bold text-sm`}>
              {team2Number}
            </span>
          </div>
          <input
            type="number"
            min="0"
            value={team2Score}
            onChange={(e) => setTeam2Score(e.target.value)}
            className={`w-16 h-12 rounded-xl border-2 bg-card-dark text-center text-xl font-bold text-white
              focus:outline-none transition-colors
              ${team2Score && team1Score && parseInt(team2Score) > parseInt(team1Score)
                ? "border-green-500 bg-green-500/10"
                : "border-white/10 focus:border-primary"
              }`}
            placeholder="0"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-center text-sm text-red-400 flex items-center justify-center gap-1">
          <span className="material-symbols-outlined text-sm">error</span>
          {error}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending || !team1Score || !team2Score}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white
            hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? (
            <>
              <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
              Đang lưu...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm">check</span>
              Lưu điểm
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsEditing(false);
            setError(null);
            setTeam1Score(initialTeam1Score?.toString() ?? "");
            setTeam2Score(initialTeam2Score?.toString() ?? "");
          }}
          disabled={isPending}
          className="flex items-center justify-center gap-1 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-gray-400
            hover:border-white/20 hover:text-white disabled:opacity-50 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">close</span>
          Hủy
        </button>
      </div>
    </form>
  );
}
