import Link from "next/link";
import { notFound } from "next/navigation";
import { getTournament } from "@/lib/actions/tournament";
import { DeleteTournamentButton } from "./delete-button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TournamentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { data: tournament, error } = await getTournament(id);

  if (error || !tournament) {
    notFound();
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-gold-accent text-navy-deep";
      case "ongoing":
        return "bg-green-500 text-white";
      case "completed":
        return "bg-gray-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="relative mx-auto min-h-screen max-w-[480px] bg-background-dark overflow-hidden flex flex-col">
      {/* Banner Image */}
      <div className="relative h-56 w-full">
        {tournament.banner_url ? (
          <img
            src={tournament.banner_url}
            alt={tournament.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/30 to-navy-deep flex items-center justify-center">
            <span className="material-symbols-outlined text-8xl text-white/20">
              emoji_events
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/50 to-transparent"></div>

        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/tournaments"
            className="size-10 rounded-xl bg-card-dark/50 border border-white/5 flex items-center justify-center text-white backdrop-blur-md hover:bg-card-dark transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
        </div>

        {/* Status Badge */}
        <div className="absolute top-6 right-6 z-10">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase ${getStatusColor(
              tournament.status
            )}`}
          >
            {tournament.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 px-6 -mt-8">
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
        <div className="mt-6 space-y-3 pb-8">
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
    </div>
  );
}
