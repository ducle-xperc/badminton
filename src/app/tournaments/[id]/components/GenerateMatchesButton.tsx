"use client";

import { useState, useTransition } from "react";
import { generateFirstRound, generateNextRound } from "@/lib/actions/match";

interface GenerateMatchesButtonProps {
  tournamentId: string;
  isFirstRound: boolean;
}

export function GenerateMatchesButton({
  tournamentId,
  isFirstRound,
}: GenerateMatchesButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleClick = () => {
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

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleClick}
        disabled={isPending}
        className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-lg">
          {isFirstRound ? "shuffle" : "arrow_forward"}
        </span>
        {isPending
          ? "Đang xử lý..."
          : isFirstRound
            ? "Sắp xếp đội hình"
            : "Tạo vòng tiếp theo"}
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
