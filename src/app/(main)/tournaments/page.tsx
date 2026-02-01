import Link from "next/link";
import { getTournaments } from "@/lib/actions/tournament";
import type { Tournament } from "@/types/database";
import { BottomNav } from "@/components/BottomNav";

export default async function TournamentsPage() {
  const { data: tournaments } = await getTournaments();

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startMonth = start.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
    const startDay = start.getDate();
    const endDay = end.getDate();
    return `${startMonth} ${startDay}-${endDay}`;
  };

  const getStatusBadge = (tournament: Tournament) => {
    switch (tournament.status) {
      case "upcoming":
        return (
          <div className="absolute top-4 right-4 bg-gold-accent text-navy-deep text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 z-10">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            {formatDateRange(tournament.start_date, tournament.end_date)}
          </div>
        );
      case "ongoing":
        return (
          <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 z-10">
            <span className="material-symbols-outlined text-[14px]">play_circle</span>
            ONGOING
          </div>
        );
      case "completed":
        return (
          <div className="absolute top-4 right-4 bg-gray-800/80 backdrop-blur text-gray-300 text-xs font-bold px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-1 z-10">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            COMPLETED
          </div>
        );
      case "cancelled":
        return (
          <div className="absolute top-4 right-4 bg-red-500/80 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 z-10">
            <span className="material-symbols-outlined text-[14px]">cancel</span>
            CANCELLED
          </div>
        );
    }
  };

  return (
    <div className="relative mx-auto min-h-screen max-w-[480px] w-full  overflow-hidden flex flex-col">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/4 left-0 w-full h-[2px] court-line"></div>
        <div className="absolute bottom-1/4 left-0 w-full h-[2px] court-line"></div>
        <div className="absolute left-1/2 top-0 w-[2px] h-full court-line -translate-x-1/2"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 border border-gold-accent/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
          <span className="material-symbols-outlined text-[300px]">emoji_events</span>
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 py-6 pt-8 bg-gradient-to-b from-navy-deep to-transparent">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="size-10 rounded-xl bg-card-dark/50 border border-white/5 flex items-center justify-center text-white backdrop-blur-md hover:bg-card-dark transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
        </div>
        <h1 className="text-lg font-bold tracking-wide uppercase text-white/90">
          Tournaments
        </h1>
        <div className="flex items-center gap-2">
          <Link
            href="/tournaments/new"
            className="size-10 rounded-xl bg-primary border border-primary/50 flex items-center justify-center text-white backdrop-blur-md hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined">add</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="relative z-10 px-6 mb-6">
        <div className="flex gap-3 overflow-x-auto hide-scroll pb-2">
          <button className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/25 whitespace-nowrap transition-transform active:scale-95">
            All
          </button>
          <button className="px-5 py-2.5 rounded-full bg-card-dark border border-white/10 text-gray-400 text-sm font-medium hover:text-white hover:border-white/30 transition-colors whitespace-nowrap">
            Upcoming
          </button>
          <button className="px-5 py-2.5 rounded-full bg-card-dark border border-white/10 text-gray-400 text-sm font-medium hover:text-white hover:border-white/30 transition-colors whitespace-nowrap">
            Ongoing
          </button>
          <button className="px-5 py-2.5 rounded-full bg-card-dark border border-white/10 text-gray-400 text-sm font-medium hover:text-white hover:border-white/30 transition-colors whitespace-nowrap">
            Completed
          </button>
        </div>
      </div>

      {/* Tournament Cards */}
      <div className="relative z-10 flex-1 px-6 overflow-y-auto hide-scroll pb-28 space-y-5">
        {!tournaments || tournaments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">
              emoji_events
            </span>
            <h3 className="text-xl font-bold text-white mb-2">No Tournaments Yet</h3>
            <p className="text-gray-400 mb-6">Create your first tournament to get started</p>
            <Link
              href="/tournaments/new"
              className="px-6 py-3 bg-primary hover:bg-blue-600 text-white font-semibold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined">add</span>
              Create Tournament
            </Link>
          </div>
        ) : (
          tournaments.map((tournament) => (
            <Link
              key={tournament.id}
              href={`/tournaments/${tournament.id}`}
              className={`group relative block w-full h-72 rounded-3xl overflow-hidden shadow-xl shadow-black/40 border border-white/5 ${
                tournament.status === "completed" ? "grayscale opacity-80" : ""
              }`}
            >
              {tournament.banner_url ? (
                <img
                  alt={tournament.name}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    tournament.status === "completed" ? "opacity-60" : ""
                  }`}
                  src={tournament.banner_url}
                />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/30 to-navy-deep flex items-center justify-center">
                  <span className="material-symbols-outlined text-8xl text-white/10">
                    emoji_events
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/70 to-transparent"></div>

              {getStatusBadge(tournament)}

              <div className="absolute bottom-0 left-0 w-full p-5 flex flex-col gap-2 z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-primary/30 border border-primary/30 text-primary text-[10px] font-bold uppercase backdrop-blur-sm">
                    {tournament.max_participants} slots
                  </span>
                  {tournament.entry_fee > 0 && (
                    <span className="px-2 py-0.5 rounded bg-gold-accent/20 border border-gold-accent/30 text-gold-accent text-[10px] font-bold uppercase backdrop-blur-sm">
                      {tournament.entry_fee.toLocaleString("en-US")} VND
                    </span>
                  )}
                </div>
                <h2
                  className={`text-2xl font-bold leading-tight ${
                    tournament.status === "completed" ? "text-gray-300" : "text-white"
                  }`}
                >
                  {tournament.name}
                </h2>
                <div
                  className={`flex items-center text-sm gap-1.5 mb-2 ${
                    tournament.status === "completed" ? "text-gray-400" : "text-gray-300"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[18px] ${
                      tournament.status === "completed" ? "" : "text-primary"
                    }`}
                  >
                    location_on
                  </span>
                  {tournament.location}
                </div>
                <div
                  className={`w-full mt-1 backdrop-blur-md border text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
                    tournament.status === "upcoming"
                      ? "bg-white/10 hover:bg-white/20 border-white/10"
                      : tournament.status === "ongoing"
                        ? "bg-primary hover:bg-blue-600 border-primary/50 shadow-lg shadow-primary/20"
                        : "bg-white/5 hover:bg-white/10 border-white/10 text-gray-300"
                  }`}
                >
                  {tournament.status === "upcoming"
                    ? "View Details"
                    : tournament.status === "ongoing"
                      ? "Join Tournament"
                      : "See Results"}
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      <BottomNav centerAction={{ icon: "add", href: "/tournaments/new" }} />
    </div>
  );
}
