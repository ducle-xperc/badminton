import type { LeaderboardEntry } from "@/lib/actions/leaderboard";

interface LeaderboardCardProps {
  entry: LeaderboardEntry;
  rank: number;
}

export function LeaderboardCard({ entry, rank }: LeaderboardCardProps) {
  const getRankStyle = (rank: number) => {
    if (rank === 1)
      return "bg-gradient-to-r from-gold-accent/20 to-gold-accent/5 border-gold-accent/30";
    if (rank === 2)
      return "bg-gradient-to-r from-gray-400/20 to-gray-400/5 border-gray-400/30";
    if (rank === 3)
      return "bg-gradient-to-r from-amber-700/20 to-amber-700/5 border-amber-700/30";
    return "bg-card-dark border-white/5";
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-gold-accent";
    if (rank === 2) return "text-gray-300";
    if (rank === 3) return "text-amber-600";
    return "text-gray-500";
  };

  const getDefaultAvatar = (gender: string | null) => {
    switch (gender) {
      case "male":
        return "https://api.dicebear.com/9.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4";
      case "female":
        return "https://api.dicebear.com/9.x/adventurer/svg?seed=Lily&backgroundColor=ffdfbf";
      default:
        return "https://api.dicebear.com/9.x/adventurer/svg?seed=Milo&backgroundColor=c0aede";
    }
  };

  return (
    <div
      className={`rounded-xl p-4 border ${getRankStyle(rank)} backdrop-blur-sm`}
    >
      <div className="flex items-center gap-4">
        {/* Rank */}
        <div className={`text-2xl font-bold w-8 text-center ${getRankColor(rank)}`}>
          {rank <= 3 ? (
            <span className="material-symbols-outlined text-2xl">
              {rank === 1 ? "trophy" : rank === 2 ? "military_tech" : "workspace_premium"}
            </span>
          ) : (
            rank
          )}
        </div>

        {/* Avatar */}
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 flex-shrink-0">
          <img
            src={getDefaultAvatar(entry.gender)}
            alt={entry.nickname}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Player Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white truncate">{entry.nickname}</h3>
          <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-primary">
                emoji_events
              </span>
              {entry.tournamentsParticipated}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-primary">
                sports_tennis
              </span>
              {entry.matchesPlayed}
            </span>
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {entry.goldCount > 0 && (
            <div className="flex items-center gap-0.5 bg-gold-accent/20 text-gold-accent px-2 py-1 rounded text-xs font-bold">
              <span className="material-symbols-outlined text-[12px]">
                emoji_events
              </span>
              {entry.goldCount}
            </div>
          )}
          {entry.silverCount > 0 && (
            <div className="flex items-center gap-0.5 bg-gray-400/20 text-gray-300 px-2 py-1 rounded text-xs font-bold">
              <span className="material-symbols-outlined text-[12px]">
                emoji_events
              </span>
              {entry.silverCount}
            </div>
          )}
          {entry.bronzeCount > 0 && (
            <div className="flex items-center gap-0.5 bg-amber-700/20 text-amber-600 px-2 py-1 rounded text-xs font-bold">
              <span className="material-symbols-outlined text-[12px]">
                emoji_events
              </span>
              {entry.bronzeCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
