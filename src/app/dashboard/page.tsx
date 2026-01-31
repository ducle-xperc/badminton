import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { HamburgerMenu } from "./hamburger-menu";
import { getUserAchievements, getUserAchievementStats } from "@/lib/actions/achievement";
import { AchievementCard } from "./achievement-card";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const nickname = user.user_metadata?.nickname || user.email?.split("@")[0] || "Player";
  const email = user.email || "";

  // Fetch achievements
  const { data: achievements } = await getUserAchievements();
  const stats = await getUserAchievementStats();

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
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-blue-800 p-[2px] shadow-lg shadow-primary/30">
            <img
              alt="Avatar"
              className="w-full h-full object-cover rounded-2xl border-2 border-background-dark"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh_UvfV3t4T7nVgW1i337iKMut7MmTAg-YPnLTAJDdWqcRY1_XMoQLOH_BoSWtr31cX_CHM_ZdHyM5T2fXtkAPPGLZvSPCRk0H8BHn4xxHwWb5ghWc7MZiwteGdPCKxJ9Q1-0fuFuzEexkKbYhIt9VaqaZjw1DrubACsyfd07oXOJ8pSyHhg0hxu9c3cL6mcqjdRxpFMXIff2Do1KoZDPQapJSzUTkNK9aJyRGQgi9Xix7HIE4rKmIML-_tdr4MtSExmbRMZAtMkA"
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
            Thành tích
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
            Vô địch
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
            Thành tích gần đây
          </h3>
          {achievements && achievements.length > 5 && (
            <button className="text-primary text-xs font-semibold hover:text-blue-400">
              Xem tất cả
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
              <p className="text-sm text-gray-500">Chưa có thành tích nào</p>
              <p className="text-xs text-gray-600 mt-1">
                Tham gia giải đấu để nhận danh hiệu
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
          <div className="bg-navy-deep/60 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex items-center justify-between">
            <div className="flex flex-col items-center gap-1 min-w-[3rem]">
              <span className="text-xs font-bold text-gray-400">OCT</span>
              <span className="text-xl font-bold text-white">24</span>
            </div>
            <div className="h-8 w-[1px] bg-white/10 mx-4"></div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-white">
                  vs. M. Rashid
                </span>
                <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded uppercase font-bold">
                  League
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="material-symbols-outlined text-[14px]">
                  location_on
                </span>
                Center Court, Arena 1
              </div>
            </div>
            <button className="ml-2 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-gray-400 text-sm">
                arrow_forward_ios
              </span>
            </button>
          </div>
          <div className="bg-navy-deep/60 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex items-center justify-between">
            <div className="flex flex-col items-center gap-1 min-w-[3rem]">
              <span className="text-xs font-bold text-gray-400">NOV</span>
              <span className="text-xl font-bold text-white">02</span>
            </div>
            <div className="h-8 w-[1px] bg-white/10 mx-4"></div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-white">
                  vs. K. Momota
                </span>
                <span className="text-[10px] bg-gold-accent/20 text-gold-accent px-2 py-0.5 rounded uppercase font-bold">
                  Finals
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="material-symbols-outlined text-[14px]">
                  location_on
                </span>
                Tokyo Gymnasium
              </div>
            </div>
            <button className="ml-2 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-gray-400 text-sm">
                arrow_forward_ios
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="relative z-20 mt-auto pt-6">
        <div className="bg-card-dark/80 backdrop-blur-lg border border-white/5 rounded-2xl p-2 flex justify-between items-center px-6">
          <button className="flex flex-col items-center gap-1 p-2 text-primary">
            <span className="material-symbols-outlined text-2xl">grid_view</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-2xl">
              calendar_month
            </span>
          </button>
          <div className="relative -top-8">
            <Link href="/tournaments" className="size-14 rounded-full bg-primary shadow-lg shadow-primary/40 border-4 border-background-dark flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-3xl">
                sports_tennis
              </span>
            </Link>
          </div>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-2xl">
              leaderboard
            </span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-2xl">person</span>
          </button>
        </div>
      </div>
    </div>
  );
}
