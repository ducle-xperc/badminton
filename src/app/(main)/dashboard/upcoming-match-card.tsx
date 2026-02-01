import Link from "next/link";
import type { UpcomingMatchDisplay } from "@/lib/actions/match";
import type { BracketType } from "@/types/database";

interface UpcomingMatchCardProps {
  match: UpcomingMatchDisplay;
}

function getBracketLabel(bracket: BracketType): {
  label: string;
  colorClass: string;
} {
  switch (bracket) {
    case "winners":
      return { label: "Winners", colorClass: "bg-primary/20 text-primary" };
    case "losers":
      return {
        label: "Losers",
        colorClass: "bg-orange-500/20 text-orange-400",
      };
    case "grand_final":
      return {
        label: "Finals",
        colorClass: "bg-gold-accent/20 text-gold-accent",
      };
  }
}

export function UpcomingMatchCard({ match }: UpcomingMatchCardProps) {
  const displayDate = match.scheduledAt
    ? new Date(match.scheduledAt)
    : new Date(match.tournamentStartDate);

  const month = displayDate
    .toLocaleDateString("en-US", { month: "short" })
    .toUpperCase();
  const day = displayDate.getDate();

  const opponentDisplay =
    match.opponentNames.length > 0
      ? `vs. ${match.opponentNames.join(" & ")}`
      : match.opponentTeamNumber !== null
        ? `vs. Team ${match.opponentTeamNumber}`
        : "TBD";

  const bracketInfo = getBracketLabel(match.bracket);
  const locationDisplay = match.court || match.tournamentLocation || "TBD";

  return (
    <Link
      href={`/tournaments/${match.tournamentId}`}
      className="bg-navy-deep/60 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex items-center justify-between hover:border-white/20 transition-colors"
    >
      <div className="flex flex-col items-center gap-1 min-w-[3rem]">
        <span className="text-xs font-bold text-gray-400">{month}</span>
        <span className="text-xl font-bold text-white">{day}</span>
      </div>
      <div className="h-8 w-[1px] bg-white/10 mx-4"></div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-bold text-white">{opponentDisplay}</span>
          <span
            className={`text-[10px] ${bracketInfo.colorClass} px-2 py-0.5 rounded uppercase font-bold`}
          >
            {bracketInfo.label}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="material-symbols-outlined text-[14px]">
            location_on
          </span>
          {locationDisplay}
        </div>
      </div>
      <div className="ml-2 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
        <span className="material-symbols-outlined text-gray-400 text-sm">
          arrow_forward_ios
        </span>
      </div>
    </Link>
  );
}
