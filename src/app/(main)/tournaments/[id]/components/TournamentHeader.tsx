import Link from "next/link";
import type { Tournament } from "@/types/database";

interface TournamentHeaderProps {
  tournament: Tournament;
}

export function TournamentHeader({ tournament }: TournamentHeaderProps) {
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
    <div className="relative h-56 w-full">
      {/* Banner Image */}
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
  );
}
