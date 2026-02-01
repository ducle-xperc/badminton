import Link from "next/link";
import { notFound } from "next/navigation";
import { getTournament } from "@/lib/actions/tournament";
import { getTournamentAchievementTiers } from "@/lib/actions/achievement";
import { TournamentForm } from "../../tournament-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTournamentPage({ params }: PageProps) {
  const { id } = await params;
  const [tournamentResult, tiersResult] = await Promise.all([
    getTournament(id),
    getTournamentAchievementTiers(id),
  ]);

  if (tournamentResult.error || !tournamentResult.data) {
    notFound();
  }

  const tournament = tournamentResult.data;
  const existingTiers = tiersResult.data?.map((tier) => ({
    min_position: tier.min_position,
    max_position: tier.max_position,
    title: tier.title,
    color: tier.color,
    icon: tier.icon ?? undefined,
    display_order: tier.display_order,
  }));

  return (
    <div className="relative mx-auto min-h-screen max-w-[480px] w-full  overflow-hidden flex flex-col">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/4 left-0 w-full h-[2px] court-line"></div>
        <div className="absolute bottom-1/4 left-0 w-full h-[2px] court-line"></div>
        <div className="absolute left-1/2 top-0 w-[2px] h-full court-line -translate-x-1/2"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 border border-gold-accent/20 rounded-full"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 py-6 pt-8 bg-gradient-to-b from-navy-deep to-transparent">
        <div className="flex items-center gap-2">
          <Link
            href={`/tournaments/${id}`}
            className="size-10 rounded-xl bg-card-dark/50 border border-white/5 flex items-center justify-center text-white backdrop-blur-md hover:bg-card-dark transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
        </div>
        <h1 className="text-lg font-bold tracking-wide uppercase text-white/90">
          Edit Tournament
        </h1>
        <div className="w-10"></div>
      </div>

      {/* Form Content */}
      <div className="relative z-10 flex-1 px-6 overflow-y-auto hide-scroll pb-8">
        <TournamentForm tournament={tournament} mode="edit" existingTiers={existingTiers} />
      </div>
    </div>
  );
}
