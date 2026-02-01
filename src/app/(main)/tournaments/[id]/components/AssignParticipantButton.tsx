"use client";

import { useState, useTransition } from "react";
import { TournamentParticipant } from "@/types/database";
import { assignParticipantToTeam } from "@/lib/actions/draw";
import { Avatar } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AssignParticipantButtonProps {
  tournamentId: string;
  teamId: string;
  teamNumber: number;
  unassignedParticipants: TournamentParticipant[];
  isFull: boolean;
}

export function AssignParticipantButton({
  tournamentId,
  teamId,
  teamNumber,
  unassignedParticipants,
  isFull,
}: AssignParticipantButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAssign = (participantId: string) => {
    setError(null);
    startTransition(async () => {
      const result = await assignParticipantToTeam(
        tournamentId,
        participantId,
        teamId
      );
      if (result.error) {
        setError(result.error);
      } else {
        setOpen(false);
      }
    });
  };

  if (isFull || unassignedParticipants.length === 0) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-green-400 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg transition-colors">
          <span className="material-symbols-outlined text-sm">person_add</span>
          Assign
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="end">
        <div className="space-y-1">
          <p className="text-xs text-gray-400 px-2 py-1">
            Select participant to assign to Team {teamNumber}
          </p>
          {error && <p className="text-xs text-red-400 px-2">{error}</p>}
          <div className="max-h-48 overflow-y-auto space-y-1">
            {unassignedParticipants.map((participant) => {
              const displayName =
                participant.profile?.nickname ||
                participant.profile?.email ||
                "Unknown";
              return (
                <button
                  key={participant.id}
                  onClick={() => handleAssign(participant.id)}
                  disabled={isPending}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  <Avatar
                    src={participant.profile?.avatar_url}
                    gender={participant.profile?.gender}
                    alt={displayName}
                    size="sm"
                  />
                  <span className="text-sm text-white truncate flex-1 text-left">
                    {displayName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
