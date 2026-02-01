import type { LeaderboardEntry } from "@/lib/actions/leaderboard";
import { LeaderboardCard } from "./leaderboard-card";

interface LeaderboardListProps {
  entries: LeaderboardEntry[];
}

export function LeaderboardList({ entries }: LeaderboardListProps) {
  if (entries.length === 0) {
    return (
      <div className="relative z-10 flex flex-col items-center justify-center py-16 text-center px-6">
        <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">
          leaderboard
        </span>
        <h3 className="text-xl font-bold text-white mb-2">No Players Yet</h3>
        <p className="text-gray-400">
          Join tournaments to appear on the leaderboard
        </p>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex-1 px-6 overflow-y-auto hide-scroll pb-28 space-y-3">
      {entries.map((entry, index) => (
        <LeaderboardCard key={entry.id} entry={entry} rank={index + 1} />
      ))}
    </div>
  );
}
