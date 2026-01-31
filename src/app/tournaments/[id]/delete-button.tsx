"use client";

import { useState } from "react";
import { deleteTournament } from "@/lib/actions/tournament";

interface DeleteTournamentButtonProps {
  id: string;
}

export function DeleteTournamentButton({ id }: DeleteTournamentButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteTournament(id);
  };

  if (showConfirm) {
    return (
      <div className="flex-1 flex gap-2">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-1 transition-all disabled:opacity-50"
        >
          {isDeleting ? (
            "Deleting..."
          ) : (
            <>
              <span className="material-symbols-outlined text-lg">check</span>
              Yes
            </>
          )}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
          className="flex-1 bg-card-dark border border-white/10 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-1 transition-all disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-lg">close</span>
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
    >
      <span className="material-symbols-outlined text-xl">delete</span>
      Delete
    </button>
  );
}
