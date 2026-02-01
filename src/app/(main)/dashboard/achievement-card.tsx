import type { UserAchievement } from "@/types/database";

interface AchievementCardProps {
  achievement: UserAchievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const formattedDate = new Date(achievement.earned_at).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="min-w-[140px] bg-card-dark rounded-xl p-3 border border-white/5 flex flex-col items-center text-center group hover:border-white/10 transition-colors">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
        style={{ backgroundColor: `${achievement.color}20` }}
      >
        <span
          className="material-symbols-outlined text-xl"
          style={{ color: achievement.color }}
        >
          {achievement.icon || "emoji_events"}
        </span>
      </div>
      <span
        className="text-xs font-bold mb-1"
        style={{ color: achievement.color }}
      >
        {achievement.title}
      </span>
      <span className="text-[10px] text-gray-400 line-clamp-1">
        {achievement.tournament_name}
      </span>
      <span className="text-[9px] text-gray-600 mt-1">{formattedDate}</span>
    </div>
  );
}
