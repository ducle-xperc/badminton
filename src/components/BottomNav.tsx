"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface CenterAction {
  icon: string;
  href: string;
}

interface BottomNavProps {
  centerAction?: CenterAction;
}

const defaultCenterAction: CenterAction = {
  icon: "sports_tennis",
  href: "/tournaments",
};

const navItems = [
  { icon: "grid_view", href: "/dashboard", label: "Dashboard" },
  { icon: "emoji_events", href: "/tournaments", label: "Tournaments" },
  { icon: "leaderboard", href: "/leaderboard", label: "Leaderboard" },
  { icon: "person", href: "/profile", label: "Profile" },
];

export function BottomNav({ centerAction = defaultCenterAction }: BottomNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-20 pb-6 pt-4 bg-gradient-to-t from-navy-deep via-navy-deep to-transparent">
      <div className="mx-6 bg-card-dark/80 backdrop-blur-xl border border-white/5 rounded-2xl p-2 flex justify-between items-center px-4 shadow-2xl shadow-black/50 max-w-[480px] mx-auto">
        {/* Left nav items */}
        {navItems.slice(0, 2).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 p-2 w-12 group transition-colors ${
              isActive(item.href)
                ? "text-primary"
                : "text-gray-500 hover:text-white"
            }`}
          >
            <span
              className={`material-symbols-outlined text-2xl group-hover:scale-105 transition-transform ${
                isActive(item.href) ? "fill-1" : ""
              }`}
            >
              {item.icon}
            </span>
          </Link>
        ))}

        {/* Center FAB */}
        <div className="relative -top-8">
          <Link
            href={centerAction.href}
            className="size-14 rounded-full bg-primary shadow-lg shadow-primary/40 border-4 border-background-dark flex items-center justify-center text-white group"
          >
            <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">
              {centerAction.icon}
            </span>
          </Link>
        </div>

        {/* Right nav items */}
        {navItems.slice(2).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 p-2 w-12 group transition-colors ${
              isActive(item.href)
                ? "text-primary"
                : "text-gray-500 hover:text-white"
            }`}
          >
            <span
              className={`material-symbols-outlined text-2xl group-hover:scale-105 transition-transform ${
                isActive(item.href) ? "fill-1" : ""
              }`}
            >
              {item.icon}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
