"use client";

import { useState, useTransition } from "react";
import { updateMatchScore } from "@/lib/actions/match";

interface ScoreEditFormProps {
  matchId: string;
  team1Number: number;
  team2Number: number;
  initialTeam1Score: number | null;
  initialTeam2Score: number | null;
  onSuccess?: () => void;
}

export function ScoreEditForm({
  matchId,
  team1Number,
  team2Number,
  initialTeam1Score,
  initialTeam2Score,
  onSuccess,
}: ScoreEditFormProps) {
  const [isPending, startTransition] = useTransition();
  const [team1Score, setTeam1Score] = useState(initialTeam1Score?.toString() ?? "");
  const [team2Score, setTeam2Score] = useState(initialTeam2Score?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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
      setError("Điểm không được âm");
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
        className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
      >
        <span className="material-symbols-outlined text-sm">edit</span>
        Nhập điểm
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-zinc-400">Team {team1Number}</span>
          <input
            type="number"
            min="0"
            value={team1Score}
            onChange={(e) => setTeam1Score(e.target.value)}
            className="w-14 rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-center text-sm text-white focus:border-primary focus:outline-none"
            placeholder="0"
          />
        </div>
        <span className="text-zinc-500">-</span>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-zinc-400">Team {team2Number}</span>
          <input
            type="number"
            min="0"
            value={team2Score}
            onChange={(e) => setTeam2Score(e.target.value)}
            className="w-14 rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-center text-sm text-white focus:border-primary focus:outline-none"
            placeholder="0"
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 rounded bg-primary px-2 py-1 text-xs font-medium text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? "..." : "Lưu"}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsEditing(false);
            setError(null);
          }}
          className="flex-1 rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-400 hover:border-zinc-600"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}
