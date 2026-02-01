"use client";

import { useState, useTransition } from "react";
import { unassignParticipantFromTeam } from "@/lib/actions/draw";

interface UnassignParticipantButtonProps {
  tournamentId: string;
  participantId: string;
  participantName: string;
}

export function UnassignParticipantButton({
  tournamentId,
  participantId,
  participantName,
}: UnassignParticipantButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUnassign = () => {
    startTransition(async () => {
      const result = await unassignParticipantFromTeam(
        tournamentId,
        participantId
      );
      if (result.error) {
        alert(result.error);
      }
      setShowConfirm(false);
    });
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleUnassign}
          disabled={isPending}
          className="text-xs px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition-colors disabled:opacity-50"
        >
          {isPending ? "..." : "Yes"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isPending}
          className="text-xs px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="p-1 text-gray-500 hover:text-red-400 transition-colors"
      title={`Remove ${participantName} from team`}
    >
      <span className="material-symbols-outlined text-sm">person_remove</span>
    </button>
  );
}
