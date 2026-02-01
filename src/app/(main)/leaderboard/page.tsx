import Link from "next/link";
import { Suspense } from "react";
import { getLeaderboard, type SortOption } from "@/lib/actions/leaderboard";
import { LeaderboardList } from "./leaderboard-list";
import { LeaderboardFilters } from "./leaderboard-filters";
import { BottomNav } from "@/components/BottomNav";

interface LeaderboardPageProps {
  searchParams: Promise<{ sort?: string }>;
}

export default async function LeaderboardPage({
  searchParams,
}: LeaderboardPageProps) {
  const params = await searchParams;
  const sortBy = (params.sort as SortOption) || "achievements";
  const { data: leaderboard } = await getLeaderboard(sortBy);

  return (
    <div className="relative mx-auto min-h-screen max-w-[480px] bg-background-dark overflow-hidden flex flex-col">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/4 left-0 w-full h-[2px] court-line"></div>
        <div className="absolute bottom-1/4 left-0 w-full h-[2px] court-line"></div>
        <div className="absolute left-1/2 top-0 w-[2px] h-full court-line -translate-x-1/2"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 border border-gold-accent/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
          <span className="material-symbols-outlined text-[300px]">
            leaderboard
          </span>
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
          Leaderboard
        </h1>
        <div className="w-10"></div>
      </div>

      {/* Filter Tabs */}
      <Suspense fallback={null}>
        <LeaderboardFilters />
      </Suspense>

      {/* Leaderboard List */}
      <LeaderboardList entries={leaderboard || []} />

      <BottomNav />
    </div>
  );
}
