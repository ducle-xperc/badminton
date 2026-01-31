import Link from "next/link";
import type { Tournament } from "@/types/database";
import { DeleteTournamentButton } from "../delete-button";

interface InfoTabProps {
  tournament: Tournament;
}

export function InfoTab({ tournament }: InfoTabProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="px-6 pb-8">
      {/* Title Card */}
      <div className="bg-card-dark/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 mb-4">
        <h1 className="text-2xl font-bold text-white mb-2">{tournament.name}</h1>
        {tournament.description && (
          <p className="text-gray-400 text-sm">{tournament.description}</p>
        )}
      </div>

      {/* Info Cards */}
      <div className="space-y-3">
        {/* Date */}
        <div className="bg-card-dark/50 border border-white/5 rounded-xl p-4 flex items-center gap-4">
          <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">calendar_today</span>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Date</p>
            <p className="text-white font-medium">
              {formatDate(tournament.start_date)} - {formatDate(tournament.end_date)}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="bg-card-dark/50 border border-white/5 rounded-xl p-4 flex items-center gap-4">
          <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">location_on</span>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Location</p>
            <p className="text-white font-medium">{tournament.location}</p>
          </div>
        </div>

        {/* Participants */}
        <div className="bg-card-dark/50 border border-white/5 rounded-xl p-4 flex items-center gap-4">
          <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">groups</span>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Participants</p>
            <p className="text-white font-medium">
              {tournament.current_participants} / {tournament.max_participants}
            </p>
          </div>
        </div>

        {/* Entry Fee */}
        {tournament.entry_fee > 0 && (
          <div className="bg-card-dark/50 border border-white/5 rounded-xl p-4 flex items-center gap-4">
            <div className="size-12 rounded-xl bg-gold-accent/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-gold-accent">payments</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Entry Fee</p>
              <p className="text-white font-medium">
                {tournament.entry_fee.toLocaleString("vi-VN")} VND
              </p>
            </div>
          </div>
        )}

        {/* Prize Pool */}
        {tournament.prize_pool && (
          <div className="bg-card-dark/50 border border-white/5 rounded-xl p-4 flex items-center gap-4">
            <div className="size-12 rounded-xl bg-gold-accent/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-gold-accent">emoji_events</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Prize Pool</p>
              <p className="text-white font-medium">{tournament.prize_pool}</p>
            </div>
          </div>
        )}

        {/* Registration Deadline */}
        {tournament.registration_deadline && (
          <div className="bg-card-dark/50 border border-white/5 rounded-xl p-4 flex items-center gap-4">
            <div className="size-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-red-400">schedule</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Registration Deadline
              </p>
              <p className="text-white font-medium">
                {formatDate(tournament.registration_deadline)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-y-3">
        {tournament.status === "upcoming" && (
          <button className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined">how_to_reg</span>
            Register Now
          </button>
        )}

        <div className="flex gap-3">
          <Link
            href={`/tournaments/${tournament.id}/edit`}
            className="flex-1 bg-card-dark hover:bg-card-dark/80 border border-white/10 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-xl">edit</span>
            Edit
          </Link>
          <DeleteTournamentButton id={tournament.id} />
        </div>
      </div>
    </div>
  );
}
