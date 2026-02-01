import type { TournamentRanking, TournamentParticipant } from "@/types/database";
import { Avatar } from "@/components/ui/avatar";

type AchievementTier = {
  id: string;
  tournament_id: string;
  min_position: number;
  max_position: number;
  title: string;
  color: string;
  icon: string | null;
  display_order: number;
};

interface ChampionsPodiumProps {
  rankings: TournamentRanking[] | null;
  tiers: AchievementTier[];
  teamSize: number;
  tournamentStatus: string;
}

const formatMemberNames = (
  members: TournamentParticipant[] | undefined,
  teamSize: number
): string => {
  if (!members?.length) return "-";

  const names = members
    .map((m) => m.profile?.nickname || m.profile?.email?.split("@")[0])
    .filter(Boolean);

  if (teamSize === 1) return names[0] || "-";
  return names.join(" & ") || "-";
};

const getFirstMember = (members: TournamentParticipant[] | undefined) => {
  return members?.[0];
};

const getTierForPosition = (
  tiers: AchievementTier[],
  position: number
): AchievementTier | null => {
  return (
    tiers.find(
      (t) => position >= t.min_position && position <= t.max_position
    ) ?? null
  );
};

export function ChampionsPodium({
  rankings,
  tiers,
  teamSize,
}: ChampionsPodiumProps) {
  const hasRankings = rankings && rankings.length > 0;

  const first = hasRankings ? rankings.find((r) => r.position === 1) : null;
  const second = hasRankings ? rankings.find((r) => r.position === 2) : null;
  const third = hasRankings ? rankings.find((r) => r.position === 3) : null;

  const tier1 = getTierForPosition(tiers, 1);
  const tier2 = getTierForPosition(tiers, 2);
  const tier3 = getTierForPosition(tiers, 3);

  const firstMember = getFirstMember(first?.members);
  const secondMember = getFirstMember(second?.members);
  const thirdMember = getFirstMember(third?.members);

  return (
    <div className="bg-card-dark/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-gold-accent">
          emoji_events
        </span>
        Champions
      </h3>

      <div className="flex items-end justify-center gap-4">
        {/* 2nd Place */}
        <div className="flex flex-col items-center flex-1">
          {second && secondMember ? (
            <div className="relative">
              <Avatar
                src={secondMember.profile?.avatar_url}
                gender={secondMember.profile?.gender}
                alt={secondMember.profile?.nickname || "2nd Place"}
                size="md"
                className="border-2 border-gray-300"
              />
              <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-800 font-bold text-xs">2</span>
              </div>
            </div>
          ) : (
            <div className="size-12 rounded-full flex items-center justify-center border-2 bg-gray-500/10 border-gray-500/30">
              <span className="font-bold text-lg text-gray-500">2</span>
            </div>
          )}
          <p
            className={`text-xs mt-2 ${tier2 ? "" : "text-gray-500"}`}
            style={tier2 ? { color: tier2.color } : undefined}
          >
            {tier2?.title ?? "2nd Place"}
          </p>
          <p
            className={`text-sm text-center truncate max-w-20 ${second ? "text-gray-300" : "text-gray-500"}`}
          >
            {second ? formatMemberNames(second.members, teamSize) : "-"}
          </p>
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center flex-1">
          <span
            className={`material-symbols-outlined text-3xl mb-1 ${first ? "text-gold-accent" : "text-gray-500"}`}
          >
            emoji_events
          </span>
          {first && firstMember ? (
            <div className="relative">
              <Avatar
                src={firstMember.profile?.avatar_url}
                gender={firstMember.profile?.gender}
                alt={firstMember.profile?.nickname || "Champion"}
                size="lg"
                className="border-2 border-gold-accent"
              />
              <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-gold-accent flex items-center justify-center">
                <span className="text-black font-bold text-xs">1</span>
              </div>
            </div>
          ) : (
            <div className="size-14 rounded-full flex items-center justify-center border-2 bg-gray-500/10 border-gray-500/30">
              <span className="font-bold text-xl text-gray-500">1</span>
            </div>
          )}
          <p
            className={`text-xs mt-2 font-semibold text-center ${tier1 ? "" : "text-gray-500"}`}
            style={tier1 ? { color: tier1.color } : undefined}
          >
            {tier1?.title ?? "Champion"}
          </p>
          <p
            className={`text-sm font-semibold text-center truncate max-w-24 ${first ? "text-gold-accent" : "text-gray-500"}`}
          >
            {first ? formatMemberNames(first.members, teamSize) : "-"}
          </p>
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center flex-1">
          {third && thirdMember ? (
            <div className="relative">
              <Avatar
                src={thirdMember.profile?.avatar_url}
                gender={thirdMember.profile?.gender}
                alt={thirdMember.profile?.nickname || "3rd Place"}
                size="md"
                className="border-2 border-amber-600"
              />
              <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-amber-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">3</span>
              </div>
            </div>
          ) : (
            <div className="size-10 rounded-full flex items-center justify-center border-2 bg-gray-500/10 border-gray-500/30">
              <span className="font-bold text-base text-gray-500">3</span>
            </div>
          )}
          <p
            className={`text-xs mt-2 ${tier3 ? "" : "text-gray-500"}`}
            style={tier3 ? { color: tier3.color } : undefined}
          >
            {tier3?.title ?? "3rd Place"}
          </p>
          <p
            className={`text-sm text-center truncate max-w-20 ${third ? "text-amber-600" : "text-gray-500"}`}
          >
            {third ? formatMemberNames(third.members, teamSize) : "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
