import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { HamburgerMenu } from "./hamburger-menu";
import { getUserAchievements, getUserAchievementStats } from "@/lib/actions/achievement";
import { getUpcomingMatches } from "@/lib/actions/match";
import { AchievementCard } from "./achievement-card";
import { UpcomingMatchCard } from "./upcoming-match-card";
import { BottomNav } from "@/components/BottomNav";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch profile for gender
  const { data: profile } = await supabase
    .from("profiles")
    .select("gender")
    .eq("id", user.id)
    .single();

  const nickname = user.user_metadata?.nickname || user.email?.split("@")[0] || "Player";
  const email = user.email || "";
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
  const gender = profile?.gender || "other";

  // Default avatar based on gender
  const getDefaultAvatar = (gender: string) => {
    switch (gender) {
      case "male":
        return "https://api.dicebear.com/9.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4";
      case "female":
        return "https://api.dicebear.com/9.x/adventurer/svg?seed=Lily&backgroundColor=ffdfbf";
      default:
        return "https://api.dicebear.com/9.x/adventurer/svg?seed=Milo&backgroundColor=c0aede";
    }
  };

  // Fetch achievements
  const { data: achievements } = await getUserAchievements();
  const stats = await getUserAchievementStats();

  // Fetch upcoming matches
  const { data: upcomingMatches } = await getUpcomingMatches(5);

  return (
    <div className="relative mx-auto min-h-screen max-w-[480px] bg-background-dark overflow-hidden flex flex-col px-6 py-8">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/4 left-0 w-full h-[2px] court-line"></div>
        <div className="absolute bottom-1/4 left-0 w-full h-[2px] court-line"></div>
        <div className="absolute left-1/2 top-0 w-[2px] h-full court-line -translate-x-1/2"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 border border-gold-accent/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
          <span className="material-symbols-outlined text-[300px]">
            sports_tennis
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="relative z-50 flex items-center justify-between mb-8">
        <HamburgerMenu />
        <div className="flex items-center gap-4">
          <div className="size-8 rounded-lg bg-navy-deep/50 border border-white/10 flex items-center justify-center text-white relative">
            <span className="material-symbols-outlined text-sm">
              notifications
            </span>
            <span className="absolute top-2 right-2 size-1.5 bg-red-500 rounded-full"></span>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="relative z-10 flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blue-800 p-[2px] shadow-lg shadow-primary/30">
            <img
              alt="Avatar"
              className="w-full h-full object-cover rounded-full border-2 border-background-dark"
              src={avatarUrl || getDefaultAvatar(gender)}
            />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-0.5">
          {nickname}
        </h1>
        <p className="text-gray-400 text-sm font-medium">
          {email}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="relative z-10 grid grid-cols-3 gap-3 mb-8">
        <div className="bg-card-dark/50 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center">
          <span className="text-2xl font-bold text-white mb-1">{stats.totalAchievements}</span>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
            Achievements
          </span>
        </div>
        <div className="bg-gradient-to-b from-navy-deep to-card-dark border border-gold-accent/20 rounded-2xl p-4 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gold-accent/5"></div>
          <span className="material-symbols-outlined text-gold-accent mb-1 text-xl">
            emoji_events
          </span>
          <span className="text-2xl font-bold text-gold-accent mb-0 leading-none">
            {stats.championshipCount}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-gold-accent/80 font-semibold mt-1">
            Champion
          </span>
        </div>
        <div className="bg-card-dark/50 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center">
          <span className="text-2xl font-bold text-primary mb-1">-</span>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
            Rank
          </span>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Recent Achievements
          </h3>
          {achievements && achievements.length > 5 && (
            <button className="text-primary text-xs font-semibold hover:text-blue-400">
              View all
            </button>
          )}
        </div>
        <div className="flex gap-3 overflow-x-auto hide-scroll pb-2 -mx-6 px-6">
          {achievements && achievements.length > 0 ? (
            achievements.slice(0, 5).map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))
          ) : (
            <div className="w-full text-center py-8">
              <span className="material-symbols-outlined text-4xl text-gray-600 mb-2">
                emoji_events
              </span>
              <p className="text-sm text-gray-500">No achievements yet</p>
              <p className="text-xs text-gray-600 mt-1">
                Join tournaments to earn titles
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Matches */}
      <div className="relative z-10 flex-1">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Upcoming Matches
          </h3>
        </div>
        <div className="space-y-3">
          {upcomingMatches && upcomingMatches.length > 0 ? (
            upcomingMatches.map((match) => (
              <UpcomingMatchCard key={match.id} match={match} />
            ))
          ) : (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-4xl text-gray-600 block mb-2">
                sports_tennis
              </span>
              <p className="text-sm text-gray-500">No upcoming matches</p>
              <p className="text-xs text-gray-600 mt-1">
                Register for tournaments to start competing
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
