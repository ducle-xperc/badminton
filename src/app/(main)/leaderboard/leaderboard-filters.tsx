"use client";

import { useRouter, useSearchParams } from "next/navigation";

const filters = [
  { key: "achievements", label: "All", icon: "trophy" },
  { key: "gold", label: "Gold", icon: "emoji_events" },
  { key: "tournaments", label: "Tournaments", icon: "emoji_events" },
  { key: "matches", label: "Matches", icon: "sports_tennis" },
];

export function LeaderboardFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") || "achievements";

  const handleFilter = (key: string) => {
    router.push(`/leaderboard?sort=${key}`);
  };

  return (
    <div className="relative z-10 px-6 mb-6">
      <div className="flex gap-3 overflow-x-auto hide-scroll pb-2">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => handleFilter(filter.key)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              current === filter.key
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "bg-card-dark border border-white/10 text-gray-400 hover:text-white hover:border-white/30"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
